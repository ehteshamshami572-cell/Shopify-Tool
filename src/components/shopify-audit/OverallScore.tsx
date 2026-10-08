"use client";

import React from "react";
import { ShieldCheck, Calendar, Globe, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OverallScoreProps {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  storeUrl: string;
  isShopify: boolean;
  themeName?: string;
  scannedAt: string;
}

export function OverallScore({
  score,
  grade,
  storeUrl,
  isShopify,
  themeName,
  scannedAt,
}: OverallScoreProps) {
  // Determine color and status
  let scoreColor = "text-emerald-600";
  let strokeColor = "#10b981"; // emerald-500
  let bgColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let statusText = "Excellent Health";

  if (score < 50) {
    scoreColor = "text-rose-600";
    strokeColor = "#f43f5e"; // rose-500
    bgColor = "bg-rose-50 text-rose-700 border-rose-200";
    statusText = "Critical Attention Needed";
  } else if (score < 75) {
    scoreColor = "text-amber-600";
    strokeColor = "#f59e0b"; // amber-500
    bgColor = "bg-amber-50 text-amber-700 border-amber-200";
    statusText = "Needs Optimization";
  } else if (score < 90) {
    scoreColor = "text-blue-600";
    strokeColor = "#3b82f6"; // blue-500
    bgColor = "bg-blue-50 text-blue-700 border-blue-200";
    statusText = "Good Condition";
  }

  // Calculate SVG circular stroke offset
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const formattedDate = new Date(scannedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Store Metadata info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {isShopify ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold gap-1 px-2.5 py-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Shopify Store
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 text-xs font-semibold">
              Generic Store
            </Badge>
          )}

          {themeName && (
            <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50 text-xs">
              Theme: {themeName}
            </Badge>
          )}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 truncate flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-400 shrink-0" />
          <a
            href={storeUrl.startsWith("http") ? storeUrl : `https://${storeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 hover:underline transition-colors"
          >
            {storeUrl.replace(/^https?:\/\//i, "")}
          </a>
        </h2>

        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Audit generated on {formattedDate}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Performance (40%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            CRO (40%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            SEO (10%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            A11y (10%)
          </span>
        </div>
      </div>

      {/* Radial Score Gauge */}
      <div className="flex items-center gap-5 shrink-0 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress stroke */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={strokeColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold tracking-tight ${scoreColor}`}>
              {score}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 -mt-0.5">
              Grade {grade}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Health
          </span>
          <span className="text-base font-bold text-slate-900 mt-0.5">
            {score}/100
          </span>
          <div className={`mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgColor} text-center`}>
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
}
