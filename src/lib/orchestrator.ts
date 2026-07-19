import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import { URL } from "url";
import { AnalysisContext } from "@/types/scan";

export async function orchestrateScan(targetUrl: string): Promise<AnalysisContext> {
  // Normalize URL
  let urlString = targetUrl.trim();
  if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
    urlString = "https://" + urlString;
  }

  const parsedUrl = new URL(urlString);
  const domain = parsedUrl.hostname;

  let html = "";
  let headers: Record<string, string> = {};
  let title = "";
  const meta: Record<string, string> = {};
  const headings: { level: number; text: string }[] = [];
  const scripts: { src: string | null; content: string }[] = [];
  const stylesheets: string[] = [];
  const images: { src: string; alt: string; originalSrc: string }[] = [];
  const links: { href: string; text: string; external: boolean }[] = [];
  const rawNetworkRequests: { url: string; method: string; type: string }[] = [];

  // 1. Axios Fetch for HTML and Headers
  try {
    const response = await axios.get(urlString, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    html = response.data;
    // Map headers to string values
    for (const [key, value] of Object.entries(response.headers)) {
      headers[key] = Array.isArray(value) ? value.join(", ") : value || "";
    }
  } catch (err: any) {
    console.error("Axios crawler failed, attempting fallback:", err.message);
  }

  // 2. Playwright crawler for rendering and network requests
  let playwrightSuccess = false;
  try {
    const browser = await chromium.launch({
      headless: true,
    });
    const browserContext = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ShopifyScan/1.0",
    });
    const page = await browserContext.newPage();

    // Track network requests
    page.on("request", (req) => {
      rawNetworkRequests.push({
        url: req.url(),
        method: req.method(),
        type: req.resourceType(),
      });
    });

    // Go to URL
    await page.goto(urlString, {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    // Retrieve rendered HTML
    const renderedHtml = await page.content();
    if (renderedHtml) {
      html = renderedHtml;
      playwrightSuccess = true;
    }

    await browser.close();
  } catch (pwErr: any) {
    console.warn("Playwright crawler unavailable (likely missing browser binaries). Using Axios + Cheerio fallback.", pwErr.message);
  }

  // 3. Cheerio Parsing
  if (html) {
    const $ = cheerio.load(html);

    // Title
    title = $("title").text().trim() || "";

    // Meta Tags
    $("meta").each((_, el) => {
      const name = $(el).attr("name") || $(el).attr("property") || "";
      const content = $(el).attr("content") || "";
      if (name) {
        meta[name.toLowerCase()] = content;
      }
    });

    // Headings
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const tagName = el.tagName.toLowerCase();
      const level = parseInt(tagName.substring(1)) || 1;
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text) {
        headings.push({ level, text });
      }
    });

    // Scripts
    $("script").each((_, el) => {
      const src = $(el).attr("src") || null;
      const content = $(el).html() || "";
      scripts.push({ src, content });
    });

    // Stylesheets
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        stylesheets.push(href);
      }
    });

    // Images
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      const alt = $(el).attr("alt") || "";
      if (src) {
        images.push({
          src,
          alt,
          originalSrc: src,
        });
      }
    });

    // Links
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (href) {
        const isExternal = href.startsWith("http://") || href.startsWith("https://") && !href.includes(domain);
        links.push({
          href,
          text,
          external: isExternal,
        });
      }
    });
  }

  // 4. Shopify Detection Checks
  const hasShopifyThemeStyle = stylesheets.some(s => s.includes("cdn.shopify.com") || s.includes("shopify"));
  const hasShopifyScript = scripts.some(s => (s.src && s.src.includes("shopify")) || s.content.includes("Shopify."));
  const hasShopifyMeta = meta["generator"]?.toLowerCase().includes("shopify") || false;
  const isShopify = hasShopifyThemeStyle || hasShopifyScript || hasShopifyMeta;

  // Extracted theme attributes from scripts/meta/html
  let themeName: string | undefined;
  let themeId: string | undefined;

  if (isShopify && html) {
    // Attempt theme name detection via Shopify global JS configuration block
    const themeMatch = html.match(/"themeName"\s*:\s*"([^"]+)"/);
    if (themeMatch && themeMatch[1]) {
      themeName = themeMatch[1];
    }
    const themeIdMatch = html.match(/"themeId"\s*:\s*(\d+)/);
    if (themeIdMatch && themeIdMatch[1]) {
      themeId = themeIdMatch[1];
    }

    // Secondary regex check if not found
    if (!themeName) {
      const secondaryThemeMatch = html.match(/Shopify\.theme\s*=\s*\{[^}]*name:\s*"([^"]+)"/i);
      if (secondaryThemeMatch && secondaryThemeMatch[1]) {
        themeName = secondaryThemeMatch[1];
      }
    }
  }

  return {
    url: urlString,
    domain,
    html,
    headers,
    title,
    meta,
    headings,
    scripts,
    stylesheets,
    images,
    links,
    rawNetworkRequests,
    shopifyData: {
      isShopify,
      themeName,
      themeId,
      detectedApps: [], // Filled by App Detector
    },
  };
}
