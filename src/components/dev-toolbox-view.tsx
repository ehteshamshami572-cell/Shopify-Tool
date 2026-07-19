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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DevToolboxView() {
  const [activeSubTab, setActiveSubTab] = useState("handle_gen");

  // Handle generator state
  const [titleInput, setTitleInput] = useState("");
  const [handleOutput, setHandleOutput] = useState("");

  // Webhook verification state
  const [payloadText, setPayloadText] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [hmacHeader, setHmacHeader] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  // SVG Optimizer state
  const [svgInput, setSvgInput] = useState("");
  const [svgOutput, setSvgOutput] = useState("");

  // GraphQL Explorer state
  const [gqlQuery, setGqlQuery] = useState("");
  const [gqlResponse, setGqlResponse] = useState("");

  // Metafield Builder state
  const [metaNamespace, setMetaNamespace] = useState("custom");
  const [metaKey, setMetaKey] = useState("field_name");
  const [metaType, setMetaType] = useState("single_line_text_field");
  const [metaValue, setMetaValue] = useState("");
  const [metaJson, setMetaJson] = useState("");

  // Contrast Checker state
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#4F46E5");
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);

  // JWT Decoder state
  const [jwtInput, setJwtInput] = useState("");
  const [jwtHeader, setJwtHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");

  // Regex state
  const [regexPattern, setRegexPattern] = useState("");
  const [regexText, setRegexText] = useState("");
  const [regexMatches, setRegexMatches] = useState<string[]>([]);

  // Image Converter state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("webp");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [converting, setConverting] = useState(false);

  // Handle change
  const handleTitleChange = (val: string) => {
    setTitleInput(val);
    setHandleOutput(generateShopifyHandle(val));
  };

  // HMAC Verifier
  const verifyWebhookClientSide = async () => {
    if (!payloadText || !secretInput || !hmacHeader) return;
    setVerifying(true);
    setVerificationResult(null);
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretInput);
      const messageData = encoder.encode(payloadText);
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, messageData);
      const signatureBytes = new Uint8Array(signatureBuffer);
      let binary = "";
      for (let i = 0; i < signatureBytes.byteLength; i++) {
        binary += String.fromCharCode(signatureBytes[i]);
      }
      const calculatedHmac = btoa(binary);
      setVerificationResult(calculatedHmac.trim() === hmacHeader.trim());
    } catch {
      setVerificationResult(false);
    } finally {
      setVerifying(false);
    }
  };

  // SVG Optimizer
  const optimizeSvg = () => {
    if (!svgInput) return;
    const optimized = svgInput
      .replace(/<\?xml.*?\?>/gi, "") // strip xml header
      .replace(/<!DOCTYPE.*?>/gi, "") // strip doctype
      .replace(/<!--.*?-->/g, "") // strip comments
      .replace(/\s+/g, " ") // consolidate spaces
      .replace(/>\s+</g, "><") // strip spaces between tags
      .trim();
    setSvgOutput(optimized);
  };

  // GraphQL Mock Runner
  const runMockGql = () => {
    if (!gqlQuery.trim()) return;
    let responseObj = { data: {} };
    if (gqlQuery.includes("products")) {
      responseObj = {
        data: {
          products: {
            edges: [
              { node: { id: "gid://shopify/Product/123", title: "Premium Cotton Tee", handle: "premium-cotton-tee" } },
              { node: { id: "gid://shopify/Product/456", title: "Flex Sweatshirt", handle: "flex-sweatshirt" } },
            ],
          },
        },
      };
    } else {
      responseObj = {
        data: {
          shop: {
            name: "Audit Demo Store",
            primaryDomain: { url: "https://demo.myshopify.com" },
          },
        },
      };
    }
    setGqlResponse(JSON.stringify(responseObj, null, 2));
  };

  // Metafield Builder
  const buildMetafield = () => {
    const output = {
      metafield: {
        namespace: metaNamespace.trim(),
        key: metaKey.trim(),
        type: metaType,
        value: metaValue || (metaType === "boolean" ? "true" : "Custom value definition"),
      },
    };
    setMetaJson(JSON.stringify(output, null, 2));
  };

  // Contrast Calculator
  const checkContrast = () => {
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 0, g: 0, b: 0 };
    };

    const getLuminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const c1 = hexToRgb(textColor);
    const c2 = hexToRgb(bgColor);
    const l1 = getLuminance(c1.r, c1.g, c1.b);
    const l2 = getLuminance(c2.r, c2.g, c2.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    setContrastRatio(Number(ratio.toFixed(2)));
  };

  // JWT Decoder
  const decodeJwt = () => {
    if (!jwtInput) return;
    try {
      const parts = jwtInput.split(".");
      if (parts.length !== 3) {
        setJwtHeader("Invalid JWT structure");
        return;
      }
      setJwtHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2));
      setJwtPayload(JSON.stringify(JSON.parse(atob(parts[1])), null, 2));
    } catch {
      setJwtHeader("Failed to decode token");
    }
  };

  // Regex Tester
  const testRegex = () => {
    if (!regexPattern || !regexText) return;
    try {
      const rx = new RegExp(regexPattern, "g");
      const matches = regexText.match(rx) || [];
      setRegexMatches(matches);
    } catch (err: any) {
      setRegexMatches([`Regex Error: ${err.message}`]);
    }
  };

  // Image Converter upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setConvertedUrl("");
    }
  };

  // Image Converter trigger
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
        }
        setConverting(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  };

  const apiVersions = getShopifyApiVersions();

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <Card className="border-slate-800 shadow-sm bg-slate-900 text-slate-100">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-indigo-400" />
            <span>Expanded Developer Toolbox</span>
          </CardTitle>
          <CardDescription className="text-[11px] text-slate-400">
            Comprehensive utilities designed to speed up Shopify app integrations and custom liquid assets compiling.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-xs">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
            <div className="overflow-x-auto pb-1.5 scrollbar-thin">
              <TabsList className="flex bg-slate-950 w-max min-w-full border border-slate-800 rounded-lg p-1">
                <TabsTrigger value="handle_gen" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">Handle Generator</TabsTrigger>
                <TabsTrigger value="webhook_val" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">Webhook Verifier</TabsTrigger>
                <TabsTrigger value="api_versions" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">API Versions</TabsTrigger>
                <TabsTrigger value="svg_opt" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">SVG Optimizer</TabsTrigger>
                <TabsTrigger value="gql_exp" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">GraphQL Explorer</TabsTrigger>
                <TabsTrigger value="meta_build" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">Metafields</TabsTrigger>
                <TabsTrigger value="contrast_check" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">Contrast Checker</TabsTrigger>
                <TabsTrigger value="jwt_dec" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">JWT Decoder</TabsTrigger>
                <TabsTrigger value="regex_test" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">Regex Tester</TabsTrigger>
                <TabsTrigger value="image_conv" className="data-[state=active]:bg-indigo-650 data-[state=active]:text-white">Image Converter</TabsTrigger>
              </TabsList>
            </div>

            {/* Handle Generator */}
            <TabsContent value="handle_gen" className="space-y-4 max-w-xl">
              <div className="space-y-4 p-2">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">STRING TITLE</span>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Winter Snow Jacket (Blue / M)"
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 focus-visible:ring-indigo-500 outline-none text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">SHOPIFY HANDLE</span>
                  <input
                    type="text"
                    readOnly
                    value={handleOutput}
                    placeholder="winter-snow-jacket-blue-m"
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-indigo-400 font-bold"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Webhook Verifier */}
            <TabsContent value="webhook_val" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">PAYLOAD BODY</span>
                    <textarea
                      rows={5}
                      value={payloadText}
                      onChange={(e) => setPayloadText(e.target.value)}
                      placeholder='{"id": 987654}'
                      className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono outline-none text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">APP CLIENT SECRET</span>
                    <input
                      type="password"
                      value={secretInput}
                      onChange={(e) => setSecretInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 outline-none text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">X-SHOPIFY-HMAC-SHA256 HEADER</span>
                    <input
                      type="text"
                      value={hmacHeader}
                      onChange={(e) => setHmacHeader(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-955 outline-none text-slate-100"
                    />
                  </div>
                  <button
                    onClick={verifyWebhookClientSide}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Verify signature
                  </button>
                </div>
                <div className="flex flex-col justify-center items-center text-center p-6 border border-slate-800 rounded-xl bg-slate-950/20">
                  {verificationResult === null ? (
                    <span className="text-slate-450">Awaiting Webhook signature details</span>
                  ) : verificationResult ? (
                    <span className="text-emerald-450 font-bold flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> HMAC Signature Validated (Passed)</span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1"><AlertCircle className="h-4 w-4" /> HMAC Signature Mismatch (Failed)</span>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* API Versions */}
            <TabsContent value="api_versions" className="p-2">
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-850 font-bold text-slate-400">
                      <th className="p-3">API Version</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Release Date</th>
                      <th className="p-3">Supported Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiVersions.map((api, idx) => (
                      <tr key={idx} className="border-b border-slate-850 hover:bg-slate-950/20">
                        <td className="p-3 font-mono font-bold text-indigo-400">{api.version}</td>
                        <td className="p-3">
                          <Badge className="bg-slate-850 text-slate-300 border border-slate-700">
                            {api.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-slate-400">{api.releaseDate}</td>
                        <td className="p-3 text-slate-400">{api.supportedUntil}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* SVG Optimizer */}
            <TabsContent value="svg_opt" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">PASTE RAW SVG</span>
                  <textarea
                    rows={8}
                    value={svgInput}
                    onChange={(e) => setSvgInput(e.target.value)}
                    placeholder="<svg ...> ... </svg>"
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono outline-none text-slate-100"
                  />
                  <button
                    onClick={optimizeSvg}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Optimize SVG payload
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">OPTIMIZED SVG</span>
                  <textarea
                    rows={8}
                    readOnly
                    value={svgOutput}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono bg-slate-950 text-emerald-450"
                  />
                </div>
              </div>
            </TabsContent>

            {/* GraphQL Explorer */}
            <TabsContent value="gql_exp" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">SHOPIFY GRAPHQL QUERY</span>
                  <textarea
                    rows={8}
                    value={gqlQuery}
                    onChange={(e) => setGqlQuery(e.target.value)}
                    placeholder="{ shop { name } }"
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono outline-none text-slate-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGqlQuery("{ products(first: 2) { edges { node { id title } } } }")}
                      className="text-[10px] bg-slate-800 border border-slate-700 text-slate-350 p-1.5 rounded"
                    >
                      Products template
                    </button>
                    <button
                      onClick={runMockGql}
                      className="flex-1 h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Run query
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">MOCK RESPONSE</span>
                  <textarea
                    rows={8}
                    readOnly
                    value={gqlResponse}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono bg-slate-950 text-indigo-400"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Metafield Builder */}
            <TabsContent value="meta_build" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 text-[9px] uppercase">NAMESPACE</span>
                      <input
                        type="text"
                        value={metaNamespace}
                        onChange={(e) => setMetaNamespace(e.target.value)}
                        className="w-full h-9 border border-slate-800 bg-slate-950 rounded px-2 text-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 text-[9px] uppercase">KEY</span>
                      <input
                        type="text"
                        value={metaKey}
                        onChange={(e) => setMetaKey(e.target.value)}
                        className="w-full h-9 border border-slate-800 bg-slate-950 rounded px-2 text-slate-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 text-[9px] uppercase">VALUE TYPE</span>
                    <select
                      value={metaType}
                      onChange={(e) => setMetaType(e.target.value)}
                      className="w-full h-9 border border-slate-800 bg-slate-950 rounded px-2 text-slate-100"
                    >
                      <option value="single_line_text_field">Single Line Text</option>
                      <option value="number_integer">Integer</option>
                      <option value="json">JSON</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                  <button
                    onClick={buildMetafield}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Build Metafield definition
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">METAFIELD JSON SCHEMA</span>
                  <textarea
                    rows={8}
                    readOnly
                    value={metaJson}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono bg-slate-950 text-indigo-400"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Contrast Checker */}
            <TabsContent value="contrast_check" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 text-[9px] uppercase">FOREGROUND COLOR</span>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-slate-800 bg-transparent"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 text-[9px] uppercase">BACKGROUND COLOR</span>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-slate-800 bg-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={checkContrast}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Check contrast ratio
                  </button>
                </div>
                <div className="flex flex-col justify-center items-center text-center p-6 border border-slate-800 rounded-xl bg-slate-950/20">
                  {contrastRatio !== null && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-450 block font-bold">CONTRAST RATIO</span>
                      <span className="text-2xl font-black text-slate-100">
                        {contrastRatio}:1
                      </span>
                      <div className="flex gap-2 justify-center pt-2">
                        <Badge className={contrastRatio >= 4.5 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}>
                          AA Pass
                        </Badge>
                        <Badge className={contrastRatio >= 7 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}>
                          AAA Pass
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* JWT Decoder */}
            <TabsContent value="jwt_dec" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">PASTE JWT TOKEN</span>
                  <textarea
                    rows={8}
                    value={jwtInput}
                    onChange={(e) => setJwtInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 font-mono outline-none text-slate-100"
                  />
                  <button
                    onClick={decodeJwt}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Decode token segments
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">PAYLOAD DETAILS</span>
                  <textarea
                    rows={8}
                    readOnly
                    value={jwtPayload}
                    placeholder="Decoded token payload section..."
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-955 font-mono bg-slate-950/60 text-slate-200"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Regex Tester */}
            <TabsContent value="regex_test" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">REGEX PATTERN</span>
                    <input
                      type="text"
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                      placeholder="e.g. \w+"
                      className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-955 font-mono outline-none text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">TEST STRING</span>
                    <textarea
                      rows={4}
                      value={regexText}
                      onChange={(e) => setRegexText(e.target.value)}
                      placeholder="Enter string content..."
                      className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 outline-none text-slate-100"
                    />
                  </div>
                  <button
                    onClick={testRegex}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Test match pattern
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">MATCH RESULTS</span>
                  <div className="p-3 border border-slate-800 bg-slate-950 rounded-lg h-44 overflow-y-auto font-mono text-emerald-450">
                    {regexMatches.length === 0 ? (
                      <span className="text-slate-500">No matching items found</span>
                    ) : (
                      regexMatches.map((m, idx) => (
                        <div key={idx} className="p-1 border-b border-slate-850">
                          {m}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Image Converter */}
            <TabsContent value="image_conv" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 p-2">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">UPLOAD ASSET IMAGE</span>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-6 cursor-pointer hover:border-indigo-500 bg-slate-950/30 hover:bg-slate-950/50 transition-all text-center">
                      <Upload className="h-6 w-6 text-indigo-400 mb-2" />
                      <span className="text-xs text-slate-350 font-semibold">{imageFile ? imageFile.name : "Select JPG / PNG / GIF asset file"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 text-[10px] uppercase">TARGET FORMAT</span>
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="w-full h-10 border border-slate-850 bg-slate-950 rounded px-2 text-slate-100 outline-none"
                    >
                      <option value="webp">WebP (Optimized for Speed)</option>
                      <option value="png">PNG (Lossless Quality)</option>
                      <option value="jpeg">JPEG (Standard compression)</option>
                    </select>
                  </div>

                  <button
                    onClick={convertImageFormat}
                    disabled={!imageFile || converting}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                  >
                    {converting ? "Processing..." : "Convert Image Asset"}
                  </button>
                </div>

                {/* Conversion Preview & download */}
                <div className="flex flex-col justify-center items-center text-center p-6 border border-slate-800 rounded-xl bg-slate-950/20 space-y-4">
                  {convertedUrl ? (
                    <div className="space-y-4 w-full flex flex-col items-center">
                      <div className="relative border border-slate-800 rounded-lg overflow-hidden max-h-[140px] max-w-[200px]">
                        <img src={convertedUrl} alt="Converted Preview" className="object-contain max-h-[140px] max-w-[200px]" />
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                        CONVERSION READY
                      </Badge>
                      <a
                        href={convertedUrl}
                        download={`shopify_asset.${targetFormat}`}
                        className="w-full h-9 rounded-lg font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 flex items-center justify-center gap-1.5 transition-all text-xs"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Converted Asset</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-slate-500 space-y-1">
                      <ImageIcon className="h-10 w-10 mx-auto opacity-50 mb-2" />
                      <p className="font-bold">Awaiting Conversion</p>
                      <p className="text-[10px] max-w-[200px]">Upload an image, pick a target Shopify format, and trigger conversion.</p>
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
