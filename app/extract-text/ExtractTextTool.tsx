"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import LiveRegion from "@/components/LiveRegion";
import { ProGate, formatMB } from "@/components/ProGate";
import { getPageCount } from "@/lib/pdf";
import { extractPdfText } from "@/lib/pdfjs-client";
import { formatExtractedText } from "@/lib/pdf";
import { FREE_MAX_FILE_MB } from "@/lib/config";

interface LoadedFile {
  name: string;
  size: number;
  bytes: Uint8Array;
  pages: number;
}

export default function ExtractTextTool() {
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async (incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setError(null);
    setText(null);
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

  if (file && file.size > FREE_MAX_FILE_MB * 1024 * 1024) {
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
    setText(null);
    setStatus(`Reading text from ${file.pages} pages…`);
    try {
      await new Promise((r) => setTimeout(r, 30)); // let the UI paint the status
      const pages = await extractPdfText(file.bytes);
      const combined = pages.join(" ").trim();
      if (!combined) {
        const msg =
          "No text found in this PDF. Scanned pages are images, not text — there is nothing to extract.";
        setError(msg);
        setStatus(`Error: ${msg}`);
        return;
      }
      setText(formatExtractedText(pages, file.name));
      setStatus("Done — text extracted. Preview below, download when ready.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Text extraction failed.";
      setError(msg);
      setStatus(`Error: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!file || text === null) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, "") + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setText(null);
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

      {!text && (
        <div className="mt-6">
          <button
            onClick={run}
            disabled={busy}
            className="inline-flex min-h-[44px] items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
          >
            {busy ? "Reading text…" : "Extract text"}
          </button>
        </div>
      )}

      {text !== null && (
        <div className="mt-6">
          <section
            aria-label="Extracted text preview"
            className="max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{text}</p>
          </section>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={download}
              className="inline-flex min-h-[44px] items-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Download .txt
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
