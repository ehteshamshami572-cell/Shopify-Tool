"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function SeoView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const seoData = currentScan.modules.seo.data;
  const seoScore = currentScan.modules.seo.score;
  const seoIssues = currentScan.modules.seo.issues;
  const seoRecommendations = currentScan.modules.seo.recommendations;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">SEO Audit Score</h2>
          <p className="text-xs text-slate-400">Analysis of meta titles, page headings, images alt text, and schemas.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{seoScore}/100</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Core Metadata */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Tag & Title Analysis</CardTitle>
            <CardDescription className="text-[11px]">Primary HTML head tags scraped from the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Page Title</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {seoData.title?.length || 0} chars
                </Badge>
              </div>
              <p className="p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-450 italic">
                "{seoData.title || "No Title tag found"}"
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Meta Description</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {seoData.description?.length || 0} chars
                </Badge>
              </div>
              <p className="p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-450 italic leading-relaxed">
                "{seoData.description || "No Description tag found"}"
              </p>
            </div>

            {/* Social Sharing Schema */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg space-y-1">
                <span className="font-bold text-slate-500 text-[10px] uppercase">JSON-LD Structured Schema</span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {seoData.hasJsonLd ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Schema Detected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>No Schema Found</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg space-y-1">
                <span className="font-bold text-slate-500 text-[10px] uppercase">Open Graph Data</span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {seoData.ogData?.ogTitle ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>OG Tags Configured</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Incomplete OG Tags</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heading Hierarchy */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Heading Outline</CardTitle>
            <CardDescription className="text-[11px]">Structured tags (H1 - H6) hierarchy.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto pr-2 text-xs scrollbar-thin space-y-2">
            {seoData.headingsHierarchy?.length === 0 ? (
              <div className="text-center text-slate-400 py-8">No headings detected.</div>
            ) : (
              seoData.headingsHierarchy.map((h: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 rounded bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50"
                  style={{ paddingLeft: `${(h.level - 1) * 8 + 8}px` }}
                >
                  <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-1 rounded uppercase font-bold shrink-0">
                    H{h.level}
                  </span>
                  <span className="truncate text-slate-600 dark:text-slate-400">{h.text}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* SEO Issues & Improvements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Module Issues */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-350">Issues Detected ({seoIssues.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {seoIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                <p className="text-xs font-bold">Excellent SEO!</p>
                <p className="text-[10px]">No issues identified in head tags.</p>
              </div>
            ) : (
              seoIssues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    {issue.severity === "critical" ? (
                      <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span>{issue.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">{issue.description}</p>
                  <div className="text-[10.5px] text-emerald-600 dark:text-teal-400 pl-6 font-medium">
                    <span className="font-bold">Recommendation:</span> {issue.recommendation}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Action items */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400">SEO Optimizations Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {seoRecommendations.map((rec: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 p-2 rounded-lg bg-indigo-50/10 dark:bg-slate-950/20 border border-indigo-500/10 text-xs text-slate-650 dark:text-slate-400 leading-relaxed"
              >
                <ChevronRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
