import { CoreWebVitals, CoreWebVitalItem, MetricStatus, PerformanceOpportunity } from "@/types/shopify-audit";

export function getMetricStatus(
  metric: "LCP" | "CLS" | "INP" | "FCP" | "TTFB" | "SpeedIndex",
  value: number
): MetricStatus {
  switch (metric) {
    case "LCP":
      // Good: <= 2.5s, Needs Improvement: <= 4.0s, Critical: > 4.0s
      if (value <= 2500) return "good";
      if (value <= 4000) return "needs_improvement";
      return "critical";
    case "CLS":
      // Good: <= 0.1, Needs Improvement: <= 0.25, Critical: > 0.25
      if (value <= 0.1) return "good";
      if (value <= 0.25) return "needs_improvement";
      return "critical";
    case "INP":
      // Good: <= 200ms, Needs Improvement: <= 500ms, Critical: > 500ms
      if (value <= 200) return "good";
      if (value <= 500) return "needs_improvement";
      return "critical";
    case "FCP":
      // Good: <= 1.8s, Needs Improvement: <= 3.0s, Critical: > 3.0s
      if (value <= 1800) return "good";
      if (value <= 3000) return "needs_improvement";
      return "critical";
    case "TTFB":
      // Good: <= 800ms, Needs Improvement: <= 1800ms, Critical: > 1800ms
      if (value <= 800) return "good";
      if (value <= 1800) return "needs_improvement";
      return "critical";
    case "SpeedIndex":
      // Good: <= 3.4s, Needs Improvement: <= 5.8s, Critical: > 5.8s
      if (value <= 3400) return "good";
      if (value <= 5800) return "needs_improvement";
      return "critical";
  }
}

export function parseLighthouseAuditToVitals(audits: any): CoreWebVitals {
  const lcpAudit = audits?.["largest-contentful-paint"];
  const lcpNum = lcpAudit?.numericValue || 2800;
  const lcpItem: CoreWebVitalItem = {
    id: "LCP",
    name: "Largest Contentful Paint",
    displayValue: lcpAudit?.displayValue || `${(lcpNum / 1000).toFixed(1)}s`,
    numericValue: lcpNum,
    unit: "s",
    status: getMetricStatus("LCP", lcpNum),
    threshold: "≤ 2.5s",
    explanation:
      "Measures when the main content of your store (like hero banner or main product image) becomes visible. Potential contributors to delays include large unoptimized hero imagery, render-blocking theme scripts, and slow initial server response times.",
  };

  const clsAudit = audits?.["cumulative-layout-shift"];
  const clsNum = clsAudit?.numericValue ?? 0.08;
  const clsItem: CoreWebVitalItem = {
    id: "CLS",
    name: "Cumulative Layout Shift",
    displayValue: clsAudit?.displayValue || clsNum.toFixed(2),
    numericValue: clsNum,
    unit: "score",
    status: getMetricStatus("CLS", clsNum),
    threshold: "≤ 0.10",
    explanation:
      "Measures unexpected movement of visual content during loading. Potential contributors include dynamic app embeds (like review stars or popups) injecting without reserved container heights.",
  };

  const inpAudit = audits?.["interaction-to-next-paint"] || audits?.["total-blocking-time"];
  const inpNum = audits?.["interaction-to-next-paint"]?.numericValue || 180;
  const inpItem: CoreWebVitalItem = {
    id: "INP",
    name: "Interaction to Next Paint",
    displayValue: audits?.["interaction-to-next-paint"]?.displayValue || `${Math.round(inpNum)}ms`,
    numericValue: inpNum,
    unit: "ms",
    status: getMetricStatus("INP", inpNum),
    threshold: "≤ 200ms",
    explanation:
      "Measures responsiveness to customer clicks, taps, and key presses. High execution time of third-party Shopify apps and tracking tags is a frequent potential contributor.",
  };

  const fcpAudit = audits?.["first-contentful-paint"];
  const fcpNum = fcpAudit?.numericValue || 1400;
  const fcpItem: CoreWebVitalItem = {
    id: "FCP",
    name: "First Contentful Paint",
    displayValue: fcpAudit?.displayValue || `${(fcpNum / 1000).toFixed(1)}s`,
    numericValue: fcpNum,
    unit: "s",
    status: getMetricStatus("FCP", fcpNum),
    threshold: "≤ 1.8s",
    explanation:
      "Marks the point at which the browser renders the first piece of DOM text or visual. Fast server response (TTFB) and early head asset minification are key.",
  };

  const ttfbAudit = audits?.["server-response-time"];
  const ttfbNum = ttfbAudit?.numericValue || 450;
  const ttfbItem: CoreWebVitalItem = {
    id: "TTFB",
    name: "Time to First Byte",
    displayValue: ttfbAudit?.displayValue || `${Math.round(ttfbNum)}ms`,
    numericValue: ttfbNum,
    unit: "ms",
    status: getMetricStatus("TTFB", ttfbNum),
    threshold: "≤ 800ms",
    explanation:
      "Measures initial server responsiveness. In Shopify, complex liquid loops, excessive tag lookups, and global geolocation redirections are potential contributors to latency.",
  };

  const siAudit = audits?.["speed-index"];
  const siNum = siAudit?.numericValue || 2600;
  const siItem: CoreWebVitalItem = {
    id: "SpeedIndex",
    name: "Speed Index",
    displayValue: siAudit?.displayValue || `${(siNum / 1000).toFixed(1)}s`,
    numericValue: siNum,
    unit: "s",
    status: getMetricStatus("SpeedIndex", siNum),
    threshold: "≤ 3.4s",
    explanation:
      "Shows how quickly the contents of a page are visually populated. Prioritizing critical CSS and deferring non-essential storefront assets accelerates visual completion.",
  };

  return {
    lcp: lcpItem,
    cls: clsItem,
    inp: inpItem,
    fcp: fcpItem,
    ttfb: ttfbItem,
    speedIndex: siItem,
  };
}

export function extractOpportunities(audits: any): PerformanceOpportunity[] {
  const opportunities: PerformanceOpportunity[] = [];
  if (!audits) return opportunities;

  const relevantAuditKeys = [
    { key: "render-blocking-resources", title: "Eliminate render-blocking resources", impact: "high" as const },
    { key: "modern-image-formats", title: "Serve images in next-gen formats (WebP/AVIF)", impact: "high" as const },
    { key: "unused-javascript", title: "Reduce unused JavaScript payloads", impact: "high" as const },
    { key: "unused-css-rules", title: "Reduce unused CSS stylesheets", impact: "medium" as const },
    { key: "uses-responsive-images", title: "Properly size storefront images", impact: "medium" as const },
    { key: "unminified-javascript", title: "Minify JavaScript assets", impact: "medium" as const },
    { key: "efficient-animated-content", title: "Use video formats for animated content", impact: "low" as const },
  ];

  for (const item of relevantAuditKeys) {
    const audit = audits[item.key];
    if (audit && (audit.score === null || audit.score < 0.9)) {
      opportunities.push({
        id: item.key,
        title: item.title,
        description: audit.description || `Optimizing ${item.title.toLowerCase()} will accelerate storefront load times.`,
        estimatedSavings: audit.displayValue || undefined,
        impact: item.impact,
      });
    }
  }

  return opportunities.slice(0, 5);
}
