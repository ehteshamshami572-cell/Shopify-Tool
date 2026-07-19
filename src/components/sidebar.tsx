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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const activeView = useScanStore((state) => state.activeView);
  const setActiveView = useScanStore((state) => state.setActiveView);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "scanner", label: "Store Scanner", icon: Search },
    { id: "seo", label: "SEO Analyzer", icon: Globe, requiresScan: true },
    { id: "apps", label: "App Detector", icon: Cpu, requiresScan: true },
    { id: "theme", label: "Theme Intelligence", icon: Palette, requiresScan: true },
    { id: "pagespeed", label: "PageSpeed Insights", icon: Gauge, requiresScan: true },
    { id: "images", label: "Image Optimizer", icon: ImageIcon, requiresScan: true },
    { id: "accessibility", label: "Accessibility Analyzer", icon: A11yIcon, requiresScan: true },
    { id: "csv_converter", label: "CSV Converter", icon: FileSpreadsheet },
    { id: "json_formatter", label: "JSON Formatter", icon: Braces },
    { id: "liquid_formatter", label: "Liquid Formatter", icon: Code2 },
    { id: "dev_toolbox", label: "Developer Toolbox", icon: Terminal },
  ];

  const currentScan = useScanStore((state) => state.currentScan);
  const hasScan = !!currentScan;

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out z-30 shrink-0",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <span>Shopify Toolkit</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <Sparkles className="h-5 w-5 text-teal-400" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-slate-900 border border-slate-700 text-slate-200 rounded-full p-1 hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isDisabled = item.requiresScan && !hasScan;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
              )}
              title={isDisabled ? "Scan a store first to unlock this analyzer" : item.label}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"
                )}
              />
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.requiresScan && !hasScan && (
                <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider scale-90 border border-slate-700">
                  Lock
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          v1.0.0 &bull; Developer Suite
        </div>
      )}
    </aside>
  );
}
