"use client";

import React from "react";
import { PerformanceAudit } from "@/types/shopify-audit";
import { Smartphone, Monitor, ArrowDownCircle, Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PerformanceOverviewProps {
  performance: PerformanceAudit;
}

export function PerformanceOverview({ performance }: PerformanceOverviewProps) {
  const { mobileScore, desktopScore, topOpportunities, diagnostics } = performance;

  return (
    <div className="space-y-6">
      {/* Device Score Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mobile Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Mobile Experience
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {mobileScore >= 80 ? "Fast Mobile Store" : mobileScore >= 50 ? "Average Mobile Speed" : "Slow on Mobile Devices"}
              </h4>
              <span className="text-xs text-slate-500">Accounts for ~75% of Shopify traffic</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-3xl font-black ${
                mobileScore >= 80
                  ? "text-emerald-600"
                  : mobileScore >= 50
                  ? "text-amber-600"
                  : "text-rose-600"
              }`}
            >
              {mobileScore}
            </span>
            <span className="text-xs text-slate-400 block font-medium">/ 100</span>
          </div>
        </div>

        {/* Desktop Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Desktop Experience
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {desktopScore >= 80 ? "High Performance" : desktopScore >= 50 ? "Moderate Desktop Speed" : "Desktop Bottlenecks Detected"}
              </h4>
              <span className="text-xs text-slate-500">High checkout conversion device</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-3xl font-black ${
                desktopScore >= 80
                  ? "text-emerald-600"
                  : desktopScore >= 50
                  ? "text-amber-600"
                  : "text-rose-600"
              }`}
            >
              {desktopScore}
            </span>
            <span className="text-xs text-slate-400 block font-medium">/ 100</span>
          </div>
        </div>
      </div>

      {/* Top Optimization Opportunities */}
      {topOpportunities && topOpportunities.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowDownCircle className="w-4 h-4 text-emerald-600" />
                PageSpeed Optimization Opportunities
              </h3>
              <p className="text-xs text-slate-500">
                Direct fixes that reduce page load times and improve Core Web Vitals
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {topOpportunities.map((opp, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-slate-800">
                    {opp.title}
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {opp.estimatedSavings && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0 text-xs font-semibold">
                    Save {opp.estimatedSavings}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostics */}
      {diagnostics && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500" />
              Store Asset Diagnostics & Resource Weight
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated parameters indicating storefront resource efficiency and execution latency
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[11px] text-slate-500 block font-medium">Total Blocking Time</span>
              <span className="text-sm font-bold text-slate-800">{diagnostics.totalBlockingTime}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[11px] text-slate-500 block font-medium">Time to Interactive</span>
              <span className="text-sm font-bold text-slate-800">{diagnostics.interactive}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[11px] text-slate-500 block font-medium">Active Scripts</span>
              <span className="text-sm font-bold text-slate-800">{diagnostics.scriptCount} files</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[11px] text-slate-500 block font-medium">Page Images</span>
              <span className="text-sm font-bold text-slate-800">{diagnostics.imageCount} elements</span>
            </div>
          </div>

          {diagnostics.potentialContributors && diagnostics.potentialContributors.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Potential Latency Contributors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {diagnostics.potentialContributors.map((c, i) => (
                  <Badge key={i} variant="outline" className="text-xs text-slate-600 bg-slate-50">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
