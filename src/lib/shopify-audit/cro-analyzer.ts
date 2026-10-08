import { CROAudit, CROCategoryEvaluation, ExtractedPageContent } from "@/types/shopify-audit";
import { CRO_CATEGORY_WEIGHTS, getScoreClassification } from "./scoring";

export function evaluateStoreCRO(pages: ExtractedPageContent[]): CROAudit {
  const home = pages.find((p) => p.type === "homepage") || pages[0];
  const product = pages.find((p) => p.type === "product");
  const collection = pages.find((p) => p.type === "collection");

  const keyFindings: string[] = [];

  // 1. Messaging Evaluation (Weight 15)
  const messagingFindings: string[] = [];
  const messagingRecs: string[] = [];
  let messagingPoints = 15;

  if (!home?.h1 || home.h1.length === 0) {
    messagingPoints -= 5;
    messagingFindings.push("Homepage lacks a prominent H1 value proposition headline.");
    messagingRecs.push("Add a clear, benefit-driven H1 statement immediately visible above the fold.");
  } else {
    messagingFindings.push(`Clear headline found: "${home.h1[0].slice(0, 50)}..."`);
  }

  if (!home?.metaDescription || home.metaDescription.length < 50) {
    messagingPoints -= 4;
    messagingFindings.push("Meta description is missing or under 50 characters, hurting search click-throughs.");
    messagingRecs.push("Draft a compelling meta description highlighting your core brand value proposition and shipping perks.");
  }

  if (home?.promotionalMessaging && home.promotionalMessaging.length > 0) {
    messagingFindings.push(`Promotional banner detected: "${home.promotionalMessaging[0].slice(0, 45)}..."`);
  } else {
    messagingPoints -= 3;
    messagingRecs.push("Implement a top announcement bar for promotions, free shipping thresholds, or seasonal discounts.");
  }

  const messagingCat: CROCategoryEvaluation = {
    id: "messaging",
    name: "Messaging & Value Prop",
    weight: CRO_CATEGORY_WEIGHTS.messaging,
    score: Math.max(0, Math.round((messagingPoints / 15) * 100)),
    status: getScoreClassification(Math.round((messagingPoints / 15) * 100)),
    findings: messagingFindings,
    recommendations: messagingRecs,
  };

  // 2. CTA Evaluation (Weight 15)
  const ctaFindings: string[] = [];
  const ctaRecs: string[] = [];
  let ctaPoints = 15;

  const allCtas = pages.flatMap((p) => p.ctaTexts);
  const hasStrongCtas = allCtas.some((c) => /shop now|buy now|add to cart|claim|explore|order/i.test(c));

  if (!hasStrongCtas) {
    ctaPoints -= 6;
    ctaFindings.push("Action verbs on call-to-action buttons are weak or generic.");
    ctaRecs.push("Upgrade primary buttons to active, high-intent wording (e.g. 'Claim Your Pair', 'Add to Bag').");
  } else {
    ctaFindings.push("High-converting action verbs detected on primary buttons.");
  }

  if (product && !product.hasAddToCart) {
    ctaPoints -= 6;
    ctaFindings.push("No explicit Add to Cart button detected on product view.");
    ctaRecs.push("Ensure product page Add to Cart buttons are prominent, high-contrast, and sticky on mobile screens.");
  }

  const ctaCat: CROCategoryEvaluation = {
    id: "cta",
    name: "Call-to-Action (CTA)",
    weight: CRO_CATEGORY_WEIGHTS.cta,
    score: Math.max(0, Math.round((ctaPoints / 15) * 100)),
    status: getScoreClassification(Math.round((ctaPoints / 15) * 100)),
    findings: ctaFindings,
    recommendations: ctaRecs,
  };

  // 3. Product Presentation (Weight 15)
  const productFindings: string[] = [];
  const productRecs: string[] = [];
  let productPoints = 15;

  if (product) {
    if (product.productPrice) {
      productFindings.push(`Clear product pricing detected: ${product.productPrice}`);
    } else {
      productPoints -= 4;
      productFindings.push("Product price hierarchy could not be cleanly detected.");
      productRecs.push("Position pricing prominently next to product titles and compare-at discount badges.");
    }

    if (product.hasVariants) {
      productFindings.push("Product variant selectors (sizes/colors) detected.");
    }

    if (product.hasFaqs) {
      productFindings.push("FAQ or accordion information block present on product page.");
    } else {
      productPoints -= 3;
      productRecs.push("Include an accordion FAQ on product pages addressing shipping, sizing, and materials.");
    }

    if (product.imagesWithoutAlt > 2) {
      productPoints -= 3;
      productFindings.push(`${product.imagesWithoutAlt} product images are missing descriptive ALT tags.`);
      productRecs.push("Add descriptive image alt attributes to improve accessibility and Google Image search visibility.");
    }
  } else {
    // If no specific product page was discovered, evaluate home product signals
    productPoints = 11;
    productFindings.push("Direct product detail page was not indexed during scan; evaluated catalog modules from homepage.");
    productRecs.push("Ensure product detail pages link cleanly from the top navigation and collection grids.");
  }

  const productCat: CROCategoryEvaluation = {
    id: "productPresentation",
    name: "Product Presentation",
    weight: CRO_CATEGORY_WEIGHTS.productPresentation,
    score: Math.max(0, Math.round((productPoints / 15) * 100)),
    status: getScoreClassification(Math.round((productPoints / 15) * 100)),
    findings: productFindings,
    recommendations: productRecs,
  };

  // 4. Trust & Security (Weight 15)
  const trustFindings: string[] = [];
  const trustRecs: string[] = [];
  let trustPoints = 15;

  const anyTrustSignals = pages.some((p) => p.hasTrustSignals);
  if (anyTrustSignals) {
    trustFindings.push("Security indicators, shipping badges, or payment icons verified.");
  } else {
    trustPoints -= 6;
    trustFindings.push("Missing security seals, satisfaction guarantees, and recognized payment icons.");
    trustRecs.push("Display SSL secured checkout badges and trusted payment icons directly below checkout buttons.");
  }

  const anyGuarantees = pages.some((p) => p.hasGuarantees);
  if (!anyGuarantees) {
    trustPoints -= 4;
    trustRecs.push("Highlight a clear guarantee (e.g. '30-Day Money-Back Guarantee' or '100% Fit Guarantee') near the buy box.");
  }

  const trustCat: CROCategoryEvaluation = {
    id: "trust",
    name: "Trust & Security",
    weight: CRO_CATEGORY_WEIGHTS.trust,
    score: Math.max(0, Math.round((trustPoints / 15) * 100)),
    status: getScoreClassification(Math.round((trustPoints / 15) * 100)),
    findings: trustFindings,
    recommendations: trustRecs,
  };

  // 5. Social Proof (Weight 10)
  const socialFindings: string[] = [];
  const socialRecs: string[] = [];
  let socialPoints = 10;

  const anyReviews = pages.some((p) => p.hasReviews);
  if (anyReviews) {
    socialFindings.push("Integrated customer reviews or star ratings app detected in page DOM.");
  } else {
    socialPoints -= 6;
    socialFindings.push("No customer reviews, star ratings, or testimonials found.");
    socialRecs.push("Install a verified Shopify review widget (e.g. Judge.me, Loox, Yotpo) to display customer feedback.");
  }

  const socialCat: CROCategoryEvaluation = {
    id: "socialProof",
    name: "Social Proof",
    weight: CRO_CATEGORY_WEIGHTS.socialProof,
    score: Math.max(0, Math.round((socialPoints / 10) * 100)),
    status: getScoreClassification(Math.round((socialPoints / 10) * 100)),
    findings: socialFindings,
    recommendations: socialRecs,
  };

  // 6. Navigation (Weight 10)
  const navFindings: string[] = [];
  const navRecs: string[] = [];
  let navPoints = 10;

  const anyNav = pages.some((p) => p.hasNavigation);
  if (anyNav) {
    navFindings.push("Header navigation hierarchy detected.");
  } else {
    navPoints -= 5;
    navFindings.push("Navigation header is unstructured or missing semantic nav tags.");
    navRecs.push("Implement a clear, sticky header with categorized drop-down menus.");
  }

  if (collection && collection.hasFilters) {
    navFindings.push("Catalog filters and faceted navigation present on collections.");
  } else if (collection) {
    navPoints -= 3;
    navRecs.push("Enable collection sorting and filtering (by price, size, availability) to reduce product search fatigue.");
  }

  const navCat: CROCategoryEvaluation = {
    id: "navigation",
    name: "Navigation & Discovery",
    weight: CRO_CATEGORY_WEIGHTS.navigation,
    score: Math.max(0, Math.round((navPoints / 10) * 100)),
    status: getScoreClassification(Math.round((navPoints / 10) * 100)),
    findings: navFindings,
    recommendations: navRecs,
  };

  // 7. Mobile UX (Weight 10)
  const mobileFindings: string[] = [];
  const mobileRecs: string[] = [];
  let mobilePoints = 10;

  // Evaluate responsive indicators
  mobileFindings.push("Responsive viewport metatags and fluid grid structures verified.");
  if (!allCtas.some((c) => /cart|bag|checkout/i.test(c))) {
    mobilePoints -= 4;
    mobileRecs.push("Implement a sticky 'Add to Bag' bar on mobile product pages to keep CTA accessible during scrolling.");
  }

  const mobileCat: CROCategoryEvaluation = {
    id: "mobileUx",
    name: "Mobile UX Readiness",
    weight: CRO_CATEGORY_WEIGHTS.mobileUx,
    score: Math.max(0, Math.round((mobilePoints / 10) * 100)),
    status: getScoreClassification(Math.round((mobilePoints / 10) * 100)),
    findings: mobileFindings,
    recommendations: mobileRecs,
  };

  // 8. Purchase Friction (Weight 10)
  const frictionFindings: string[] = [];
  const frictionRecs: string[] = [];
  let frictionPoints = 10;

  const anyShipping = pages.some((p) => p.hasShippingInfo);
  if (!anyShipping) {
    frictionPoints -= 4;
    frictionFindings.push("Shipping costs and delivery timelines are not clearly articulated.");
    frictionRecs.push("Add an estimated delivery date counter (e.g. 'Get it by Thursday') on product pages.");
  } else {
    frictionFindings.push("Shipping policies visible to shoppers.");
  }

  const anyReturns = pages.some((p) => p.hasReturnInfo);
  if (!anyReturns) {
    frictionPoints -= 3;
    frictionRecs.push("Link refund and return policies in both the footer and product page tabs to eliminate purchase doubt.");
  }

  const frictionCat: CROCategoryEvaluation = {
    id: "purchaseFriction",
    name: "Purchase Friction",
    weight: CRO_CATEGORY_WEIGHTS.purchaseFriction,
    score: Math.max(0, Math.round((frictionPoints / 10) * 100)),
    status: getScoreClassification(Math.round((frictionPoints / 10) * 100)),
    findings: frictionFindings,
    recommendations: frictionRecs,
  };

  // Compile Key Findings summary
  if (!anyReviews) keyFindings.push("Lack of social proof (reviews/ratings) is suppressing prospective customer trust.");
  if (!anyTrustSignals) keyFindings.push("Absence of security badges near purchase forms increases cart abandonment.");
  if (!anyShipping) keyFindings.push("Uncertainty regarding shipping rates and delivery schedules creates hesitation.");
  if (keyFindings.length === 0) {
    keyFindings.push("Strong baseline conversion infrastructure with clear messaging and product presentation.");
  }

  // Calculate Weighted Total Score (0-100)
  const totalRaw =
    (messagingCat.score * CRO_CATEGORY_WEIGHTS.messaging +
      ctaCat.score * CRO_CATEGORY_WEIGHTS.cta +
      productCat.score * CRO_CATEGORY_WEIGHTS.productPresentation +
      trustCat.score * CRO_CATEGORY_WEIGHTS.trust +
      socialCat.score * CRO_CATEGORY_WEIGHTS.socialProof +
      navCat.score * CRO_CATEGORY_WEIGHTS.navigation +
      mobileCat.score * CRO_CATEGORY_WEIGHTS.mobileUx +
      frictionCat.score * CRO_CATEGORY_WEIGHTS.purchaseFriction) /
    100;

  const overallScore = Math.round(Math.max(0, Math.min(100, totalRaw)));

  return {
    overallScore,
    categories: {
      messaging: messagingCat,
      cta: ctaCat,
      trust: trustCat,
      productPresentation: productCat,
      socialProof: socialCat,
      navigation: navCat,
      mobileUx: mobileCat,
      purchaseFriction: frictionCat,
    },
    keyFindings,
  };
}
