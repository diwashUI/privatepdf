import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import CompressTool from "./CompressTool";

export const metadata: Metadata = {
  title: "Compress PDF Online Free — Reduce Size Without Uploading | PrivatePDF",
  description:
    "Reduce PDF file size for free, right in your browser. Your document is never uploaded to any server. Choose your quality, download instantly.",
};

const FAQ = [
  {
    q: "How does PDF compression work here?",
    a: "Your browser re-renders each page at a smaller size and re-compresses images, then rebuilds the PDF locally. Pick High, Medium, or Low quality depending on how small you need the file.",
  },
  {
    q: "Will my PDF be uploaded to compress it?",
    a: "No — compression runs 100% on your device. This is the key difference from most online compressors, which upload your file to their servers first.",
  },
  {
    q: "Will text still be selectable after compression?",
    a: "Compressed pages are re-rendered as images, so text selection won't work in the output. For documents where selectable text matters, use the High quality setting.",
  },
  {
    q: "How much smaller will my PDF get?",
    a: "It depends on the original. Scanned or image-heavy PDFs often shrink 50–80%. Already-optimized PDFs shrink less — you'll see the exact before/after sizes before downloading.",
  },
];

export default function CompressPage() {
  return (
    <ToolShell
      title="Compress PDF"
      description="Shrink your PDF's file size without uploading it anywhere. Choose a quality level and see the savings before you download."
      faq={FAQ}
      adSlotId="compress-below-workspace"
    >
      <CompressTool />
    </ToolShell>
  );
}
