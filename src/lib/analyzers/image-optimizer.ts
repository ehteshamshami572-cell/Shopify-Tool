import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

export class ImageOptimizer implements ShopifyAnalyzer {
  name = "Image Optimizer";
  id = "image_optimizer";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const images = context.images;
    if (images.length === 0) {
      return {
        score: 100,
        issues: [],
        recommendations: ["No images detected on this page."],
        data: {
          totalImages: 0,
          unoptimizedFormats: 0,
          missingSizingParams: 0,
          missingLazyLoad: 0,
        },
      };
    }

    let unoptimizedFormats = 0;
    let missingSizingParams = 0;
    let missingLazyLoad = 0;
    let shopifyImagesCount = 0;

    // We also parse the HTML structure in detail for lazyload parameters
    // In next-step we can parse alt texts, sizes, format
    for (const img of images) {
      const src = img.src.toLowerCase();
      const isShopifyCdn = src.includes("cdn.shopify.com");

      if (isShopifyCdn) {
        shopifyImagesCount++;
        // Shopify CDN resizing check:
        // Normally, Shopify image sources look like: ".../product_name_300x300.jpg" or ".../product.jpg?v=123&width=360"
        // If they do not contain width/height parameters or sizing suffixes (e.g., _100x, _800x, etc.), they might load full sizes
        const hasResizingParam = src.includes("width=") || src.includes("height=") || /_\d+x\d*/.test(src) || src.includes("crop=");
        if (!hasResizingParam) {
          missingSizingParams++;
        }
      }

      // Format check (PNG/JPG should be converted to WebP/AVIF)
      const isLegacyFormat = src.endsWith(".jpg") || src.endsWith(".jpeg") || src.endsWith(".png");
      if (isLegacyFormat && !src.includes("format=webp") && !src.includes("format=avif")) {
        unoptimizedFormats++;
      }
    }

    // Parse lazy-loading from html (we can parse manually or use context)
    // For simplicity, we check the HTML matches for 'loading="lazy"' or 'loading='lazy''
    const lazyMatches = (context.html.match(/loading\s*=\s*["']lazy["']/g) || []).length;
    missingLazyLoad = Math.max(0, images.length - lazyMatches);

    // 1. Sizing query parameter check
    if (missingSizingParams > 0) {
      const penalty = Math.min(25, missingSizingParams * 4);
      score -= penalty;
      issues.push({
        id: "img_missing_shopify_resizing",
        severity: missingSizingParams > 5 ? "critical" : "warning",
        category: "Images",
        title: `Images Missing CDN Resizing Parameters (${missingSizingParams} images)`,
        description: `Detected ${missingSizingParams} Shopify CDN images loaded at full resolution without utilizing Shopify's dynamic width resizing queries. This wastes bandwidth and slows page rendering.`,
        recommendation: "Ensure theme uses liquid tags like `image | image_url: width: 360` to fetch appropriately sized images.",
      });
      recommendations.push("Utilize srcsets and media query filters in liquid elements to server correct sizing.");
    }

    // 2. Legacy format check
    if (unoptimizedFormats > 0) {
      const percentage = Math.round((unoptimizedFormats / images.length) * 100);
      const penalty = Math.min(20, Math.ceil(unoptimizedFormats * 1.5));
      score -= penalty;
      issues.push({
        id: "img_legacy_formats",
        severity: "warning",
        category: "Images",
        title: `Legacy Image Formats Detected (${unoptimizedFormats} images)`,
        description: `${unoptimizedFormats} images (${percentage}%) are using legacy formats (JPG/PNG) instead of modern formats (WebP/AVIF) or format conversion queries.`,
        recommendation: "Convert source images to WebP inside Shopify Admin or append `format=webp` request flags to Shopify CDN image links.",
      });
    }

    // 3. Lazy loading check
    if (missingLazyLoad > 5) {
      score -= 10;
      issues.push({
        id: "img_missing_lazy_load",
        severity: "warning",
        category: "Images",
        title: "Missing Lazy Loading Attributes",
        description: `Only ${lazyMatches} out of ${images.length} images are configured to lazy load. Offscreen images should be deferred to improve Largest Contentful Paint (LCP).`,
        recommendation: "Add `loading='lazy'` attributes to all images below the fold. Exclude the main hero banners or LCP images from lazy-loading.",
      });
      recommendations.push("Add `loading='eager'` to the above-the-fold hero image for faster visual load, and `loading='lazy'` to catalog layout lists.");
    }

    score = Math.max(0, score);

    return {
      score,
      issues,
      recommendations,
      data: {
        totalImages: images.length,
        shopifyImagesCount,
        unoptimizedFormats,
        missingSizingParams,
        missingLazyLoad,
        lazyLoadedCount: lazyMatches,
      },
    };
  }
}
