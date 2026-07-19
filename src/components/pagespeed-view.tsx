"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function PageSpeedView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const speedResult = currentScan.modules.pagespeed;
  const metrics = speedResult.data.metrics;
  const timingCategories = [
    { label: "First Contentful Paint (FCP)", value: metrics.firstContentfulPaint, desc: "Time to render first text or image block." },
    { label: "Largest Contentful Paint (LCP)", value: metrics.largestContentfulPaint, desc: "Time to load primary above-the-fold content." },
    { label: "Total Blocking Time (TBT)", value: metrics.totalBlockingTime, desc: "Sum of script loading delays blocking browser threads." },
    { label: "Cumulative Layout Shift (CLS)", value: metrics.cumulativeLayoutShift, desc: "Stability measure of page layout shifts during paint." },
    { label: "Speed Index", value: metrics.speedIndex, desc: "How quickly the visual elements are populated." },
    { label: "Time to Interactive (TTI)", value: metrics.interactive, desc: "Time until page is fully responsive to input events." },
  ];

  const scoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 border-emerald-550/20 bg-emerald-500/10";
    if (score >= 50) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
    return "text-rose-500 border-rose-500/20 bg-rose-500/10";
  };

  const textScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Google PageSpeed Analytics</h2>
          <p className="text-xs text-slate-400">Core Web Vitals evaluation based on Lighthouse auditing specs.</p>
        </div>
        <div className={`text-3xl font-black ${textScoreColor(speedResult.score)}`}>
          {speedResult.score}/100
        </div>
      </div>

      {/* Categories Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${scoreColor(speedResult.data.performance)}`}>
          <span className="text-[9px] font-extrabold uppercase mb-1">PERFORMANCE</span>
          <span className="text-2xl font-black">{speedResult.data.performance}</span>
        </div>
        
        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${scoreColor(speedResult.data.accessibility)}`}>
          <span className="text-[9px] font-extrabold uppercase mb-1">ACCESSIBILITY</span>
          <span className="text-2xl font-black">{speedResult.data.accessibility}</span>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${scoreColor(speedResult.data.bestPractices)}`}>
          <span className="text-[9px] font-extrabold uppercase mb-1">BEST PRACTICES</span>
          <span className="text-2xl font-black">{speedResult.data.bestPractices}</span>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${scoreColor(speedResult.data.seo)}`}>
          <span className="text-[9px] font-extrabold uppercase mb-1">SEO GRADE</span>
          <span className="text-2xl font-black">{speedResult.data.seo}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Core Web Vitals Timings */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-amber-500" />
              <span>Lighthouse Timings Audit</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Core speed timestamps for mobile browser rendering.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 text-xs">
            {timingCategories.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-350">
                  <span>{item.label}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                    {item.value}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Verification Metadata */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Audit Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[10px] uppercase">DATA CAPTURE SOURCE</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                {speedResult.data.fetchedRealData ? (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Real Google PSI API</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4.5 w-4.5 text-indigo-500 shrink-0 animate-pulse" />
                    <span>Heuristic Scoring Engine</span>
                  </>
                )}
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed pt-1">
                {speedResult.data.fetchedRealData 
                  ? "Metrics are fetched directly from Google PageSpeed servers for this specific URL."
                  : "Scored using our offline static code parsing engine, evaluating script count weight, CSS block sizes, theme templates, and unoptimized layout elements."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagespeed issues */}
      {speedResult.issues.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-350">PageSpeed Issue Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {speedResult.issues.map((issue: any, index: number) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  {issue.severity === "critical" ? (
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span>{issue.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">{issue.description}</p>
                <div className="text-[10.5px] text-emerald-600 dark:text-teal-400 pl-6 font-medium">
                  <span className="font-bold">Recommendation:</span> {issue.recommendation}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
