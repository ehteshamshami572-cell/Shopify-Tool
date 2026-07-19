import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

export class SeoAnalyzer implements ShopifyAnalyzer {
  name = "SEO Analyzer";
  id = "seo";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // 1. Title Check
    const title = context.title;
    if (!title) {
      score -= 20;
      issues.push({
        id: "seo_missing_title",
        severity: "critical",
        category: "SEO",
        title: "Missing Page Title",
        description: "The page does not have a `<title>` tag in its HTML header.",
        recommendation: "Add a descriptive `<title>` tag between 50-60 characters.",
      });
      recommendations.push("Define a unique page title to improve search engine click-through rates.");
    } else if (title.length < 30 || title.length > 60) {
      score -= 5;
      issues.push({
        id: "seo_suboptimal_title_length",
        severity: "warning",
        category: "SEO",
        title: `Suboptimal Title Length (${title.length} chars)`,
        description: `Page title length is ${title.length} characters. The ideal length is between 30 and 60 characters.`,
        recommendation: "Adjust title length to fit within the 30-60 character range.",
      });
      recommendations.push("Optimize the title text for readability and optimal search snippet fitting.");
    }

    // 2. Meta Description Check
    const description = context.meta["description"];
    if (!description) {
      score -= 20;
      issues.push({
        id: "seo_missing_description",
        severity: "critical",
        category: "SEO",
        title: "Missing Meta Description",
        description: "The page does not have a description meta tag.",
        recommendation: "Add a `<meta name='description'>` tag with a concise summary of the page.",
      });
      recommendations.push("Create a unique meta description to entice search engine users to click.");
    } else if (description.length < 110 || description.length > 160) {
      score -= 5;
      issues.push({
        id: "seo_suboptimal_desc_length",
        severity: "warning",
        category: "SEO",
        title: `Suboptimal Meta Description Length (${description.length} chars)`,
        description: `Meta description is ${description.length} characters. The ideal length is between 110 and 160 characters.`,
        recommendation: "Adjust description length to fit within the 110-160 character range.",
      });
    }

    // 3. Headings Structure (H1 Check)
    const h1s = context.headings.filter((h) => h.level === 1);
    if (h1s.length === 0) {
      score -= 15;
      issues.push({
        id: "seo_missing_h1",
        severity: "critical",
        category: "SEO",
        title: "Missing H1 Heading",
        description: "The page has no H1 heading element.",
        recommendation: "Implement exactly one H1 heading denoting the main topic of the page.",
      });
      recommendations.push("Create a clear `<h1>` heading matching the page's primary theme.");
    } else if (h1s.length > 1) {
      score -= 10;
      issues.push({
        id: "seo_multiple_h1",
        severity: "warning",
        category: "SEO",
        title: "Multiple H1 Headings",
        description: `The page has ${h1s.length} H1 headings. It is best practice to have only one main heading.`,
        recommendation: "Consolidate the H1 elements so only the primary page title is H1.",
      });
    }

    // 4. Image Alt Attribute Check
    const totalImages = context.images.length;
    if (totalImages > 0) {
      const missingAltImages = context.images.filter((img) => !img.alt.trim());
      if (missingAltImages.length > 0) {
        const percentage = Math.round((missingAltImages.length / totalImages) * 100);
        const altScoreReduction = Math.min(15, Math.ceil(missingAltImages.length * 1.5));
        score -= altScoreReduction;
        issues.push({
          id: "seo_missing_alt_tags",
          severity: missingAltImages.length > 5 ? "critical" : "warning",
          category: "SEO",
          title: "Missing Image Alt Attributes",
          description: `${missingAltImages.length} out of ${totalImages} images (${percentage}%) are missing alt text descriptions.`,
          recommendation: "Provide descriptive `alt` tags for all images to describe their visual content.",
        });
        recommendations.push("Audit Shopify store theme product images to verify alt text tags are automatically populated.");
      }
    }

    // 5. Open Graph Meta Tags Check
    const ogTitle = context.meta["og:title"];
    const ogImage = context.meta["og:image"];
    const ogDesc = context.meta["og:description"];
    if (!ogTitle || !ogImage || !ogDesc) {
      score -= 5;
      issues.push({
        id: "seo_incomplete_og_meta",
        severity: "warning",
        category: "SEO",
        title: "Incomplete Open Graph Data",
        description: "One or more essential Open Graph tags (og:title, og:image, og:description) are missing.",
        recommendation: "Configure social meta tags to ensure correct title, image, and description display when shared.",
      });
    }

    // 6. JSON-LD Structured Data
    const hasJsonLd = context.scripts.some(
      (s) => s.src === null && s.content.includes('"@context"') && s.content.includes('"schema.org"')
    );
    if (!hasJsonLd) {
      score -= 10;
      issues.push({
        id: "seo_missing_structured_data",
        severity: "warning",
        category: "SEO",
        title: "Missing Structured Schema Markup",
        description: "No JSON-LD structured schema markup (like Product, Website, or Organization schemas) was detected.",
        recommendation: "Embed schema markup (JSON-LD) to help search engines display rich result snippets.",
      });
      recommendations.push("Deploy Schema/JSON-LD metadata for Shopify Products to qualify for google rich snippets.");
    }

    // Safeguard score
    score = Math.max(0, score);

    return {
      score,
      issues,
      recommendations,
      data: {
        title,
        description,
        totalHeadings: context.headings.length,
        headingsHierarchy: context.headings,
        totalImages,
        hasJsonLd,
        ogData: { ogTitle, ogImage, ogDesc },
      },
    };
  }
}
