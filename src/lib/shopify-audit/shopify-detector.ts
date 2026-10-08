import { ShopifyDetection } from "@/types/shopify-audit";

export function detectShopifyStore(
  html: string,
  headers: Record<string, string> = {}
): ShopifyDetection {
  const indicators: string[] = [];
  let confidence = 0;
  let themeName: string | undefined;
  let themeId: string | undefined;

  const lowerHtml = (html || "").toLowerCase();

  // 1. Check CDN references
  if (lowerHtml.includes("cdn.shopify.com")) {
    indicators.push("References cdn.shopify.com asset pipeline");
    confidence += 30;
  }

  if (lowerHtml.includes("/cdn/shop/")) {
    indicators.push("Uses modern Shopify /cdn/shop/ asset paths");
    confidence += 30;
  }

  // 2. Check Meta Generator tag
  if (lowerHtml.includes('<meta name="generator" content="shopify"') || lowerHtml.includes("name='generator' content='shopify'")) {
    indicators.push("Explicit Shopify generator meta tag detected");
    confidence += 35;
  }

  // 3. Check JavaScript Globals and configuration objects
  if (lowerHtml.includes("window.shopify") || lowerHtml.includes("shopify.theme") || lowerHtml.includes("shopify.currency")) {
    indicators.push("Shopify client-side JavaScript object initialized");
    confidence += 25;
  }

  // 4. Check Shopify Section DOM attributes
  if (lowerHtml.includes("shopify-section") || lowerHtml.includes("data-shopify")) {
    indicators.push("Shopify Online Store 2.0 sections present in DOM");
    confidence += 20;
  }

  // 5. Check Checkout or Cart endpoints
  if (lowerHtml.includes("/cart/add") || lowerHtml.includes("/cart.js") || lowerHtml.includes("myshopify.com")) {
    indicators.push("Shopify native cart and domain endpoints detected");
    confidence += 20;
  }

  // 6. Check Response Headers
  const headerKeys = Object.keys(headers).map((k) => k.toLowerCase());
  for (const k of headerKeys) {
    if (k.startsWith("x-shopify") || k.includes("shopify")) {
      indicators.push(`Shopify HTTP header: ${k}`);
      confidence += 35;
      break;
    }
  }

  // 7. Extract Theme Intelligence if available
  const themeNameMatch = html.match(/"themeName"\s*:\s*"([^"]+)"/i) || html.match(/theme\s*=\s*\{[^}]*name:\s*"([^"]+)"/i);
  if (themeNameMatch && themeNameMatch[1]) {
    themeName = themeNameMatch[1].trim();
    indicators.push(`Theme identified: ${themeName}`);
  }

  const themeIdMatch = html.match(/"themeId"\s*:\s*(\d+)/i) || html.match(/id:\s*(\d{7,})/i);
  if (themeIdMatch && themeIdMatch[1]) {
    themeId = themeIdMatch[1];
  }

  // Bound confidence between 0 and 100
  confidence = Math.min(100, confidence);
  const isShopify = confidence >= 30;

  return {
    isShopify,
    confidence,
    indicators,
    themeName,
    themeId,
  };
}
