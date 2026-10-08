export const AUDIT_SYSTEM_PROMPT = `You are a Senior Shopify Performance Architect, CRO Specialist, and eCommerce UX Lead.
Your job is to analyze structured findings from an automated Shopify audit and provide actionable, high-impact recommendations.

STRICT RULES:
1. Ground your recommendations ONLY in the provided metrics and page observations.
2. NEVER invent conversion rates, fake revenue guarantees, or fabricated analytics numbers.
3. Distinguish facts (observed metrics) from hypotheses (expected outcomes).
4. Focus strictly on Shopify best practices (Online Store 2.0, Liquid optimization, app embeds, checkout UX).
5. Output MUST be valid JSON adhering strictly to the requested schema. No conversational filler or markdown wrappers outside the JSON.`;

export function buildAuditUserPrompt(context: any): string {
  return `Please analyze the following structured Shopify store audit results and generate an executive summary, strengths, critical issues, CRO recommendations, performance recommendations, and a prioritized improvement roadmap.

AUDIT DATA:
${JSON.stringify(context, null, 2)}

REQUIRED JSON OUTPUT FORMAT:
{
  "summary": "2-3 sentence executive summary of the store's current health and top optimization avenues.",
  "strengths": [
    "Identified strength 1 based on positive findings",
    "Identified strength 2"
  ],
  "criticalIssues": [
    {
      "title": "Clear concise issue title",
      "description": "Evidence-backed description of why this is hurting conversions or speed",
      "category": "performance", // "performance" | "cro" | "ux" | "technical"
      "impact": "high",          // "high" | "medium" | "low"
      "effort": "medium"         // "low" | "medium" | "high"
    }
  ],
  "croRecommendations": [
    {
      "title": "Actionable recommendation title",
      "problem": "Specific observed friction point",
      "recommendation": "Concrete tactical steps to solve it",
      "expectedImpact": "High potential conversion lift by resolving checkout hesitation",
      "priority": "P1" // "P1" | "P2" | "P3"
    }
  ],
  "performanceRecommendations": [
    {
      "title": "Performance recommendation title",
      "problem": "Specific metric bottleneck (e.g. LCP or JS execution)",
      "recommendation": "Technical steps (e.g. app script deferral or WebP conversion)",
      "expectedImpact": "Expected reduction in load time and improved Core Web Vitals pass rate",
      "priority": "P1"
    }
  ],
  "roadmap": {
    "quickWins": [
      {
        "title": "Immediate 1-2 day fix",
        "problem": "What it fixes",
        "solution": "How to execute",
        "priority": "P1",
        "impact": "high",
        "effort": "low"
      }
    ],
    "highImpact": [],
    "shortTerm": [],
    "longTerm": []
  }
}`;
}
