"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AccessibilityView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const a11yResult = currentScan.modules.accessibility;
  const a11yData = a11yResult.data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Accessibility Analyzer</h2>
          <p className="text-xs text-slate-400">Inspecting DOM nodes for keyboard focus states, form labels, and screen reader mappings.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{a11yResult.score}/100</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Diagnostics Info */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Accessibility className="h-4.5 w-4.5 text-indigo-500" />
              <span>A11y Node Diagnostics</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Audit compliance results for screen reader navigation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Lang check */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-700 dark:text-slate-350">Document Language</span>
              <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5 rounded">
                lang="{a11yData.language}"
              </Badge>
            </div>

            {/* Input fields */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-700 dark:text-slate-350">Unlabelled Form Elements</span>
              <span className={`font-mono text-sm font-extrabold ${a11yData.unlabelledInputs > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {a11yData.unlabelledInputs} fields
              </span>
            </div>

            {/* Zoom scalable viewport */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-700 dark:text-slate-350">Zoom scalable viewport</span>
              <span className="font-bold">
                {a11yData.zoomScalable ? (
                  <span className="text-emerald-600 dark:text-emerald-450 font-semibold">Enabled</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">Disabled</span>
                )}
              </span>
            </div>

            {/* Non-descriptive text */}
            <div className="flex items-center justify-between pb-1">
              <span className="font-bold text-slate-700 dark:text-slate-350">Non-descriptive Link text</span>
              <span className={`font-mono text-sm font-extrabold ${a11yData.nonDescriptiveInteractive > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {a11yData.nonDescriptiveInteractive} elements
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Items List */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Priority Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {a11yResult.issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                <p className="font-bold">Perfect Accessibility!</p>
                <p className="text-[10px]">No issues or warnings detected on this page.</p>
              </div>
            ) : (
              a11yResult.issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span className="truncate">{issue.title}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-normal pl-6">{issue.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
