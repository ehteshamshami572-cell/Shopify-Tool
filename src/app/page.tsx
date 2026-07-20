"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import DashboardView from "@/components/dashboard-view";
import ScannerView from "@/components/scanner-view";
import SeoView from "@/components/seo-view";
import AppsView from "@/components/apps-view";
import ThemeView from "@/components/theme-view";
import PageSpeedView from "@/components/pagespeed-view";
import ImagesView from "@/components/images-view";
import AccessibilityView from "@/components/accessibility-view";
import QaView from "@/components/qa-view";
import BenchmarkView from "@/components/benchmark-view";
import AppCostView from "@/components/app-cost-view";
import CroView from "@/components/cro-view";
import SpeedPlannerView from "@/components/speed-planner-view";
import HealthMonitorView from "@/components/health-monitor-view";
import DevToolboxView from "@/components/dev-toolbox-view";
import ReportsView from "@/components/reports-view";
import SettingsView from "@/components/settings-view";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useScanStore } from "@/store/useScanStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const activeView = useScanStore((state) => state.activeView);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "scanner":
        return <ScannerView />;
      case "seo":
        return <SeoView />;
      case "apps":
        return <AppsView />;
      case "theme":
        return <ThemeView />;
      case "pagespeed":
        return <PageSpeedView />;
      case "images":
        return <ImagesView />;
      case "accessibility":
        return <AccessibilityView />;
      case "qa":
        return <QaView />;
      case "benchmark":
        return <BenchmarkView />;
      case "app_cost":
        return <AppCostView />;
      case "cro":
        return <CroView />;
      case "speed_planner":
        return <SpeedPlannerView />;
      case "health_monitor":
        return <HealthMonitorView />;
      case "dev_toolbox":
        return <DevToolboxView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090B] font-sans">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Dynamic Views Viewport with Framer Motion Page Transitions */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#09090B] scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
