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
  Settings,
  FileText,
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
        { id: "scanner", label: "Store Scanner", icon: Search },
        { id: "qa", label: "QA Automation", icon: Play, requiresScan: true },
        { id: "benchmark", label: "Store Benchmark", icon: BarChart3, requiresScan: true },
        { id: "app_cost", label: "App Cost Analyzer", icon: DollarSign, requiresScan: true },
        { id: "seo", label: "SEO Manager", icon: Globe, requiresScan: true },
        { id: "speed_planner", label: "Speed Optimization Planner", icon: Zap, requiresScan: true },
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
      title: "MONITOR & MANAGEMENT",
      items: [
        { id: "health_monitor", label: "Store Health Monitor", icon: Activity },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "settings", label: "Settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200 bg-white text-slate-800 transition-all duration-300 ease-in-out z-30 shrink-0 h-screen select-none",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Top Header Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-slate-100 shrink-0">
        <div
          onClick={() => setActiveView("landing")}
          className="flex items-center gap-2 font-bold text-sm text-slate-800 cursor-pointer hover:opacity-85 transition-opacity"
        >
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white font-black text-xs shadow-md shadow-indigo-600/20">
            S
          </div>
          {!collapsed && (
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">Shopify Toolkit</span>
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded">
                  PRO
                </Badge>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">Enterprise Suite</span>
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
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all group",
            activeView === "dashboard"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {/* Sections loop */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5 text-left">
            {!collapsed && (
              <span className="text-[11px] font-bold tracking-wider text-slate-400 block px-3 uppercase">
                {section.title}
              </span>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const isDisabled = !!item.requiresScan && !hasScan;

                return (
                  <button
                    key={item.id}
                    disabled={isDisabled}
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all group relative",
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
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
      </div>

      {/* User profile footer block */}
      <div className="p-3 border-t border-slate-100 shrink-0 space-y-2 bg-white">
        {!collapsed && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-150">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 text-slate-655 rounded-full border border-slate-200">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900">Developer</span>
                <span className="text-[11px] text-slate-500 font-medium uppercase">Enterprise</span>
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-500 cursor-pointer" />
          </div>
        )}

        {/* Toggle Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
