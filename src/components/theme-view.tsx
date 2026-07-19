"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, CheckCircle2, AlertCircle, FileCode, Shield } from "lucide-react";

export default function ThemeView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const themeData = currentScan.modules.theme.data;
  const themeScore = currentScan.modules.theme.score;
  const themeIssues = currentScan.modules.theme.issues;
  const themeRecommendations = currentScan.modules.theme.recommendations;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Theme Structure Intelligence</h2>
          <p className="text-xs text-slate-400">Verifying theme engine framework, active templates, and versions.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{themeScore}/100</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Theme Profile */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Palette className="h-4 w-4 text-indigo-500" />
              <span>Theme Profile</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Active storefront design details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg">
                <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block mb-1">
                  THEME NAME
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {themeData.themeName}
                </span>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg">
                <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block mb-1">
                  THEME ID
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">
                  {themeData.themeId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg">
                <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block mb-1">
                  THEME VENDOR
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {themeData.themeDeveloper}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg">
                <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block mb-1">
                  THEME TYPE
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {themeData.isCustomized ? "Modified Storefront" : "Standard Core Theme"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OS 2.0 Integration Status */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Online Store 2.0</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[10px] uppercase">ARCHITECTURE TYPE</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                {themeData.isOs2 ? (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-450">OS 2.0 (JSON Layouts)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span className="text-sm text-rose-600 dark:text-rose-400">Vintage (Liquid Layouts)</span>
                  </>
                )}
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed pt-1">
                Shopify's Online Store 2.0 allows merchants to dynamically drag-and-drop theme app blocks, customize pages without touching code, and speeds up storefront rendering engine benchmarks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Issues & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Module Issues */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-350">Issues Detected ({themeIssues.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {themeIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                <p className="text-xs font-bold">Theme is Healthy!</p>
                <p className="text-[10px]">Your Shopify theme structure aligns with modern best practices.</p>
              </div>
            ) : (
              themeIssues.map((issue: any, index: number) => (
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
              ))
            )}
          </CardContent>
        </Card>

        {/* Action items */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Theme Best Practices Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {themeRecommendations.length === 0 ? (
              <div className="text-slate-400 py-6 text-center text-xs">No specific theme adjustments required.</div>
            ) : (
              themeRecommendations.map((rec: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-2 p-2 rounded-lg bg-indigo-50/10 dark:bg-slate-950/20 border border-indigo-500/10 text-xs text-slate-650 dark:text-slate-400 leading-relaxed"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
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
