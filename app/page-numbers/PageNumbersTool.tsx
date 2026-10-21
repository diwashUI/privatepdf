"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import LiveRegion from "@/components/LiveRegion";
import Options from "@/components/Options";
import { ProGate, formatMB } from "@/components/ProGate";
import { addPageNumbers, getPageCount, type PageNumberPosition } from "@/lib/pdf";
import { downloadFile } from "@/lib/download";
import { FREE_MAX_FILE_MB } from "@/lib/config";
import { isPro } from "@/lib/pro";

interface LoadedFile {
  name: string;
  size: number;
  bytes: Uint8Array;
  pages: number;
}

const POSITIONS: { value: PageNumberPosition; label: string }[] = [
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
];

export default function PageNumbersTool() {
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [start, setStart] = useState(1);
  const [size, setSize] = useState(12);
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
    setBusy(true);
    setError(null);
    setResult(null);
    setStatus(`Numbering ${file.pages} pages…`);
    try {
      await new Promise((r) => setTimeout(r, 30)); // let the UI paint the status
      const out = await addPageNumbers(file.bytes, { start, size, position });
      downloadFile(out, "numbered.pdf");
      setResult(out);
      setStatus("Done — your numbered PDF downloaded.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Numbering failed.";
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pn-position" className="mb-1 block text-sm font-semibold text-slate-900">
            Position
          </label>
          <select
            id="pn-position"
            value={position}
            onChange={(e) => setPosition(e.target.value as PageNumberPosition)}
            className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-4 text-sm focus:border-blue-500 focus:outline-none"
          >
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pn-start" className="mb-1 block text-sm font-semibold text-slate-900">
            First page number
          </label>
          <input
            id="pn-start"
            type="number"
            min={1}
            max={99999}
            value={start}
            onChange={(e) => setStart(Math.max(1, Number(e.target.value) || 1))}
            className="min-h-[44px] w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">Useful when the first pages are a cover.</p>
        </div>
      </div>

      <Options>
        <div>
          <label htmlFor="pn-size" className="mb-1 block text-sm font-semibold text-slate-900">
            Number size: {size}pt
          </label>
          <input
            id="pn-size"
            type="range"
            min={8}
            max={36}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="h-11 w-full accent-blue-600"
          />
        </div>
      </Options>

      <div className="mt-6">
        <button
          onClick={run}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? "Adding numbers…" : "Add page numbers"}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-bold text-emerald-800">Page numbers added</p>
          <p className="mt-1 text-sm text-slate-600">Your file downloaded. Need it again?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => result && downloadFile(result, "numbered.pdf")}
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
