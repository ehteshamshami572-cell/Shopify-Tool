"use client";

import React, { useState } from "react";
import { useScanStore } from "@/store/useScanStore";
import {
  Play,
  BarChart3,
  DollarSign,
  Terminal,
  Globe,
  Zap,
  Image as ImageIcon,
  Sparkles,
  Cpu,
  Palette,
  Activity,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LandingView() {
  const setActiveView = useScanStore((state) => state.setActiveView);
  const setPrefilledUrl = useScanStore((state) => state.setPrefilledUrl);
  const [urlInput, setUrlInput] = useState("");

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error("Please enter a valid Shopify store URL.");
      return;
    }
    setPrefilledUrl(urlInput.trim());
    setActiveView("scanner");
  };

  const handleQuickClick = (domain: string) => {
    setPrefilledUrl(domain);
    setActiveView("scanner");
    toast.success(`Initializing scan for ${domain}...`);
  };

  const features = [
    {
      title: "QA Automation Test",
      desc: "Simulate checkout flows, test variant selections, Add to Cart buttons, and detect broken links.",
      icon: Play,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Store Benchmark",
      desc: "Compare script weights, page sizes, and PageSpeed metrics against global e-commerce averages.",
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "App Cost Analyzer",
      desc: "Audit installed apps, estimate monthly SaaS subscription budgets, and discover free alternatives.",
      icon: DollarSign,
      color: "text-emerald-655",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Developer Toolbox",
      desc: "9 standalone developer utilities: JSON/Liquid formatters, CSV converters, and redirect builders.",
      icon: Terminal,
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-100",
    },
    {
      title: "SEO Auditing",
      desc: "Inspect meta tags, canonical definitions, heading structures, sitemaps, and robots.txt rules.",
      icon: Globe,
      color: "text-teal-600",
      bg: "bg-teal-50 border-teal-100",
    },
    {
      title: "Speed Planner",
      desc: "Project performance score gains (+X points) after applying critical path optimizations.",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
    {
      title: "Image Optimizer",
      desc: "Scan for wrong image dimensions, missing Alt attributes, and recommend WebP conversion options.",
      icon: ImageIcon,
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-100",
    },
    {
      title: "CRO Recommendations",
      desc: "Verify trust seals, sticky add-to-carts, upsells, reviews widgets, and estimate conversion improvements.",
      icon: Sparkles,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50 border-fuchsia-100",
    },
    {
      title: "App footprint Detector",
      desc: "Identify 40+ popular Shopify apps using stylesheet imports, script names, and DOM handles.",
      icon: Cpu,
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden select-none pb-24">
      {/* Background Glowing shapes (Light Theme friendly) */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Sticky Light Navbar */}
      <nav className="h-16 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white font-black text-xs shadow-md shadow-indigo-650/20">
            S
          </div>
          <span className="font-extrabold text-[13px] tracking-tight">Shopify Toolkit Pro</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-semibold">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-slate-900 transition-colors">How it Works</a>
          <a href="#examples" className="hover:text-slate-900 transition-colors">Popular Audits</a>
        </div>

        <button
          onClick={() => setActiveView("scanner")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-650/10 transition-all cursor-pointer"
        >
          <span>Try Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </nav>

      {/* Hero Section with Direct URL Input Form */}
      <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-20 text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Developer & Merchant Suite</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-r from-indigo-700 via-violet-800 to-teal-700 bg-clip-text text-transparent max-w-3xl mx-auto">
            Audit, Optimize & Scale Your Shopify Storefront
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            The ultimate pluggable optimization and QA suite. Enter your store domain directly below to run a deep scan of app footprints, SEO tags, accessibility, and speed scores.
          </p>
        </div>

        {/* Usability Upgrade: Direct Scan Input Box */}
        <div className="max-w-lg mx-auto p-2 bg-white rounded-xl border border-slate-200 shadow-lg glow-indigo">
          <form onSubmit={handleStartScan} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. exercere.com or gymshark.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Analyze Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Quick Click Recommendations */}
        <div id="examples" className="text-xs sm:text-sm text-slate-600 font-medium">
          <span>Quick examples:</span>
          {["exercere.com", "shopify.com", "gymshark.com"].map((domain) => (
            <button
              key={domain}
              onClick={() => handleQuickClick(domain)}
              className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Premium Dashboard Image Visualization */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
            <img
              src="/images/dashboard_preview.jpg"
              alt="Shopify Toolkit Pro Dashboard Preview"
              className="rounded-xl border border-slate-100 w-full object-cover shadow-sm max-h-[380px]"
            />
          </div>
        </div>
      </section>

      {/* Step by step navigation timeline */}
      <section id="workflow" className="max-w-4xl mx-auto px-6 pt-24 text-center space-y-8 relative z-10">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Audit in 3 Simple Steps</h2>
          <p className="text-sm text-slate-600">How to analyze and optimize your store performance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Enter Storefront URL", desc: "Type your Shopify store domain in the quick scanner form." },
            { step: "2", title: "Run Crawl Audit", desc: "Our engine executes Playwright & Cheerio rules within 1.2s." },
            { step: "3", title: "Get Client PDF Report", desc: "Review visual scores and download white-label PDF scorecards." },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 text-left">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600">
                {item.step}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-4xl mx-auto px-6 pt-24 space-y-10 relative z-10 text-left">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Advanced Pluggable Analyzer Modules</h2>
          <p className="text-sm text-slate-600">Every module calculates insights using one shared scan payload.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-350 hover:shadow-md transition-all space-y-3 group"
              >
                <div className={`p-2 rounded-lg w-fit border ${feat.bg}`}>
                  <Icon className={`h-5 w-5 ${feat.color}`} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{feat.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CRO Call To Action Footer */}
      <section className="max-w-4xl mx-auto px-6 pt-24 text-center z-10 relative">
        <div className="p-8 md:p-12 rounded-2xl border border-slate-200 bg-white text-center space-y-5 relative overflow-hidden shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Ready to Audit Your Shopify Storefront?</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Get instant reports, diagnostic suggestions, and White-label executive PDFs.
          </p>
          <button
            onClick={() => setActiveView("scanner")}
            className="px-7 py-3 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/15 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Scan Storefront Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
