"use client";

import React, { useState } from "react";
import { useScanStore } from "@/store/useScanStore";
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  Globe,
  Cpu,
  Palette,
  Gauge,
  Image as ImageIcon,
  Accessibility as A11yIcon,
  HelpCircle,
  Play,
  BarChart3,
  DollarSign,
  Zap,
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  Check,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardView() {
  const currentScan = useScanStore((state) => state.currentScan);
  const setActiveView = useScanStore((state) => state.setActiveView);
  const [scanInputUrl, setScanInputUrl] = useState("");

  const triggerScan = () => {
    if (!scanInputUrl.trim()) return;
    // Set view to scanner page and trigger scan
    setActiveView("scanner");
  };

  // Mock data matching the user's mockup image if no scan exists
  const displayData = currentScan || {
    domain: "your-store.myshopify.com",
    scannedAt: "May 12, 2025 at 10:30 AM",
    scores: {
      overall: 82,
      pagespeed: 78,
      seo: 88,
      cro: 74,
      accessibility: 91,
    },
    metadata: {
      themeName: "Dawn Theme",
      themeId: "13567890",
    }
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" };
    if (score >= 80) return { label: "Good", color: "text-emerald-450", border: "border-emerald-500/20", bg: "bg-emerald-500/10" };
    if (score >= 60) return { label: "Needs Improvement", color: "text-amber-450", border: "border-amber-500/20", bg: "bg-amber-500/10" };
    return { label: "Average", color: "text-orange-450", border: "border-orange-500/20", bg: "bg-orange-500/10" };
  };

  const dashboardTools = [
    { id: "qa", name: "QA Automation", desc: "Automated testing & quality checks", icon: Play, color: "text-indigo-400" },
    { id: "benchmark", name: "Store Benchmark", desc: "Compare your store with top performers", icon: BarChart3, color: "text-blue-400" },
    { id: "app_cost", name: "App Cost Analysis", desc: "Analyze app costs & find savings", icon: DollarSign, color: "text-emerald-400" },
    { id: "dev_toolbox", name: "Developer Toolbox", desc: "Essential tools for Shopify developers", icon: Terminal, color: "text-orange-400" },
    { id: "seo", name: "SEO Manager", desc: "Improve search rankings & SEO health", icon: Globe, color: "text-teal-400" },
    { id: "speed_planner", name: "Speed Optimization", desc: "Boost speed & Core Web Vitals", icon: Zap, color: "text-amber-400" },
    { id: "images", name: "Image Optimizer", desc: "Optimize images for better performance", icon: ImageIcon, color: "text-rose-400" },
    { id: "cro", name: "CRO Analyzer", desc: "Increase conversions & improve UX", icon: Sparkles, color: "text-violet-400" },
    { id: "apps", name: "App Detector", desc: "Detect installed apps & technologies", icon: Cpu, color: "text-sky-400" },
    { id: "theme", name: "Theme Intelligence", desc: "Deep dive into your theme & code", icon: Palette, color: "text-purple-400" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-2 text-slate-100 select-none">
      <div className="grid gap-6 lg:grid-cols-4">
        
        {/* Left main content column (3 cols wide) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Hero Scan input block */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-7 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-teal-500/5 pointer-events-none" />
            
            <div className="space-y-4 max-w-xl z-10 text-left">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-white">Analyze any Shopify store in seconds</h2>
                <p className="text-[11px] text-slate-400">Run a comprehensive scan to get actionable insights.</p>
              </div>
              
              <div className="flex h-12 w-full max-w-md items-center gap-2 rounded-lg bg-slate-950 p-1.5 border border-slate-800">
                <input
                  type="text"
                  value={scanInputUrl}
                  onChange={(e) => setScanInputUrl(e.target.value)}
                  placeholder="https://your-store.myshopify.com"
                  className="flex-1 bg-transparent px-3 text-xs outline-none text-slate-100 placeholder-slate-600"
                />
                <select className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-350 outline-none">
                  <option>Full Scan</option>
                  <option>Quick Scan</option>
                </select>
                <button
                  onClick={triggerScan}
                  className="h-full rounded-md bg-indigo-650 px-4 text-xs font-bold text-white hover:bg-indigo-700 transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Start Scan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500">We'll analyze 50+ factors and generate a detailed report.</p>
            </div>

            {/* Illustration Graphic */}
            <div className="relative w-44 h-28 shrink-0 flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-indigo-600/10 blur-xl" />
              {/* CSS Gauge drawing */}
              <div className="relative border-4 border-dashed border-indigo-500/20 rounded-full w-24 h-24 flex items-center justify-center">
                <Gauge className="h-10 w-10 text-indigo-400 animate-pulse" />
                <div className="absolute bottom-2 bg-emerald-400 text-slate-900 text-[8px] font-extrabold px-1 rounded">82%</div>
              </div>
            </div>
          </div>

          {/* Performance Gauges block */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-slate-200">Overall Performance Score</span>
                <span className="text-[10px] text-slate-500 font-medium">Scanned on {displayData.scannedAt}</span>
              </div>
              <button
                onClick={() => setActiveView("scanner")}
                className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <span>View Full Report</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Radial score grid (5 items) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: "Overall Score", score: displayData.scores.overall },
                { label: "Performance", score: displayData.scores.pagespeed },
                { label: "SEO Score", score: displayData.scores.seo },
                { label: "CRO Score", score: displayData.scores.cro },
                { label: "Health Score", score: displayData.scores.accessibility },
              ].map((item, idx) => {
                const status = getScoreStatus(item.score);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <span className="text-[10px] text-slate-400 font-bold block">{item.label}</span>
                    
                    {/* Ring score */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-850">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow opacity-30" />
                      <span className="text-sm font-black">{item.score}</span>
                      <span className="text-[9px] text-slate-500 absolute bottom-1.5">/100</span>
                    </div>

                    <Badge className={`${status.bg} ${status.color} ${status.border} text-[9px] font-extrabold px-1.5 py-0.5 rounded`}>
                      {status.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Tools grid (10 items) */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase block text-left pl-1">All Tools</h3>
            
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {dashboardTools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveView(tool.id)}
                    className="p-4 rounded-xl border border-slate-850 hover:border-indigo-500/40 bg-slate-900/30 hover:bg-indigo-950/5 transition-all flex items-start gap-3 cursor-pointer group text-left"
                  >
                    <div className={`p-2 bg-slate-950 rounded-lg group-hover:scale-105 transition-transform ${tool.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{tool.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-normal truncate">{tool.desc}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600 ml-auto self-center shrink-0 group-hover:text-indigo-400 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Store Health Monitor chart block */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-white">Store Health Monitor</h4>
                <p className="text-[10px] text-slate-550 max-w-xs">Track your store health over time and get alerts for any issues.</p>
                <button
                  onClick={() => setActiveView("health_monitor")}
                  className="px-3 py-1 rounded bg-slate-950 border border-slate-850 hover:border-slate-700 text-[10px] font-bold text-emerald-400 mt-2 transition-colors inline-block"
                >
                  View Monitoring &rarr;
                </button>
              </div>
            </div>

            {/* Sparkline Graphic (HTML/CSS mockup) */}
            <div className="flex-1 max-w-md h-16 flex items-end justify-between gap-1 border-b border-slate-850 pb-2 relative px-4">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-full border-t border-slate-600 border-dashed" />
              </div>
              
              {/* Chart dots and lines simulation */}
              {[70, 75, 73, 85, 80, 88, 91].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 select-none">
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 flex items-center justify-center hover:scale-125 transition-transform cursor-pointer relative"
                    style={{ marginBottom: `${(val - 70) * 1.5}px` }}
                    title={`Score: ${val}%`}
                  >
                    <div className="absolute -top-5 bg-slate-950 text-white text-[8px] px-1 rounded hidden hover:block">{val}</div>
                  </div>
                  <span className="text-[8px] text-slate-550 font-bold">May {idx + 6}</span>
                </div>
              ))}
            </div>

            {/* Status score badge */}
            <div className="text-right flex flex-col items-end gap-1.5">
              <span className="text-[9px] text-slate-500 font-bold block uppercase">Current Score</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-white">91</span>
                <span className="text-[10px] font-extrabold text-emerald-450 flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  <TrendingUp className="h-3 w-3" />
                  +8%
                </span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                Excellent
              </Badge>
            </div>
          </div>

        </div>

        {/* Right sidebar diagnostics summaries column (1 col wide) */}
        <div className="lg:col-span-1 space-y-5">
          
          {/* Recent Scans list */}
          <Card className="border-slate-850 bg-[#0B0F19] text-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-slate-900 pb-3">
              <CardTitle className="text-xs font-extrabold text-slate-200">Recent Scans</CardTitle>
              <button
                onClick={() => setActiveView("scanner")}
                className="text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300"
              >
                View All
              </button>
            </CardHeader>
            <CardContent className="p-3.5 space-y-3.5 text-xs text-left">
              {[
                { domain: "your-store.myshopify.com", date: "May 12, 2025 • 10:30 AM", score: 82, color: "text-emerald-450 bg-emerald-500/10 border-emerald-500/20" },
                { domain: "fashionhub.com", date: "May 10, 2025 • 02:15 PM", score: 75, color: "text-amber-450 bg-amber-500/10 border-amber-500/20" },
                { domain: "brandoutlet.myshopify.com", date: "May 8, 2025 • 11:20 AM", score: 90, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-slate-200 block truncate">{item.domain}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{item.date}</span>
                  </div>
                  <Badge className={`${item.color} font-black text-xs h-7 w-7 flex items-center justify-center rounded-lg border`}>
                    {item.score}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights panel card */}
          <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-4 relative overflow-hidden text-left shadow-lg">
            <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full bg-indigo-550/10 blur-xl pointer-events-none" />
            
            <div className="space-y-1">
              <span className="text-[8px] font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase">AI Insights <span className="text-[7px]">Beta</span></span>
              <h4 className="text-xs font-extrabold text-white pt-1">Boost performance by up to 23%</h4>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              We identified 12 high-impact performance issues including deferred asset optimization loops and scripts blocking parameters.
            </p>

            <button
              onClick={() => setActiveView("speed_planner")}
              className="w-full h-8 rounded-lg bg-indigo-600 hover:bg-indigo-750 transition-colors text-[10px] font-bold text-white shadow-md shadow-indigo-600/15"
            >
              View Insights
            </button>
          </div>

          {/* Recommendation checklist card */}
          <Card className="border-slate-850 bg-[#0B0F19] text-slate-100 shadow-sm overflow-hidden text-left">
            <CardHeader className="p-4 border-b border-slate-900 pb-3">
              <CardTitle className="text-xs font-extrabold text-slate-200">Tips for You</CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-xs space-y-3">
              {[
                "Compress 35 large images to improve speed",
                "Add missing alt tags to 18 images",
                "Reduce unused JavaScript by 220 KB",
                "Enable lazy loading for offscreen images",
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10.5px] text-slate-400 leading-normal">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}

              <button
                onClick={() => setActiveView("speed_planner")}
                className="w-full border-t border-slate-900 pt-3 text-[10px] font-bold text-indigo-400 hover:text-indigo-350 transition-colors text-center block"
              >
                View All Recommendations &rarr;
              </button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
