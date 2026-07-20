"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useScanStore } from "@/store/useScanStore";
import {
  LayoutDashboard,
  Search,
  Globe,
  Cpu,
  Palette,
  Gauge,
  Image as ImageIcon,
  Accessibility as A11yIcon,
  Play,
  BarChart3,
  DollarSign,
  Zap,
  Sparkles,
  Terminal,
  Activity,
  FileSpreadsheet,
  Settings,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const setActiveView = useScanStore((state) => state.setActiveView);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (viewId: string) => {
    setActiveView(viewId);
    setOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", category: "Navigation", icon: LayoutDashboard },
    { id: "scanner", label: "Store Scanner", category: "Navigation", icon: Search },
    { id: "qa", label: "QA Automation", category: "Analyzers", icon: Play },
    { id: "benchmark", label: "Store Benchmark", category: "Analyzers", icon: BarChart3 },
    { id: "app_cost", label: "App Cost Analysis", category: "Analyzers", icon: DollarSign },
    { id: "seo", label: "SEO Manager", category: "Analyzers", icon: Globe },
    { id: "speed_planner", label: "Speed Optimization", category: "Analyzers", icon: Zap },
    { id: "images", label: "Image Optimizer", category: "Analyzers", icon: ImageIcon },
    { id: "cro", label: "CRO Analyzer", category: "Analyzers", icon: Sparkles },
    { id: "apps", label: "App Detector", category: "Analyzers", icon: Cpu },
    { id: "theme", label: "Theme Intelligence", category: "Analyzers", icon: Palette },
    { id: "dev_toolbox", label: "Developer Toolbox", category: "Developer Tools", icon: Terminal },
    { id: "health_monitor", label: "Store Health Monitor", category: "Monitoring", icon: Activity },
    { id: "reports", label: "Executive Reports", category: "Tools", icon: FileSpreadsheet },
    { id: "settings", label: "Settings & Config", category: "Tools", icon: Settings },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#121215] text-slate-100 shadow-2xl overflow-hidden"
          >
            <Command className="w-full">
              <div className="flex items-center border-b border-slate-800 px-4">
                <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
                <Command.Input
                  placeholder="Type a command or search tools (e.g. SEO, Image, QA)..."
                  className="w-full h-12 bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs scrollbar-thin">
                <Command.Empty className="py-6 text-center text-slate-500 text-xs">
                  No matching tools found.
                </Command.Empty>

                <Command.Group heading="Actions" className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500">
                  <Command.Item
                    onSelect={() => runCommand("scanner")}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors"
                  >
                    <Search className="h-4 w-4 text-indigo-400" />
                    <span>Run New Store Audit</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="All Suite Modules" className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 mt-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        onSelect={() => runCommand(item.id)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                          <span>{item.label}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 group-hover:text-indigo-200 font-bold uppercase">{item.category}</span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between border-t border-slate-850 px-4 py-2 text-[10px] text-slate-500 bg-slate-950/40">
                <span>Use ↑ ↓ to navigate</span>
                <span>ESC to close</span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
