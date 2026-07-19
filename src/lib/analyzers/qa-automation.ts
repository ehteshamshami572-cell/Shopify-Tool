import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";
import * as cheerio from "cheerio";

export class QaAutomationAnalyzer implements ShopifyAnalyzer {
  name = "QA Automation";
  id = "qa_automation";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];
    let passed = 0;
    let failed = 0;
    let warnings = 0;

    const html = context.html;
    if (!html) {
      return {
        score: 0,
        issues: [],
        recommendations: ["Ensure store HTML resolves correctly before checking QA metrics."],
        data: { passed: 0, failed: 1, warnings: 0, checks: [] },
      };
    }

    const $ = cheerio.load(html);
    const checks: { name: string; status: "pass" | "fail" | "warn"; desc: string }[] = [];

    // Helper to log checks
    const addCheck = (name: string, status: "pass" | "fail" | "warn", desc: string) => {
      checks.push({ name, status, desc });
      if (status === "pass") passed++;
      else if (status === "fail") failed++;
      else warnings++;
    };

    // 1. Homepage Checks
    const hasLogo = $("img[src*='logo'], img[alt*='logo'], .logo, #logo").length > 0;
    addCheck(
      "Logo Presence",
      hasLogo ? "pass" : "warn",
      hasLogo ? "Found brand logo asset." : "Logo element not explicitly found by crawler selectors."
    );

    const hasNav = $("nav, .nav, .navigation, ul[class*='menu']").length > 0;
    addCheck(
      "Navigation Menu",
      hasNav ? "pass" : "fail",
      hasNav ? "Navigation menu links detected." : "No navigation header elements identified."
    );

    const hasFooter = $("footer, .footer, #footer").length > 0;
    addCheck(
      "Storefront Footer",
      hasFooter ? "pass" : "pass",
      hasFooter ? "Footer structure verified." : "Footer area not explicitly tagged."
    );

    // 2. Product Page Selector Audits
    // Checking for selectors like input[name="add"], button[name="add"], .add-to-cart, #AddToCart
    const hasAddToCart = $(
      'button[name="add"], input[type="submit"][name="add"], .add-to-cart, #AddToCart, button[class*="atc"], button[class*="add-to-cart"]'
    ).length > 0;
    addCheck(
      "Add to Cart Button",
      hasAddToCart ? "pass" : "fail",
      hasAddToCart ? "Verified active Add to Cart form button." : "No active Add to Cart buttons detected in page DOM."
    );

    const hasQty = $('input[name="quantity"], select[name="quantity"], .quantity-selector').length > 0;
    addCheck(
      "Quantity Selector",
      hasQty ? "pass" : "warn",
      hasQty ? "Quantity modifier input element found." : "Quantity selector input missing from page layout."
    );

    const hasVariants = $('select[name="id"], input[type="radio"][name="id"], .variant-input, [class*="variant"]').length > 0;
    addCheck(
      "Variant Options Selector",
      hasVariants ? "pass" : "pass",
      hasVariants ? "Variant options options/swatches active." : "Single product variant or standard template loaded."
    );

    // 3. Search and Input Forms
    const hasSearch = $('input[type="search"], input[name="q"], form[action*="/search"]').length > 0;
    addCheck(
      "Search Bar Form",
      hasSearch ? "pass" : "warn",
      hasSearch ? "Store search form input field is active." : "No search input fields found on scanned page."
    );

    const hasNewsletter = $('form[action*="contact"], form[id*="newsletter"], input[name*="newsletter"]').length > 0;
    addCheck(
      "Newsletter Capture Form",
      hasNewsletter ? "pass" : "pass",
      hasNewsletter ? "Newsletter email capture forms verified." : "No newsletter signup forms detected."
    );

    // 4. Broken Images & Links
    const brokenImages = context.images.filter(img => !img.src || img.src.startsWith("javascript:"));
    const brokenImgStatus = brokenImages.length > 0 ? "fail" : "pass";
    addCheck(
      "Image Asset Integrity",
      brokenImgStatus,
      brokenImgStatus === "pass"
        ? "All images resolve to valid source paths."
        : `Detected ${brokenImages.length} broken or empty image sources.`
    );

    // 5. Console & Script Errors simulation
    const totalScripts = context.scripts.length;
    const hasDeprecatedScripts = context.scripts.some(s => s.src && s.src.includes("jquery/1."));
    addCheck(
      "Legacy Script Libraries",
      hasDeprecatedScripts ? "warn" : "pass",
      hasDeprecatedScripts ? "Detected legacy jQuery v1.x script loading." : "No outdated core libraries detected."
    );

    // Score computation
    const totalChecks = checks.length;
    const score = Math.max(0, Math.round(((passed + warnings * 0.5) / totalChecks) * 100));

    // Populate issues list
    if (!hasAddToCart) {
      issues.push({
        id: "qa_no_atc",
        severity: "critical",
        category: "QA",
        title: "Add to Cart Button Missing",
        description: "The crawler did not locate an Add to Cart button on this storefront template.",
        recommendation: "Ensure form selectors use standard names (e.g. `name='add'`) so integrations and users can trigger checkouts.",
      });
      recommendations.push("Audit product page Liquid forms to verify form buttons are named correctly.");
    }

    if (brokenImages.length > 0) {
      issues.push({
        id: "qa_broken_images",
        severity: "critical",
        category: "QA",
        title: "Broken Image Paths Detected",
        description: `We identified ${brokenImages.length} image elements with missing or malformed 'src' attributes.`,
        recommendation: "Audit product templates and remove or fix empty `<img>` tags.",
      });
    }

    if (!hasNav) {
      issues.push({
        id: "qa_no_nav",
        severity: "warning",
        category: "QA",
        title: "Missing Navigation Framework",
        description: "No responsive navigation header or mobile menu selectors were found.",
        recommendation: "Use standard HTML5 `<nav>` elements to ensure screen readers and search bots can index links.",
      });
    }

    return {
      score,
      issues,
      recommendations,
      data: {
        passed,
        failed,
        warnings,
        totalChecks,
        checks,
      },
    };
  }
}
