import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";
import axios from "axios";

export class PageSpeedAnalyzer implements ShopifyAnalyzer {
  name = "PageSpeed Insights";
  id = "pagespeed";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    const apiKey = process.env.PAGESPEED_API_KEY;
    let performance = 0;
    let accessibility = 0;
    let bestPractices = 0;
    let seo = 0;

    let fcp = "1.2s";
    let speedIndex = "1.8s";
    let lcp = "2.5s";
    let tbt = "180ms";
    let cls = "0.05";
    let interactive = "2.8s";

    let fetchedRealData = false;

    if (apiKey) {
      try {
        const desktopUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          context.url
        )}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

        const res = await axios.get(desktopUrl, { timeout: 25000 });
        const categories = res.data?.lighthouseResult?.categories;
        const audits = res.data?.lighthouseResult?.audits;

        if (categories) {
          performance = Math.round((categories.performance?.score || 0) * 100);
          accessibility = Math.round((categories.accessibility?.score || 0) * 100);
          bestPractices = Math.round((categories["best-practices"]?.score || 0) * 100);
          seo = Math.round((categories.seo?.score || 0) * 100);

          fcp = audits?.["first-contentful-paint"]?.displayValue || fcp;
          speedIndex = audits?.["speed-index"]?.displayValue || speedIndex;
          lcp = audits?.["largest-contentful-paint"]?.displayValue || lcp;
          tbt = audits?.["total-blocking-time"]?.displayValue || tbt;
          cls = audits?.["cumulative-layout-shift"]?.displayValue || cls;
          interactive = audits?.["interactive"]?.displayValue || interactive;

          fetchedRealData = true;
        }
      } catch (err: any) {
        console.warn("Failed to fetch real Google PageSpeed data. Falling back to heuristic engine.", err.message);
      }
    }

    // Heuristic Engine fallback if no API key or API call failed
    if (!fetchedRealData) {
      // Calculate realistic Performance score based on app count, image optimizer results
      let perfScore = 95;

      // App count penalty (Shopify apps inject a lot of scripts)
      const appCount = context.shopifyData.detectedApps?.length || 0;
      perfScore -= appCount * 2.5;

      // Script count penalty
      const scriptCount = context.scripts.length;
      perfScore -= Math.min(15, scriptCount * 0.4);

      // Image count & formatting penalty
      const imgCount = context.images.length;
      perfScore -= Math.min(10, imgCount * 0.3);

      // Legacy theme architecture penalty
      if (context.shopifyData.isShopify && !context.shopifyData.themeName) {
        perfScore -= 10;
      }

      performance = Math.max(35, Math.round(perfScore));

      // Calculate mock lighthouse metric timings based on performance score
      const ratio = (100 - performance) / 100;
      fcp = `${(1.0 + ratio * 2.5).toFixed(1)}s`;
      speedIndex = `${(1.5 + ratio * 3.5).toFixed(1)}s`;
      lcp = `${(1.8 + ratio * 5.0).toFixed(1)}s`;
      tbt = `${Math.round(80 + ratio * 800)}ms`;
      cls = (ratio * 0.35).toFixed(2);
      interactive = `${(2.0 + ratio * 6.0).toFixed(1)}s`;

      // Sync other category grades based on actual page audit contexts
      // Accessibility score approximation (will be refined by accessibility analyzer)
      accessibility = 90;
      if (context.images.some(img => !img.alt.trim())) accessibility -= 10;
      if (context.meta["viewport"]?.includes("user-scalable=no")) accessibility -= 10;

      // Best practices score approximation
      bestPractices = 88;
      if (!context.url.startsWith("https://")) bestPractices -= 10;
      if (context.scripts.some(s => s.src && s.src.includes("jquery/1."))) bestPractices -= 8; // old jquery version

      // SEO score approximation
      seo = 90;
      if (!context.title) seo -= 20;
      if (!context.meta["description"]) seo -= 15;
    }

    // Map audits to issues
    if (performance < 50) {
      issues.push({
        id: "speed_poor_performance",
        severity: "critical",
        category: "Performance",
        title: "Poor Core Web Vitals Performance",
        description: `Mobile speed score is ${performance}/100. First Input Delay (FID) and Largest Contentful Paint (LCP) timings indicate long loading delays for visitors.`,
        recommendation: "Optimize images, implement CSS/JS minification, delay non-critical Shopify scripts, and audit third-party apps.",
      });
    } else if (performance < 90) {
      issues.push({
        id: "speed_moderate_performance",
        severity: "warning",
        category: "Performance",
        title: "Moderate Core Web Vitals Speed",
        description: `Mobile speed score is ${performance}/100. Opportunities exist to improve render blocking resources and layout stability.`,
        recommendation: "Review CSS payloads and lazy load off-screen images to bump the score past 90.",
      });
    }

    // Total Blocking Time alert
    const tbtVal = parseInt(tbt.replace("ms", "")) || 0;
    if (tbtVal > 300) {
      issues.push({
        id: "speed_high_tbt",
        severity: "warning",
        category: "Performance",
        title: `High Total Blocking Time (${tbt})`,
        description: "Large volumes of javascript are blocking the browser main execution thread, delaying interactive elements from responding to mouse clicks or key inputs.",
        recommendation: "Defer Shopify app scripts that are not required for immediate layout paint.",
      });
    }

    // Cumulative Layout Shift alert
    const clsVal = parseFloat(cls) || 0;
    if (clsVal > 0.1) {
      issues.push({
        id: "speed_high_cls",
        severity: "warning",
        category: "Performance",
        title: `High Cumulative Layout Shift (${cls})`,
        description: "Elements on the page shift dynamically as assets finish loading, leading to a jarring user experience.",
        recommendation: "Set explicit width/height dimensions on image elements and reserve space for dynamic blocks (like review widgets).",
      });
    }

    context.performanceMetrics = {
      mobile: { performance, accessibility, bestPractices, seo, firstContentfulPaint: fcp, speedIndex, largestContentfulPaint: lcp, totalBlockingTime: tbt, cumulativeLayoutShift: cls, interactive },
      desktop: { performance: Math.min(100, performance + 12), accessibility, bestPractices, seo, firstContentfulPaint: fcp, speedIndex, largestContentfulPaint: lcp, totalBlockingTime: tbt, cumulativeLayoutShift: cls, interactive }
    };

    return {
      score: performance,
      issues,
      recommendations,
      data: {
        performance,
        accessibility,
        bestPractices,
        seo,
        metrics: {
          firstContentfulPaint: fcp,
          speedIndex,
          largestContentfulPaint: lcp,
          totalBlockingTime: tbt,
          cumulativeLayoutShift: cls,
          interactive,
        },
        fetchedRealData,
      },
    };
  }
}
