"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { generatePdfReport } from "@/lib/pdf-generator";
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  Globe,
  Cpu,
  Palette,
  Gauge,
  Image as ImageIcon,
  Accessibility as A11yIcon,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardView() {
  const currentScan = useScanStore((state) => state.currentScan);
  const setActiveView = useScanStore((state) => state.setActiveView);

  if (!currentScan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto my-12 bg-white/40 dark:bg-slate-900/40">
        <div className="p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-500 rounded-full">
          <FileText className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No Scanned Store</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Unlock the audit dashboard by scanning your Shopify store URL.
          </p>
        </div>
        <button
          onClick={() => setActiveView("scanner")}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-colors active:scale-95"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  const { domain, scores, metadata, allIssues, allRecommendations } = currentScan;
  const criticalCount = allIssues.filter((i: any) => i.severity === "critical").length;
  const warningCount = allIssues.filter((i: any) => i.severity === "warning").length;
  const infoCount = allIssues.filter((i: any) => i.severity === "info").length;

  const scoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const scoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (score >= 50) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  };

  const modules = [
    { id: "seo", name: "SEO Intelligence", score: scores.seo, icon: Globe, desc: "Titles, tags, headings & markup schemas" },
    { id: "apps", name: "Shopify App Load", score: scores.apps, icon: Cpu, desc: "Script counts, app trackers & weight" },
    { id: "theme", name: "Theme Structure", score: scores.theme, icon: Palette, desc: "OS 2.0 readiness, vendor structures" },
    { id: "pagespeed", name: "PageSpeed Metrics", score: scores.pagespeed, icon: Gauge, desc: "Speed Index, FCP, blocking times" },
    { id: "images", name: "Image Optimizer", score: scores.images, icon: ImageIcon, desc: "Format audits, Shopify resizing, lazyloading" },
    { id: "accessibility", name: "Accessibility (A11y)", score: scores.accessibility, icon: A11yIcon, desc: "Labels, alt tags, scales & zoom levels" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Overview Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/20 to-teal-500/10 pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <span className="text-[10px] text-teal-400 font-extrabold tracking-widest uppercase">AUDIT COMPLETED</span>
          <h2 className="text-2xl font-bold tracking-tight">{domain}</h2>
          <p className="text-xs text-slate-400">
            Theme Name: <span className="text-slate-200 font-semibold">{metadata.themeName}</span> &bull; ID: <span className="text-slate-200 font-semibold">{metadata.themeId}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={() => generatePdfReport(currentScan)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg shadow-teal-400/10"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Export PDF Report</span>
          </button>
          <button
            onClick={() => setActiveView("scanner")}
            className="flex-1 sm:flex-initial text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg transition-colors bg-slate-800/50"
          >
            Re-scan Store
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Overall Score */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm md:col-span-1 flex flex-col justify-center items-center p-6 text-center bg-white/70 dark:bg-slate-900/70">
          <CardHeader className="p-0 pb-2">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">OVERALL GRADE</span>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center">
            <div className={`text-5xl font-black ${scoreColor(scores.overall)}`}>
              {scores.overall}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">out of 100 points</div>
            <Badge className={`mt-3 ${scoreBg(scores.overall)}`}>
              {scores.overall >= 90 ? "Excellent" : scores.overall >= 50 ? "Needs Work" : "Critical"}
            </Badge>
          </CardContent>
        </Card>

        {/* Severity Metrics */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm md:col-span-3 bg-white/70 dark:bg-slate-900/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">ISSUE HEALTH OVERVIEW</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-rose-500 text-white rounded-lg">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{criticalCount}</div>
                <div className="text-[10px] text-slate-400">Critical Issues</div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{warningCount}</div>
                <div className="text-[10px] text-slate-400">Warnings</div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20 p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{infoCount}</div>
                <div className="text-[10px] text-slate-400">Info Codes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module score breakdowns */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">MODULE ANALYZERS</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.id}
                onClick={() => setActiveView(m.id)}
                className="border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{m.name}</span>
                  </CardTitle>
                  <span className={`text-base font-extrabold ${scoreColor(m.score)}`}>
                    {m.score}%
                  </span>
                </CardHeader>
                <CardContent className="pt-1">
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-4">{m.desc}</p>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        m.score >= 90 ? "bg-emerald-500" : m.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Critical Issues & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Critical Fixes */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>Priority Action Items ({criticalCount})</span>
            </CardTitle>
            <CardDescription className="text-[11px]">
              Resolve these critical issues to restore site performance and conversions.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {allIssues.filter((i: any) => i.severity === "critical").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-xs font-bold">All clear!</p>
                <p className="text-[10px]">No critical issues detected on this store.</p>
              </div>
            ) : (
              allIssues
                .filter((i: any) => i.severity === "critical")
                .map((issue: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{issue.title}</span>
                      <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 uppercase text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200/10">
                        {issue.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{issue.description}</p>
                    <div className="text-[10.5px] text-emerald-600 dark:text-teal-400 font-medium">
                      <span className="font-bold">Fix: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Global Recommendations */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-4.5 w-4.5" />
              <span>Developer & Merchant Recommendations</span>
            </CardTitle>
            <CardDescription className="text-[11px]">
              Practical advice for developers to scale and optimize themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {allRecommendations.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-xs">
                No custom recommendations are available.
              </div>
            ) : (
              allRecommendations.map((rec: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-2 p-2.5 rounded-lg bg-indigo-50/10 dark:bg-slate-950/20 border border-indigo-500/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  <span className="font-bold text-indigo-500 shrink-0">{index + 1}.</span>
                  <span>{rec}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
