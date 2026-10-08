"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, Sparkles, Zap, ShieldCheck, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface AuditProgressProps {
  currentStage?: string;
}

const STAGES = [
  {
    id: "detect",
    title: "Platform Detection",
    description: "Verifying public accessibility, Shopify CDN, and theme assets",
    icon: ShieldCheck,
    duration: 3500,
  },
  {
    id: "pagespeed",
    title: "Google PageSpeed & Core Web Vitals",
    description: "Simulating mobile & desktop field metrics (LCP, CLS, INP, TTFB)",
    icon: Zap,
    duration: 6500,
  },
  {
    id: "cro",
    title: "CRO & Conversion Heuristics",
    description: "Evaluating messaging, CTA friction, trust badges, and navigation",
    icon: ShoppingCart,
    duration: 5000,
  },
  {
    id: "ai",
    title: "AI Synthesis & Action Plan",
    description: "Generating prioritized engineering recommendations & roadmap",
    icon: Sparkles,
    duration: 5000,
  },
];

export function AuditProgress({ currentStage }: AuditProgressProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStepIndex(1), 3500);
    const timer2 = setTimeout(() => setActiveStepIndex(2), 10000);
    const timer3 = setTimeout(() => setActiveStepIndex(3), 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Running Enterprise Store Audit
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Analyzing performance bottlenecks, Core Web Vitals, and conversion rate blockers
        </p>
      </div>

      <div className="space-y-4">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? "border-emerald-200 bg-emerald-50/40 shadow-xs"
                  : isDone
                  ? "border-slate-100 bg-slate-50/60"
                  : "border-transparent opacity-50"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="relative">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-slate-900"
                        : isDone
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {stage.title}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-700 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {stage.description}
                </p>
              </div>

              <div className="shrink-0 text-slate-400">
                <Icon className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
