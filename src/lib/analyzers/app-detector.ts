import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";

interface AppDetectionRule {
  name: string;
  category: string;
  website: string;
  icon?: string;
  detect: (context: AnalysisContext) => boolean;
}

export class AppDetector implements ShopifyAnalyzer {
  name = "App Detector";
  id = "app_detector";

  private rules: AppDetectionRule[] = [
    {
      name: "Klaviyo",
      category: "Marketing Automation",
      website: "https://www.klaviyo.com",
      detect: (c) =>
        c.scripts.some((s) => (s.src && s.src.includes("klaviyo.com")) || s.content.includes("klaviyo")),
    },
    {
      name: "Loox Reviews",
      category: "Product Reviews",
      website: "https://loox.app",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("loox.io")) ||
        c.html.includes("loox-rating") ||
        c.html.includes("loox-reviews"),
    },
    {
      name: "Judge.me",
      category: "Product Reviews",
      website: "https://judge.me",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("judgeme")) ||
        c.html.includes("jdgm-widget") ||
        c.html.includes("jdgm-preview-badge"),
    },
    {
      name: "Yotpo",
      category: "Product Reviews & Loyalty",
      website: "https://www.yotpo.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("yotpo.com")) ||
        c.html.includes("yotpo-widget") ||
        c.html.includes("yotpo-preview-badge"),
    },
    {
      name: "Recharge",
      category: "Subscriptions",
      website: "https://rechargepayments.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("rechargecdn.com")) ||
        c.html.includes("recharge-subscription-widget"),
    },
    {
      name: "Bold Commerce",
      category: "Product Options & Subscriptions",
      website: "https://boldcommerce.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("boldapps.net")) ||
        c.html.includes("bold-ro-widget"),
    },
    {
      name: "PageFly",
      category: "Page Builder",
      website: "https://pagefly.io",
      detect: (c) =>
        c.stylesheets.some((s) => s.includes("pagefly")) ||
        c.html.includes("pagefly-container") ||
        c.html.includes("PF_Page"),
    },
    {
      name: "Shogun",
      category: "Page Builder",
      website: "https://getshogun.com",
      detect: (c) =>
        c.stylesheets.some((s) => s.includes("shogun")) ||
        c.html.includes("shogun-layout") ||
        c.scripts.some((s) => s.src && s.src.includes("shogun")),
    },
    {
      name: "Smile.io",
      category: "Loyalty & Referrals",
      website: "https://smile.io",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("sweettoothio.com")) ||
        c.html.includes("smile-ui-lite-container"),
    },
    {
      name: "Gorgias",
      category: "Customer Support (Chat)",
      website: "https://www.gorgias.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("gorgias.chat")) ||
        c.html.includes("gorgias-chat-container"),
    },
    {
      name: "Tidio",
      category: "Customer Support (Chat)",
      website: "https://www.tidio.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("tidiochat.com")) ||
        c.html.includes("tidio-chat-iframe"),
    },
    {
      name: "Shopify Inbox",
      category: "Customer Support (Chat)",
      website: "https://www.shopify.com/inbox",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("shopify-chat")) ||
        c.html.includes("shopify-chat"),
    },
    {
      name: "Omnisend",
      category: "Marketing Automation",
      website: "https://www.omnisend.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("omnisend.com")) ||
        c.html.includes("omnisend-form-container"),
    },
    {
      name: "Hotjar",
      category: "Analytics & Behavior",
      website: "https://www.hotjar.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("hotjar.com")) ||
        c.scripts.some((s) => s.content.includes("static.hotjar.com")),
    },
    {
      name: "Lucky Orange",
      category: "Analytics & Behavior",
      website: "https://www.luckyorange.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("luckyorange.com")) ||
        c.html.includes("luckyorange"),
    },
    {
      name: "Meta Pixel (Facebook)",
      category: "Advertising",
      website: "https://facebook.com",
      detect: (c) =>
        c.scripts.some((s) => s.content.includes("connect.facebook.net") || s.content.includes("fbq(")),
    },
    {
      name: "Pinterest Tag",
      category: "Advertising",
      website: "https://pinterest.com",
      detect: (c) =>
        c.scripts.some((s) => s.content.includes("pintrk(")) ||
        c.scripts.some((s) => s.src && s.src.includes("pinit.js")),
    },
    {
      name: "TikTok Pixel",
      category: "Advertising",
      website: "https://tiktok.com",
      detect: (c) =>
        c.scripts.some((s) => s.content.includes("ttq.load") || s.content.includes("ttq.track")),
    },
    {
      name: "Google Analytics (GA4)",
      category: "Analytics",
      website: "https://analytics.google.com",
      detect: (c) =>
        c.scripts.some(
          (s) =>
            (s.src && s.src.includes("googletagmanager.com/gtag/js")) ||
            s.content.includes("gtag(") ||
            s.content.includes("ga(")
        ),
    },
    {
      name: "Google Tag Manager",
      category: "Analytics & Tag Mgmt",
      website: "https://tagmanager.google.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("googletagmanager.com/gtm.js")),
    },
    {
      name: "Route Shipping",
      category: "Shipping & Insurance",
      website: "https://route.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("routeapp.io")) ||
        c.html.includes("route-div"),
    },
    {
      name: "Privy",
      category: "Popups & Email Capture",
      website: "https://www.privy.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("widget.privy.com")),
    },
    {
      name: "Afterpay",
      category: "Buy Now Pay Later",
      website: "https://www.afterpay.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("afterpay.com")) ||
        c.html.includes("afterpay-placement"),
    },
    {
      name: "Klarna",
      category: "Buy Now Pay Later",
      website: "https://www.klarna.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("klarnacdn.net")) ||
        c.html.includes("klarna-placement-container"),
    },
    {
      name: "Affirm",
      category: "Buy Now Pay Later",
      website: "https://www.affirm.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("affirm.com")) ||
        c.html.includes("affirm-as-low-as"),
    },
    {
      name: "Sezzle",
      category: "Buy Now Pay Later",
      website: "https://sezzle.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("sezzle.com")),
    },
    {
      name: "Okendo Reviews",
      category: "Product Reviews",
      website: "https://okendo.io",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("okendo.co")) ||
        c.html.includes("oke-reviews-widget"),
    },
    {
      name: "Stamped.io",
      category: "Product Reviews",
      website: "https://stamped.io",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("stamped.io")) ||
        c.html.includes("stamped-main-widget"),
    },
    {
      name: "Ali Reviews",
      category: "Product Reviews",
      website: "https://alireviews.io",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("alireviews.io")) ||
        c.html.includes("alireviews-widget-anchor"),
    },
    {
      name: "Growave",
      category: "Loyalty, Wishlist & Reviews",
      website: "https://growave.io",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("growave.io")) ||
        c.html.includes("growave-widget"),
    },
    {
      name: "Mailchimp",
      category: "Email Marketing",
      website: "https://mailchimp.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("chimpstatic.com")),
    },
    {
      name: "Back in Stock",
      category: "Alerts & Notifications",
      website: "https://backinstock.org",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("backinstock.org")),
    },
    {
      name: "Hextom Quick Announcement Bar",
      category: "Store Utilities",
      website: "https://hextom.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("hextom.com")) ||
        c.html.includes("hextom_qab"),
    },
    {
      name: "Rise.ai",
      category: "Loyalty & Gift Cards",
      website: "https://rise.ai",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("rise.ai")),
    },
    {
      name: "Shopify Search & Discovery",
      category: "Search & Filters",
      website: "https://apps.shopify.com/search-and-discovery",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("shopify-search")),
    },
    {
      name: "Booster SEO",
      category: "SEO Optimization",
      website: "https://boosterapps.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("boosterapps.com")),
    },
    {
      name: "Langify",
      category: "Translation & Languages",
      website: "https://apps.shopify.com/langify",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("langify")),
    },
    {
      name: "Weglot",
      category: "Translation & Languages",
      website: "https://weglot.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("weglot.com")) ||
        c.html.includes("weglot-switcher"),
    },
    {
      name: "Infinite Options",
      category: "Product Options",
      website: "https://shoppad.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("infiniteoptions")),
    },
    {
      name: "Zendesk",
      category: "Customer Support",
      website: "https://www.zendesk.com",
      detect: (c) =>
        c.scripts.some((s) => s.src && s.src.includes("zendesk.com")),
    },
  ];

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const detected: any[] = [];
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // Run rules
    for (const rule of this.rules) {
      try {
        if (rule.detect(context)) {
          detected.push({
            name: rule.name,
            category: rule.category,
            website: rule.website,
          });
        }
      } catch (err) {
        console.error(`Error running rule ${rule.name}:`, err);
      }
    }

    // Populate Shopify context detected apps
    context.shopifyData.detectedApps = detected.map((a) => a.name);

    // Score calculations
    // In Shopify, having too many apps can slow down the site (JS heavy).
    // If > 8 apps: trigger warning
    // If > 15 apps: trigger critical alert
    let score = 100;
    if (detected.length > 15) {
      score = 65;
      issues.push({
        id: "apps_too_many",
        severity: "critical",
        category: "Performance",
        title: "High App Count Detected",
        description: `We detected ${detected.length} Shopify apps installed. Excessive apps load multiple third-party JavaScript files, which severely degrades page loading speed and interactive response times.`,
        recommendation: "Conduct an app audit: uninstall unused apps, and consolidate features where possible.",
      });
      recommendations.push("Remove any apps that are disabled or duplicate functionality (e.g. having multiple review modules).");
    } else if (detected.length > 8) {
      score = 85;
      issues.push({
        id: "apps_medium_count",
        severity: "warning",
        category: "Performance",
        title: "Suboptimal App Count",
        description: `We detected ${detected.length} Shopify apps installed. This amount can cause moderate load time delays.`,
        recommendation: "Keep an eye on scripts performance. Consolidate scripts into Shopify App Blocks.",
      });
    }

    if (!context.shopifyData.isShopify) {
      issues.push({
        id: "apps_not_shopify",
        severity: "info",
        category: "General",
        title: "Non-Shopify Platform",
        description: "This store does not appear to be running on Shopify. App detection is customized for Shopify plugins.",
        recommendation: "Utilize this tool primarily for Shopify-backed stores for optimal app detection accuracy.",
      });
    }

    return {
      score,
      issues,
      recommendations,
      data: {
        detectedCount: detected.length,
        detectedApps: detected,
      },
    };
  }
}
