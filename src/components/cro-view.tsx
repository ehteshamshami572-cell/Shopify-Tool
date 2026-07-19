"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export default function CroView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const croResult = currentScan.modules.cro;
  const croData = croResult.data;

  const checklistItems = [
    { label: "Product Review Integration", status: croData.hasReviews, desc: "Displays visitor testimonials and star scores dynamically." },
    { label: "Trust & Security Badges", status: croData.hasTrustBadges, desc: "Promotes visitor check-out confidence with guarantee text." },
    { label: "Clear Return & Shipping Link", status: croData.hasReturnsPolicy, desc: "Enforces shopper clarity on shipping rates and policies." },
    { label: "Cart AOV Progress Bars", status: croData.hasFreeShippingProgress, desc: "Increases average order value metrics with thresholds." },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Conversion Rate Optimization</h2>
          <p className="text-xs text-slate-400">Auditing trust parameters, cart values modifiers, reviews presence, and checkout friction.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{croResult.score}/100</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* CRO Checklist */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
              <span>Conversion Audit Checklist</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Audit verification status of customer experience factors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-xs">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-350">{item.label}</span>
                  <p className="text-[11.5px] text-slate-500 leading-normal">{item.desc}</p>
                </div>
                <div className="pt-0.5">
                  {item.status ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Dynamic ROI Forecast Card */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
              <span>Revenue Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 text-center border border-emerald-500/20 space-y-1 text-emerald-600 dark:text-emerald-450">
              <span className="text-[10px] text-slate-400 block font-bold">EST. REVENUE INCREASE</span>
              <span className="text-2xl font-black">{croData.revenueBoost}</span>
            </div>

            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Based on the missing elements (reviews, trust symbols, return accessibility links), resolving these warnings can increase storefront check-out conversions by up to the estimated amount.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action items checklist */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Conversion Optimization Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-1 text-xs">
          {croResult.recommendations.map((rec: string, index: number) => (
            <div
              key={index}
              className="flex gap-2 p-2.5 rounded-lg bg-indigo-50/10 dark:bg-slate-950/20 border border-indigo-500/10 text-xs text-slate-650 dark:text-slate-400 leading-normal"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
