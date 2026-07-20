"use client";

import React, { useState } from "react";
import { generateShopifyHandle, getShopifyApiVersions } from "@/lib/developer-toolbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Terminal,
  Braces,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Sparkles,
  Search,
  Check,
  Eye,
  Sliders,
  Maximize,
  Image as ImageIcon,
  Download,
  Upload,
  Code2,
  FileSpreadsheet,
  Link as LinkIcon,
  Hash,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DevToolboxView() {
  const [activeSubTab, setActiveSubTab] = useState("formatters");

  // Formatters state
  const [formatterInput, setFormatterInput] = useState('{\n  "store": "Demo Store",\n  "products": 42\n}');
  const [formatterMode, setFormatterMode] = useState<"json" | "liquid" | "html" | "css" | "js">("json");
  const [formatterOutput, setFormatterOutput] = useState("");

  // Converters state
  const [converterInput, setConverterInput] = useState("https://exercere.com/products/jacket");
  const [converterMode, setConverterMode] = useState<"base64_enc" | "base64_dec" | "url_enc" | "url_dec" | "jwt">("url_enc");
  const [converterOutput, setConverterOutput] = useState("");

  // Utilities state
  const [hashInput, setHashInput] = useState("shopify_secret");
  const [hashOutput, setHashOutput] = useState("");
  const [generatedUuid, setGeneratedUuid] = useState("");

  // Shopify Helpers state
  const [bulkHandleInput, setBulkHandleInput] = useState("Blue Shirt\nRed Hoodie\nGreen Hat");
  const [bulkHandleOutput, setBulkHandleOutput] = useState("");

  // Image Converter state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("webp");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [converting, setConverting] = useState(false);

  // Formatters runner
  const runFormatter = () => {
    try {
      if (formatterMode === "json") {
        const parsed = JSON.parse(formatterInput);
        setFormatterOutput(JSON.stringify(parsed, null, 2));
      } else {
        // Clean text formatting
        const formatted = formatterInput.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
        setFormatterOutput(formatted);
      }
      toast.success("Formatted successfully!");
    } catch {
      toast.error("Syntax parsing error in input string.");
    }
  };

  // Converters runner
  const runConverter = () => {
    try {
      if (converterMode === "base64_enc") setConverterOutput(btoa(converterInput));
      else if (converterMode === "base64_dec") setConverterOutput(atob(converterInput));
      else if (converterMode === "url_enc") setConverterOutput(encodeURIComponent(converterInput));
      else if (converterMode === "url_dec") setConverterOutput(decodeURIComponent(converterInput));
      else if (converterMode === "jwt") {
        const parts = converterInput.split(".");
        if (parts.length === 3) setConverterOutput(JSON.stringify(JSON.parse(atob(parts[1])), null, 2));
        else setConverterOutput("Invalid JWT token format");
      }
      toast.success("Conversion completed!");
    } catch {
      toast.error("Failed to convert input.");
    }
  };

  // UUID generator
  const generateUuid = () => {
    const uuid = crypto.randomUUID();
    setGeneratedUuid(uuid);
    toast.success("New UUID generated!");
  };

  // Bulk handle generator
  const runBulkHandle = () => {
    const lines = bulkHandleInput.split("\n");
    const handles = lines.map((line) => generateShopifyHandle(line)).join("\n");
    setBulkHandleOutput(handles);
    toast.success("Bulk handles generated!");
  };

  // Image Converter
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setConvertedUrl("");
    }
  };

  const convertImageFormat = () => {
    if (!imageFile) return;
    setConverting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          let mime = "image/webp";
          if (targetFormat === "png") mime = "image/png";
          else if (targetFormat === "jpeg") mime = "image/jpeg";

          const dataUrl = canvas.toDataURL(mime, 0.85);
          setConvertedUrl(dataUrl);
          toast.success(`Image converted to ${targetFormat.toUpperCase()}!`);
        }
        setConverting(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-slate-100 select-none">
      <Card className="border-slate-800 bg-[#121215] shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-indigo-400" />
            <span>Developer Toolbox & Utility Suite</span>
          </CardTitle>
          <CardDescription className="text-[11px] text-slate-400">
            Categorized developer tools for code formatting, string conversion, Shopify GraphQL, and image optimizations.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-xs">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
            <div className="overflow-x-auto pb-1.5 scrollbar-thin">
              <TabsList className="flex bg-slate-950 w-max min-w-full border border-slate-850 rounded-lg p-1">
                <TabsTrigger value="formatters" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Formatters</TabsTrigger>
                <TabsTrigger value="converters" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Converters</TabsTrigger>
                <TabsTrigger value="utilities" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Utilities</TabsTrigger>
                <TabsTrigger value="shopify_helpers" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Shopify Helpers</TabsTrigger>
                <TabsTrigger value="image_conv" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Image Converter</TabsTrigger>
              </TabsList>
            </div>

            {/* Category 1: Formatters */}
            <TabsContent value="formatters" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {(["json", "liquid", "html", "css", "js"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setFormatterMode(mode)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                          formatterMode === mode
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={8}
                    value={formatterInput}
                    onChange={(e) => setFormatterInput(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono text-slate-100 outline-none"
                  />
                  <button
                    onClick={runFormatter}
                    className="w-full h-9 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Format Code
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">OUTPUT</span>
                    <button onClick={() => copyToClipboard(formatterOutput)} className="text-[10px] text-indigo-400 flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    readOnly
                    value={formatterOutput}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-emerald-400"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Category 2: Converters */}
            <TabsContent value="converters" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: "url_enc", label: "URL Encode" },
                      { id: "url_dec", label: "URL Decode" },
                      { id: "base64_enc", label: "Base64 Enc" },
                      { id: "base64_dec", label: "Base64 Dec" },
                      { id: "jwt", label: "JWT Decode" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setConverterMode(btn.id as any)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                          converterMode === btn.id
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={6}
                    value={converterInput}
                    onChange={(e) => setConverterInput(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono text-slate-100 outline-none"
                  />
                  <button
                    onClick={runConverter}
                    className="w-full h-9 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Convert String
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">CONVERTED RESULT</span>
                  <textarea
                    rows={6}
                    readOnly
                    value={converterOutput}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-indigo-300"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Category 3: Utilities */}
            <TabsContent value="utilities" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 space-y-3">
                  <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <Hash className="h-4 w-4 text-indigo-400" />
                    <span>UUID Generator</span>
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={generatedUuid}
                    placeholder="Click to generate UUID v4"
                    className="w-full h-9 px-3 rounded border border-slate-800 bg-slate-950 font-mono text-indigo-400"
                  />
                  <button
                    onClick={generateUuid}
                    className="w-full h-8 rounded font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Generate UUID v4
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 space-y-3">
                  <span className="font-bold text-slate-300 text-xs">Timestamp Converter</span>
                  <input
                    type="text"
                    readOnly
                    value={new Date().toISOString()}
                    className="w-full h-9 px-3 rounded border border-slate-800 bg-slate-950 font-mono text-emerald-400"
                  />
                  <span className="text-[10px] text-slate-500 block">Current Unix Time: {Math.floor(Date.now() / 1000)}</span>
                </div>
              </div>
            </TabsContent>

            {/* Category 4: Shopify Helpers */}
            <TabsContent value="shopify_helpers" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">BULK HANDLE INPUT (1 PER LINE)</span>
                  <textarea
                    rows={6}
                    value={bulkHandleInput}
                    onChange={(e) => setBulkHandleInput(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono text-slate-100 outline-none"
                  />
                  <button
                    onClick={runBulkHandle}
                    className="w-full h-9 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Generate Bulk Shopify Handles
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">SHOPIFY HANDLES OUTPUT</span>
                  <textarea
                    rows={6}
                    readOnly
                    value={bulkHandleOutput}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-emerald-400"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Category 5: Image Converter */}
            <TabsContent value="image_conv" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">UPLOAD ASSET IMAGE</span>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-6 cursor-pointer hover:border-indigo-500 bg-slate-950/30 hover:bg-slate-950/50 transition-all text-center">
                      <Upload className="h-6 w-6 text-indigo-400 mb-2" />
                      <span className="text-xs text-slate-350 font-semibold">{imageFile ? imageFile.name : "Select JPG / PNG / GIF asset file"}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">TARGET FORMAT</span>
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="w-full h-10 border border-slate-800 bg-slate-950 rounded px-2 text-slate-100 outline-none"
                    >
                      <option value="webp">WebP (Optimized for Speed)</option>
                      <option value="png">PNG (Lossless Quality)</option>
                      <option value="jpeg">JPEG (Standard compression)</option>
                    </select>
                  </div>

                  <button
                    onClick={convertImageFormat}
                    disabled={!imageFile || converting}
                    className="w-full h-9 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                  >
                    {converting ? "Processing..." : "Convert Image Asset"}
                  </button>
                </div>

                <div className="flex flex-col justify-center items-center text-center p-6 border border-slate-800 rounded-xl bg-slate-950/20 space-y-4">
                  {convertedUrl ? (
                    <div className="space-y-4 w-full flex flex-col items-center">
                      <img src={convertedUrl} alt="Converted Preview" className="object-contain max-h-[140px] border border-slate-800 rounded" />
                      <a
                        href={convertedUrl}
                        download={`shopify_asset.${targetFormat}`}
                        className="w-full h-9 rounded-lg font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 flex items-center justify-center gap-1.5 transition-all text-xs"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Converted Asset</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-slate-500 space-y-1">
                      <ImageIcon className="h-8 w-8 mx-auto opacity-40 mb-2" />
                      <p className="font-bold">Awaiting Image File</p>
                      <p className="text-[10px]">Select an image asset to convert client-side.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
