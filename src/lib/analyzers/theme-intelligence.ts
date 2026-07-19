import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

export class ThemeIntelligence implements ShopifyAnalyzer {
  name = "Theme Intelligence";
  id = "theme_intelligence";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const shopifyData = context.shopifyData;
    const isShopify = shopifyData.isShopify;
    let themeName = shopifyData.themeName || "Unknown";
    let themeId = shopifyData.themeId || "Unknown";
    let themeDeveloper = "Unknown";
    let isOs2 = false;

    if (!isShopify) {
      score = 0;
      issues.push({
        id: "theme_not_shopify",
        severity: "critical",
        category: "Platform",
        title: "Not a Shopify Store",
        description: "This store does not run on Shopify. Theme intelligence features are unavailable.",
        recommendation: "Ensure you are scanning a valid Shopify store domain.",
      });
      return {
        score,
        issues,
        recommendations,
        data: {
          isShopify: false,
          themeName: "N/A",
          themeId: "N/A",
          themeDeveloper: "N/A",
          isOs2: false,
        },
      };
    }

    // 1. Identify theme developer
    const popularThemes: Record<string, string> = {
      dawn: "Shopify",
      sense: "Shopify",
      craft: "Shopify",
      publisher: "Shopify",
      ride: "Shopify",
      colorblock: "Shopify",
      taste: "Shopify",
      studio: "Shopify",
      origin: "Shopify",
      prestige: "Maestrooo",
      impulse: "Archetype Themes",
      motion: "Archetype Themes",
      streamline: "Archetype Themes",
      warehouse: "Maestrooo",
      empire: "Pixel Union",
      grid: "Pixel Union",
      provocal: "Clean Canvas",
      showcase: "Clean Canvas",
      symmetry: "Clean Canvas",
      canopy: "Clean Canvas",
      boost: "Clean Canvas",
      testament: "WeTheme",
      envy: "WeTheme",
      pipeline: "Groupthought",
      focal: "Maestrooo",
      blockshop: "Troop Themes",
      district: "Style Hatch",
      split: "Krown Themes",
      kingdom: "Krown Themes",
      boostrap: "Custom",
    };

    const searchName = themeName.toLowerCase();
    for (const [key, dev] of Object.entries(popularThemes)) {
      if (searchName.includes(key)) {
        themeDeveloper = dev;
        break;
      }
    }

    if (themeDeveloper === "Unknown" && (searchName.includes("custom") || searchName.includes("dev"))) {
      themeDeveloper = "Custom Developer / In-house";
    }

    // 2. Online Store 2.0 (OS 2.0) detection
    // OS 2.0 themes usually feature CSS variables, section rendering engines, and use main JSON sections
    // e.g., files starting with Section templates or DOM structures with section-id attributes
    const hasSectionRenderer = context.html.includes("shopify-section") || context.html.includes("shopify-section-");
    const hasJsonTemplateMarkers = context.html.includes("sections--") || context.html.includes('id="shopify-section-template--');
    
    if (hasSectionRenderer && hasJsonTemplateMarkers) {
      isOs2 = true;
    } else {
      // Check if standard Dawn/OS 2.0 architecture elements exist in scripts/html
      if (["dawn", "sense", "craft", "publisher", "ride", "colorblock", "taste", "studio", "origin"].some(t => searchName.includes(t))) {
        isOs2 = true;
      }
    }

    // 3. Evaluate Theme Performance & Best Practices
    if (!isOs2) {
      score -= 30;
      issues.push({
        id: "theme_legacy_architecture",
        severity: "critical",
        category: "Theme Health",
        title: "Legacy Theme Architecture (Vintage)",
        description: "The theme appears to use Shopify's vintage Liquid template structure instead of the modern Online Store 2.0 (JSON-based) architecture.",
        recommendation: "Upgrade to an Online Store 2.0 compatible theme to take advantage of section customization and improved load speeds.",
      });
      recommendations.push("Migrate custom liquid template sections into JSON templates to speed up admin operations and page rendering.");
    }

    // 4. Customization checks
    // If it's a Shopify default theme like Dawn, check if it has custom assets or is heavily edited
    const isDefaultTheme = ["dawn", "sense", "craft"].some(t => searchName.includes(t));
    if (isDefaultTheme && themeName.toLowerCase() !== "dawn") {
      recommendations.push("Ensure your custom code changes are documented or use a child-theme structure to allow seamless theme updates.");
    }

    return {
      score,
      issues,
      recommendations,
      data: {
        isShopify: true,
        themeName,
        themeId,
        themeDeveloper,
        isOs2,
        isCustomized: themeName.toLowerCase() !== searchName,
      },
    };
  }
}
