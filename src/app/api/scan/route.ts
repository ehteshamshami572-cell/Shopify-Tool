import { NextResponse } from "next/server";
import { orchestrateScan } from "@/lib/orchestrator";
import { SeoAnalyzer } from "@/lib/analyzers/seo";
import { AppDetector } from "@/lib/analyzers/app-detector";
import { ThemeIntelligence } from "@/lib/analyzers/theme-intelligence";
import { AccessibilityAnalyzer } from "@/lib/analyzers/accessibility";
import { ImageOptimizer } from "@/lib/analyzers/image-optimizer";
import { PageSpeedAnalyzer } from "@/lib/analyzers/pagespeed";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Store URL is required" }, { status: 400 });
    }

    console.log(`Starting Shopify scan for: ${url}`);

    // 1. Run Crawl & Parse Orchestration
    const context = await orchestrateScan(url);

    // 2. Run Plugins sequentially or in parallel depending on dependencies
    // App detection and Theme intelligence run first since PageSpeed and others consume their populated context data
    const appDetector = new AppDetector();
    const themeIntelligence = new ThemeIntelligence();

    const appResult = await appDetector.analyze(context);
    const themeResult = await themeIntelligence.analyze(context);

    // Run others in parallel
    const seoAnalyzer = new SeoAnalyzer();
    const accessibilityAnalyzer = new AccessibilityAnalyzer();
    const imageOptimizer = new ImageOptimizer();
    const pageSpeedAnalyzer = new PageSpeedAnalyzer();

    const [seoResult, a11yResult, imgResult, speedResult] = await Promise.all([
      seoAnalyzer.analyze(context),
      accessibilityAnalyzer.analyze(context),
      imageOptimizer.analyze(context),
      pageSpeedAnalyzer.analyze(context),
    ]);

    // Calculate consolidated stats
    const allIssues = [
      ...seoResult.issues,
      ...appResult.issues,
      ...themeResult.issues,
      ...a11yResult.issues,
      ...imgResult.issues,
      ...speedResult.issues,
    ];

    const allRecommendations = Array.from(
      new Set([
        ...seoResult.recommendations,
        ...appResult.recommendations,
        ...themeResult.recommendations,
        ...a11yResult.recommendations,
        ...imgResult.recommendations,
        ...speedResult.recommendations,
      ])
    );

    const scores = {
      seo: seoResult.score,
      apps: appResult.score,
      theme: themeResult.score,
      accessibility: a11yResult.score,
      images: imgResult.score,
      pagespeed: speedResult.score,
      overall: Math.round(
        (seoResult.score +
          appResult.score +
          themeResult.score +
          a11yResult.score +
          imgResult.score +
          speedResult.score) /
          6
      ),
    };

    return NextResponse.json({
      url: context.url,
      domain: context.domain,
      isShopify: context.shopifyData.isShopify,
      metadata: {
        title: context.title,
        description: context.meta["description"] || "",
        themeName: context.shopifyData.themeName || "Unknown Theme",
        themeId: context.shopifyData.themeId || "Unknown ID",
        detectedApps: context.shopifyData.detectedApps || [],
      },
      scores,
      modules: {
        seo: seoResult,
        apps: appResult,
        theme: themeResult,
        accessibility: a11yResult,
        images: imgResult,
        pagespeed: speedResult,
      },
      allIssues,
      allRecommendations,
      scannedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Scan route error:", err);
    return NextResponse.json({ error: "Failed to perform scan", details: err.message }, { status: 500 });
  }
}
