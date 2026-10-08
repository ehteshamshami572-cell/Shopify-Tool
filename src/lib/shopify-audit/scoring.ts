import { MetricStatus, OverallScores } from "@/types/shopify-audit";

export const CRO_CATEGORY_WEIGHTS = {
  messaging: 15,
  cta: 15,
  trust: 15,
  productPresentation: 15,
  socialProof: 10,
  navigation: 10,
  mobileUx: 10,
  purchaseFriction: 10,
} as const;

export const OVERALL_AUDIT_WEIGHTS = {
  performance: 0.4,
  cro: 0.4,
  seo: 0.1,
  accessibility: 0.1,
} as const;

export function getScoreClassification(score: number): MetricStatus {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "needs_improvement";
  return "critical";
}

export function calculateOverallAuditScores(
  performanceScore: number,
  croScore: number,
  seoScore: number = 85,
  accessibilityScore: number = 88
): OverallScores {
  const perfWeight = OVERALL_AUDIT_WEIGHTS.performance;
  const croWeight = OVERALL_AUDIT_WEIGHTS.cro;
  const seoWeight = OVERALL_AUDIT_WEIGHTS.seo;
  const a11yWeight = OVERALL_AUDIT_WEIGHTS.accessibility;

  const rawOverall =
    performanceScore * perfWeight +
    croScore * croWeight +
    seoScore * seoWeight +
    accessibilityScore * a11yWeight;

  const overall = Math.round(Math.max(0, Math.min(100, rawOverall)));

  return {
    overall,
    status: getScoreClassification(overall),
    performance: performanceScore,
    cro: croScore,
    seo: seoScore,
    accessibility: accessibilityScore,
    weights: {
      performance: perfWeight * 100,
      cro: croWeight * 100,
      seo: seoWeight * 100,
      accessibility: a11yWeight * 100,
    },
  };
}
