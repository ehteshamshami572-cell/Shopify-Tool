import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

interface OptimizationTask {
  title: string;
  impact: "high" | "medium" | "low";
  scoreBoost: number;
  description: string;
  recommendation: string;
}

export class SpeedOptimizationPlanner implements ShopifyAnalyzer {
  name = "Speed Optimizer Planner";
  id = "speed_planner";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    const pageSpeedScore = context.performanceMetrics?.mobile?.performance || 70;
    const appCount = context.shopifyData.detectedApps?.length || 0;
    const scriptCount = context.scripts.length;
    const imageCount = context.images.length;

    const tasks: OptimizationTask[] = [];

    // Calculate potential fixes
    if (imageCount > 20) {
      tasks.push({
        title: "Resize and Compress Catalog Images",
        impact: "high",
        scoreBoost: 8,
        description: `Your page loads ${imageCount} images. Deferring offscreen layouts and compressing legacy formats reduces paint times.`,
        recommendation: "Ensure Shopify template uses dynamic resizing queries like `image | image_url: width: 360`.",
      });
    }

    if (appCount > 6) {
      tasks.push({
        title: "Audit and Defer App Scripts",
        impact: "high",
        scoreBoost: 10,
        description: `We detected ${appCount} installed Shopify apps. Deferring non-critical scripts ensures the main layout loads faster.`,
        recommendation: "Clean up unused app remnants in theme.liquid and delay loading chat widgets.",
      });
    }

    // Font preload task
    tasks.push({
      title: "Preload Core Font Files",
      impact: "medium",
      scoreBoost: 3,
      description: "Preloading web font families prevents style shifts and invisible text layouts.",
      recommendation: "Embed `<link rel='preload' as='font' href='...' type='font/woff2' crossorigin>` tags in head templates.",
    });

    // CSS minification task
    if (context.stylesheets.length > 3) {
      tasks.push({
        title: "Consolidate Theme Stylesheets",
        impact: "medium",
        scoreBoost: 4,
        description: `We detected ${context.stylesheets.length} CSS stylesheets loaded, blocking browser layout paints.`,
        recommendation: "Merge custom styles into your main theme.css bundle to speed up browser processing.",
      });
    }

    // Project estimated score after optimizations
    const totalPotentialBoost = tasks.reduce((sum, t) => sum + t.scoreBoost, 0);
    const projectedScore = Math.min(99, pageSpeedScore + totalPotentialBoost);

    // Populate recommendations list
    tasks.forEach(t => {
      recommendations.push(`[+${t.scoreBoost} Score] ${t.title}: ${t.recommendation}`);
    });

    return {
      score: pageSpeedScore,
      issues,
      recommendations,
      data: {
        performanceScore: pageSpeedScore,
        projectedScore,
        estimatedGain: projectedScore - pageSpeedScore,
        optimizationTasks: tasks,
      },
    };
  }
}
