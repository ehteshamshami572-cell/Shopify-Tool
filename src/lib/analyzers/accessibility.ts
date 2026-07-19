import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult, Issue } from "@/types/scan";
import * as cheerio from "cheerio";

export class AccessibilityAnalyzer implements ShopifyAnalyzer {
  name = "Accessibility Analyzer";
  id = "accessibility";

  async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const issues: Issue[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const html = context.html;
    if (!html) {
      return {
        score: 0,
        issues: [
          {
            id: "a11y_no_html",
            severity: "critical",
            category: "Accessibility",
            title: "Empty Page Content",
            description: "No HTML content was provided for analysis.",
            recommendation: "Ensure the store crawls successfully first.",
          },
        ],
        recommendations: [],
        data: {},
      };
    }

    const $ = cheerio.load(html);

    // 1. Language Attribute Check
    const lang = $("html").attr("lang");
    if (!lang) {
      score -= 10;
      issues.push({
        id: "a11y_missing_lang",
        severity: "warning",
        category: "Accessibility",
        title: "Missing Language Attribute",
        description: "The `<html>` element does not have a `lang` attribute specified.",
        recommendation: "Add a `lang` attribute (e.g., `<html lang='en'>`) to indicate the page's language.",
      });
      recommendations.push("Update the layout file to ensure the language code is dynamically outputted.");
    }

    // 2. Alt attributes on Images (this overlaps with SEO, but checks specifically accessibility)
    const images = $("img");
    let missingAltCount = 0;
    images.each((_, el) => {
      const alt = $(el).attr("alt");
      if (alt === undefined || (alt.trim() === "" && !$(el).attr("aria-hidden"))) {
        missingAltCount++;
      }
    });

    if (images.length > 0 && missingAltCount > 0) {
      const percentage = Math.round((missingAltCount / images.length) * 100);
      const penalty = Math.min(25, Math.ceil(missingAltCount * 2));
      score -= penalty;
      issues.push({
        id: "a11y_images_missing_alt",
        severity: percentage > 30 ? "critical" : "warning",
        category: "Accessibility",
        title: `Images Missing Alt Text (${missingAltCount} images)`,
        description: `${missingAltCount} out of ${images.length} images (${percentage}%) are missing alternative text (alt tags) or aria-hidden rules. Screen readers cannot describe these images to visually impaired users.`,
        recommendation: "Ensure every functional image has a descriptive `alt` attribute, or use `alt=''` / `aria-hidden='true'` for purely decorative images.",
      });
    }

    // 3. Form Input Labels Check
    const inputs = $("input[type='text'], input[type='email'], input[type='search'], select, textarea");
    let unlabelledInputs = 0;
    inputs.each((_, el) => {
      const id = $(el).attr("id");
      const name = $(el).attr("name");
      const ariaLabel = $(el).attr("aria-label");
      const ariaLabelledBy = $(el).attr("aria-labelledby");
      const placeholder = $(el).attr("placeholder");

      // Check if associated label exists
      let hasLabel = false;
      if (id) {
        hasLabel = $(`label[for='${id}']`).length > 0;
      }

      if (!hasLabel && !ariaLabel && !ariaLabelledBy && !placeholder) {
        unlabelledInputs++;
      }
    });

    if (unlabelledInputs > 0) {
      score -= Math.min(15, unlabelledInputs * 3);
      issues.push({
        id: "a11y_unlabelled_inputs",
        severity: "warning",
        category: "Accessibility",
        title: `Unlabelled Form Controls (${unlabelledInputs} fields)`,
        description: `${unlabelledInputs} form inputs or select fields do not have labels or ARIA naming attributes. Screen readers cannot identify what these fields are for.`,
        recommendation: "Associate form controls with `<label>` tags using the `for` attribute, or use `aria-label` directly on the input.",
      });
      recommendations.push("Ensure contact forms and newsletter signup fields are correctly labelled.");
    }

    // 4. Buttons and Links with Generic or Empty Text
    const interactiveElements = $("a, button");
    let badTextElements = 0;
    const genericPhrases = ["click here", "read more", "more", "learn more", "go", "link"];
    
    interactiveElements.each((_, el) => {
      const text = $(el).text().trim().toLowerCase();
      const ariaLabel = $(el).attr("aria-label");
      const ariaLabelledBy = $(el).attr("aria-labelledby");

      if (!text && !ariaLabel && !ariaLabelledBy) {
        badTextElements++;
      } else if (text && genericPhrases.includes(text) && !ariaLabel) {
        badTextElements++;
      }
    });

    if (badTextElements > 0) {
      score -= Math.min(15, badTextElements * 2);
      issues.push({
        id: "a11y_generic_interactive_text",
        severity: "warning",
        category: "Accessibility",
        title: "Non-descriptive Link/Button Text",
        description: `Detected ${badTextElements} links or buttons with empty content or generic labels like 'click here' or 'learn more' without supplemental ARIA descriptions.`,
        recommendation: "Update the button/link text to be self-descriptive (e.g. 'Read our shipping policy' instead of 'Read more'), or attach an `aria-label` attribute.",
      });
    }

    // 5. Check if viewports allow zooming
    const viewportContent = context.meta["viewport"] || "";
    if (viewportContent.includes("user-scalable=no") || viewportContent.includes("maximum-scale=1.0") || viewportContent.includes("maximum-scale=1")) {
      score -= 10;
      issues.push({
        id: "a11y_scalable_disabled",
        severity: "warning",
        category: "Accessibility",
        title: "Zooming Disabled in Viewport Meta",
        description: "The viewport configuration blocks users from scaling or zooming the page (e.g., `user-scalable=no`). This affects users with low vision who require browser-level magnification.",
        recommendation: "Remove `user-scalable=no` and maximum scale limits from the `<meta name='viewport'>` tag.",
      });
    }

    score = Math.max(0, score);

    return {
      score,
      issues,
      recommendations,
      data: {
        language: lang || "Not set",
        totalImages: images.length,
        missingAltImages: missingAltCount,
        unlabelledInputs,
        nonDescriptiveInteractive: badTextElements,
        zoomScalable: !viewportContent.includes("user-scalable=no"),
      },
    };
  }
}
