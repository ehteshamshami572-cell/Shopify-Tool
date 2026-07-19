"use client";

import React, { useState, useEffect } from "react";
import { useScanStore, ScanHistoryItem } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from "lucide-react";

export default function HealthMonitorView() {
  const recentScans = useScanStore((state) => state.recentScans);
  const currentScan = useScanStore((state) => state.currentScan);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [comparison, setComparison] = useState<any | null>(null);

  // Group scans by domain
  const domains = Array.from(new Set(recentScans.map((s) => s.domain)));

  useEffect(() => {
    if (currentScan && !selectedDomain) {
      setSelectedDomain(currentScan.domain);
    } else if (domains.length > 0 && !selectedDomain) {
      setSelectedDomain(domains[0]);
    }
  }, [currentScan, domains]);

  useEffect(() => {
    if (!selectedDomain) return;

    // Filter scans for selected domain, sort by scannedAt descending
    const domainScans = recentScans
      .filter((s) => s.domain === selectedDomain)
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());

    if (domainScans.length < 2) {
      setComparison(null);
      return;
    }

    const latest = domainScans[0];
    const previous = domainScans[1];

    // Compute differentials
    const scoreDiff = latest.overallScore - previous.overallScore;

    setComparison({
      latest,
      previous,
      scoreDiff,
    });
  }, [selectedDomain, recentScans]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Store Health Monitor</h2>
          <p className="text-xs text-slate-400">Comparing historical scan snapshots to identify theme changes, new scripts, and speed regressions.</p>
        </div>
        {domains.length > 0 && (
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs text-slate-100 font-semibold"
          >
            {domains.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Comparison card */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-indigo-500" />
              <span>Snapshot Comparison</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Compare current scorecards to the previous audit report.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 text-xs">
            {!comparison ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
                <Layers className="h-8 w-8 text-slate-400 opacity-60" />
                <p className="font-bold">Insufficient Scan History</p>
                <p className="text-[10px] max-w-xs">You need at least two scans for "{selectedDomain || 'this store'}" to view historical performance trends.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score delta */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">GRADE DIFFERENTIAL</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-350">
                      Score: {comparison.latest.overallScore} / 100
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {comparison.scoreDiff > 0 ? (
                      <div className="flex items-center gap-0.5 text-emerald-600 font-extrabold font-mono text-sm bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <ArrowUpRight className="h-4 w-4" />
                        <span>+{comparison.scoreDiff}</span>
                      </div>
                    ) : comparison.scoreDiff < 0 ? (
                      <div className="flex items-center gap-0.5 text-rose-600 font-extrabold font-mono text-sm bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <ArrowDownRight className="h-4 w-4" />
                        <span>{comparison.scoreDiff}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-750">
                        No Change
                      </span>
                    )}
                  </div>
                </div>

                {/* Timestamps details */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 border border-slate-100 dark:border-slate-850 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold block">LATEST AUDIT</span>
                    <span className="text-xs font-semibold text-slate-750 dark:text-slate-300">
                      {new Date(comparison.latest.scannedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 border border-slate-100 dark:border-slate-850 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold block">PREVIOUS AUDIT</span>
                    <span className="text-xs font-semibold text-slate-750 dark:text-slate-300">
                      {new Date(comparison.previous.scannedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts & Detections summary */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Monitor Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[10px] uppercase">STATUS INDICATOR</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                <span>Healthy Status</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Continuous monitor runs at scheduled intervals (daily/weekly) to ensure zero speed regressions or broken cart flows.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
