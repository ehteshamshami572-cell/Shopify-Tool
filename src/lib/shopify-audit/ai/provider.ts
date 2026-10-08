import axios from "axios";
import { AIAnalysis, aiOutputSchema, CriticalIssue, AuditRecommendation, RoadmapItem } from "@/types/shopify-audit";
import { AUDIT_SYSTEM_PROMPT, buildAuditUserPrompt } from "./prompts";

export interface AIProvider {
  name: string;
  analyzeAudit(payload: any): Promise<AIAnalysis>;
}

export class OpenAIProvider implements AIProvider {
  name = "OpenAI";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeAudit(payload: any): Promise<AIAnalysis> {
    try {
      const userPrompt = buildAuditUserPrompt(payload);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: this.model,
          messages: [
            { role: "system", content: AUDIT_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 2200,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 25000,
        }
      );

      const rawJsonString = response.data?.choices?.[0]?.message?.content;
      if (!rawJsonString) {
        throw new Error("Empty response from OpenAI completion");
      }

      const parsed = JSON.parse(rawJsonString);
      const validated = aiOutputSchema.parse(parsed);

      return {
        isAvailable: true,
        provider: `OpenAI (${this.model})`,
        summary: validated.summary,
        strengths: validated.strengths,
        criticalIssues: validated.criticalIssues.map((issue, idx) => ({
          id: `crit_${idx + 1}`,
          ...issue,
        })),
        croRecommendations: validated.croRecommendations.map((rec, idx) => ({
          id: `cro_rec_${idx + 1}`,
          category: "cro",
          ...rec,
        })),
        performanceRecommendations: validated.performanceRecommendations.map((rec, idx) => ({
          id: `perf_rec_${idx + 1}`,
          category: "performance",
          ...rec,
        })),
        roadmap: {
          quickWins: validated.roadmap.quickWins.map((item, idx) => ({ id: `qw_${idx + 1}`, ...item })),
          highImpact: validated.roadmap.highImpact.map((item, idx) => ({ id: `hi_${idx + 1}`, ...item })),
          shortTerm: validated.roadmap.shortTerm.map((item, idx) => ({ id: `st_${idx + 1}`, ...item })),
          longTerm: validated.roadmap.longTerm.map((item, idx) => ({ id: `lt_${idx + 1}`, ...item })),
        },
      };
    } catch (err: any) {
      console.warn("OpenAI analysis failed. Falling back to deterministic AI engine:", err.message);
      return new DeterministicAIProvider().analyzeAudit(payload);
    }
  }
}

export class DeterministicAIProvider implements AIProvider {
  name = "Heuristic AI Engine";

  async analyzeAudit(payload: any): Promise<AIAnalysis> {
    const { domain, isShopify, performance, cro } = payload;

    const perfScore = performance?.score || 75;
    const croScore = cro?.overallScore || 70;

    // 1. Executive Summary
    const summary = `${domain} operates a ${
      isShopify ? "Shopify" : "custom ecommerce"
    } storefront with a performance score of ${perfScore}/100 and a CRO score of ${croScore}/100. Key optimization leverage lies in optimizing Core Web Vitals (specifically ${
      performance?.coreWebVitals?.lcp?.displayValue || "LCP"
    }) and addressing customer trust signals before the checkout stage.`;

    // 2. Strengths
    const strengths: string[] = [];
    if (perfScore >= 75) strengths.push("Strong initial storefront loading performance and fast server response times.");
    if (cro?.categories?.messaging?.score >= 70) strengths.push("Clear headline messaging and concise above-the-fold value proposition.");
    if (cro?.categories?.cta?.score >= 70) strengths.push("Well-defined primary Call-To-Action buttons across product views.");
    if (cro?.categories?.navigation?.score >= 70) strengths.push("Clean desktop and mobile navigation hierarchy.");
    if (strengths.length === 0) {
      strengths.push("Established ecommerce storefront infrastructure with valid responsive layout tags.");
      strengths.push("Clean DOM hierarchy with standard storefront navigation.");
    }

    // 3. Critical Issues
    const criticalIssues: CriticalIssue[] = [];

    if (performance?.coreWebVitals?.lcp?.status === "critical" || performance?.coreWebVitals?.lcp?.status === "needs_improvement") {
      criticalIssues.push({
        id: "crit_lcp",
        title: "Slow Largest Contentful Paint (LCP)",
        description: `Main banner takes ${performance?.coreWebVitals?.lcp?.displayValue || "3.8s"} to render. Potential contributors include uncompressed hero imagery and render-blocking scripts.`,
        category: "performance",
        impact: "high",
        effort: "medium",
      });
    }

    if (cro?.categories?.socialProof?.score < 60) {
      criticalIssues.push({
        id: "crit_social_proof",
        title: "Missing Verified Customer Social Proof",
        description: "Zero product reviews, star rating badges, or testimonial carousels detected on product detail pages.",
        category: "cro",
        impact: "high",
        effort: "low",
      });
    }

    if (cro?.categories?.trust?.score < 65) {
      criticalIssues.push({
        id: "crit_trust_seals",
        title: "Absence of Security & Guarantee Seals",
        description: "No SSL badges, money-back guarantees, or payment provider logos found adjacent to purchase action buttons.",
        category: "cro",
        impact: "medium",
        effort: "low",
      });
    }

    if (criticalIssues.length === 0) {
      criticalIssues.push({
        id: "crit_app_bloat",
        title: "Third-party Script Overhead",
        description: "Excessive client-side tracking pixels delay main-thread interactivity during peak visitor checkouts.",
        category: "technical",
        impact: "medium",
        effort: "medium",
      });
    }

    // 4. CRO Recommendations
    const croRecommendations: AuditRecommendation[] = [
      {
        id: "cro_rec_1",
        title: "Embed Dynamic Trust Badges & Guarantee Micro-copy",
        problem: "Shoppers abandon purchase flow when security, returns, and payment options are not clearly articulated.",
        recommendation: "Add recognized payment provider logos (Shop Pay, PayPal, Visa) and a '30-Day Money-Back Guarantee' pill right under the Add to Cart button.",
        expectedImpact: "Estimated reduction in cart drop-offs by resolving checkout hesitation.",
        priority: "P1",
        category: "cro",
      },
      {
        id: "cro_rec_2",
        title: "Integrate Verified Review Ratings Near Product Titles",
        problem: "Shoppers require social validation before purchasing unfamiliar brands or items.",
        recommendation: "Install a native Shopify review app (e.g. Judge.me or Loox) and display gold star rating summaries directly above the price tag.",
        expectedImpact: "Strengthens buyer confidence and increases click-through rates.",
        priority: "P1",
        category: "cro",
      },
      {
        id: "cro_rec_3",
        title: "Implement Free Shipping Progress Threshold Counter",
        problem: "Average order values (AOV) remain lower when shoppers aren't incentivized to add an extra item.",
        recommendation: "Add a visual progress bar inside the cart drawer (e.g., 'Add $12 more to unlock FREE Shipping').",
        expectedImpact: "Motivates basket expansion and increases average transaction size.",
        priority: "P2",
        category: "cro",
      },
    ];

    // 5. Performance Recommendations
    const performanceRecommendations: AuditRecommendation[] = [
      {
        id: "perf_rec_1",
        title: "Serve Next-Gen WebP/AVIF Formats and Enforce Explicit Dimensions",
        problem: "Heavy image files delay LCP and missing dimensions cause visual Cumulative Layout Shift (CLS).",
        recommendation: "Audit Shopify image filters (e.g., 'image_url: width: 800') and assign explicit width and height HTML attributes to all product and banner images.",
        expectedImpact: "Cuts hero image payloads by up to 40% and stabilizes layout shifts.",
        priority: "P1",
        category: "performance",
      },
      {
        id: "perf_rec_2",
        title: "Defer Non-Critical Third-Party App Scripts",
        problem: "Installed Shopify apps load blocking JavaScript in the document head before the storefront can paint.",
        recommendation: "Audit apps in Shopify Admin and ensure tracking pixels and analytics tools use 'defer' or Google Tag Manager delayed loading.",
        expectedImpact: "Decreases Total Blocking Time (TBT) and improves mobile responsiveness (INP).",
        priority: "P2",
        category: "performance",
      },
    ];

    // 6. Roadmap
    const roadmap = {
      quickWins: [
        {
          id: "rw_1",
          title: "Add Payment & Security Badges Below Add-to-Cart",
          problem: "Missing trust indicators at point of purchase.",
          solution: "Upload SVG trust badges into product template block.",
          priority: "P1" as const,
          impact: "high" as const,
          effort: "low" as const,
        },
        {
          id: "rw_2",
          title: "Configure Free Shipping Notification Bar",
          problem: "Lack of clear promotional threshold.",
          solution: "Enable Shopify announcement bar with delivery terms.",
          priority: "P2" as const,
          impact: "medium" as const,
          effort: "low" as const,
        },
      ],
      highImpact: [
        {
          id: "hi_1",
          title: "Install & Display Verified Reviews Widget",
          problem: "Zero social proof on high-value products.",
          solution: "Setup Judge.me / Loox app blocks across product pages.",
          priority: "P1" as const,
          impact: "high" as const,
          effort: "medium" as const,
        },
        {
          id: "hi_2",
          title: "Preload Hero Banner & Optimize Image CDN Resizing",
          problem: "Elevated LCP duration for mobile shoppers.",
          solution: "Use link rel='preload' on hero image and compress to WebP.",
          priority: "P1" as const,
          impact: "high" as const,
          effort: "medium" as const,
        },
      ],
      shortTerm: [
        {
          id: "st_1",
          title: "Implement Sticky Add to Cart for Mobile",
          problem: "Shoppers lose access to buy button when reading long descriptions.",
          solution: "Add floating bottom action bar when buy box scrolls off-screen.",
          priority: "P2" as const,
          impact: "medium" as const,
          effort: "medium" as const,
        },
      ],
      longTerm: [
        {
          id: "lt_1",
          title: "Shopify App Consolidation & Code Cleanup",
          problem: "Accumulated unused app scripts causing main-thread latency.",
          solution: "Audit and remove legacy code remnants from theme.liquid.",
          priority: "P3" as const,
          impact: "high" as const,
          effort: "high" as const,
        },
      ],
    };

    return {
      isAvailable: true,
      provider: "Heuristic Intelligence Engine",
      summary,
      strengths,
      criticalIssues,
      croRecommendations,
      performanceRecommendations,
      roadmap,
    };
  }
}

export function getAIProvider(): AIProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (apiKey && apiKey.trim() !== "") {
    return new OpenAIProvider(apiKey, model);
  }

  return new DeterministicAIProvider();
}
