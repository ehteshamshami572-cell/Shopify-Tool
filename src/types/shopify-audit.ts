import { z } from "zod";

export type AuditStatus = "idle" | "validating" | "detecting" | "analyzing_pages" | "running_pagespeed" | "analyzing_cro" | "generating_ai" | "completed" | "error";

export type MetricStatus = "excellent" | "good" | "needs_improvement" | "critical";

export interface ShopifyDetection {
  isShopify: boolean;
  confidence: number; // 0 to 100
  indicators: string[];
  themeName?: string;
  themeId?: string;
}

export interface ExtractedPageContent {
  url: string;
  type: "homepage" | "product" | "collection" | "other";
  title: string;
  metaDescription: string;
  h1: string[];
  headings: { level: number; text: string }[];
  ctaTexts: string[];
  hasNavigation: boolean;
  hasTrustSignals: boolean;
  trustIndicators: string[];
  hasReviews: boolean;
  reviewCount?: number;
  rating?: number;
  hasShippingInfo: boolean;
  hasReturnInfo: boolean;
  hasGuarantees: boolean;
  promotionalMessaging: string[];
  // Product specific
  productPrice?: string;
  compareAtPrice?: string;
  hasVariants?: boolean;
  hasAddToCart?: boolean;
  hasFaqs?: boolean;
  imageCount: number;
  imagesWithoutAlt: number;
  // Collection specific
  productCardCount?: number;
  hasFilters?: boolean;
  hasSorting?: boolean;
}

export interface CoreWebVitalItem {
  id: "LCP" | "CLS" | "INP" | "FCP" | "TTFB" | "SpeedIndex";
  name: string;
  displayValue: string;
  numericValue: number;
  unit: string;
  status: MetricStatus;
  threshold: string;
  explanation: string;
}

export interface CoreWebVitals {
  lcp: CoreWebVitalItem;
  cls: CoreWebVitalItem;
  inp: CoreWebVitalItem;
  fcp: CoreWebVitalItem;
  ttfb: CoreWebVitalItem;
  speedIndex: CoreWebVitalItem;
}

export interface PerformanceOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedSavings?: string;
  impact: "high" | "medium" | "low";
}

export interface PerformanceAudit {
  score: number;
  mobileScore: number;
  desktopScore: number;
  coreWebVitals: CoreWebVitals;
  topOpportunities: PerformanceOpportunity[];
  diagnostics: {
    totalBlockingTime: string;
    interactive: string;
    scriptCount: number;
    stylesheetCount: number;
    imageCount: number;
    pageSizeBytes?: number;
    potentialContributors: string[];
  };
  isSimulated: boolean;
}

export interface CROCategoryEvaluation {
  id: string;
  name: string;
  weight: number;
  score: number;
  status: MetricStatus;
  findings: string[];
  recommendations: string[];
}

export interface CROAudit {
  overallScore: number;
  categories: {
    messaging: CROCategoryEvaluation;
    cta: CROCategoryEvaluation;
    trust: CROCategoryEvaluation;
    productPresentation: CROCategoryEvaluation;
    socialProof: CROCategoryEvaluation;
    navigation: CROCategoryEvaluation;
    mobileUx: CROCategoryEvaluation;
    purchaseFriction: CROCategoryEvaluation;
  };
  keyFindings: string[];
}

export interface OverallScores {
  overall: number;
  status: MetricStatus;
  performance: number;
  cro: number;
  seo?: number;
  accessibility?: number;
  weights: {
    performance: number;
    cro: number;
    seo: number;
    accessibility: number;
  };
}

export interface CriticalIssue {
  id: string;
  title: string;
  description: string;
  category: "performance" | "cro" | "ux" | "technical" | string;
  impact: "high" | "medium" | "low" | string;
  effort: "low" | "medium" | "high" | string;
  severity?: "critical" | "high" | "medium" | "low" | string;
  solution?: string;
}

export interface AuditRecommendation {
  id: string;
  title: string;
  problem?: string;
  recommendation?: string;
  expectedImpact?: string;
  priority: "P1" | "P2" | "P3" | number | string;
  category: "cro" | "performance" | "ux" | string;
  impact?: string;
  description?: string;
  actionableSteps?: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  problem?: string;
  solution?: string;
  priority?: "P1" | "P2" | "P3" | string;
  impact?: "high" | "medium" | "low" | string;
  effort?: "low" | "medium" | "high" | string;
  description?: string;
}

export interface Roadmap {
  quickWins: RoadmapItem[];
  highImpact: RoadmapItem[];
  shortTerm: RoadmapItem[];
  longTerm: RoadmapItem[];
}

export type AuditRoadmap = Roadmap;
export type CROCategoryResult = CROCategoryEvaluation;
export type PerformanceAuditResult = PerformanceAudit;

export interface AIAnalysis {
  isAvailable: boolean;
  provider: string;
  summary: string;
  strengths: string[];
  criticalIssues: CriticalIssue[];
  croRecommendations: AuditRecommendation[];
  performanceRecommendations: AuditRecommendation[];
  roadmap: Roadmap;
}

export interface AuditResult {
  version: string;
  url: string;
  domain: string;
  auditedAt: string;
  shopifyDetection: ShopifyDetection;
  scores: OverallScores;
  pagesAnalyzed: {
    count: number;
    urls: string[];
    pages: ExtractedPageContent[];
  };
  performance: PerformanceAudit;
  cro: CROAudit;
  ai: AIAnalysis;
  partialFailure?: {
    pageSpeedFailed?: boolean;
    aiFailed?: boolean;
    shopifyWarning?: string;
  };
}

export type ShopifyAuditResult = AuditResult;

// Zod schemas for AI response parsing & validation
export const criticalIssueSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(["performance", "cro", "ux", "technical"]).default("cro"),
  impact: z.enum(["high", "medium", "low"]).default("medium"),
  effort: z.enum(["low", "medium", "high"]).default("medium"),
});

export const auditRecommendationSchema = z.object({
  title: z.string(),
  problem: z.string(),
  recommendation: z.string(),
  expectedImpact: z.string(),
  priority: z.enum(["P1", "P2", "P3"]).default("P2"),
});

export const roadmapItemSchema = z.object({
  title: z.string(),
  problem: z.string(),
  solution: z.string(),
  priority: z.enum(["P1", "P2", "P3"]).default("P2"),
  impact: z.enum(["high", "medium", "low"]).default("medium"),
  effort: z.enum(["low", "medium", "high"]).default("medium"),
});

export const aiOutputSchema = z.object({
  summary: z.string().min(10),
  strengths: z.array(z.string()).default([]),
  criticalIssues: z.array(criticalIssueSchema).default([]),
  croRecommendations: z.array(auditRecommendationSchema).default([]),
  performanceRecommendations: z.array(auditRecommendationSchema).default([]),
  roadmap: z.object({
    quickWins: z.array(roadmapItemSchema).default([]),
    highImpact: z.array(roadmapItemSchema).default([]),
    shortTerm: z.array(roadmapItemSchema).default([]),
    longTerm: z.array(roadmapItemSchema).default([]),
  }),
});

export type AIOutputValidated = z.infer<typeof aiOutputSchema>;
