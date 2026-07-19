"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Sparkles, Terminal, Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const currentScan = useScanStore((state) => state.currentScan);
  const activeView = useScanStore((state) => state.activeView);
  const setActiveView = useScanStore((state) => state.setActiveView);

  const getTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Merchant Dashboard";
      case "scanner":
        return "Store Auditor Engine";
      case "seo":
        return "SEO Intelligence";
      case "apps":
        return "Third-Party App Detector";
      case "theme":
        return "Theme Structure Intelligence";
      case "pagespeed":
        return "Google PageSpeed Insights Metrics";
      case "images":
        return "Image Delivery Optimizer";
      case "accessibility":
        return "A11y Compliance Analyzer";
      case "csv_converter":
        return "Shopify Product CSV Converter";
      case "json_formatter":
        return "Developer JSON Beautifier";
      case "liquid_formatter":
        return "Shopify Liquid Template Formatter";
      case "dev_toolbox":
        return "Developer Toolbox & Verifiers";
      default:
        return "Shopify Developer Toolkit";
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{getTitle()}</h2>
        {currentScan && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-400">&bull;</span>
            <Badge variant="outline" className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
              <span>{currentScan.domain}</span>
            </Badge>
            {currentScan.isShopify && (
              <Badge className="bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 border border-teal-500/20 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="h-3 w-3" />
                Shopify Verified
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!currentScan && activeView !== "scanner" && (
          <button
            onClick={() => setActiveView("scanner")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-700/20 transition-all"
          >
            <span>Scan First Store</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
        {currentScan && activeView !== "scanner" && (
          <button
            onClick={() => setActiveView("scanner")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors bg-white dark:bg-slate-800 dark:text-indigo-400"
          >
            New Audit
          </button>
        )}
        <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          <Terminal className="h-3.5 w-3.5 text-teal-500" />
          <span className="font-mono text-[10px]">Merchant-Ready</span>
        </div>
      </div>
    </header>
  );
}
