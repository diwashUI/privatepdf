"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { ProGate } from "@/components/ProGate";
import { imagesToPdf, ImageInput } from "@/lib/pdf";
import { downloadFile } from "@/lib/download";

interface Img {
  id: string;
  name: string;
  bytes: Uint8Array;
  type: "jpg" | "png";
  url: string;
}

let uid = 0;
const FREE_MAX_IMAGES = 20;

export default function ImagesToPdfTool() {
  const [images, setImages] = useState<Img[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (incoming: File[]) => {
    setError(null);
    const next: Img[] = [];
    for (const f of incoming) {
      const lower = f.name.toLowerCase();
      const type = lower.endsWith(".png") ? "png" : lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "jpg" : null;
      if (!type) {
        setError(`"${f.name}" is not a JPG or PNG image.`);
        continue;
      }
      const bytes = new Uint8Array(await f.arrayBuffer());
      next.push({ id: `${Date.now()}-${uid++}`, name: f.name, bytes, type, url: URL.createObjectURL(f) });
    }
    setImages((prev) => [...prev, ...next]);
  };

  const move = (i: number, dir: -1 | 1) => {
    setImages((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remove = (id: string) =>
    setImages((prev) => {
      const gone = prev.find((x) => x.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return prev.filter((x) => x.id !== id);
    });

  if (images.length > FREE_MAX_IMAGES) {
    return (
      <ProGate
        reason={`You added ${images.length} images. The free plan converts up to ${FREE_MAX_IMAGES} images per PDF — Pro converts unlimited images at once.`}
      />
    );
  }

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 30));
      const inputs: ImageInput[] = images.map((i) => ({ bytes: i.bytes, type: i.type }));
      const out = await imagesToPdf(inputs);
      downloadFile(out, "images.pdf");
    } catch {
      setError("Could not create the PDF. One of the images may be corrupt.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {images.length === 0 ? (
        <Dropzone
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          onFiles={addFiles}
          title="Drop your images here"
          subtitle="JPG or PNG — select multiple"
        />
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={img.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img src={img.url} alt={img.name} className="aspect-square w-full object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex items-center justify-center gap-1 border-t border-slate-100 p-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">←</button>
                  <button onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move later" className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">→</button>
                  <button onClick={() => remove(img.id)} aria-label={`Remove ${img.name}`} className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600">✕</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={create}
              disabled={busy}
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
            >
              {busy ? "Creating…" : `Create PDF from ${images.length} image${images.length === 1 ? "" : "s"}`}
            </button>
            <label className="cursor-pointer rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Add more
              <input type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles([...e.target.files]); e.target.value = ""; }} />
            </label>
            <button onClick={() => { images.forEach((x) => URL.revokeObjectURL(x.url)); setImages([]); }} className="text-sm font-medium text-slate-500 hover:text-slate-800">
              Start over
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
