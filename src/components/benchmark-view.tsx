"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BenchmarkView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const bResult = currentScan.modules.benchmark;
  const bData = bResult.data;

  const compareItems = [
    { label: "Shopify Apps", actual: bData.comparisons.apps.actual, benchmark: bData.comparisons.apps.benchmark, unit: "apps", desc: "Lower is better for main thread speeds." },
    { label: "Image Count", actual: bData.comparisons.images.actual, benchmark: bData.comparisons.images.benchmark, unit: "images", desc: "Heavy image loads delay layout painting." },
    { label: "Loaded Scripts", actual: bData.comparisons.scripts.actual, benchmark: bData.comparisons.scripts.benchmark, unit: "scripts", desc: "Excessive scripts cause layout blocking." },
    { label: "PageSpeed Index", actual: bData.comparisons.pagespeed.actual, benchmark: bData.comparisons.pagespeed.benchmark, unit: "points", desc: "Higher is better (Lighthouse target)." },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Industry Benchmarking</h2>
          <p className="text-xs text-slate-400">Comparing asset weights, speeds, and scripts against e-commerce averages.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{bResult.score}/100</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Comparisons Grid */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-indigo-500" />
              <span>Competitor Comparisons</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Compare values against general industry standard values.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 text-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              {compareItems.map((item, index) => {
                const diff = item.actual - item.benchmark;
                const isBetter = item.label === "PageSpeed Index" ? diff >= 0 : diff <= 0;

                return (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-850 dark:text-slate-250">{item.label}</span>
                      <Badge
                        className={
                          isBetter
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded"
                            : "bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded"
                        }
                      >
                        {isBetter ? "BEATING AVG" : "BEHIND AVG"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center border-t border-slate-100 dark:border-slate-800 pt-2.5">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">YOUR STORE</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                          {item.actual} {item.unit}
                        </span>
                      </div>
                      <div className="border-l border-slate-150 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400 block font-bold">BENCHMARK</span>
                        <span className="text-sm font-bold text-slate-500">
                          {item.benchmark} {item.unit}
                        </span>
                      </div>
                    </div>

                    <p className="text-[9.5px] text-slate-400 leading-normal border-t border-slate-100 dark:border-slate-800 pt-2">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Global Competitor Ranking Card */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
              <span>Competitor Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-indigo-50/10 dark:bg-slate-950/20 border border-indigo-500/10 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">STORE RANKING</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{bData.ranking}</span>
            </div>

            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Based on overall analysis weight (number of images, script count, third-party apps, PageSpeed grades), your store ranks at the indicated performance tier compared to e-commerce average scores.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark issues */}
      {bResult.issues.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-350">Benchmark Optimization Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bResult.issues.map((issue: any, index: number) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
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
