"use client";

import React, { useState } from "react";
import { CROCategoryResult } from "@/types/shopify-audit";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Shield,
  Star,
  Compass,
  Smartphone,
  CreditCard,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CROOverviewProps {
  categories: Record<string, CROCategoryResult>;
  summary: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  messaging: MessageSquare,
  cta: Sparkles,
  productPresentation: Star,
  trust: Shield,
  socialProof: TrendingUp,
  navigation: Compass,
  mobileUX: Smartphone,
  checkoutFriction: CreditCard,
};

export function CROOverview({ categories, summary }: CROOverviewProps) {
  const categoryKeys = Object.keys(categories);
  const [selectedKey, setSelectedKey] = useState<string>(categoryKeys[0] || "");

  const activeCategory = categories[selectedKey] || Object.values(categories)[0];
  const Icon = CATEGORY_ICONS[selectedKey] || Sparkles;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header and Summary */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Conversion Rate Optimization (CRO) Heuristic Audit
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          {summary || "Evaluation of merchant conversion pathways across 8 critical buyer decision-making friction points."}
        </p>
      </div>

      {/* Category Selection Tabs / Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 border-b border-slate-100 pb-4">
        {categoryKeys.map((key) => {
          const cat = categories[key];
          const isSelected = key === selectedKey;
          const CatIcon = CATEGORY_ICONS[key] || Sparkles;

          let scoreBadgeColor = "text-emerald-700 bg-emerald-50";
          if (cat.score < 50) scoreBadgeColor = "text-rose-700 bg-rose-50";
          else if (cat.score < 75) scoreBadgeColor = "text-amber-700 bg-amber-50";

          return (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-500"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <CatIcon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? "text-emerald-600" : "text-slate-400"
                  }`}
                />
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${scoreBadgeColor}`}>
                  {cat.score}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold line-clamp-1 ${
                  isSelected ? "text-slate-900" : "text-slate-600"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Details Panel */}
      {activeCategory && (
        <div className="bg-slate-50/60 rounded-xl p-5 border border-slate-100 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-2xs border border-slate-200 text-slate-800">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {activeCategory.name}
                </h4>
                <span className="text-xs text-slate-500">
                  Score: {activeCategory.score}/100 • Grade{" "}
                  {activeCategory.status === "excellent" || activeCategory.status === "good"
                    ? "A"
                    : activeCategory.status === "needs_improvement"
                    ? "C"
                    : "F"}
                </span>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`text-xs font-semibold ${
                activeCategory.status === "excellent" || activeCategory.status === "good"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : activeCategory.status === "needs_improvement"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {activeCategory.status === "excellent" || activeCategory.status === "good"
                ? "Optimized"
                : activeCategory.status === "needs_improvement"
                ? "Needs Attention"
                : "High Friction"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Findings List */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Audit Findings & Observations
              </h5>
              <ul className="space-y-2">
                {(activeCategory.findings || []).map((finding: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations List */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Targeted Fixes & Recommendations
              </h5>
              <ul className="space-y-2">
                {(activeCategory.recommendations || []).map((rec: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
