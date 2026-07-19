import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

interface BenchmarkData {
  avgImages: number;
  avgApps: number;
  avgScripts: number;
  avgScore: number;
  avgPageSpeed: number;
}

export class StoreBenchmarkAnalyzer implements ShopifyAnalyzer {
  name = "Competitor Benchmark";
  id = "benchmark";

  private industryBenchmarks: Record<string, BenchmarkData> = {
    fashion: { avgImages: 85, avgApps: 12, avgScripts: 28, avgScore: 82, avgPageSpeed: 78 },
    electronics: { avgImages: 60, avgApps: 10, avgScripts: 24, avgScore: 85, avgPageSpeed: 81 },
    food_beverage: { avgImages: 45, avgApps: 8, avgScripts: 20, avgScore: 88, avgPageSpeed: 85 },
    general: { avgImages: 65, avgApps: 11, avgScripts: 25, avgScore: 84, avgPageSpeed: 80 },
  };

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Extract actual metrics
    const appCount = context.shopifyData.detectedApps?.length || 0;
    const scriptCount = context.scripts.length;
    const imageCount = context.images.length;
    
    // PageSpeed mobile performance (retrieve from context if calculated, otherwise estimate)
    const pageSpeedScore = context.performanceMetrics?.mobile?.performance || 70;

    // Use General as default, allow expansion
    const benchmark = this.industryBenchmarks.general;

    // Calculate score based on deviations
    let score = 100;

    // App Count comparison
    const appDiff = appCount - benchmark.avgApps;
    if (appDiff > 0) {
      score -= Math.min(15, appDiff * 3);
    }

    // Image Count comparison
    const imgDiff = imageCount - benchmark.avgImages;
    if (imgDiff > 15) {
      score -= 10;
    }

    // Speed comparison
    const speedDiff = benchmark.avgPageSpeed - pageSpeedScore;
    if (speedDiff > 0) {
      score -= Math.min(20, speedDiff * 1.5);
    }

    score = Math.max(30, Math.round(score));

    // Formulate rankings
    let rank = "Average";
    if (score >= 90) rank = "Top 10% (Leader)";
    else if (score >= 75) rank = "Top 25% (Above Average)";
    else if (score < 50) rank = "Bottom 25% (Below Average)";

    // Add benchmark issue warning if script count is excessive
    if (scriptCount > benchmark.avgScripts * 1.5) {
      issues.push({
        id: "benchmark_high_scripts",
        severity: "warning",
        category: "Benchmark",
        title: "Script Payload Above Average",
        description: `This store loads ${scriptCount} javascript elements, which is ${Math.round(
          ((scriptCount - benchmark.avgScripts) / benchmark.avgScripts) * 100
        )}% higher than the industry average (${benchmark.avgScripts}).`,
        recommendation: "Review loaded libraries and disable unused app templates.",
      });
      recommendations.push("Trim script bundles: consolidate analytic pixels and third-party trackers.");
    }

    if (pageSpeedScore < benchmark.avgPageSpeed - 10) {
      issues.push({
        id: "benchmark_poor_speed",
        severity: "warning",
        category: "Benchmark",
        title: "Speed Performance Below Benchmark",
        description: `Your PageSpeed score of ${pageSpeedScore} is lower than the industry benchmark speed of ${benchmark.avgPageSpeed}.`,
        recommendation: "Optimize critical rendering path stylesheets and defer app blocks script hooks.",
      });
    }

    return {
      score,
      issues,
      recommendations,
      data: {
        ranking: rank,
        industryDefaults: benchmark,
        comparisons: {
          apps: { actual: appCount, benchmark: benchmark.avgApps, status: appCount <= benchmark.avgApps ? "better" : "worse" },
          images: { actual: imageCount, benchmark: benchmark.avgImages, status: imageCount <= benchmark.avgImages ? "better" : "worse" },
          scripts: { actual: scriptCount, benchmark: benchmark.avgScripts, status: scriptCount <= benchmark.avgScripts ? "better" : "worse" },
          pagespeed: { actual: pageSpeedScore, benchmark: benchmark.avgPageSpeed, status: pageSpeedScore >= benchmark.avgPageSpeed ? "better" : "worse" },
        },
      },
    };
  }
}
