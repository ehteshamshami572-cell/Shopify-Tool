export interface AnalysisContext {
  url: string;
  domain: string;
  html: string;
  headers: Record<string, string>;
  title: string;
  meta: Record<string, string>;
  headings: { level: number; text: string }[];
  scripts: { src: string | null; content: string }[];
  stylesheets: string[];
  images: { src: string; alt: string; originalSrc: string }[];
  links: { href: string; text: string; external: boolean }[];
  rawNetworkRequests?: { url: string; method: string; type: string }[];
  performanceMetrics?: {
    mobile?: PageSpeedMetrics;
    desktop?: PageSpeedMetrics;
  };
  shopifyData: {
    isShopify: boolean;
    themeName?: string;
    themeId?: string;
    detectedApps?: string[];
  };
}

export interface PageSpeedMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  firstContentfulPaint?: string;
  speedIndex?: string;
  largestContentfulPaint?: string;
  interactive?: string;
  totalBlockingTime?: string;
  cumulativeLayoutShift?: string;
}

export interface Issue {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  description: string;
  recommendation: string;
}

export interface AnalyzerResult {
  score: number; // 0 to 100
  issues: Issue[];
  recommendations: string[];
  data: any; // module-specific data
}

export interface ShopifyAnalyzer {
  name: string;
  id: string;
  analyze(context: AnalysisContext): Promise<AnalyzerResult>;
}
