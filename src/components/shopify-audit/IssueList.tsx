"use client";

import React, { useState } from "react";
import { CriticalIssue } from "@/types/shopify-audit";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IssueListProps {
  issues: CriticalIssue[];
}

export function IssueList({ issues }: IssueListProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const getEffectiveSeverity = (issue: CriticalIssue): string => {
    return issue.severity || (issue.impact === "high" ? "high" : issue.impact === "low" ? "low" : "medium");
  };

  const filteredIssues = issues.filter((issue) => {
    if (selectedSeverity === "all") return true;
    return getEffectiveSeverity(issue) === selectedSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-bold gap-1">
            <AlertCircle className="w-3 h-3" /> Critical
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold gap-1">
            <AlertTriangle className="w-3 h-3" /> High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold gap-1">
            <Info className="w-3 h-3" /> Medium
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50 text-xs">
            Low
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Detected Friction Points & Bottlenecks ({issues.length})
          </h3>
          <p className="text-xs text-slate-500">
            Issues impacting your conversion funnel and search performance rankings
          </p>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
          {["all", "critical", "high", "medium"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedSeverity(lvl)}
              className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                selectedSeverity === lvl
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-slate-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">No issues found in this category</p>
          <p className="text-xs text-slate-400">Everything looks great according to these criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="py-4 first:pt-2 last:pb-0 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(getEffectiveSeverity(issue))}
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {issue.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>
                    Impact: <strong className="text-slate-700 capitalize">{issue.impact}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Effort: <strong className="text-slate-700 capitalize">{issue.effort}</strong>
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                {issue.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {issue.description}
              </p>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-slate-700">
                <strong className="text-emerald-800 font-semibold block mb-0.5">
                  Suggested Action:
                </strong>
                {issue.solution || "Implement optimizations directly in the Shopify theme code or consult app configuration."}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
