"use client";

import React, { useState, useEffect } from "react";
import { useScanStore } from "@/store/useScanStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Search,
  Activity,
  Globe,
  Gauge,
  Cpu,
  Palette,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ScannerView() {
  const [urlInput, setUrlInput] = useState("");
  const [scanStep, setScanStep] = useState(0);
  
  const currentScan = useScanStore((state) => state.currentScan);
  const setCurrentScan = useScanStore((state) => state.setCurrentScan);
  const addRecentScan = useScanStore((state) => state.addRecentScan);
  const recentScans = useScanStore((state) => state.recentScans);
  const isScanning = useScanStore((state) => state.isScanning);
  const setScanning = useScanStore((state) => state.setScanning);
  const scanningError = useScanStore((state) => state.scanningError);
  const setScanningError = useScanStore((state) => state.setScanningError);
  const setActiveView = useScanStore((state) => state.setActiveView);

  const steps = [
    { label: "Contacting host server & parsing DOM tree...", icon: Globe },
    { label: "Inspecting styles, resources, and CDN assets...", icon: Activity },
    { label: "Identifying installed Shopify third-party plugins...", icon: Cpu },
    { label: "Extracting liquid theme layout architecture...", icon: Palette },
    { label: "Calculating PageSpeed performance metrics...", icon: Gauge },
    { label: "Compiling audit scorecards and reports...", icon: Sparkles },
  ];

  // Increment scan steps simulating crawler milestones
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const scanMutation = useMutation({
    mutationFn: async (targetUrl: string) => {
      setScanning(true);
      setScanningError(null);
      const response = await axios.post("/api/scan", { url: targetUrl });
      return response.data;
    },
    onSuccess: (data) => {
      setCurrentScan(data);
      addRecentScan({
        url: data.url,
        domain: data.domain,
        overallScore: data.scores.overall,
        scannedAt: data.scannedAt,
        themeName: data.metadata.themeName,
        isShopify: data.isShopify,
      });
      setScanning(false);
      // Redirect to dashboard to see results
      setActiveView("dashboard");
    },
    onError: (err: any) => {
      console.error(err);
      setScanningError(err.response?.data?.error || err.message || "Failed to analyze the website.");
      setScanning(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    scanMutation.mutate(urlInput);
  };

  const handleRecentScanClick = (domain: string) => {
    setUrlInput(domain);
    scanMutation.mutate(domain);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Hero Banner */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-teal-400 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
          Shopify Store Auditor
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Audit SEO tags, load weights, theme structures, and accessibility standards for any Shopify store in seconds.
        </p>
      </div>

      {/* Audit Input Form */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 to-indigo-500" />
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. shop.shopify.com or targetstore.com"
                value={urlInput}
                disabled={isScanning}
                onChange={(e) => setUrlInput(e.target.value)}
                className="pl-10 h-10 border-slate-200 dark:border-slate-850 dark:bg-slate-950 focus-visible:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !urlInput.trim()}
              className="h-10 px-6 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-700/20 active:scale-[0.98]"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>Start Audit</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Stepper Status Indicators */}
          {isScanning && (
            <div className="mt-8 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>ANALYSIS PROGRESS</span>
                <span>{Math.round(((scanStep + 1) / steps.length) * 100)}%</span>
              </div>
              <Progress value={((scanStep + 1) / steps.length) * 100} className="h-2" />
              
              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCurrent = idx === scanStep;
                  const isDone = idx < scanStep;
                  const isPending = idx > scanStep;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                        isCurrent ? "opacity-100 font-bold" : isDone ? "opacity-60" : "opacity-35"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-full border ${
                          isDone
                            ? "bg-emerald-50 border-emerald-200 text-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-800"
                            : isCurrent
                            ? "bg-indigo-50 border-indigo-200 text-indigo-600 animate-pulse dark:bg-indigo-950/20 dark:border-indigo-800"
                            : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                        }`}
                      >
                        <StepIcon className="h-3.5 w-3.5" />
                      </div>
                      <span className={isCurrent ? "text-slate-800 dark:text-slate-200" : "text-slate-500"}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scanning Errors */}
          {scanningError && (
            <div className="mt-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 flex gap-3 text-xs text-rose-800 dark:text-rose-400 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <div className="space-y-1">
                <p className="font-bold">Scan Failed</p>
                <p>{scanningError}</p>
                <p className="text-[10px] text-rose-500/80">Make sure the store is publicly accessible and correct URL structure.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans */}
      {recentScans.length > 0 && !isScanning && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/40 dark:bg-slate-900/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Recent Audits</span>
            </CardTitle>
            <CardDescription className="text-[11px]">
              Jump back into recently scanned stores.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {recentScans.map((scan, index) => (
              <div
                key={index}
                onClick={() => handleRecentScanClick(scan.url)}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-white/80 dark:bg-slate-950/80 hover:bg-indigo-50/10 dark:hover:bg-slate-900/20 cursor-pointer transition-all hover:translate-x-0.5 active:translate-x-0"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                    {scan.domain}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Theme: {scan.themeName || "Unknown"} &bull; {new Date(scan.scannedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      scan.overallScore >= 90
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : scan.overallScore >= 50
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    }
                  >
                    {scan.overallScore} / 100
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
