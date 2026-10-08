import axios from "axios";
import * as cheerio from "cheerio";
import { ExtractedPageContent } from "@/types/shopify-audit";

const MAX_PAGES = 3;
const REQUEST_TIMEOUT = 7000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function fetchAndAnalyzePages(
  baseUrl: string,
  initialHtml?: string
): Promise<{ pages: ExtractedPageContent[]; count: number; urls: string[] }> {
  const pages: ExtractedPageContent[] = [];
  const urlsAnalyzed: string[] = [];

  // 1. Analyze Homepage
  let homeHtml = initialHtml;
  if (!homeHtml) {
    try {
      const res = await axios.get(baseUrl, {
        headers: { "User-Agent": USER_AGENT },
        timeout: REQUEST_TIMEOUT,
        maxRedirects: 3,
        validateStatus: () => true,
      });
      homeHtml = typeof res.data === "string" ? res.data : "";
    } catch {
      homeHtml = "";
    }
  }

  if (homeHtml) {
    const homeParsed = parsePageContent(baseUrl, homeHtml, "homepage");
    pages.push(homeParsed);
    urlsAnalyzed.push(baseUrl);
  }

  // 2. Discover One Product Page & One Collection Page from Homepage Links
  if (homeHtml && pages.length < MAX_PAGES) {
    const $ = cheerio.load(homeHtml);
    let productUrl: string | null = null;
    let collectionUrl: string | null = null;

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const fullUrl = resolveUrl(baseUrl, href);
      if (!fullUrl) return;

      if (!productUrl && fullUrl.includes("/products/") && !fullUrl.includes("#")) {
        productUrl = fullUrl;
      } else if (!collectionUrl && fullUrl.includes("/collections/") && !fullUrl.includes("#") && !fullUrl.endsWith("/collections/all")) {
        collectionUrl = fullUrl;
      }
    });

    // Fallback to /collections/all if specific collection not found
    if (!collectionUrl) {
      collectionUrl = resolveUrl(baseUrl, "/collections/all");
    }

    // Fetch Product Page
    if (productUrl && pages.length < MAX_PAGES) {
      try {
        const prodRes = await axios.get(productUrl, {
          headers: { "User-Agent": USER_AGENT },
          timeout: REQUEST_TIMEOUT,
          maxRedirects: 3,
          validateStatus: (status) => status >= 200 && status < 400,
        });
        if (typeof prodRes.data === "string") {
          pages.push(parsePageContent(productUrl, prodRes.data, "product"));
          urlsAnalyzed.push(productUrl);
        }
      } catch {
        // Safe continuation if product page fetch fails
      }
    }

    // Fetch Collection Page
    if (collectionUrl && pages.length < MAX_PAGES) {
      try {
        const colRes = await axios.get(collectionUrl, {
          headers: { "User-Agent": USER_AGENT },
          timeout: REQUEST_TIMEOUT,
          maxRedirects: 3,
          validateStatus: (status) => status >= 200 && status < 400,
        });
        if (typeof colRes.data === "string") {
          pages.push(parsePageContent(collectionUrl, colRes.data, "collection"));
          urlsAnalyzed.push(collectionUrl);
        }
      } catch {
        // Safe continuation
      }
    }
  }

  return {
    pages,
    count: pages.length,
    urls: urlsAnalyzed,
  };
}

function resolveUrl(base: string, relative: string): string | null {
  try {
    const urlObj = new URL(relative, base);
    const baseHost = new URL(base).hostname;
    // Keep to same domain
    if (urlObj.hostname !== baseHost) return null;
    return urlObj.href.split("?")[0].replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function parsePageContent(
  url: string,
  html: string,
  type: "homepage" | "product" | "collection" | "other"
): ExtractedPageContent {
  const $ = cheerio.load(html);

  const title = $("title").text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  const h1: string[] = [];
  $("h1").each((_, el) => {
    const txt = $(el).text().replace(/\s+/g, " ").trim();
    if (txt) h1.push(txt);
  });

  const headings: { level: number; text: string }[] = [];
  $("h1, h2, h3").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const level = parseInt(tag[1]) || 1;
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text && text.length < 120) {
      headings.push({ level, text });
    }
  });

  const ctaTexts: string[] = [];
  $("button, a.btn, a.button, input[type='submit']").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim() || $(el).attr("value") || "";
    if (text && text.length < 40 && !ctaTexts.includes(text)) {
      ctaTexts.push(text);
    }
  });

  const hasNavigation = $("nav, header, [role='navigation']").length > 0;

  // Trust signals
  const trustIndicators: string[] = [];
  const lowerHtml = html.toLowerCase();

  if (lowerHtml.includes("free shipping") || lowerHtml.includes("shipping worldwide")) {
    trustIndicators.push("Free shipping announcement");
  }
  if (lowerHtml.includes("30-day") || lowerHtml.includes("money back") || lowerHtml.includes("satisfaction guarantee")) {
    trustIndicators.push("Return or money-back guarantee");
  }
  if (lowerHtml.includes("ssl secured") || lowerHtml.includes("safe checkout") || lowerHtml.includes("trusted")) {
    trustIndicators.push("Secure checkout badges");
  }
  if (lowerHtml.includes("visa") || lowerHtml.includes("mastercard") || lowerHtml.includes("apple pay")) {
    trustIndicators.push("Payment provider icons");
  }

  const hasTrustSignals = trustIndicators.length > 0;
  const hasShippingInfo = lowerHtml.includes("shipping") || lowerHtml.includes("delivery");
  const hasReturnInfo = lowerHtml.includes("return") || lowerHtml.includes("refund");
  const hasGuarantees = lowerHtml.includes("guarantee") || lowerHtml.includes("warranty");

  // Reviews check
  const hasReviews =
    lowerHtml.includes("jdgm-") ||
    lowerHtml.includes("yotpo") ||
    lowerHtml.includes("loox") ||
    lowerHtml.includes("stamped") ||
    lowerHtml.includes("review-") ||
    lowerHtml.includes("spr-badge") ||
    $("span.rating, .review-count, .stars").length > 0;

  // Images
  let imageCount = 0;
  let imagesWithoutAlt = 0;
  $("img").each((_, el) => {
    imageCount++;
    const alt = $(el).attr("alt");
    if (!alt || !alt.trim()) {
      imagesWithoutAlt++;
    }
  });

  // Promotional messaging
  const promotionalMessaging: string[] = [];
  $(".announcement-bar, [class*='announcement'], [class*='promo'], [class*='banner']").each((_, el) => {
    const txt = $(el).text().replace(/\s+/g, " ").trim();
    if (txt && txt.length < 150) {
      promotionalMessaging.push(txt);
    }
  });

  // Product specific extractions
  let productPrice: string | undefined;
  let compareAtPrice: string | undefined;
  let hasVariants: boolean | undefined;
  let hasAddToCart: boolean | undefined;
  let hasFaqs: boolean | undefined;

  if (type === "product" || type === "homepage") {
    // Detect Add to Cart
    hasAddToCart =
      $("form[action*='/cart/add'], button[name='add'], [data-add-to-cart]").length > 0 ||
      ctaTexts.some((c) => /add to cart|buy now|pre-order/i.test(c));

    // Detect Variants
    hasVariants = $("select[name='id'], input[type='radio'][name*='variant'], [data-variant]").length > 0;

    // Detect Price
    const priceText = $("[class*='price'], .price, .product__price").first().text().replace(/\s+/g, " ").trim();
    if (priceText && /\$|€|£|¥|\d/.test(priceText)) {
      productPrice = priceText.slice(0, 30);
    }

    hasFaqs = lowerHtml.includes("faq") || lowerHtml.includes("frequently asked") || $("details, .accordion").length > 0;
  }

  // Collection specific extractions
  let productCardCount: number | undefined;
  let hasFilters: boolean | undefined;
  let hasSorting: boolean | undefined;

  if (type === "collection") {
    productCardCount = $("[class*='product-card'], [class*='product-grid-item'], [class*='card--product']").length;
    hasFilters = $("[class*='filter'], [id*='filter']").length > 0;
    hasSorting = $("select[name*='sort'], [class*='sort']").length > 0;
  }

  return {
    url,
    type,
    title,
    metaDescription,
    h1,
    headings,
    ctaTexts,
    hasNavigation,
    hasTrustSignals,
    trustIndicators,
    hasReviews,
    hasShippingInfo,
    hasReturnInfo,
    hasGuarantees,
    promotionalMessaging,
    productPrice,
    compareAtPrice,
    hasVariants,
    hasAddToCart,
    hasFaqs,
    imageCount,
    imagesWithoutAlt,
    productCardCount,
    hasFilters,
    hasSorting,
  };
}
