"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Info, Clock, Zap, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface IssueCardProps {
  id?: string;
  severity: "critical" | "warning" | "info";
  category?: string;
  title: string;
  description: string;
  recommendation?: string;
  estimatedFixTime?: string;
  businessImpact?: string;
}

export function IssueCard({
  severity,
  category,
  title,
  description,
  recommendation,
  estimatedFixTime = "15-30 mins",
  businessImpact = "Moderate speed & conversion impact",
}: IssueCardProps) {
  const getSeverityIcon = () => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />;
      case "warning":
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  const getSeverityBadge = () => {
    switch (severity) {
      case "critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const copyFix = () => {
    if (recommendation) {
      navigator.clipboard.writeText(recommendation);
      toast.success("Fix recommendation copied to clipboard!");
    }
  };

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-[#121215] space-y-3 text-xs text-slate-100 select-none hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {getSeverityIcon()}
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-100 text-xs">{title}</span>
              <Badge className={`${getSeverityBadge()} text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase border`}>
                {severity}
              </Badge>
              {category && (
                <span className="text-[9px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded uppercase">
                  {category}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">{description}</p>
          </div>
        </div>
      </div>

      {/* Fix parameters */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-900 pt-2.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-indigo-400" />
          <span>Est. Fix Time: <strong className="text-slate-200 font-bold">{estimatedFixTime}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-amber-400" />
          <span>Impact: <strong className="text-slate-200 font-bold">{businessImpact}</strong></span>
        </div>
      </div>

      {/* Action Recommendation */}
      {recommendation && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/10 text-[10.5px] text-indigo-300">
          <span className="truncate pr-2"><strong>Fix:</strong> {recommendation}</span>
          <button
            onClick={copyFix}
            className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold shrink-0 transition-colors"
          >
            Copy Fix
          </button>
        </div>
      )}
    </div>
  );
}
