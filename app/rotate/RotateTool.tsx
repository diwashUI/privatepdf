"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import LiveRegion from "@/components/LiveRegion";
import Options from "@/components/Options";
import { ProGate, formatMB } from "@/components/ProGate";
import { rotatePages, getPageCount, parsePageRanges } from "@/lib/pdf";
import { renderPageToDataUrl } from "@/lib/pdfjs-client";
import { downloadFile } from "@/lib/download";
import { FREE_MAX_FILE_MB } from "@/lib/config";

const ROTATIONS = [
  { id: "cw", label: "90° clockwise", value: 90 },
  { id: "ccw", label: "90° counter-clockwise", value: 270 },
  { id: "flip", label: "180°", value: 180 },
] as const;

export default function RotateTool() {
  const [file, setFile] = useState<{ name: string; size: number; bytes: Uint8Array; pages: number } | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [scope, setScope] = useState<"all" | "range">("all");
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
      const t = await renderPageToDataUrl(bytes, 1, 0.4, "image/jpeg", 0.7).catch(() => null);
      setFile({ name: f.name, size: f.size, bytes, pages });
      setThumb(t);
      setStatus(`Loaded ${f.name}, ${pages} pages.`);
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

  const rotate = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setStatus("Rotating pages…");
    try {
      let pages: number[] | "all" = "all";
      if (scope === "range") pages = parsePageRanges(rangeInput, file.pages);
      await new Promise((r) => setTimeout(r, 30));
      const out = await rotatePages(file.bytes, rotation, pages);
      downloadFile(out, "rotated.pdf");
      setStatus("Done — your rotated PDF downloaded.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Rotation failed.";
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

  return (
    <div>
      <LiveRegion message={status} />
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        {thumb ? (
          <img src={thumb} alt={`First page of ${file.name}`} className="h-20 w-16 rounded border border-slate-200 object-cover" />
        ) : (
          <div className="flex h-20 w-16 items-center justify-center rounded border border-slate-200 bg-slate-100 text-xs text-slate-400">PDF</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-500">{file.pages} pages · {formatMB(file.size)}</p>
        </div>
        <button onClick={() => { setFile(null); setStatus(""); }} className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-medium text-slate-500 hover:text-slate-800">
          Choose another
        </button>
      </div>

      <Options>
        <div className="space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Rotation</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {ROTATIONS.map((r) => (
                <label
                  key={r.id}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition ${
                    rotation === r.value ? "border-blue-600 bg-blue-50/60" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input type="radio" name="rotation" className="sr-only" checked={rotation === r.value} onChange={() => setRotation(r.value)} />
                  <span className="text-2xl" aria-hidden>
                    <svg className="mx-auto h-7 w-7 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={r.id === "flip" ? { transform: "rotate(180deg)" } : r.id === "ccw" ? { transform: "scaleX(-1)" } : undefined}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Pages</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setScope("all")}
                aria-pressed={scope === "all"}
                className={`inline-flex min-h-[44px] items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${scope === "all" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
              >
                All pages
              </button>
              <button
                onClick={() => setScope("range")}
                aria-pressed={scope === "range"}
                className={`inline-flex min-h-[44px] items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${scope === "range" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
              >
                Choose pages
              </button>
            </div>
            {scope === "range" && (
              <input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="Pages: 1-3, 5, 8-10"
                aria-label="Page ranges"
                className="mt-3 min-h-[44px] w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            )}
          </fieldset>
        </div>
      </Options>

      <div className="mt-6">
        <button
          onClick={rotate}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? "Rotating…" : "Rotate & download"}
        </button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
