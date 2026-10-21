"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import LiveRegion from "@/components/LiveRegion";
import Options from "@/components/Options";
import { ProGate, formatMB } from "@/components/ProGate";
import { watermarkPdf, getPageCount } from "@/lib/pdf";
import { downloadFile } from "@/lib/download";
import { FREE_MAX_FILE_MB } from "@/lib/config";
import { isPro } from "@/lib/pro";

interface LoadedFile {
  name: string;
  size: number;
  bytes: Uint8Array;
  pages: number;
}

export default function WatermarkTool() {
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [text, setText] = useState("DRAFT");
  const [opacity, setOpacity] = useState(30);
  const [size, setSize] = useState(48);
  const [diagonal, setDiagonal] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async (incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setError(null);
    setResult(null);
    const bytes = new Uint8Array(await f.arrayBuffer());
    try {
      const pages = await getPageCount(bytes);
      setFile({ name: f.name, size: f.size, bytes, pages });
      setStatus(`Loaded ${f.name}, ${pages} pages.`);
    } catch {
      const msg = `"${f.name}" could not be read as a PDF.`;
      setError(msg);
      setStatus(`Error: ${msg}`);
    }
  };

  if (!isPro() && file && file.size > FREE_MAX_FILE_MB * 1024 * 1024) {
    return (
      <ProGate
        reason={`"${file.name}" is ${formatMB(file.size)}. The free plan handles files up to ${FREE_MAX_FILE_MB}MB — Pro removes the limit.`}
      />
    );
  }

  const run = async () => {
    if (!file) return;
    if (!text.trim()) {
      const msg = "Type your watermark text first.";
      setError(msg);
      setStatus(`Error: ${msg}`);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setStatus(`Adding watermark to ${file.pages} pages…`);
    try {
      await new Promise((r) => setTimeout(r, 30)); // let the UI paint the status
      const out = await watermarkPdf(file.bytes, {
        text: text.trim(),
        opacity: opacity / 100,
        size,
        diagonal,
      });
      downloadFile(out, "watermarked.pdf");
      setResult(out);
      setStatus("Done — your watermarked PDF downloaded.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Watermarking failed.";
      setError(msg);
      setStatus(`Error: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setStatus("");
  };

  if (!file) {
    return (
      <div>
        <Dropzone
          accept="application/pdf,.pdf"
          onFiles={load}
          title="Drop your PDF here"
          subtitle="or click to browse"
        />
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <LiveRegion message={status} />
      </div>
    );
  }

  return (
    <div>
      <LiveRegion message={status} />
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-500">
            {file.pages} pages · {formatMB(file.size)}
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          Choose another
        </button>
      </div>

      <div className="mt-6">
        <label htmlFor="wm-text" className="mb-1 block text-sm font-semibold text-slate-900">
          Watermark text
        </label>
        <input
          id="wm-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="DRAFT"
          maxLength={60}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <Options>
        <div className="space-y-5">
          <div>
            <label htmlFor="wm-opacity" className="mb-1 block text-sm font-semibold text-slate-900">
              Transparency: {opacity}%
            </label>
            <input
              id="wm-opacity"
              type="range"
              min={5}
              max={90}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="h-11 w-full accent-blue-600"
            />
            <p className="text-xs text-slate-500">Lower is more see-through.</p>
          </div>
          <div>
            <label htmlFor="wm-size" className="mb-1 block text-sm font-semibold text-slate-900">
              Text size: {size}pt
            </label>
            <input
              id="wm-size"
              type="range"
              min={12}
              max={120}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-11 w-full accent-blue-600"
            />
          </div>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm font-medium text-slate-900">
            <input
              type="checkbox"
              checked={diagonal}
              onChange={(e) => setDiagonal(e.target.checked)}
              className="h-5 w-5 accent-blue-600"
            />
            Diagonal (uncheck for horizontal)
          </label>
        </div>
      </Options>

      <div className="mt-6">
        <button
          onClick={run}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? "Adding watermark…" : "Add watermark"}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-bold text-emerald-800">Watermark added</p>
          <p className="mt-1 text-sm text-slate-600">Your file downloaded. Need it again?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => result && downloadFile(result, "watermarked.pdf")}
              className="inline-flex min-h-[44px] items-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Download again
            </button>
            <button
              onClick={reset}
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Start over
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
