"use client";

import React, { useState } from "react";
import { StoreUrlInput } from "./StoreUrlInput";
import { AuditProgress } from "./AuditProgress";
import { OverallScore } from "./OverallScore";
import { CategoryScore } from "./CategoryScore";
import { CoreWebVitals } from "./CoreWebVitals";
import { PerformanceOverview } from "./PerformanceOverview";
import { CROOverview } from "./CROOverview";
import { IssueList } from "./IssueList";
import { RecommendationList } from "./RecommendationList";
import { Roadmap } from "./Roadmap";
import { AuditResult } from "@/types/shopify-audit";
import { AlertCircle, RotateCcw, Download, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AuditDashboardProps {
  initialUrl?: string;
}

function getScoreGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function AuditDashboard({ initialUrl }: AuditDashboardProps) {
  const [url, setUrl] = useState<string>(initialUrl || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartAudit = async (targetUrl: string, forceRefresh = false) => {
    setUrl(targetUrl);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/shopify-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, forceRefresh }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to complete store audit.");
      }

      setAuditResult(data.data);
    } catch (err: any) {
      console.error("Audit error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred while communicating with the audit service."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!auditResult) return;
    const blob = new Blob([JSON.stringify(auditResult, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `shopify-audit-${auditResult.domain}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const perfScore = auditResult?.scores?.performance ?? 0;
  const croScore = auditResult?.scores?.cro ?? 0;
  const seoScore = auditResult?.scores?.seo ?? 85;
  const a11yScore = auditResult?.scores?.accessibility ?? 80;
  const overall = auditResult?.scores?.overall ?? 0;

  const combinedRecommendations = auditResult?.ai?.croRecommendations
    ? [...(auditResult.ai.croRecommendations || []), ...(auditResult.ai.performanceRecommendations || [])]
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
      {/* Feature Header */}
      <div className="text-center max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Shopify Store Performance & CRO Audit
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Automated Speed, Core Web Vitals & Conversion Audit
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2">
          Run deep technical diagnostics on your Shopify store to identify checkout friction, mobile latency bottlenecks, and revenue growth opportunities.
        </p>
      </div>

      {/* URL Input Form */}
      <StoreUrlInput
        onStartAudit={(u) => handleStartAudit(u, false)}
        isLoading={isLoading}
        initialUrl={url}
      />

      {/* Error Alert */}
      {errorMessage && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1 text-sm">
            <strong className="font-semibold block mb-0.5">Audit Failed</strong>
            <p className="text-xs text-rose-700">{errorMessage}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStartAudit(url, true)}
            className="text-xs border-rose-300 hover:bg-rose-100 text-rose-800 shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Progress Stepper */}
      {isLoading && <AuditProgress />}

      {/* Audit Results Dashboard */}
      {!isLoading && auditResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Audit complete for:
              </span>
              <span className="text-xs font-bold text-slate-900">
                {auditResult.domain}
              </span>

              {auditResult.performance.isSimulated && (
                <Badge variant="outline" className="text-[11px] bg-amber-50 text-amber-700 border-amber-200">
                  Heuristic Mode
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartAudit(auditResult.url, true)}
                className="text-xs h-8 gap-1.5 cursor-pointer text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-run Audit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="text-xs h-8 gap-1.5 cursor-pointer text-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </Button>

              <a
                href={auditResult.url.startsWith("http") ? auditResult.url : `https://${auditResult.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="text-xs h-8 gap-1.5 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer">
                  Visit Store
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>

          {/* 1. Overall Score & Store Identity */}
          <OverallScore
            score={overall}
            grade={getScoreGrade(overall)}
            storeUrl={auditResult.url}
            isShopify={auditResult.shopifyDetection.isShopify}
            themeName={auditResult.shopifyDetection.themeName}
            scannedAt={auditResult.auditedAt}
          />

          {/* 2. 4-Pillar Category Scores */}
          <CategoryScore
            performanceScore={perfScore}
            performanceGrade={getScoreGrade(perfScore)}
            croScore={croScore}
            croGrade={getScoreGrade(croScore)}
            seoScore={seoScore}
            seoGrade={getScoreGrade(seoScore)}
            accessibilityScore={a11yScore}
            accessibilityGrade={getScoreGrade(a11yScore)}
          />

          {/* 3. Core Web Vitals */}
          <CoreWebVitals metrics={auditResult.performance.coreWebVitals} />

          {/* 4. Performance Overview (Mobile vs Desktop) */}
          <PerformanceOverview performance={auditResult.performance} />

          {/* 5. CRO 8-Pillar Heuristic Analysis */}
          <CROOverview
            categories={auditResult.cro.categories}
            summary={auditResult.ai?.summary || auditResult.cro.keyFindings?.join(". ") || ""}
          />

          {/* 6. Critical Issues */}
          <IssueList issues={auditResult.ai?.criticalIssues || []} />

          {/* 7. Strategic Recommendations */}
          <RecommendationList recommendations={combinedRecommendations} />

          {/* 8. Prioritized Implementation Roadmap */}
          <Roadmap
            roadmap={
              auditResult.ai?.roadmap || {
                quickWins: [],
                highImpact: [],
                shortTerm: [],
                longTerm: [],
              }
            }
          />
        </div>
      )}
    </div>
  );
}
