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
import CsvConverterView from "@/components/csv-converter-view";
import JsonFormatterView from "@/components/json-formatter-view";
import LiquidFormatterView from "@/components/liquid-formatter-view";
import DevToolboxView from "@/components/dev-toolbox-view";
import { useScanStore } from "@/store/useScanStore";

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
      case "csv_converter":
        return <CsvConverterView />;
      case "json_formatter":
        return <JsonFormatterView />;
      case "liquid_formatter":
        return <LiquidFormatterView />;
      case "dev_toolbox":
        return <DevToolboxView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Dynamic Views Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/40 scrollbar-thin">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
