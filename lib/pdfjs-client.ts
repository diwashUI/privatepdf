/**
 * Browser-only PDF rendering helpers (pdf.js). Import from client components
 * only — never from server components or Node tests.
 */
import * as pdfjsLib from "pdfjs-dist";

let workerReady = false;

export function ensurePdfWorker() {
  if (!workerReady) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    workerReady = true;
  }
}

async function loadDoc(data: Uint8Array | ArrayBuffer) {
  ensurePdfWorker();
  const bytes = data instanceof Uint8Array ? data.slice() : new Uint8Array(data);
  return pdfjsLib.getDocument({ data: bytes }).promise;
}

/** Render one page (1-indexed) to a JPEG data URL at the given scale. */
export async function renderPageToDataUrl(
  data: Uint8Array | ArrayBuffer,
  pageNumber: number,
  scale = 1.5,
  mimeType = "image/jpeg",
  quality = 0.85
): Promise<string> {
  const doc = await loadDoc(data);
  try {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported.");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL(mimeType, quality);
  } finally {
    await doc.cleanup();
  }
}

export async function getPdfPageCount(data: Uint8Array | ArrayBuffer): Promise<number> {
  const doc = await loadDoc(data);
  try {
    return doc.numPages;
  } finally {
    await doc.cleanup();
  }
}

/** Extract the plain text of every page, in page order. */
export async function extractPdfText(data: Uint8Array | ArrayBuffer): Promise<string[]> {
  const doc = await loadDoc(data);
  try {
    const out: string[] = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const text = content.items
        .map((it) => ("str" in it ? (it as { str: string }).str : ""))
        .join(" ");
      out.push(text.replace(/\s+/g, " ").trim());
    }
    return out;
  } finally {
    await doc.cleanup();
  }
}
