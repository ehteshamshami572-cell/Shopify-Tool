import React from "react";
import { Metadata } from "next";
import { AuditDashboard } from "@/components/shopify-audit/AuditDashboard";
import Link from "next/link";
import { ArrowLeft, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Shopify Store Performance & CRO Audit | Automated Speed & Conversion Analysis",
  description:
    "Comprehensive automated audit for Shopify stores. Inspect Google PageSpeed, Core Web Vitals (LCP, CLS, INP), 8-pillar CRO heuristics, and generate prioritized AI recommendations.",
};

export default function ShopifyAuditPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Bar for Dedicated Route */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Toolkit Home</span>
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                S
              </div>
              <span>Shopify Store Audit</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button size="sm" variant="outline" className="text-xs text-slate-700 cursor-pointer">
                <Home className="w-3.5 h-3.5 mr-1" />
                Dashboard Shell
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Audit Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuditDashboard />
      </main>
    </div>
  );
}
