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
    <header className="flex h-16 w-full items-center justify-between px-6 border-b border-slate-200 bg-white text-slate-800 sticky top-0 z-20 select-none">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-left">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suite</span>
        <span className="text-slate-350">/</span>
        <h1 className="text-sm font-extrabold text-slate-900">{getTitle()}</h1>
        
        {currentScan && (
          <div className="hidden lg:flex items-center gap-2 border border-slate-200 bg-slate-50 px-2.5 py-1 rounded-lg text-xs ml-3">
            <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700 text-[11px]">{currentScan.domain}</span>
          </div>
        )}
      </div>

      {/* Right Controls Block */}
      <div className="flex items-center gap-3">
        {/* Direct Try Now CTA Action */}
        <button
          onClick={() => setActiveView("scanner")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
        >
          <span>Try Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* User profile bubble */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 border border-indigo-250 text-indigo-650 font-extrabold text-xs">
          ST
        </div>
      </div>
    </header>
  );
}
