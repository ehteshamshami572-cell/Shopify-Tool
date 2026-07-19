"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, ArrowRight, Activity, HelpCircle } from "lucide-react";

export default function SpeedPlannerView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const plannerResult = currentScan.modules.speedPlanner;
  const plannerData = plannerResult.data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Speed Optimization Planner</h2>
          <p className="text-xs text-slate-400">Projecting page performance upgrades after applying CSS, script, and image optimizations.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{plannerResult.score}/100</div>
      </div>

      {/* Target scores comparison */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 block font-bold uppercase">CURRENT PERFORMANCE</span>
          <span className="text-2xl font-black text-rose-500">{plannerData.performanceScore}</span>
        </div>

        <div className="p-4 bg-indigo-600 text-white rounded-xl text-center space-y-1 shadow-lg shadow-indigo-600/10">
          <span className="text-[10px] text-indigo-200 block font-bold uppercase">PROJECTED SPEED SCORE</span>
          <span className="text-2xl font-black text-teal-300">{plannerData.projectedScore}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 block font-bold uppercase">TOTAL METRICS GAIN</span>
          <span className="text-2xl font-black text-emerald-500">+{plannerData.estimatedGain} points</span>
        </div>
      </div>

      {/* Optimization Tasks List */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-indigo-500" />
            <span>Speed Optimization Tasks</span>
          </CardTitle>
          <CardDescription className="text-[11px]">Recommended action plan to optimize the critical rendering path.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-1 text-xs">
          {plannerData.optimizationTasks?.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No pending optimizations required.
            </div>
          ) : (
            plannerData.optimizationTasks.map((task: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 space-y-2"
              >
                <div className="flex items-center justify-between font-bold flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        task.impact === "high"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-extrabold uppercase"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-extrabold uppercase"
                      }
                    >
                      {task.impact} Impact
                    </Badge>
                    <span className="text-slate-800 dark:text-slate-200">{task.title}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-450 font-extrabold font-mono">
                    +{task.scoreBoost} Score Boost
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-normal">{task.description}</p>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-850">
                  <span className="font-bold text-slate-550 dark:text-slate-400">Implementation: </span>
                  {task.recommendation}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
