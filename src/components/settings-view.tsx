"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Key, Sliders, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsView() {
  const [apiKey, setApiKey] = useState("");
  const [autoSaveHistory, setAutoSaveHistory] = useState(true);
  const [scanTimeout, setScanTimeout] = useState("8000");

  const saveSettings = () => {
    toast.success("Platform settings updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <span>Platform Settings & Preferences</span>
          </h2>
          <p className="text-xs text-slate-400">Configure scanner timeouts, API keys, and reporting preferences.</p>
        </div>
        <button
          onClick={saveSettings}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-1.5 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-800 bg-[#121215] text-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Key className="h-4 w-4 text-indigo-400" />
              <span>API Credentials</span>
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-400">Optional Google PageSpeed API integration keys.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-400 text-[10px] uppercase">GOOGLE PAGESPEED API KEY</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 font-mono outline-none text-slate-100"
              />
              <p className="text-[10px] text-slate-500">Leaving this blank uses simulated high-fidelity PageSpeed metrics.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-[#121215] text-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <span>Crawler Timeout & Thresholds</span>
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-400">Manage request limits for store scans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-400 text-[10px] uppercase">HTTP CRAWLER TIMEOUT (MS)</span>
              <select
                value={scanTimeout}
                onChange={(e) => setScanTimeout(e.target.value)}
                className="w-full h-10 border border-slate-800 bg-slate-950 rounded px-2 text-slate-100 outline-none"
              >
                <option value="5000">5,000 ms (Ultra Fast)</option>
                <option value="8000">8,000 ms (Standard Balanced)</option>
                <option value="15000">15,000 ms (Deep Analysis)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-850">
              <span className="font-semibold text-slate-300">Auto-save history to LocalStorage</span>
              <input
                type="checkbox"
                checked={autoSaveHistory}
                onChange={(e) => setAutoSaveHistory(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
