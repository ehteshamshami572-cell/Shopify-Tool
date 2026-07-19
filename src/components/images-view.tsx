"use client";

import React from "react";
import { useScanStore } from "@/store/useScanStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Image, HelpCircle } from "lucide-react";

export default function ImagesView() {
  const currentScan = useScanStore((state) => state.currentScan);

  if (!currentScan) return null;
  const imgResult = currentScan.modules.images;
  const imgData = imgResult.data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-md">
        <div>
          <h2 className="text-xl font-bold">Image Optimizer</h2>
          <p className="text-xs text-slate-400">Verifying Shopify CDN query modifiers, next-gen formats, and layout shifts.</p>
        </div>
        <div className="text-3xl font-black text-teal-400">{imgResult.score}/100</div>
      </div>

      {/* Metrics Summary */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs font-semibold">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">TOTAL IMAGES</span>
          <span className="text-xl font-bold text-slate-850 dark:text-slate-100">{imgData.totalImages}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">LEGACY JPG/PNG FORMATS</span>
          <span className={`text-xl font-bold ${imgData.unoptimizedFormats > 0 ? "text-amber-500" : "text-emerald-500"}`}>
            {imgData.unoptimizedFormats}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">MISSING RESIZING PARAMETERS</span>
          <span className={`text-xl font-bold ${imgData.missingSizingParams > 0 ? "text-rose-500" : "text-emerald-500"}`}>
            {imgData.missingSizingParams}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">LAZY-LOAD CONFIGURATION</span>
          <span className="text-xl font-bold text-slate-850 dark:text-slate-100">
            {imgData.lazyLoadedCount} / {imgData.totalImages}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Core Recommendations */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Image className="h-4.5 w-4.5 text-indigo-500" />
              <span>Image Diagnostics</span>
            </CardTitle>
            <CardDescription className="text-[11px]">Analysis of asset requests sent to the CDN.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850 space-y-1.5">
              <h4 className="font-bold text-slate-700 dark:text-slate-350">Shopify Image Sizing Query Parameter</h4>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Shopify hosts a built-in image processor. Requesting images with flags (e.g. `?width=480` or `?v=123&format=webp`) tells the Shopify servers to automatically downscale and compress the images on-the-fly. Serving unresized original banner assets degrades Largest Contentful Paint (LCP).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850 space-y-1.5">
              <h4 className="font-bold text-slate-700 dark:text-slate-350">Modern WebP & AVIF Delivery</h4>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                AVIF and WebP compress images up to 50-70% compared to JPG or PNG without loss in resolution quality. You can easily enforce this in Shopify Liquid templates using filter outputs: {"{{ image | image_url: width: 300, format: 'webp' }}"}.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Issues List */}
        <Card className="border-slate-200 dark:border-slate-800 md:col-span-1 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Audit Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {imgResult.issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-450">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                <p className="font-bold">Image Optimization Perfect!</p>
                <p className="text-[9.5px]">No image resizing or formats issues detected.</p>
              </div>
            ) : (
              imgResult.issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span className="truncate">{issue.title}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-normal">{issue.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
