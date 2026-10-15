"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { ProGate, formatMB } from "@/components/ProGate";
import { mergePdfs, getPageCount } from "@/lib/pdf";
import { renderPageToDataUrl } from "@/lib/pdfjs-client";
import { downloadFile } from "@/lib/download";
import { FREE_MAX_FILE_MB, FREE_MAX_MERGE_FILES } from "@/lib/config";

interface PdfFile {
  id: string;
  name: string;
  size: number;
  bytes: Uint8Array;
  pages: number;
  thumb: string | null;
}

let uid = 0;

export default function MergeTool() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (incoming: File[]) => {
    setError(null);
    const pdfs = incoming.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) {
      setError("Please choose PDF files.");
      return;
    }
    const next: PdfFile[] = [];
    for (const f of pdfs) {
      const bytes = new Uint8Array(await f.arrayBuffer());
      let pages = 0;
      let thumb: string | null = null;
      try {
        pages = await getPageCount(bytes);
        thumb = await renderPageToDataUrl(bytes, 1, 0.35, "image/jpeg", 0.7);
      } catch {
        setError(`"${f.name}" could not be read as a PDF.`);
        continue;
      }
      next.push({ id: `${Date.now()}-${uid++}`, name: f.name, size: f.size, bytes, pages, thumb });
    }
    setFiles((prev) => [...prev, ...next]);
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const oversized = files.find((f) => f.size > FREE_MAX_FILE_MB * 1024 * 1024);
  if (oversized) {
    return (
      <ProGate
        reason={`"${oversized.name}" is ${formatMB(oversized.size)}. The free plan handles files up to ${FREE_MAX_FILE_MB}MB — Pro removes the limit.`}
      />
    );
  }
  if (files.length > FREE_MAX_MERGE_FILES) {
    return (
      <ProGate
        reason={`You added ${files.length} files. The free plan merges up to ${FREE_MAX_MERGE_FILES} files per batch — Pro merges unlimited files at once.`}
      />
    );
  }

  const merge = async () => {
    setBusy(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 30)); // let the UI paint the spinner
      const out = await mergePdfs(files.map((f) => f.bytes));
      downloadFile(out, "merged.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Merging failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {files.length === 0 ? (
        <Dropzone
          accept="application/pdf,.pdf"
          multiple
          onFiles={addFiles}
          title="Drop your PDFs here"
          subtitle="or click to browse — select multiple files"
        />
      ) : (
        <div>
          <ul className="space-y-3">
            {files.map((f, i) => (
              <li
                key={f.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3"
              >
                {f.thumb ? (
                  <img src={f.thumb} alt={`First page of ${f.name}`} className="h-16 w-12 rounded border border-slate-200 object-cover" />
                ) : (
                  <div className="flex h-16 w-12 items-center justify-center rounded border border-slate-200 bg-slate-100 text-xs text-slate-400">PDF</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{f.name}</p>
                  <p className="text-xs text-slate-500">{f.pages} pages · {formatMB(f.size)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label="Move down" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">↓</button>
                  <button onClick={() => remove(f.id)} aria-label={`Remove ${f.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">✕</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={merge}
              disabled={busy || files.length < 2}
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
            >
              {busy ? "Merging…" : `Merge ${files.length} PDFs`}
            </button>
            <label className="cursor-pointer rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Add more
              <input type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles([...e.target.files]); e.target.value = ""; }} />
            </label>
            <button onClick={() => setFiles([])} className="text-sm font-medium text-slate-500 hover:text-slate-800">
              Start over
            </button>
          </div>
          {files.length < 2 && (
            <p className="mt-3 text-sm text-slate-500">Add at least 2 PDFs to merge.</p>
          )}
        </div>
      )}
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
