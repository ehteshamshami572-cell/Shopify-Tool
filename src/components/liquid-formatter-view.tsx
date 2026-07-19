"use client";

import React, { useState } from "react";
import { formatLiquid } from "@/lib/formatters/liquid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, AlertTriangle, Sparkles, Clipboard, Check } from "lucide-react";

export default function LiquidFormatterView() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [tabSize, setTabSize] = useState(2);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setErrors([]);
    const result = formatLiquid(inputText, tabSize);
    setOutputText(result.formatted);
    if (result.errors.length > 0) {
      setErrors(result.errors);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Code2 className="h-4.5 w-4.5 text-indigo-500" />
            <span>Shopify Liquid Template Formatter</span>
          </CardTitle>
          <CardDescription className="text-[11px]">
            Pretty-print Liquid files, adjust indentation block nesting, and detect unclosed liquid block tags.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-xs space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[10px] text-slate-500 uppercase">INDENTATION</span>
              <select
                value={tabSize}
                onChange={(e) => setTabSize(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 outline-none text-xs"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Input Editor */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[10px] uppercase">PASTE LIQUID TEMPLATE CODE</span>
              <textarea
                rows={14}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='{% if product.available %}&#10;  {{ product.title | link_to: product.url }}&#10;{% else %}&#10;  <p>Out of Stock</p>&#10;{% endif %}'
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono text-[11px] outline-none focus-visible:ring-indigo-500 resize-y"
              />
              <button
                onClick={handleFormat}
                className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Format Liquid Code</span>
              </button>
            </div>

            {/* Output Editor */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 text-[10px] uppercase">BEAUTIFIED CODE</span>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="h-6 px-2.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 flex items-center gap-1 text-[10px] font-bold text-slate-650 bg-white dark:bg-slate-900 transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Clipboard className="h-3 w-3" />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
                )}
              </div>
              <textarea
                rows={14}
                readOnly
                value={outputText}
                placeholder="Formatted Liquid code will display here..."
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950/60 font-mono text-[11px] outline-none bg-slate-50/50 resize-y"
              />
            </div>
          </div>

          {/* Errors warnings */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-955/10 border border-amber-100 dark:border-amber-900/20 text-xs text-amber-800 dark:text-amber-450 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>Potential Syntax Warnings Detected ({errors.length})</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] leading-relaxed">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
