"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, AlertTriangle, Play, HelpCircle } from "lucide-react";

export default function QaView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const qaResult = currentScan.modules.qa;
  const qaData = qaResult.data;

  const getStatusIcon = (status: "pass" | "fail" | "warn") => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />;
      case "fail":
        return <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 animate-pulse" />;
      case "warn":
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />;
    }
  };

  const getStatusClass = (status: "pass" | "fail" | "warn") => {
    switch (status) {
      case "pass":
        return "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/15 dark:border-emerald-800/10";
      case "fail":
        return "bg-rose-50/50 border-rose-100 dark:bg-rose-950/15 dark:border-rose-800/10";
      case "warn":
        return "bg-amber-50/50 border-amber-100 dark:bg-amber-950/15 dark:border-amber-800/10";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">QA Automation Testing</h2>
          <p className="text-xs text-slate-400">Verifying storefront buttons, variants selectors, input forms, and script errors.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{qaResult.score}/100</div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-center">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">PASSED CHECKS</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450">{qaData.passed}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">FAILED ALERTS</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{qaData.failed}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">WARNINGS</span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{qaData.warnings}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Checks Checklist */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Play className="h-4.5 w-4.5 text-indigo-500" />
              <span>QA Verification Log</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Results of e-commerce interaction triggers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1 text-xs">
            {qaData.checks?.map((check: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border flex items-start gap-3 justify-between ${getStatusClass(check.status)}`}
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-350">{check.name}</span>
                  <p className="text-[11.5px] text-slate-500 leading-normal">{check.desc}</p>
                </div>
                <div className="pt-0.5">{getStatusIcon(check.status)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Diagnostic Issues List */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">QA Issues & Warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {qaResult.issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-450">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                <p className="font-bold">QA Passed Successfully</p>
                <p className="text-[9.5px]">No broken forms, buttons, or checkout issues.</p>
              </div>
            ) : (
              qaResult.issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span>{issue.title}</span>
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
