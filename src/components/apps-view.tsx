"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, ExternalLink, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AppsView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const appData = currentScan.modules.apps.data;
  const appScore = currentScan.modules.apps.score;
  const appIssues = currentScan.modules.apps.issues;
  const appRecommendations = currentScan.modules.apps.recommendations;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Shopify App Detection</h2>
          <p className="text-xs text-slate-400">Analysis of loaded scripts and third-party widget hooks.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{appScore}/100</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Apps List */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-500" />
              <span>Detected Apps ({appData.detectedCount})</span>
            </CardTitle>
            <CardDescription className="text-[11px]">
              Third-party integrations detected by examining source tags and APIs.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {appData.detectedCount === 0 ? (
              <div className="text-center text-slate-400 py-12 text-xs">
                No popular Shopify apps were detected on this page.
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {appData.detectedApps.map((app: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-200 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {app.name}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">{app.category}</p>
                    </div>
                    <div className="mt-2.5 flex items-center justify-end">
                      <a
                        href={app.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 dark:text-indigo-400"
                      >
                        <span>App Details</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Script Health */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Script Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[10px] uppercase">APP COUNT RATING</span>
              <div className="flex items-center gap-2">
                {appData.detectedCount <= 8 ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Optimal
                  </Badge>
                ) : appData.detectedCount <= 15 ? (
                  <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Suboptimal
                  </Badge>
                ) : (
                  <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Heavy Load
                  </Badge>
                )}
              </div>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Shopify stores typically experience a 100-300ms loading delay for every third-party script loaded. Keeping this list small ensures snappy checkout and search experiences.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Issues */}
      {appIssues.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-350">
              Merchant Alerts & Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appIssues.map((issue: any, index: number) => (
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
