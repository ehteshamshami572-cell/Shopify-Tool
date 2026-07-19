"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cpu, DollarSign, Wallet, CheckCircle2, ArrowRight } from "lucide-react";

export default function AppCostView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const costResult = currentScan.modules.cost;
  const costData = costResult.data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">App Cost Analyzer</h2>
          <p className="text-xs text-slate-400">Estimating monthly subscription budgets and locating lower-cost alternatives.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{costResult.score}/100</div>
      </div>

      {/* Stats summary */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-slate-800 text-indigo-500 rounded-lg">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">EST. MONTHLY COST</span>
            <span className="text-xl font-black text-slate-850 dark:text-slate-100">
              ${costData.totalCost} / month
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 dark:bg-slate-800 text-rose-500 rounded-lg">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">HEAVY LOAD APP SCRIPTS</span>
            <span className="text-xl font-black text-slate-850 dark:text-slate-100">
              {costData.highImpactCount} apps
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-slate-800 text-emerald-500 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">SAVINGS OPPORTUNITIES</span>
            <span className="text-xl font-black text-slate-850 dark:text-slate-100">
              {costResult.recommendations.length} items
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* App Cost Table */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Pricing Breakdown</CardTitle>
            <CardDescription className="text-[11px]">List of detected apps and estimated SaaS pricing tiers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-xs">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-950/40">
                <TableRow>
                  <TableHead className="pl-4">App</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costData.appsDetail?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                      No apps detected.
                    </TableCell>
                  </TableRow>
                ) : (
                  costData.appsDetail.map((app: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold pl-4">{app.name}</TableCell>
                      <TableCell className="text-slate-500">{app.purpose}</TableCell>
                      <TableCell className="font-bold text-slate-800 dark:text-slate-200">
                        ${app.monthlyCost}/mo
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            app.performanceImpact === "high"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-extrabold"
                              : app.performanceImpact === "medium"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-extrabold"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-extrabold"
                          }
                        >
                          {app.performanceImpact.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alternatives and savings advice */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Savings Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-xs">
            {costResult.recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                <p className="font-bold">Cost Optimized</p>
                <p className="text-[10px]">No app cost optimizations identified.</p>
              </div>
            ) : (
              costResult.recommendations.map((rec: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-2 p-2.5 rounded-lg bg-indigo-50/10 dark:bg-slate-950/20 border border-indigo-500/10 text-xs text-slate-650 dark:text-slate-400 leading-normal"
                >
                  <ArrowRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
