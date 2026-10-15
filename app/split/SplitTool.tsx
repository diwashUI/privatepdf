"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import LiveRegion from "@/components/LiveRegion";
import { ProGate, formatMB } from "@/components/ProGate";
import { splitPdf, getPageCount, parsePageRanges } from "@/lib/pdf";
import { downloadFile } from "@/lib/download";
import { FREE_MAX_FILE_MB } from "@/lib/config";

export default function SplitTool() {
  const [file, setFile] = useState<{ name: string; size: number; bytes: Uint8Array; pages: number } | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const load = async (incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setError(null);
    const bytes = new Uint8Array(await f.arrayBuffer());
    try {
      const pages = await getPageCount(bytes);
      setFile({ name: f.name, size: f.size, bytes, pages });
      setSelected(new Set());
      setRangeInput("");
      setStatus(`Loaded ${f.name}, ${pages} pages. Pick the pages to extract.`);
    } catch {
      const msg = `"${f.name}" could not be read as a PDF.`;
      setError(msg);
      setStatus(`Error: ${msg}`);
    }
  };

  const toggle = (p: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const applyRanges = () => {
    if (!file) return;
    setError(null);
    try {
      const pages = parsePageRanges(rangeInput, file.pages);
      setSelected(new Set(pages));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid range.";
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

  const split = async () => {
    if (!file || selected.size === 0) return;
    setBusy(true);
    setError(null);
    setStatus(`Extracting ${selected.size} pages…`);
    try {
      await new Promise((r) => setTimeout(r, 30));
      const out = await splitPdf(file.bytes, [...selected].sort((a, b) => a - b));
      downloadFile(out, "split.pdf");
      setStatus("Done — your extracted pages downloaded.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Splitting failed.";
      setError(msg);
      setStatus(`Error: ${msg}`);
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

  const chips = [];
  const maxChips = Math.min(file.pages, 400);
  for (let i = 0; i < maxChips; i++) chips.push(i);

  return (
    <div>
      <LiveRegion message={status} />
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-500">{file.pages} pages · {formatMB(file.size)}</p>
        </div>
        <button onClick={() => { setFile(null); setSelected(new Set()); setStatus(""); }} className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-medium text-slate-500 hover:text-slate-800">
          Choose another
        </button>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          <input
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="Pages: 1-3, 5, 8-10"
            aria-label="Page ranges"
            className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button onClick={applyRanges} className="inline-flex min-h-[44px] items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
            Apply
          </button>
          <button onClick={() => setSelected(new Set(Array.from({ length: file.pages }, (_, i) => i)))} className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            All
          </button>
          <button onClick={() => setSelected(new Set())} className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            None
          </button>
        </div>

        <div className="mt-4 flex max-h-56 flex-wrap gap-1.5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4" role="group" aria-label="Select pages">
          {chips.map((p) => (
            <button
              key={p}
              onClick={() => toggle(p)}
              aria-pressed={selected.has(p)}
              className={`h-11 w-12 rounded-lg text-sm font-medium transition ${
                selected.has(p)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p + 1}
            </button>
          ))}
          {file.pages > maxChips && (
            <p className="w-full pt-2 text-xs text-slate-500">
              Showing first {maxChips} pages — use the range box above for the rest.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={split}
          disabled={busy || selected.size === 0}
          className="inline-flex min-h-[44px] items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? "Splitting…" : `Extract ${selected.size} page${selected.size === 1 ? "" : "s"}`}
        </button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
