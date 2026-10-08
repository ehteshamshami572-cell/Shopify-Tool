"use client";

import React from "react";
import { AuditRecommendation } from "@/types/shopify-audit";
import { Sparkles, ArrowRight, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendationListProps {
  recommendations: AuditRecommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Strategic Recommendations ({recommendations.length})
          </h3>
          <p className="text-xs text-slate-500">
            Action items synthesized to maximize average order value (AOV) and conversion rate
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isHighPriority = rec.priority === "P1" || rec.priority === 1;
          const displayImpact = rec.expectedImpact || rec.impact || "High";
          const displayBody = rec.recommendation || rec.description || rec.problem || "";

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isHighPriority
                  ? "bg-slate-50/70 border-emerald-200 shadow-2xs"
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-5 px-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {rec.priority}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200 capitalize">
                      {rec.category || "CRO"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {displayImpact}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  {rec.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {displayBody}
                </p>

                {rec.problem && rec.recommendation && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg mb-2">
                    <strong className="text-slate-700 font-semibold">Problem: </strong>
                    {rec.problem}
                  </div>
                )}
              </div>

              {rec.actionableSteps && rec.actionableSteps.length > 0 && (
                <div className="border-t border-slate-100 pt-3 mt-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Implementation Steps:
                  </span>
                  <ul className="space-y-1">
                    {rec.actionableSteps.map((step: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
