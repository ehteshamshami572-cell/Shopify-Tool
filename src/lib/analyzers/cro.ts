import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";
import * as cheerio from "cheerio";

export class CroAnalyzer implements ShopifyAnalyzer {
  name = "CRO Optimizer";
  id = "cro";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const html = context.html;
    if (!html) {
      return {
        score: 0,
        issues: [],
        recommendations: ["Ensure html finishes loading to run CRO rules."],
        data: {},
      };
    }

    const $ = cheerio.load(html);

    // 1. Trust Badges Check
    const hasTrustBadges = 
      html.includes("trust") || 
      html.includes("badge") || 
      html.includes("guarantee") || 
      $("img[src*='trust'], img[alt*='trust'], img[src*='badge'], img[alt*='badge']").length > 0;

    if (!hasTrustBadges) {
      score -= 15;
      issues.push({
        id: "cro_missing_trust_badges",
        severity: "warning",
        category: "CRO",
        title: "Missing trust indicators",
        description: "No trust badges, security icons, or credit card logos were found near the footer or purchase forms.",
        recommendation: "Embed trust banners (e.g., 'Free Returns', 'SSL Secured') to reduce visitor purchase friction.",
      });
      recommendations.push("Display security icons and satisfaction guarantees close to the main checkout buttons.");
    }

    // 2. Reviews Widgets Check
    const hasReviews = 
      html.includes("jdgm-") || 
      html.includes("loox-") || 
      html.includes("yotpo-") || 
      html.includes("review") || 
      html.includes("rating");

    if (!hasReviews) {
      score -= 20;
      issues.push({
        id: "cro_missing_reviews",
        severity: "critical",
        category: "CRO",
        title: "No Social Proof / Review Widgets",
        description: "No product review widgets, star ratings, or testimonials sections were identified in the DOM.",
        recommendation: "Install a review manager (e.g. Judge.me, Loox) to showcase ratings and build shopper validation.",
      });
      recommendations.push("Configure product reviews to display star ratings immediately under titles.");
    }

    // 3. Clear Returns/Shipping link check
    const hasReturnsPolicy = 
      html.includes("shipping") || 
      html.includes("return") || 
      html.includes("refund");

    if (!hasReturnsPolicy) {
      score -= 10;
      issues.push({
        id: "cro_missing_returns_policy",
        severity: "warning",
        category: "CRO",
        title: "Return & Refund Policies Hidden",
        description: "Links to shipping rates or refund policies are not prominent or missing.",
        recommendation: "Add 'Free shipping over $X' alerts and return link configurations to the footer navigation.",
      });
    }

    // 4. Urgency or Stock Indicators Check
    const hasUrgency = 
      html.includes("limited") || 
      html.includes("stock") || 
      html.includes("only") || 
      html.includes("left") || 
      html.includes("selling fast");

    if (!hasUrgency) {
      recommendations.push("Introduce low-stock indicators (e.g., 'Only 3 left in stock!') to trigger checkout urgency.");
    }

    // 5. Cart features check
    const hasFreeShippingProgress = html.includes("free shipping") || html.includes("shipping progress");
    if (!hasFreeShippingProgress) {
      recommendations.push("Provide a free-shipping threshold counter inside the cart page (e.g., 'Add $10 more for free shipping') to increase average order values (AOV).");
    }

    score = Math.max(0, score);

    // Calculate revenue boost estimate based on score gaps
    const revenueBoostPercentage = Math.round((100 - score) * 0.15 + 2);

    return {
      score,
      issues,
      recommendations,
      data: {
        hasTrustBadges,
        hasReviews,
        hasReturnsPolicy,
        hasUrgency,
        hasFreeShippingProgress,
        revenueBoost: `${revenueBoostPercentage}%`,
      },
    };
  }
}
