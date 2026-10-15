import { PDFDocument, degrees, StandardFonts, rgb } from "pdf-lib";

/**
 * Pure PDF manipulation functions (pdf-lib only — runs in Node and browser).
 * All page numbers in the public API are 1-indexed (what users see);
 * internally converted to 0-indexed.
 */

export async function getPageCount(pdfBytes: Uint8Array | ArrayBuffer): Promise<number> {
  const doc = await PDFDocument.load(pdfBytes);
  return doc.getPageCount();
}

export async function mergePdfs(files: (Uint8Array | ArrayBuffer)[]): Promise<Uint8Array> {
  if (files.length === 0) throw new Error("No files to merge.");
  const out = await PDFDocument.create();
  for (const bytes of files) {
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}

/**
 * Parse a page-range string like "1-3, 5, 7-9" into sorted, deduped,
 * 0-indexed page numbers, clamped to [0, pageCount).
 * Throws on unparseable input.
 */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) throw new Error("Enter at least one page or range.");

  for (const part of parts) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`Could not understand "${part}". Use formats like 1-3, 5.`);
    let start = parseInt(m[1], 10);
    let end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end < 1) throw new Error("Page numbers start at 1.");
    if (start > end) [start, end] = [end, start];
    for (let p = start; p <= end; p++) {
      if (p <= pageCount) pages.add(p - 1); // clamp: silently drop pages past the end
    }
  }
  if (pages.size === 0) throw new Error("No valid pages in that range.");
  return [...pages].sort((a, b) => a - b);
}

export async function splitPdf(
  pdfBytes: Uint8Array | ArrayBuffer,
  pages: number[] // 0-indexed
): Promise<Uint8Array> {
  if (pages.length === 0) throw new Error("No pages selected.");
  const src = await PDFDocument.load(pdfBytes);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, pages);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export async function rotatePages(
  pdfBytes: Uint8Array | ArrayBuffer,
  rotation: 90 | 180 | 270,
  pages: number[] | "all" = "all" // 0-indexed
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const targets = pages === "all" ? doc.getPageIndices() : pages;
  for (const i of targets) {
    const page = doc.getPage(i);
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + rotation) % 360));
  }
  return doc.save();
}

export interface ImageInput {
  bytes: Uint8Array;
  type: "jpg" | "png";
}

export async function imagesToPdf(images: ImageInput[]): Promise<Uint8Array> {
  if (images.length === 0) throw new Error("No images provided.");
  const doc = await PDFDocument.create();
  for (const img of images) {
    const embedded = img.type === "jpg" ? await doc.embedJpg(img.bytes) : await doc.embedPng(img.bytes);
    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }
  return doc.save();
}

/** Create a tiny sample PDF (used by tests and as a demo). */
export async function makeSamplePdf(pages: number, label = "Sample"): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i++) {
    const page = doc.addPage([612, 792]);
    page.drawText(`${label} — page ${i + 1}`, { x: 72, y: 720, size: 24, font });
  }
  return doc.save();
}

export interface WatermarkOptions {
  text: string;
  opacity: number; // 0..1
  size: number; // font size in pt
  diagonal: boolean;
}

/** Stamp text (e.g. DRAFT, CONFIDENTIAL) across every page. */
export async function watermarkPdf(
  pdfBytes: Uint8Array | ArrayBuffer,
  opts: WatermarkOptions
): Promise<Uint8Array> {
  if (!opts.text.trim()) throw new Error("Enter the watermark text first.");
  const opacity = Math.min(0.9, Math.max(0.05, opts.opacity));
  const size = Math.min(200, Math.max(8, Math.round(opts.size)));
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(opts.text, size);
    page.drawText(opts.text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.45, 0.45, 0.45),
      opacity,
      rotate: degrees(opts.diagonal ? 45 : 0),
    });
  }
  return doc.save();
}

export type PageNumberPosition =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "top-left"
  | "top-center"
  | "top-right";

export interface PageNumberOptions {
  start: number; // number printed on the first page
  size: number; // font size in pt
  position: PageNumberPosition;
}

/** Print "Page N" on every page at the chosen position. */
export async function addPageNumbers(
  pdfBytes: Uint8Array | ArrayBuffer,
  opts: PageNumberOptions
): Promise<Uint8Array> {
  const size = Math.min(72, Math.max(8, Math.round(opts.size)));
  const start = Math.max(1, Math.floor(opts.start) || 1);
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.getPages().forEach((page, i) => {
    const { width, height } = page.getSize();
    const label = `Page ${start + i}`;
    const textWidth = font.widthOfTextAtSize(label, size);
    const margin = 36;
    const x = opts.position.endsWith("left")
      ? margin
      : opts.position.endsWith("right")
        ? width - margin - textWidth
        : width / 2 - textWidth / 2;
    const y = opts.position.startsWith("top") ? height - margin : margin;
    page.drawText(label, { x, y, size, font, color: rgb(0.35, 0.35, 0.35) });
  });
  return doc.save();
}

/**
 * Join per-page extracted text into a readable .txt document.
 * Pure helper — safe to unit test in Node.
 */
export function formatExtractedText(pages: string[], fileName: string): string {
  const base = fileName.replace(/\.pdf$/i, "") || "document";
  const header = `Text extracted from ${base}\n${"=".repeat(40)}`;
  const body = pages.map((t, i) => `\n\n--- Page ${i + 1} ---\n\n${t.trim()}`).join("");
  return `${header}${body}\n`;
}
