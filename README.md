# Shopify Developer & Merchant Toolkit

A production-ready, highly extensible SaaS platform built on Next.js 15 App Router. The toolkit provides merchants and developers with comprehensive audits, third-party script detection, SEO analysis, theme intelligence, and offline developer utilities.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand (with localStorage persistence)
- **Data Fetching**: TanStack React Query (v5)
- **Parser libraries**: Cheerio (for HTML structures) & Axios (for requests)
- **JS Rendering**: Playwright (for dynamic script rendering fallback)
- **Report Generation**: jsPDF (client-side PDF audits compiling)
- **Validation**: Zod & React Hook Form

---

## Architecture & Code Design

The application utilizes a **Plugin-Based Scan Pipeline** that ensures high performance and modularity. 

### 1. The Unified Scan Orchestrator (`src/lib/orchestrator.ts`)
Instead of each analyzer crawling the target website separately (which wastes bandwidth and triggers bot-protection blocks), a single crawler makes the request:
1. Attempts to run **Playwright** inside the Next.js API route to trace dynamic Javascript loads and track network requests.
2. Falls back to **Axios + Cheerio** if browser binaries are unavailable in the host environment.
3. Normalizes all scraped headers, page titles, metas, scripts, styles, links, and images into a single `AnalysisContext` object.

### 2. Extensible Analyzer Plugins (`src/lib/analyzers/`)
Every analyzer implements a common TypeScript interface:

```typescript
export interface ShopifyAnalyzer {
  name: string;
  id: string;
  analyze(context: AnalysisContext): Promise<AnalyzerResult>;
}
```

This makes it trivial to add new analyzers. Simply write a class that implements `ShopifyAnalyzer`, drop it in `src/lib/analyzers/`, and register it inside the route handler `src/app/api/scan/route.ts`.

---

## Directory Structure

```
shopify-toolkit/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Main router controller
│   │   ├── globals.css
│   │   └── api/
│   │       └── scan/
│   │           └── route.ts    # Scan Pipeline coordinator API
│   ├── components/
│   │   ├── ui/                 # shadcn UI components
│   │   ├── sidebar.tsx         # Collapsible sidebar
│   │   ├── navbar.tsx          # Top navbar
│   │   ├── providers.tsx       # QueryClient & Tooltip providers
│   │   ├── dashboard-view.tsx  # Executive dashboard
│   │   ├── scanner-view.tsx    # Crawl interface & status stepper
│   │   ├── seo-view.tsx        # SEO details panel
│   │   ├── apps-view.tsx       # Third-party app lists
│   │   ├── theme-view.tsx      # Theme profile & OS 2.0 flags
│   │   ├── pagespeed-view.tsx  # Speed timing audits
│   │   ├── images-view.tsx     # Image sizing CDN metrics
│   │   ├── accessibility-view.tsx # WCAG checklist diagnostics
│   │   ├── json-formatter-view.tsx # Developer JSON beautifier
│   │   ├── liquid-formatter-view.tsx # Liquid markup prettifier
│   │   ├── csv-converter-view.tsx    # CSV-to-JSON mapper
│   │   └── dev-toolbox-view.tsx      # Webhook HMAC and handle tools
│   ├── lib/
│   │   ├── orchestrator.ts     # Crawler coordinator
│   │   ├── pdf-generator.ts    # jsPDF report compiler
│   │   ├── developer-toolbox.ts # Handle & webhook hmac helper functions
│   │   ├── csv-converter.ts     # RFC 4180 CSV serializer
│   │   ├── formatters/
│   │   │   ├── json.ts         # JSON validators
│   │   │   └── liquid.ts       # Liquid formatters
│   │   └── analyzers/
│   │       ├── seo.ts          # SEO plugin
│   │       ├── app-detector.ts # App detector plugin
│   │       ├── theme-intelligence.ts # Theme metadata plugin
│   │       ├── accessibility.ts     # A11y WCAG plugin
│   │       └── image-optimizer.ts   # Image CDN plugin
│   ├── store/
│   │   └── useScanStore.ts     # Zustand store
│   └── types/
│       └── scan.ts             # TypeScript definitions
```

---

## Setup & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright Browsers (Optional but recommended for dynamic script rendering)**:
   ```bash
   npx playwright install chromium
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Environment Variables**:
   Create a `.env.local` file in the root if you wish to configure the Google PageSpeed Insights API key:
   ```env
   PAGESPEED_API_KEY=your_google_pagespeed_api_key_here
   ```
   If not specified, the system automatically falls back to its heuristic offline parsing engine to compute Lighthouse scores based on scripts, themes, and asset weights.

---

## Extension Points: Adding a New Tool Module

Adding a new tool (e.g. "Security Header Audits") is a three-step process:

1. **Create the Analyzer Plugin**:
   Create a file `src/lib/analyzers/security-headers.ts`:
   ```typescript
   import { AnalysisContext, ShopifyAnalyzer, AnalyzerResult } from "@/types/scan";

   export class SecurityHeaderAnalyzer implements ShopifyAnalyzer {
     name = "Security Headers";
     id = "security_headers";

     async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
       // Inspect context.headers for Content-Security-Policy, HSTS, etc.
       const score = 100; // calculate score
       return {
         score,
         issues: [],
         recommendations: [],
         data: {}
       };
     }
   }
   ```

2. **Register the Plugin in the API**:
   Open `src/app/api/scan/route.ts`. Import your class and execute it in the scan list. Append the issues and score outputs to the consolidated response object.

3. **Build the Front-end Panel**:
   Add a tab identifier to the `Sidebar` navigation items in `src/components/sidebar.tsx` and create a matching panel component in `src/app/page.tsx`'s view switcher.
# Shopify-Tool
