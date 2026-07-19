"use client";

import React, { useState } from "react";
import { parseCsv, jsonToCsv } from "@/lib/csv-converter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileSpreadsheet, ArrowLeftRight, Download, Clipboard } from "lucide-react";

export default function CsvConverterView() {
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [resultJson, setResultJson] = useState("");
  const [resultCsv, setResultCsv] = useState("");
  const [errorList, setErrorList] = useState<string[]>([]);

  const handleCsvToValues = () => {
    setErrorList([]);
    try {
      const parsed = parseCsv(csvText);
      if (parsed.errors.length > 0) {
        setErrorList(parsed.errors);
      }
      setResultJson(JSON.stringify(parsed.data, null, 2));
    } catch (err: any) {
      setErrorList([err.message || "Failed to parse CSV text."]);
    }
  };

  const handleJsonToValues = () => {
    setErrorList([]);
    try {
      const parsedArray = JSON.parse(jsonText);
      if (!Array.isArray(parsedArray)) {
        setErrorList(["JSON must be an array of objects."]);
        return;
      }
      const csvOutput = jsonToCsv(parsedArray);
      setResultCsv(csvOutput);
    } catch (err: any) {
      setErrorList([`Invalid JSON: ${err.message}`]);
    }
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-4.5 w-4.5 text-indigo-500" />
            <span>CSV & JSON Converter</span>
          </CardTitle>
          <CardDescription className="text-[11px]">
            Easily convert Shopify products or customer lists from CSV to JSON arrays and vice versa.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-xs">
          <Tabs defaultValue="csv_to_json" className="space-y-4">
            <TabsList className="grid grid-cols-2 max-w-md bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="csv_to_json">CSV to JSON</TabsTrigger>
              <TabsTrigger value="json_to_csv">JSON to CSV</TabsTrigger>
            </TabsList>

            {/* CSV To JSON */}
            <TabsContent value="csv_to_json" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">INPUT CSV TEXT</span>
                  <textarea
                    rows={12}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Handle,Title,Body (HTML),Vendor,Type,Tags,Published...&#10;t-shirt,Cool T-shirt,<p>Best fabric</p>,My Brand,T-Shirt,blue"
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono text-[11px] outline-none focus-visible:ring-indigo-500 resize-y"
                  />
                  <button
                    onClick={handleCsvToValues}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    <span>Convert to JSON</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">OUTPUT JSON ARRAY</span>
                  <textarea
                    rows={12}
                    readOnly
                    value={resultJson}
                    placeholder="[{ &quot;Handle&quot;: &quot;t-shirt&quot;, &quot;Title&quot;: &quot;Cool T-shirt&quot; }]"
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950/60 font-mono text-[11px] outline-none bg-slate-50/50 resize-y"
                  />
                  <button
                    onClick={() => downloadFile(resultJson, "shopify_products.json", "application/json")}
                    disabled={!resultJson}
                    className="w-full h-9 rounded-lg font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all bg-white dark:bg-slate-900 active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download JSON File</span>
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* JSON To CSV */}
            <TabsContent value="json_to_csv" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">INPUT JSON ARRAY</span>
                  <textarea
                    rows={12}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder="[&#10;  {&#10;    &quot;Handle&quot;: &quot;cool-tshirt&quot;,&#10;    &quot;Title&quot;: &quot;Cool T-Shirt&quot;&#10;  }&#10;]"
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono text-[11px] outline-none focus-visible:ring-indigo-500 resize-y"
                  />
                  <button
                    onClick={handleJsonToValues}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    <span>Convert to CSV</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">OUTPUT CSV</span>
                  <textarea
                    rows={12}
                    readOnly
                    value={resultCsv}
                    placeholder="Handle,Title&#10;cool-tshirt,Cool T-Shirt"
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950/60 font-mono text-[11px] outline-none bg-slate-50/50 resize-y"
                  />
                  <button
                    onClick={() => downloadFile(resultCsv, "shopify_export.csv", "text/csv")}
                    disabled={!resultCsv}
                    className="w-full h-9 rounded-lg font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all bg-white dark:bg-slate-900 active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download CSV File</span>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Validation Warnings */}
          {errorList.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-xs text-rose-800 dark:text-rose-450 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <span>Conversion Errors Detected ({errorList.length})</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] leading-relaxed">
                {errorList.map((err, i) => (
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
