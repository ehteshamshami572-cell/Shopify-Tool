import { NextResponse } from "next/server";
import { orchestrateScan } from "@/lib/orchestrator";
import { SeoAnalyzer } from "@/lib/analyzers/seo";
import { AppDetector } from "@/lib/analyzers/app-detector";
import { ThemeIntelligence } from "@/lib/analyzers/theme-intelligence";
import { AccessibilityAnalyzer } from "@/lib/analyzers/accessibility";
import { ImageOptimizer } from "@/lib/analyzers/image-optimizer";
import { PageSpeedAnalyzer } from "@/lib/analyzers/pagespeed";
import { QaAutomationAnalyzer } from "@/lib/analyzers/qa-automation";
import { StoreBenchmarkAnalyzer } from "@/lib/analyzers/benchmark";
import { AppCostAnalyzer } from "@/lib/analyzers/app-cost";
import { CroAnalyzer } from "@/lib/analyzers/cro";
import { SpeedOptimizationPlanner } from "@/lib/analyzers/speed-planner";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Store URL is required" }, { status: 400 });
    }

    console.log(`Starting expanded Shopify scan for: ${url}`);

    // 1. Run Crawl & Parse Orchestration
    const context = await orchestrateScan(url);

    // 2. Run App detector and Theme intelligence first since context shopifyData is populated
    const appDetector = new AppDetector();
    const themeIntelligence = new ThemeIntelligence();

    const appResult = await appDetector.analyze(context);
    const themeResult = await themeIntelligence.analyze(context);

    // 3. Run remaining 9 modules in parallel
    const seoAnalyzer = new SeoAnalyzer();
    const accessibilityAnalyzer = new AccessibilityAnalyzer();
    const imageOptimizer = new ImageOptimizer();
    const pageSpeedAnalyzer = new PageSpeedAnalyzer();
    const qaAnalyzer = new QaAutomationAnalyzer();
    const benchmarkAnalyzer = new StoreBenchmarkAnalyzer();
    const appCostAnalyzer = new AppCostAnalyzer();
    const croAnalyzer = new CroAnalyzer();
    const speedPlanner = new SpeedOptimizationPlanner();

    const [
      seoResult,
      a11yResult,
      imgResult,
      speedResult,
      qaResult,
      benchmarkResult,
      costResult,
      croResult,
      speedPlannerResult
    ] = await Promise.all([
      seoAnalyzer.analyze(context),
      accessibilityAnalyzer.analyze(context),
      imageOptimizer.analyze(context),
      pageSpeedAnalyzer.analyze(context),
      qaAnalyzer.analyze(context),
      benchmarkAnalyzer.analyze(context),
      appCostAnalyzer.analyze(context),
      croAnalyzer.analyze(context),
      speedPlanner.analyze(context),
    ]);

    // Calculate consolidated stats
    const allIssues = [
      ...seoResult.issues,
      ...appResult.issues,
      ...themeResult.issues,
      ...a11yResult.issues,
      ...imgResult.issues,
      ...speedResult.issues,
      ...qaResult.issues,
      ...benchmarkResult.issues,
      ...costResult.issues,
      ...croResult.issues,
      ...speedPlannerResult.issues,
    ];

    const allRecommendations = Array.from(
      new Set([
        ...seoResult.recommendations,
        ...appResult.recommendations,
        ...themeResult.recommendations,
        ...a11yResult.recommendations,
        ...imgResult.recommendations,
        ...speedResult.recommendations,
        ...qaResult.recommendations,
        ...benchmarkResult.recommendations,
        ...costResult.recommendations,
        ...croResult.recommendations,
        ...speedPlannerResult.recommendations,
      ])
    );

    const scores = {
      seo: seoResult.score,
      apps: appResult.score,
      theme: themeResult.score,
      accessibility: a11yResult.score,
      images: imgResult.score,
      pagespeed: speedResult.score,
      qa: qaResult.score,
      benchmark: benchmarkResult.score,
      cost: costResult.score,
      cro: croResult.score,
      speedPlanner: speedPlannerResult.score,
      overall: Math.round(
        (seoResult.score +
          appResult.score +
          themeResult.score +
          a11yResult.score +
          imgResult.score +
          speedResult.score +
          qaResult.score +
          benchmarkResult.score +
          costResult.score +
          croResult.score +
          speedPlannerResult.score) /
          11
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
        qa: qaResult,
        benchmark: benchmarkResult,
        cost: costResult,
        cro: croResult,
        speedPlanner: speedPlannerResult,
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
