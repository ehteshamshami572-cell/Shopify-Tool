"use client";

import React, { useState } from "react";
import { AuditRoadmap, RoadmapItem } from "@/types/shopify-audit";
import { Zap, Target, Calendar, Rocket, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoadmapProps {
  roadmap: AuditRoadmap;
}

export function Roadmap({ roadmap }: RoadmapProps) {
  const [activeTab, setActiveTab] = useState<"quickWins" | "highImpact" | "shortTerm" | "longTerm">("quickWins");

  const tabs = [
    {
      id: "quickWins" as const,
      label: "Quick Wins",
      icon: Zap,
      count: roadmap.quickWins.length,
      timeframe: "Under 2 hours",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "highImpact" as const,
      label: "High Impact",
      icon: Rocket,
      count: roadmap.highImpact.length,
      timeframe: "1 - 3 days",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "shortTerm" as const,
      label: "Short-Term Sprint",
      icon: Target,
      count: roadmap.shortTerm.length,
      timeframe: "1 - 2 weeks",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "longTerm" as const,
      label: "Long-Term Strategic",
      icon: Calendar,
      count: roadmap.longTerm.length,
      timeframe: "1+ months",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  const currentItems: RoadmapItem[] = roadmap[activeTab] || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Rocket className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Prioritized Implementation Roadmap
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Actionable sprint schedule organized by execution velocity and ROI
        </p>
      </div>

      {/* Roadmap Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
          <span className="font-medium">
            Showing {currentItems.length} tasks for{" "}
            <strong className="text-slate-800">
              {tabs.find((t) => t.id === activeTab)?.label}
            </strong>
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Estimated effort: {tabs.find((t) => t.id === activeTab)?.timeframe}
          </span>
        </div>

        {currentItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">
              No pending tasks in this sprint phase
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] font-semibold text-slate-600 border-slate-200">
                      Step {idx + 1}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {item.impact} impact
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.effort} effort
                      </span>
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-slate-900 mb-1">
                    {item.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.solution || item.description || item.problem || "Implement recommended architectural optimization."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
