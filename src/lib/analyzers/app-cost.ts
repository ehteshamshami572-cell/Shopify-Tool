import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

interface AppPricing {
  name: string;
  monthlyCost: number;
  performanceImpact: "high" | "medium" | "low";
  alternative: string;
  altCost: number;
  purpose: string;
}

export class AppCostAnalyzer implements ShopifyAnalyzer {
  name = "App Cost Analyzer";
  id = "app_cost";

  private pricingDb: Record<string, AppPricing> = {
    "Klaviyo": { name: "Klaviyo", monthlyCost: 150, performanceImpact: "medium", alternative: "Shopify Email", altCost: 0, purpose: "Marketing Automation" },
    "Loox Reviews": { name: "Loox Reviews", monthlyCost: 29, performanceImpact: "medium", alternative: "Judge.me (Free Tier)", altCost: 0, purpose: "Product Reviews" },
    "Judge.me": { name: "Judge.me", monthlyCost: 15, performanceImpact: "low", alternative: "Shopify Reviews", altCost: 0, purpose: "Product Reviews" },
    "Yotpo": { name: "Yotpo", monthlyCost: 79, performanceImpact: "high", alternative: "Judge.me / Shopify Inbox", altCost: 15, purpose: "Reviews & Loyalty" },
    "Recharge": { name: "Recharge", monthlyCost: 99, performanceImpact: "medium", alternative: "Shopify Subscriptions API", altCost: 0, purpose: "Subscriptions" },
    "Bold Commerce": { name: "Bold Commerce", monthlyCost: 49, performanceImpact: "medium", alternative: "Shopify Bundle App", altCost: 0, purpose: "Subscriptions & Options" },
    "PageFly": { name: "PageFly", monthlyCost: 29, performanceImpact: "medium", alternative: "OS 2.0 JSON Custom Sections", altCost: 0, purpose: "Page Builder" },
    "Shogun": { name: "Shogun", monthlyCost: 39, performanceImpact: "high", alternative: "PageFly or Standard JSON sections", altCost: 29, purpose: "Page Builder" },
    "Smile.io": { name: "Smile.io", monthlyCost: 49, performanceImpact: "medium", alternative: "Growave / Joy Loyalty", altCost: 29, purpose: "Loyalty & Rewards" },
    "Gorgias": { name: "Gorgias", monthlyCost: 79, performanceImpact: "low", alternative: "Shopify Inbox (Free)", altCost: 0, purpose: "Customer Chat Support" },
    "Tidio": { name: "Tidio", monthlyCost: 39, performanceImpact: "low", alternative: "Shopify Inbox (Free)", altCost: 0, purpose: "Customer Chat Support" },
    "Shopify Inbox": { name: "Shopify Inbox", monthlyCost: 0, performanceImpact: "low", alternative: "None (Free & Native)", altCost: 0, purpose: "Chat Support" },
    "Omnisend": { name: "Omnisend", monthlyCost: 59, performanceImpact: "medium", alternative: "Shopify Email (Free up to 10k emails)", altCost: 0, purpose: "Marketing Automation" },
    "Hotjar": { name: "Hotjar", monthlyCost: 39, performanceImpact: "high", alternative: "Microsoft Clarity (100% Free)", altCost: 0, purpose: "Session Recordings" },
    "Lucky Orange": { name: "Lucky Orange", monthlyCost: 29, performanceImpact: "medium", alternative: "Microsoft Clarity (Free)", altCost: 0, purpose: "Session Recordings" },
    "Privy": { name: "Privy", monthlyCost: 30, performanceImpact: "high", alternative: "Shopify Forms (Free)", altCost: 0, purpose: "Popups & Email Capture" },
    "Okendo Reviews": { name: "Okendo Reviews", monthlyCost: 29, performanceImpact: "medium", alternative: "Judge.me", altCost: 15, purpose: "Product Reviews" },
    "Stamped.io": { name: "Stamped.io", monthlyCost: 19, performanceImpact: "low", alternative: "Judge.me", altCost: 15, purpose: "Product Reviews" },
    "Ali Reviews": { name: "Ali Reviews", monthlyCost: 15, performanceImpact: "medium", alternative: "Judge.me", altCost: 15, purpose: "Product Reviews" },
    "Growave": { name: "Growave", monthlyCost: 29, performanceImpact: "medium", alternative: "Smile.io / Judge.me", altCost: 15, purpose: "Loyalty & Reviews" },
    "Weglot": { name: "Weglot", monthlyCost: 29, performanceImpact: "low", alternative: "Shopify Translate & Adapt", altCost: 0, purpose: "Translation & Languages" },
    "Langify": { name: "Langify", monthlyCost: 17, performanceImpact: "low", alternative: "Shopify Translate & Adapt", altCost: 0, purpose: "Translation & Languages" },
    "Infinite Options": { name: "Infinite Options", monthlyCost: 10, performanceImpact: "low", alternative: "Shopify Variant Swatches", altCost: 0, purpose: "Product Options" },
  };

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    const detectedApps = context.shopifyData.detectedApps || [];
    const items: AppPricing[] = [];
    let totalCost = 0;
    let highImpactCount = 0;

    for (const appName of detectedApps) {
      const match = this.pricingDb[appName];
      if (match) {
        items.push(match);
        totalCost += match.monthlyCost;
        if (match.performanceImpact === "high") {
          highImpactCount++;
        }
      } else {
        // Fallback estimate for unrecognized apps
        const fallback: AppPricing = {
          name: appName,
          monthlyCost: 19, // typical average shopify app cost
          performanceImpact: "low",
          alternative: "Evaluate utility",
          altCost: 0,
          purpose: "Utility Plugin",
        };
        items.push(fallback);
        totalCost += fallback.monthlyCost;
      }
    }

    // App cost analyzer scorecard score
    // Higher costs and high performance impacts reduce the score
    let score = 100;
    if (totalCost > 200) score -= 15;
    if (totalCost > 500) score -= 15;
    if (highImpactCount > 1) score -= 15;

    score = Math.max(40, score);

    // Formulate alerts
    if (totalCost > 150) {
      issues.push({
        id: "cost_high_monthly",
        severity: "warning",
        category: "App Cost",
        title: `High App Subscriptions (${totalCost}/mo)`,
        description: `We estimate this store spends around $${totalCost} per month on SaaS subscription apps. Some apps load large JS bundles that degrade site speeds.`,
        recommendation: "Evaluate high-cost apps like page builders and email managers for native Shopify equivalents.",
      });
    }

    items.forEach(app => {
      if (app.monthlyCost > 0 && app.alternative !== "None (Free & Native)") {
        const potentialSavings = app.monthlyCost - app.altCost;
        if (potentialSavings > 15) {
          recommendations.push(
            `Replace ${app.name} ($${app.monthlyCost}/mo) with ${app.alternative} ($${app.altCost}/mo) to save $${potentialSavings}/mo.`
          );
        }
      }
    });

    return {
      score,
      issues,
      recommendations,
      data: {
        totalCost,
        highImpactCount,
        appsDetail: items,
      },
    };
  }
}
