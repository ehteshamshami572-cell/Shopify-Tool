"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Bell, Moon, Sun, ArrowRight, Activity, ShieldCheck, Search, Command } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const currentScan = useScanStore((state) => state.currentScan);
  const activeView = useScanStore((state) => state.activeView);
  const setActiveView = useScanStore((state) => state.setActiveView);

  const getTitle = () => {
    switch (activeView) {
      case "dashboard": return "Dashboard";
      case "scanner": return "Store Auditor Engine";
      case "seo": return "SEO Manager";
      case "apps": return "App Detector";
      case "theme": return "Theme Intelligence";
      case "pagespeed": return "PageSpeed Metrics";
      case "images": return "Image Optimizer";
      case "accessibility": return "Accessibility Analyzer";
      case "qa": return "QA Automation";
      case "benchmark": return "Store Benchmark";
      case "app_cost": return "App Cost Analyzer";
      case "cro": return "CRO Analyzer";
      case "speed_planner": return "Speed Optimization Planner";
      case "health_monitor": return "Store Health Monitor";
      case "dev_toolbox": return "Developer Toolbox";
      case "reports": return "Executive Reports";
      case "settings": return "Settings";
      default: return "Shopify Toolkit";
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between px-6 border-b border-slate-800 bg-[#09090B] text-slate-100 sticky top-0 z-20 select-none">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-left">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suite</span>
        <span className="text-slate-700">/</span>
        <h1 className="text-sm font-extrabold text-slate-100">{getTitle()}</h1>
        
        {currentScan && (
          <div className="hidden lg:flex items-center gap-2 border border-slate-800 bg-slate-950/40 px-2.5 py-1 rounded-lg text-xs ml-3">
            <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300 text-[11px]">{currentScan.domain}</span>
          </div>
        )}
      </div>

      {/* Right Controls Block */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
            document.dispatchEvent(event);
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px]">Search commands...</span>
          <kbd className="font-mono text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
        </button>

        {/* Quick Scan action */}
        <button
          onClick={() => setActiveView("scanner")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/15 transition-all"
        >
          <span>New Scan</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* User profile bubble */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold text-xs">
          ST
        </div>
      </div>
    </header>
  );
}
