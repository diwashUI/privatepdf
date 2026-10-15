"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { ProGate, formatMB } from "@/components/ProGate";
import { getPageCount } from "@/lib/pdf";
import { renderPageToDataUrl } from "@/lib/pdfjs-client";
import { downloadDataUrl } from "@/lib/download";
import { FREE_MAX_FILE_MB } from "@/lib/config";

export default function PdfToImagesTool() {
  const [file, setFile] = useState<{ name: string; size: number; bytes: Uint8Array; pages: number } | null>(null);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async (incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setError(null);
    setImages([]);
    const bytes = new Uint8Array(await f.arrayBuffer());
    try {
      const pages = await getPageCount(bytes);
      setFile({ name: f.name, size: f.size, bytes, pages });
    } catch {
      setError(`"${f.name}" could not be read as a PDF.`);
    }
  };

  if (file && file.size > FREE_MAX_FILE_MB * 1024 * 1024) {
    return (
      <ProGate
        reason={`"${file.name}" is ${formatMB(file.size)}. The free plan handles files up to ${FREE_MAX_FILE_MB}MB — Pro removes the limit.`}
      />
    );
  }

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setImages([]);
    try {
      const out: string[] = [];
      for (let p = 1; p <= file.pages; p++) {
        setProgress(`Rendering page ${p} of ${file.pages}…`);
        await new Promise((r) => setTimeout(r, 0));
        out.push(await renderPageToDataUrl(file.bytes, p, scale, "image/png"));
      }
      setImages(out);
      setProgress("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
      setProgress("");
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      downloadDataUrl(images[i], `page-${i + 1}.png`);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  if (!file) {
    return (
      <div>
        <Dropzone accept="application/pdf,.pdf" onFiles={load} title="Drop your PDF here" subtitle="or click to browse" />
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>
    );
  }

  const base = file.name.replace(/\.pdf$/i, "");

  return (
    <div>
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-500">{file.pages} pages · {formatMB(file.size)}</p>
        </div>
        <button onClick={() => { setFile(null); setImages([]); }} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          Choose another
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-slate-300 p-1" role="radiogroup" aria-label="Resolution">
          {[1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              aria-pressed={scale === s}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${scale === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {s}x
            </button>
          ))}
        </div>
        <button
          onClick={convert}
          disabled={busy}
          className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? "Converting…" : `Convert ${file.pages} page${file.pages === 1 ? "" : "s"} to PNG`}
        </button>
        {busy && progress && <p className="w-full text-sm text-slate-600">{progress}</p>}
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{images.length} images ready</p>
            <button onClick={downloadAll} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Download all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((url, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img src={url} alt={`Page ${i + 1} of ${file.name}`} className="aspect-[3/4] w-full object-cover" />
                <button
                  onClick={() => downloadDataUrl(url, `${base}-page-${i + 1}.png`)}
                  className="w-full border-t border-slate-100 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Download page {i + 1}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
