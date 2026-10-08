"use client";

import React from "react";
import { Zap, Sparkles, Globe, Eye, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CategoryScoreCardProps {
  title: string;
  score: number;
  grade: string;
  weight: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "emerald" | "blue" | "purple" | "amber";
}

function CategoryCard({
  title,
  score,
  grade,
  weight,
  description,
  icon: Icon,
  accentColor,
}: CategoryScoreCardProps) {
  // Score color styles
  const isHigh = score >= 80;
  const isMed = score >= 60 && score < 80;

  const badgeColor = isHigh
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isMed
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-rose-50 text-rose-700 border-rose-200";

  const barColor = isHigh
    ? "bg-emerald-500"
    : isMed
    ? "bg-amber-500"
    : "bg-rose-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{title}</h4>
              <span className="text-[11px] text-slate-400 font-medium">Weight: {weight}</span>
            </div>
          </div>

          <div className={`px-2 py-0.5 rounded-md text-xs font-bold border ${badgeColor}`}>
            Grade {grade}
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-3 mb-1.5">
          <span className="text-2xl font-black text-slate-900">{score}</span>
          <span className="text-xs text-slate-400 font-medium">out of 100</span>
        </div>

        {/* Custom progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface CategoryScoreProps {
  performanceScore: number;
  performanceGrade: string;
  croScore: number;
  croGrade: string;
  seoScore: number;
  seoGrade: string;
  accessibilityScore: number;
  accessibilityGrade: string;
}

export function CategoryScore({
  performanceScore,
  performanceGrade,
  croScore,
  croGrade,
  seoScore,
  seoGrade,
  accessibilityScore,
  accessibilityGrade,
}: CategoryScoreProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CategoryCard
        title="Performance"
        score={performanceScore}
        grade={performanceGrade}
        weight="40%"
        description="Speed metrics, Core Web Vitals, server response times, and asset payload weights."
        icon={Zap}
        accentColor="emerald"
      />
      <CategoryCard
        title="CRO & Conversion"
        score={croScore}
        grade={croGrade}
        weight="40%"
        description="Purchase funnel clarity, CTA contrast, trust indicators, reviews, and mobile UX flow."
        icon={Sparkles}
        accentColor="blue"
      />
      <CategoryCard
        title="SEO & Indexing"
        score={seoScore}
        grade={seoGrade}
        weight="10%"
        description="Meta tags, canonicals, OpenGraph properties, semantic headings, and crawler visibility."
        icon={Globe}
        accentColor="purple"
      />
      <CategoryCard
        title="Accessibility"
        score={accessibilityScore}
        grade={accessibilityGrade}
        weight="10%"
        description="Color contrast ratios, tap target sizing, image alt texts, and aria attributes."
        icon={Eye}
        accentColor="amber"
      />
    </div>
  );
}
