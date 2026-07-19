"use client";

import React, { useState } from "react";
import { formatJson, minifyJson } from "@/lib/formatters/json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Braces, AlertCircle, Sparkles, Code, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function JsonFormatterView() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [indent, setIndent] = useState(2);
  const [errorMsg, setErrorMsg] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [byteSize, setByteSize] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setErrorMsg("");
    setIsValid(null);
    const result = formatJson(inputText, indent);
    setIsValid(result.isValid);
    if (result.isValid) {
      setOutputText(result.formatted);
      setByteSize(result.sizeBytes || null);
    } else {
      setErrorMsg(result.error || "Failed to parse JSON");
      setOutputText(inputText);
    }
  };

  const handleMinify = () => {
    setErrorMsg("");
    setIsValid(null);
    const result = minifyJson(inputText);
    setIsValid(result.isValid);
    if (result.isValid) {
      setOutputText(result.formatted);
      setByteSize(result.sizeBytes || null);
    } else {
      setErrorMsg(result.error || "Failed to parse JSON");
      setOutputText(inputText);
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
            <Braces className="h-4.5 w-4.5 text-indigo-500" />
            <span>Developer JSON Formatter & Minifier</span>
          </CardTitle>
          <CardDescription className="text-[11px]">
            Validate, pretty-print, and compress Shopify API JSON responses or metafield definitions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-xs space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[10px] text-slate-500 uppercase">INDENTATION</span>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 outline-none text-xs"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {isValid !== null && (
                <Badge
                  className={
                    isValid
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                  }
                >
                  {isValid ? "VALID JSON" : "INVALID JSON"}
                </Badge>
              )}
              {byteSize !== null && (
                <Badge variant="outline" className="font-mono text-[10px]">
                  {(byteSize / 1024).toFixed(2)} KB
                </Badge>
              )}
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Input Editor */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 text-[10px] uppercase">PASTE RAW JSON</span>
              <textarea
                rows={14}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='{ "id": 123, "name": "Shopify Storefront" }'
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono text-[11px] outline-none focus-visible:ring-indigo-500 resize-y"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleFormat}
                  className="flex-1 h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Format</span>
                </button>
                <button
                  onClick={handleMinify}
                  className="flex-1 h-9 rounded-lg font-semibold text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 flex items-center justify-center gap-1.5 transition-all bg-white dark:bg-slate-900 active:scale-[0.98]"
                >
                  <Code className="h-4 w-4" />
                  <span>Minify</span>
                </button>
              </div>
            </div>

            {/* Output Editor */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 text-[10px] uppercase">FORMATTED OUTPUT</span>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="h-6 px-2.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 flex items-center gap-1 text-[10px] font-bold text-slate-650 bg-white dark:bg-slate-900 transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Braces className="h-3 w-3" />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
                )}
              </div>
              <textarea
                rows={14}
                readOnly
                value={outputText}
                placeholder="Beautified result will display here..."
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950/60 font-mono text-[11px] outline-none bg-slate-50/50 resize-y"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-xs text-rose-800 dark:text-rose-450 flex gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold">JSON Parsing Error</p>
                <p className="font-mono text-[10.5px] leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
