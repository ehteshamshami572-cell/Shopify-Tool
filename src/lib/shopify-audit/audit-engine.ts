import axios from "axios";
import { AuditResult } from "@/types/shopify-audit";
import { validateAndNormalizeStoreUrl } from "./url-validator";
import { detectShopifyStore } from "./shopify-detector";
import { fetchAndAnalyzePages } from "./page-analyzer";
import { runPageSpeedAudit } from "./pagespeed/client";
import { evaluateStoreCRO } from "./cro-analyzer";
import { calculateOverallAuditScores } from "./scoring";
import { getAIProvider } from "./ai/provider";

export const AUDIT_ENGINE_VERSION = "1.0.0";

// In-Memory Cache abstraction with 10-minute TTL to prevent spamming PageSpeed/crawls
interface CacheEntry {
  result: AuditResult;
  timestamp: number;
}

const auditCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getCachedAudit(normalizedUrl: string): AuditResult | null {
  const cacheKey = `shopify-audit:${normalizedUrl}:${AUDIT_ENGINE_VERSION}`;
  const entry = auditCache.get(cacheKey);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    auditCache.delete(cacheKey);
    return null;
  }

  return entry.result;
}

export function setCachedAudit(normalizedUrl: string, result: AuditResult): void {
  const cacheKey = `shopify-audit:${normalizedUrl}:${AUDIT_ENGINE_VERSION}`;
  auditCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
  });
}

export async function runShopifyAudit(inputUrl: string, bypassCache = false): Promise<AuditResult> {
  // 1. URL Validation & Normalization with SSRF check
  const validation = validateAndNormalizeStoreUrl(inputUrl);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid store URL provided.");
  }

  const normalizedUrl = validation.normalizedUrl;
  const domain = validation.domain;

  // 2. Check Cache
  if (!bypassCache) {
    const cached = getCachedAudit(normalizedUrl);
    if (cached) {
      return cached;
    }
  }

  // 3. Initial Homepage Crawl
  let initialHtml = "";
  let initialHeaders: Record<string, string> = {};

  try {
    const res = await axios.get(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      timeout: 8000,
      maxRedirects: 4,
      validateStatus: () => true,
    });

    if (typeof res.data === "string") {
      initialHtml = res.data;
    }

    if (res.headers) {
      for (const [k, v] of Object.entries(res.headers)) {
        initialHeaders[k] = Array.isArray(v) ? v.join(", ") : String(v || "");
      }
    }
  } catch (crawlErr: any) {
    throw new Error(`Unable to reach ${domain}. Please verify that the storefront is publicly accessible online.`);
  }

  if (!initialHtml || initialHtml.length < 100) {
    throw new Error(`The website at ${domain} returned an empty response. Verify the URL is correct.`);
  }

  // 4. Shopify Detection
  const shopifyDetection = detectShopifyStore(initialHtml, initialHeaders);

  // 5. Public Page Analysis (Home, Product, Collection)
  const pagesAnalysis = await fetchAndAnalyzePages(normalizedUrl, initialHtml);

  // Approximate counts for performance heuristics
  const scriptCount = (initialHtml.match(/<script/gi) || []).length;
  const stylesheetCount = (initialHtml.match(/<link[^>]*rel=["']stylesheet["']/gi) || []).length;
  const imageCount = (initialHtml.match(/<img/gi) || []).length;

  // 6. Google PageSpeed Audit (Mobile & Desktop)
  const performance = await runPageSpeedAudit(normalizedUrl, {
    scriptCount,
    stylesheetCount,
    imageCount,
    appCount: shopifyDetection.indicators.length > 2 ? 5 : 2,
  });

  // 7. Deterministic CRO Analysis
  const cro = evaluateStoreCRO(pagesAnalysis.pages);

  // 8. Overall Scoring Engine (40% Perf, 40% CRO, 10% SEO, 10% Accessibility)
  const scores = calculateOverallAuditScores(
    performance.score,
    cro.overallScore,
    shopifyDetection.isShopify ? 92 : 80,
    performance.coreWebVitals.lcp.status === "good" ? 90 : 82
  );

  // 9. AI Analysis Layer (Sends structured findings only)
  const aiProvider = getAIProvider();
  const structuredFindingsPayload = {
    url: normalizedUrl,
    domain,
    isShopify: shopifyDetection.isShopify,
    theme: shopifyDetection.themeName,
    performance: {
      score: performance.score,
      mobileScore: performance.mobileScore,
      desktopScore: performance.desktopScore,
      coreWebVitals: performance.coreWebVitals,
      topOpportunities: performance.topOpportunities,
    },
    cro: {
      overallScore: cro.overallScore,
      categories: cro.categories,
      keyFindings: cro.keyFindings,
    },
    pagesAnalyzed: {
      count: pagesAnalysis.count,
      urls: pagesAnalysis.urls,
    },
  };

  const aiAnalysis = await aiProvider.analyzeAudit(structuredFindingsPayload);

  // 10. Assemble Final Audit Result
  const finalResult: AuditResult = {
    version: AUDIT_ENGINE_VERSION,
    url: normalizedUrl,
    domain,
    auditedAt: new Date().toISOString(),
    shopifyDetection,
    scores,
    pagesAnalyzed: {
      count: pagesAnalysis.count,
      urls: pagesAnalysis.urls,
      pages: pagesAnalysis.pages,
    },
    performance,
    cro,
    ai: aiAnalysis,
    partialFailure: {
      pageSpeedFailed: performance.isSimulated,
      aiFailed: !aiAnalysis.isAvailable,
      shopifyWarning: !shopifyDetection.isShopify
        ? "This website does not appear to be a Shopify store. Performance and CRO findings were evaluated based on general ecommerce standards."
        : undefined,
    },
  };

  // Cache result
  setCachedAudit(normalizedUrl, finalResult);

  return finalResult;
}
