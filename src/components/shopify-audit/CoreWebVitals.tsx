"use client";

import React from "react";
import { CoreWebVitals as CWVType } from "@/types/shopify-audit";
import { CheckCircle2, AlertTriangle, XCircle, Info, Clock, Layers, MousePointerClick } from "lucide-react";

interface CoreWebVitalsProps {
  metrics: CWVType;
}

interface MetricCardProps {
  name: string;
  acronym: string;
  value: string;
  status: string;
  threshold: string;
  explanation: string;
  impact: string;
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({
  name,
  acronym,
  value,
  status,
  threshold,
  explanation,
  impact,
  icon: Icon,
}: MetricCardProps) {
  const normalizedStatus =
    status === "excellent" || status === "good"
      ? "good"
      : status === "needs_improvement" || status === "needs-improvement"
      ? "needs-improvement"
      : "poor";

  const statusStyles = {
    good: {
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      valueColor: "text-emerald-700",
      icon: CheckCircle2,
      label: "Good",
    },
    "needs-improvement": {
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      valueColor: "text-amber-700",
      icon: AlertTriangle,
      label: "Needs Improvement",
    },
    poor: {
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      valueColor: "text-rose-700",
      icon: XCircle,
      label: "Poor",
    },
  }[normalizedStatus];

  const StatusIcon = statusStyles.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block leading-tight">
                {acronym}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{name}</span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${statusStyles.badgeBg}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusStyles.label}
          </span>
        </div>

        <div className="my-2">
          <div className={`text-2xl font-black ${statusStyles.valueColor}`}>
            {value}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Goal: {threshold}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
        <p className="text-xs text-slate-600 line-clamp-2">
          {explanation}
        </p>
        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <span className="font-semibold text-slate-500">Impact:</span> {impact}
        </div>
      </div>
    </div>
  );
}

export function CoreWebVitals({ metrics }: CoreWebVitalsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Core Web Vitals & Field Diagnostics
          </h3>
          <p className="text-xs text-slate-500">
            Key user-centric metrics Google uses to evaluate real merchant experience and ranking
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Needs Work
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Poor
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          name="Largest Contentful Paint"
          acronym="LCP"
          value={metrics.lcp.displayValue}
          status={metrics.lcp.status}
          threshold="≤ 2.5s"
          explanation="Measures when the main hero image or banner renders on the screen."
          impact="Directly lowers bounce rates on mobile landing pages."
          icon={Clock}
        />

        <MetricCard
          name="Cumulative Layout Shift"
          acronym="CLS"
          value={metrics.cls.displayValue}
          status={metrics.cls.status}
          threshold="≤ 0.1"
          explanation="Quantifies visual stability and shifts while page banners or apps load."
          impact="Prevents accidental clicks on wrong buttons or cart links."
          icon={Layers}
        />

        <MetricCard
          name="Interaction to Next Paint"
          acronym="INP"
          value={metrics.inp.displayValue}
          status={metrics.inp.status}
          threshold="≤ 200ms"
          explanation="Assesses UI responsiveness when clicking Buy Now or opening drawers."
          impact="Ensures smooth Add to Cart and variant switching actions."
          icon={MousePointerClick}
        />

        <MetricCard
          name="First Contentful Paint"
          acronym="FCP"
          value={metrics.fcp.displayValue}
          status={metrics.fcp.status}
          threshold="≤ 1.8s"
          explanation="Marks the first point where any text or hero graphic is painted."
          impact="Reassures visitors that the store is active and responding."
          icon={Clock}
        />

        <MetricCard
          name="Time to First Byte"
          acronym="TTFB"
          value={metrics.ttfb.displayValue}
          status={metrics.ttfb.status}
          threshold="≤ 800ms"
          explanation="Time spent waiting for Shopify servers and edge cache to respond."
          impact="Fundamental baseline for all subsequent page assets."
          icon={Clock}
        />

        <MetricCard
          name="Speed Index"
          acronym="SI"
          value={metrics.speedIndex.displayValue}
          status={metrics.speedIndex.status}
          threshold="≤ 3.4s"
          explanation="Measures how quickly the visual contents of the page are filled in."
          impact="Perceived speed and overall merchant browsing feel."
          icon={Clock}
        />
      </div>
    </div>
  );
}
