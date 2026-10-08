export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl: string;
  domain: string;
  error?: string;
}

const PRIVATE_IP_PATTERNS = [
  /^127\./,                           // 127.0.0.0/8
  /^10\./,                            // 10.0.0.0/8
  /^192\.168\./,                      // 192.168.0.0/16
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,   // 172.16.0.0/12
  /^169\.254\./,                      // Link-local 169.254.0.0/16
  /^0\./,                             // 0.0.0.0/8
];

const DISALLOWED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "local",
  "internal",
];

export const validateAndNormalizeUrl = validateAndNormalizeStoreUrl;

export function validateAndNormalizeStoreUrl(inputUrl: string): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== "string") {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Please enter a valid Shopify store URL.",
    };
  }

  let trimmed = inputUrl.trim();

  // If protocol omitted, default to https
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = "https://" + trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Invalid URL format. Please enter a valid URL like https://your-store.myshopify.com",
    };
  }

  // Must be http or https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Only HTTP and HTTPS protocols are supported.",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check disallowed hostnames
  if (DISALLOWED_HOSTNAMES.includes(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal") || hostname.endsWith(".lan")) {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Local, private, or internal network addresses are not permitted for scanning.",
    };
  }

  // Check private IP ranges
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: "Private network IP addresses are not permitted.",
      };
    }
  }

  // Check IPv6 loopback and private
  if (hostname.startsWith("[fc") || hostname.startsWith("[fe80") || hostname === "[::1]") {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Private IPv6 addresses are not permitted.",
    };
  }

  // Must contain at least one dot in hostname (e.g. store.com, my-store.myshopify.com)
  if (!hostname.includes(".")) {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Please enter a fully-qualified domain name (e.g. example.com).",
    };
  }

  // Normalize: remove trailing slash, lowercase protocol and hostname, preserve path if any
  let normalized = `${parsed.protocol}//${hostname}`;
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    normalized += `:${parsed.port}`;
  }
  const cleanPath = parsed.pathname.replace(/\/+$/, "");
  normalized += cleanPath;

  return {
    isValid: true,
    normalizedUrl: normalized,
    domain: hostname,
  };
}
