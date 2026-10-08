import { NextRequest, NextResponse } from "next/server";
import { runShopifyAudit } from "@/lib/shopify-audit/audit-engine";
import { validateAndNormalizeUrl } from "@/lib/shopify-audit/url-validator";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Up to 60s for external PageSpeed & multi-page scraping

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.url) {
      return NextResponse.json(
        {
          success: false,
          error: "Store URL is required. Please provide a valid URL.",
        },
        { status: 400 }
      );
    }

    const { url, forceRefresh } = body;

    // Validate and check SSRF safely
    const validation = validateAndNormalizeUrl(url);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || "The URL entered is invalid or restricted.",
        },
        { status: 400 }
      );
    }

    // Run the audit orchestrator
    const auditResult = await runShopifyAudit(validation.normalizedUrl, Boolean(forceRefresh));

    return NextResponse.json(
      {
        success: true,
        data: auditResult,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("[Shopify Audit API Error]:", error);

    const errorMessage =
      error?.message || "An unexpected error occurred while analyzing the Shopify store.";
    
    // Check for specific error types
    const status = errorMessage.includes("Invalid") || errorMessage.includes("blocked")
      ? 400
      : errorMessage.includes("fetch") || errorMessage.includes("reach") || errorMessage.includes("ENOTFOUND")
      ? 422
      : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status }
    );
  }
}
