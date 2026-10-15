"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "@/components/Dropzone";
import LiveRegion from "@/components/LiveRegion";
import Options from "@/components/Options";
import { ProGate, formatMB } from "@/components/ProGate";
import { getPageCount } from "@/lib/pdf";
import { renderPageToDataUrl } from "@/lib/pdfjs-client";
import { downloadFile } from "@/lib/download";
import { FREE_MAX_FILE_MB } from "@/lib/config";

const QUALITIES = [
  { id: "high", label: "High", desc: "Good quality, moderate savings", scale: 1.6, jpeg: 0.82 },
  { id: "medium", label: "Medium", desc: "Balanced size and quality", scale: 1.15, jpeg: 0.68 },
  { id: "low", label: "Low", desc: "Smallest file, readable text", scale: 0.8, jpeg: 0.5 },
] as const;

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export default function CompressTool() {
  const [file, setFile] = useState<{ name: string; size: number; bytes: Uint8Array; pages: number } | null>(null);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>(QUALITIES[1]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{ bytes: Uint8Array; savedPct: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const load = async (incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setError(null);
    setResult(null);
    const bytes = new Uint8Array(await f.arrayBuffer());
    try {
      const pages = await getPageCount(bytes);
      setFile({ name: f.name, size: f.size, bytes, pages });
      setStatus(`Loaded ${f.name}, ${pages} pages. Pick a quality and compress.`);
    } catch {
      const msg = `"${f.name}" could not be read as a PDF.`;
      setError(msg);
      setStatus(`Error: ${msg}`);
    }
  };

  if (file && file.size > FREE_MAX_FILE_MB * 1024 * 1024) {
    return (
      <ProGate
        reason={`"${file.name}" is ${formatMB(file.size)}. The free plan handles files up to ${FREE_MAX_FILE_MB}MB — Pro removes the limit.`}
      />
    );
  }

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await PDFDocument.create();
      for (let p = 1; p <= file.pages; p++) {
        const msg = `Rendering page ${p} of ${file.pages}…`;
        setProgress(msg);
        setStatus(msg);
        await new Promise((r) => setTimeout(r, 0));
        const url = await renderPageToDataUrl(file.bytes, p, quality.scale, "image/jpeg", quality.jpeg);
        const jpg = await out.embedJpg(dataUrlToBytes(url));
        const page = out.addPage([jpg.width, jpg.height]);
        page.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
      }
      setProgress("Finalizing…");
      setStatus("Finalizing…");
      const bytes = await out.save({ useObjectStreams: true });
      const savedPct = Math.max(0, Math.round((1 - bytes.length / file.size) * 100));
      setResult({ bytes, savedPct });
      setProgress("");
      setStatus(`Done — file is ${savedPct}% smaller. Download below.`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Compression failed.";
      setError(msg);
      setStatus(`Error: ${msg}`);
      setProgress("");
    } finally {
      setBusy(false);
    }
  };

  if (!file) {
    return (
      <div>
        <Dropzone accept="application/pdf,.pdf" onFiles={load} title="Drop your PDF here" subtitle="or click to browse" />
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
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
          <p className="text-xs text-slate-500">{file.pages} pages · {formatMB(file.size)}</p>
        </div>
        <button onClick={() => { setFile(null); setResult(null); setStatus(""); }} className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-medium text-slate-500 hover:text-slate-800">
          Choose another
        </button>
      </div>

      <Options>
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Quality</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {QUALITIES.map((q) => (
              <label
                key={q.id}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  quality.id === q.id ? "border-blue-600 bg-blue-50/60" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="quality"
                  className="sr-only"
                  checked={quality.id === q.id}
                  onChange={() => setQuality(q)}
                />
                <span className="font-bold text-slate-900">{q.label}</span>
                <span className="mt-1 block text-sm text-slate-500">{q.desc}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </Options>

      <div className="mt-6">
        <button
          onClick={compress}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? "Compressing…" : "Compress PDF"}
        </button>
        {busy && progress && <p className="mt-3 text-sm text-slate-600">{progress}</p>}
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="text-3xl font-bold text-emerald-700">{result.savedPct}% smaller</p>
          <p className="mt-1 text-sm text-slate-600">
            {formatMB(file.size)} → {formatMB(result.bytes.length)}
          </p>
          <button
            onClick={() => downloadFile(result.bytes, "compressed.pdf")}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Download compressed PDF
          </button>
        </div>
      )}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
