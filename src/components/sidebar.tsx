"use client";

import React, { useState } from "react";
import { useScanStore } from "@/store/useScanStore";
import {
  LayoutDashboard,
  Search,
  Globe,
  Cpu,
  Palette,
  Gauge,
  Accessibility as A11yIcon,
  Image as ImageIcon,
  FileSpreadsheet,
  Braces,
  Code2,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  BarChart3,
  DollarSign,
  Zap,
  Activity,
  ChevronDown,
  User,
  Check,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const activeView = useScanStore((state) => state.activeView);
  const setActiveView = useScanStore((state) => state.setActiveView);
  const [collapsed, setCollapsed] = useState(false);

  const currentScan = useScanStore((state) => state.currentScan);
  const hasScan = !!currentScan;

  interface SidebarItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    requiresScan?: boolean;
    showArrow?: boolean;
  }

  const sections: { title: string; items: SidebarItem[] }[] = [
    {
      title: "ANALYZE & OPTIMIZE",
      items: [
        { id: "qa", label: "QA Automation", icon: Play, requiresScan: true },
        { id: "benchmark", label: "Store Benchmark", icon: BarChart3, requiresScan: true },
        { id: "app_cost", label: "App Cost Analysis", icon: DollarSign, requiresScan: true },
        { id: "seo", label: "SEO Manager", icon: Globe, requiresScan: true },
        { id: "speed_planner", label: "Speed Optimization", icon: Zap, requiresScan: true },
        { id: "images", label: "Image Optimizer", icon: ImageIcon, requiresScan: true },
        { id: "cro", label: "CRO Analyzer", icon: Sparkles, requiresScan: true },
        { id: "apps", label: "App Detector", icon: Cpu, requiresScan: true },
        { id: "theme", label: "Theme Intelligence", icon: Palette, requiresScan: true },
      ]
    },
    {
      title: "DEVELOPER TOOLS",
      items: [
        { id: "dev_toolbox", label: "Developer Toolbox", icon: Terminal, showArrow: true },
      ]
    },
    {
      title: "MONITOR & TRACK",
      items: [
        { id: "health_monitor", label: "Store Health Monitor", icon: Activity },
      ]
    }
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-800 bg-[#0B0F19] text-slate-100 transition-all duration-300 ease-in-out z-30 shrink-0 h-screen select-none",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Top Header Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
          <div className="p-1.5 bg-emerald-500 rounded-lg text-white font-black text-xs shadow-md shadow-emerald-500/20">
            S
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[13px] tracking-tight">Shopify Toolkit</span>
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[9px] px-1 py-0 rounded scale-90">
                  Pro
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Developer & Merchant Suite</span>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation scroll area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
        {/* Dashboard Link */}
        <button
          onClick={() => setActiveView("dashboard")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all group",
            activeView === "dashboard"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {/* Sections loop */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            {!collapsed && (
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 block px-3">
                {section.title}
              </span>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const isDisabled = item.requiresScan && !hasScan;

                return (
                  <button
                    key={item.id}
                    disabled={isDisabled}
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all group relative",
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
                      isDisabled && "opacity-35 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                    )}
                    title={isDisabled ? "Scan a store first to unlock this analyzer" : item.label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                    {!collapsed && item.showArrow && (
                      <ChevronRight className="h-3 w-3 text-slate-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Upgrade to Pro Card */}
        {!collapsed && (
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-3 relative overflow-hidden mt-6 shadow-lg shadow-indigo-950/20">
            <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full bg-indigo-550/10 blur-xl pointer-events-none" />
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>Upgrade to Pro</span>
            </h4>
            <ul className="space-y-1 text-[10px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Unlimited Scans</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Scheduled Monitoring</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Advanced Reports</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Priority Support</span>
              </li>
            </ul>
            <button className="w-full h-8 rounded-lg bg-indigo-600 hover:bg-indigo-750 transition-colors text-[10px] font-extrabold text-white shadow-md shadow-indigo-600/10">
              Upgrade Now 🚀
            </button>
          </div>
        )}
      </div>

      {/* User profile footer block */}
      <div className="p-3 border-t border-slate-900 shrink-0 space-y-2 bg-slate-950/40">
        {!collapsed && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/30 border border-slate-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-slate-200">John Developer</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Pro Plan</span>
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-550 cursor-pointer" />
          </div>
        )}

        {/* Toggle Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
