"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Bell, Moon, Sun, ArrowRight, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const currentScan = useScanStore((state) => state.currentScan);
  const activeView = useScanStore((state) => state.activeView);
  const setActiveView = useScanStore((state) => state.setActiveView);

  return (
    <header className="flex h-20 w-full items-center justify-between px-8 border-b border-slate-900 bg-[#0B0F19] text-slate-100 sticky top-0 z-20 select-none">
      {/* Greetings Block */}
      <div className="flex flex-col text-left">
        <h1 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 leading-tight">
          <span>Welcome back, John!</span>
          <span>👋</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">
          Here's what's happening with your store performance.
        </p>
      </div>

      {/* Right Controls Block */}
      <div className="flex items-center gap-4.5">
        {/* Scanned domain info if exists */}
        {currentScan && (
          <div className="hidden lg:flex items-center gap-2 border border-slate-800 bg-slate-950/40 px-3 py-1.5 rounded-lg text-xs">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300">{currentScan.domain}</span>
            {currentScan.isShopify && (
              <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                SHOPIFY VERIFIED
              </Badge>
            )}
          </div>
        )}

        {/* New Scan button */}
        <button
          onClick={() => setActiveView("scanner")}
          className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
        >
          <span>New Scan</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* Theme mode toggle mock */}
        <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-950/20 border border-slate-900 rounded-lg transition-colors cursor-pointer">
          <Moon className="h-4 w-4" />
        </button>

        {/* Notification bell mock */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 bg-slate-950/20 border border-slate-900 rounded-lg transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
            3
          </span>
        </button>

        {/* User profile bubble mock */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold text-xs shadow-md shadow-indigo-600/10">
          JD
        </div>
      </div>
    </header>
  );
}
