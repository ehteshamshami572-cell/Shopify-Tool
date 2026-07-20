"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  badgeText?: string;
  badgeVariant?: "success" | "warning" | "danger" | "info";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "positive",
  badgeText,
  badgeVariant = "info",
}: MetricCardProps) {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "danger":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl border border-slate-800 bg-[#121215] space-y-3 shadow-sm select-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">{value}</span>
        {badgeText && (
          <Badge className={`${getBadgeClass()} text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase border`}>
            {badgeText}
          </Badge>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 border-t border-slate-900 pt-2">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={
                trendType === "positive"
                  ? "text-emerald-400 font-extrabold"
                  : trendType === "negative"
                  ? "text-rose-400 font-extrabold"
                  : "text-slate-400 font-semibold"
              }
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
