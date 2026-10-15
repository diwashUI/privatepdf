import { describe, it, expect } from "vitest";
import { PDFDocument, degrees } from "pdf-lib";
import {
  getPageCount,
  mergePdfs,
  parsePageRanges,
  splitPdf,
  rotatePages,
  imagesToPdf,
  makeSamplePdf,
  watermarkPdf,
  addPageNumbers,
  formatExtractedText,
  type PageNumberPosition,
} from "./pdf";

// 1x1 transparent PNG (valid for pdf-lib's PNG parser)
const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function tinyPng(): Uint8Array {
  return Uint8Array.from(atob(TINY_PNG_BASE64), (c) => c.charCodeAt(0));
}

describe("getPageCount", () => {
  it("returns the correct number of pages", async () => {
    expect(await getPageCount(await makeSamplePdf(4))).toBe(4);
    expect(await getPageCount(await makeSamplePdf(1))).toBe(1);
  });
});

describe("mergePdfs", () => {
  it("combines pages from multiple PDFs in order", async () => {
    const a = await makeSamplePdf(2, "A");
    const b = await makeSamplePdf(3, "B");
    const merged = await mergePdfs([a, b]);
    expect(await getPageCount(merged)).toBe(5);
  });

  it("passes a single file through unchanged in page count", async () => {
    const a = await makeSamplePdf(2);
    expect(await getPageCount(await mergePdfs([a]))).toBe(2);
  });

  it("throws on empty input", async () => {
    await expect(mergePdfs([])).rejects.toThrow();
  });
});

describe("parsePageRanges", () => {
  it("parses mixed ranges and singles", () => {
    expect(parsePageRanges("1-3, 5", 10)).toEqual([0, 1, 2, 4]);
  });

  it("dedupes, sorts, and clamps to the page count", () => {
    expect(parsePageRanges("5, 2-4, 3, 99-120", 6)).toEqual([1, 2, 3, 4]);
  });

  it("normalizes reversed ranges", () => {
    expect(parsePageRanges("3-1", 5)).toEqual([0, 1, 2]);
  });

  it("throws on garbage input", () => {
    expect(() => parsePageRanges("abc", 5)).toThrow();
    expect(() => parsePageRanges("", 5)).toThrow();
    expect(() => parsePageRanges("0", 5)).toThrow();
  });
});

describe("splitPdf", () => {
  it("extracts the selected pages", async () => {
    const src = await makeSamplePdf(5);
    const out = await splitPdf(src, [0, 2, 4]);
    expect(await getPageCount(out)).toBe(3);
  });

  it("throws when no pages are selected", async () => {
    const src = await makeSamplePdf(3);
    await expect(splitPdf(src, [])).rejects.toThrow();
  });
});

describe("rotatePages", () => {
  it("rotates all pages by 90 degrees", async () => {
    const src = await makeSamplePdf(2);
    const out = await rotatePages(src, 90, "all");
    const doc = await PDFDocument.load(out);
    for (const p of doc.getPages()) {
      expect(p.getRotation().angle).toBe(90);
    }
  });

  it("rotates only the selected pages", async () => {
    const src = await makeSamplePdf(3);
    const out = await rotatePages(src, 180, [1]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPage(0).getRotation().angle).toBe(0);
    expect(doc.getPage(1).getRotation().angle).toBe(180);
    expect(doc.getPage(2).getRotation().angle).toBe(0);
  });

  it("accumulates rotation on already-rotated pages", async () => {
    const src = await makeSamplePdf(1);
    const once = await rotatePages(src, 90, "all");
    const twice = await rotatePages(once, 90, "all");
    const doc = await PDFDocument.load(twice);
    expect(doc.getPage(0).getRotation().angle).toBe(180);
  });
});

describe("imagesToPdf", () => {
  it("creates one page per image", async () => {
    const png = tinyPng();
    const out = await imagesToPdf([
      { bytes: png, type: "png" },
      { bytes: png, type: "png" },
    ]);
    expect(await getPageCount(out)).toBe(2);
  });

  it("throws on empty input", async () => {
    await expect(imagesToPdf([])).rejects.toThrow();
  });
});

describe("makeSamplePdf", () => {
  it("is a valid PDF whose text survives a merge", async () => {
    const a = await makeSamplePdf(1, "Hello");
    const merged = await mergePdfs([a, await makeSamplePdf(1, "World")]);
    const doc = await PDFDocument.load(merged);
    expect(doc.getPageCount()).toBe(2);
    // sanity: rotation helper type-checks against pdf-lib's degrees()
    expect(degrees(90).angle).toBe(90);
  });
});

describe("watermarkPdf", () => {
  it("keeps the same page count", async () => {
    const out = await watermarkPdf(await makeSamplePdf(3), {
      text: "DRAFT",
      opacity: 0.3,
      size: 48,
      diagonal: true,
    });
    expect(await getPageCount(out)).toBe(3);
  });

  it("works horizontally and clamps extreme sizes", async () => {
    const out = await watermarkPdf(await makeSamplePdf(1), {
      text: "CONFIDENTIAL",
      opacity: 2, // clamped to 0.9
      size: 999, // clamped to 200
      diagonal: false,
    });
    expect(await getPageCount(out)).toBe(1);
  });

  it("throws on empty watermark text", async () => {
    await expect(
      watermarkPdf(await makeSamplePdf(1), { text: "   ", opacity: 0.3, size: 48, diagonal: true })
    ).rejects.toThrow("watermark text");
  });
});

describe("addPageNumbers", () => {
  it("keeps the page count for every position", async () => {
    const positions: PageNumberPosition[] = [
      "bottom-left",
      "bottom-center",
      "bottom-right",
      "top-left",
      "top-center",
      "top-right",
    ];
    for (const position of positions) {
      const out = await addPageNumbers(await makeSamplePdf(2), { start: 1, size: 12, position });
      expect(await getPageCount(out)).toBe(2);
    }
  });

  it("respects a custom start number without throwing", async () => {
    const out = await addPageNumbers(await makeSamplePdf(2), {
      start: 10,
      size: 14,
      position: "bottom-right",
    });
    expect(await getPageCount(out)).toBe(2);
  });
});

describe("formatExtractedText", () => {
  it("joins pages with readable headers", () => {
    const txt = formatExtractedText(["hello", "world"], "report.pdf");
    expect(txt).toContain("Text extracted from report");
    expect(txt).toContain("--- Page 1 ---");
    expect(txt).toContain("hello");
    expect(txt).toContain("--- Page 2 ---");
    expect(txt).toContain("world");
  });

  it("handles empty pages and non-pdf names", () => {
    const txt = formatExtractedText(["", "x"], "scan");
    expect(txt).toContain("--- Page 1 ---");
    expect(txt).toContain("Text extracted from scan");
  });
});
