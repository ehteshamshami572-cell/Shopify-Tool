"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { generatePdfReport } from "@/lib/pdf-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Share2, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ReportsView() {
  const currentScan = useScanStore((state) => state.currentScan);
  const recentScans = useScanStore((state) => state.recentScans);

  const handlePdfDownload = () => {
    if (!currentScan) {
      toast.error("No active scan data available to export.");
      return;
    }
    generatePdfReport(currentScan);
    toast.success("Executive PDF Report generated and downloaded!");
  };

  const handleJsonExport = () => {
    if (!currentScan) return;
    const blob = new Blob([JSON.stringify(currentScan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_report_${currentScan.domain}.json`;
    a.click();
    toast.success("JSON Audit Data exported successfully!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            <span>Executive Reports & Exports</span>
          </h2>
          <p className="text-xs text-slate-400">Generate white-label PDF audit scorecards and raw diagnostic JSON payloads.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleJsonExport}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={handlePdfDownload}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-1.5 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main preview */}
        <Card className="border-slate-800 md:col-span-2 shadow-sm bg-[#121215] text-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Active Audit Summary</CardTitle>
            <CardDescription className="text-[11px] text-slate-400">Preview report details for target store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 text-xs">
            {!currentScan ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <FileText className="h-8 w-8 mx-auto opacity-40" />
                <p className="font-bold">No Active Audit Loaded</p>
                <p className="text-[10px]">Scan a store first to generate instant client-ready reports.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-950 border border-slate-850 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block">STORE DOMAIN</span>
                    <span className="text-sm font-bold text-slate-200">{currentScan.domain}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block">OVERALL SCORE</span>
                    <span className="text-xl font-black text-emerald-400">{currentScan.scores.overall}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 border border-slate-850 bg-slate-950/40 rounded-lg">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">DETECTED APPS</span>
                    <span className="text-sm font-extrabold text-slate-200">{currentScan.metadata.detectedApps.length} Apps</span>
                  </div>
                  <div className="p-3 border border-slate-850 bg-slate-950/40 rounded-lg">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">TOTAL ISSUES</span>
                    <span className="text-sm font-extrabold text-amber-400">{currentScan.allIssues.length} Items</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History log */}
        <Card className="border-slate-800 md:col-span-1 shadow-sm bg-[#121215] text-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Recent Report Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-xs">
            {recentScans.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-[11px]">No saved audit history.</div>
            ) : (
              recentScans.slice(0, 5).map((scan, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-850 bg-slate-950/40 space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="truncate text-slate-200">{scan.domain}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold">
                      {scan.overallScore}
                    </Badge>
                  </div>
                  <span className="text-[9px] text-slate-500 block">{new Date(scan.scannedAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
