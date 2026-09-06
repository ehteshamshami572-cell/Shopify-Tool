import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shopifytoolkit.com";

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shopify Toolkit - Store Auditor, SEO & Speed Optimization Suite",
    template: "%s | Shopify Developer & Merchant Toolkit",
  },
  description:
    "All-in-one Shopify store audit, SEO analyzer, and developer suite. Audit Core Web Vitals, detect installed apps, optimize themes, inspect CRO, and automate storefront QA testing in seconds.",
  keywords: [
    "Shopify store audit",
    "Shopify SEO analyzer",
    "Shopify speed optimization",
    "Shopify app detector",
    "Shopify developer tools",
    "Shopify QA automation",
    "Shopify theme intelligence",
    "Core Web Vitals Shopify",
    "Shopify CRO audit",
    "Liquid code formatter",
    "Shopify store benchmark",
  ],
  authors: [{ name: "Shopify Toolkit Team" }],
  creator: "Shopify Developer & Merchant Toolkit",
  publisher: "Shopify Developer & Merchant Toolkit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shopify Developer & Merchant Toolkit",
    title: "Shopify Toolkit - Store Auditor, SEO & Speed Optimization Suite",
    description:
      "All-in-one Shopify store audit and developer suite. Detect apps, benchmark speed, optimize SEO, and generate white-label PDF reports instantly.",
    images: [
      {
        url: "/images/dashboard_preview.jpg",
        width: 1200,
        height: 630,
        alt: "Shopify Developer & Merchant Toolkit Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Toolkit - Store Auditor, SEO & Speed Optimization Suite",
    description:
      "Audit Shopify store speed, SEO, app footprints, and conversion factors instantly. Get white-label client PDF reports.",
    images: ["/images/dashboard_preview.jpg"],
    creator: "@ShopifyToolkit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Shopify Developer & Merchant Toolkit",
      description: "Automated Store Audits, SEO Optimization & Developer Utilities for Shopify",
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/?url={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "Shopify Developer & Merchant Toolkit",
      operatingSystem: "Web Browser",
      applicationCategory: "DeveloperApplication, BusinessApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "320",
      },
      description:
        "Comprehensive SaaS toolkit for Shopify merchants and developers. Runs automated QA tests, SEO audits, app footprint analysis, and Core Web Vitals profiling.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
