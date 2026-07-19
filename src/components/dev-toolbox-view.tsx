"use client";

import React, { useState } from "react";
import { generateShopifyHandle, getShopifyApiVersions } from "@/lib/developer-toolbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Braces, ShieldCheck, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DevToolboxView() {
  // Handle generator state
  const [titleInput, setTitleInput] = useState("");
  const [handleOutput, setHandleOutput] = useState("");

  // Webhook verification state
  const [payloadText, setPayloadText] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [hmacHeader, setHmacHeader] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitleInput(val);
    setHandleOutput(generateShopifyHandle(val));
  };

  // HMAC verification utilizing browser subtle Web Crypto API (no external request needed)
  const verifyWebhookClientSide = async () => {
    if (!payloadText || !secretInput || !hmacHeader) return;
    setVerifying(true);
    setVerificationResult(null);

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretInput);
      const messageData = encoder.encode(payloadText);

      // Import secret as HMAC key
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      // Calculate HMAC signature
      const signatureBuffer = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        messageData
      );

      // Convert signature to Base64
      const signatureBytes = new Uint8Array(signatureBuffer);
      let binary = "";
      for (let i = 0; i < signatureBytes.byteLength; i++) {
        binary += String.fromCharCode(signatureBytes[i]);
      }
      const calculatedHmac = btoa(binary);

      // Compare calculated vs provided HMAC
      const match = calculatedHmac.trim() === hmacHeader.trim();
      setVerificationResult(match);
    } catch (err) {
      console.error(err);
      setVerificationResult(false);
    } finally {
      setVerifying(false);
    }
  };

  const apiVersions = getShopifyApiVersions();

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-indigo-500" />
            <span>Developer Toolbox</span>
          </CardTitle>
          <CardDescription className="text-[11px]">
            Helper utilities for Shopify App and Theme development workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-xs">
          <Tabs defaultValue="handle_gen" className="space-y-4">
            <TabsList className="grid grid-cols-3 max-w-xl bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="handle_gen">Handle Generator</TabsTrigger>
              <TabsTrigger value="webhook_val">Webhook Verifier</TabsTrigger>
              <TabsTrigger value="api_versions">API Version Checker</TabsTrigger>
            </TabsList>

            {/* Handle Generator */}
            <TabsContent value="handle_gen" className="space-y-4 max-w-2xl">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">STRING VALUE</span>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Red Leather T-Shirt (Fall Collection!)"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">SHOPIFY HANDLE</span>
                  <input
                    type="text"
                    readOnly
                    value={handleOutput}
                    placeholder="red-leather-t-shirt-fall-collection"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950/60 bg-slate-50/50 font-mono text-indigo-600 dark:text-teal-400 font-semibold"
                  />
                </div>
                
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  Shopify uses handles to access products, pages, smart collections, and custom blog templates dynamically in URLs.
                </p>
              </div>
            </TabsContent>

            {/* Webhook Verifier */}
            <TabsContent value="webhook_val" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">RAW WEBHOOK BODY (JSON)</span>
                    <textarea
                      rows={8}
                      value={payloadText}
                      onChange={(e) => setPayloadText(e.target.value)}
                      placeholder='{"id": 1234567, "email": "customer@shop.com"}'
                      className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono text-[11px] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">SHOPIFY WEBHOOK CLIENT SECRET</span>
                    <input
                      type="password"
                      value={secretInput}
                      onChange={(e) => setSecretInput(e.target.value)}
                      placeholder="Enter app client secret key"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">X-SHOPIFY-HMAC-SHA256 HEADER VALUE</span>
                    <input
                      type="text"
                      value={hmacHeader}
                      onChange={(e) => setHmacHeader(e.target.value)}
                      placeholder="Base64 encoded signature header"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>

                  <button
                    onClick={verifyWebhookClientSide}
                    disabled={!payloadText || !secretInput || !hmacHeader || verifying}
                    className="w-full h-9 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                  >
                    <span>Verify Authenticity</span>
                  </button>
                </div>

                {/* Verification results display */}
                <div className="flex flex-col justify-center items-center text-center p-6 border border-slate-100 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                  {verificationResult === null ? (
                    <div className="space-y-2 text-slate-400">
                      <ShieldCheck className="h-10 w-10 mx-auto opacity-50" />
                      <p className="font-bold">Awaiting Inputs</p>
                      <p className="text-[10px] max-w-[240px]">Paste payload details, header credentials, and click verify.</p>
                    </div>
                  ) : verificationResult ? (
                    <div className="space-y-2 text-emerald-600">
                      <ShieldCheck className="h-10 w-10 mx-auto text-emerald-500" />
                      <p className="font-bold">HMAC Match Verified</p>
                      <p className="text-[10px] text-slate-500 max-w-[240px]">Webhook is authentic. Calculated signature matches header hash.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-rose-600">
                      <AlertCircle className="h-10 w-10 mx-auto text-rose-500 animate-bounce" />
                      <p className="font-bold">Verification Failed</p>
                      <p className="text-[10px] text-slate-500 max-w-[240px]">Calculated signature does NOT match header hmac. Payload may be tampered.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* API Version Checker */}
            <TabsContent value="api_versions" className="space-y-4">
              <div className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-150 dark:border-slate-800 font-bold text-slate-500">
                      <th className="p-3">API Version</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Release Date</th>
                      <th className="p-3">Supported Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiVersions.map((api, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                      >
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-355">
                          {api.version}
                        </td>
                        <td className="p-3">
                          {api.status === "active" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                              Active
                            </Badge>
                          ) : api.status === "release_candidate" ? (
                            <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                              RC Release
                            </Badge>
                          ) : api.status === "deprecated" ? (
                            <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                              Deprecated
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                              Unstable Dev
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{api.releaseDate}</span>
                        </td>
                        <td className="p-3 text-slate-500">{api.supportedUntil}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
