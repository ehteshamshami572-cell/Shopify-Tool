import crypto from "crypto";

export function generateShopifyHandle(title: string): string {
  if (!title) return "";

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric/spaces/hyphens
    .replace(/[\s_-]+/g, "-") // replace spaces/underscores/hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

export function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string,
  sharedSecret: string
): boolean {
  if (!rawBody || !hmacHeader || !sharedSecret) {
    return false;
  }

  try {
    const hash = crypto
      .createHmac("sha256", sharedSecret)
      .update(rawBody, "utf8")
      .digest("base64");

    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(hmacHeader)
    );
  } catch (err) {
    console.error("Webhook verification error:", err);
    return false;
  }
}

export interface ApiVersionStatus {
  version: string;
  status: "active" | "release_candidate" | "deprecated" | "unstable";
  releaseDate: string;
  supportedUntil: string;
}

export function getShopifyApiVersions(): ApiVersionStatus[] {
  return [
    {
      version: "2024-10",
      status: "release_candidate",
      releaseDate: "2024-10-01",
      supportedUntil: "2025-10-31",
    },
    {
      version: "2024-07",
      status: "active",
      releaseDate: "2024-07-01",
      supportedUntil: "2025-07-31",
    },
    {
      version: "2024-04",
      status: "active",
      releaseDate: "2024-04-01",
      supportedUntil: "2025-04-30",
    },
    {
      version: "2024-01",
      status: "deprecated",
      releaseDate: "2024-01-01",
      supportedUntil: "2025-01-31",
    },
    {
      version: "2023-10",
      status: "deprecated",
      releaseDate: "2023-10-01",
      supportedUntil: "2024-10-31",
    },
    {
      version: "unstable",
      status: "unstable",
      releaseDate: "Rolling",
      supportedUntil: "N/A",
    },
  ];
}
