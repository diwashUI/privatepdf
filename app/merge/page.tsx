import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import MergeTool from "./MergeTool";

export const metadata: Metadata = {
  title: "Merge PDF Online Free — No Upload, 100% Private",
  description:
    "Combine multiple PDF files into one document for free. Files are merged entirely in your browser — never uploaded to any server. No sign-up, no watermarks.",
};

const FAQ = [
  {
    q: "How do I merge PDF files?",
    a: "Drop two or more PDFs into the box above, drag them into the order you want (or use the arrow buttons), then click Merge. The combined PDF downloads instantly.",
  },
  {
    q: "Are my PDFs uploaded to a server when merging?",
    a: "No. Merging happens 100% in your browser with local JavaScript. Your documents never leave your device — verify it in DevTools under the Network tab.",
  },
  {
    q: "How many PDFs can I merge at once?",
    a: "The free plan merges up to 5 files per batch, each up to 50MB. PrivatePDF Pro removes these limits for a single $29 payment.",
  },
  {
    q: "Will merging change my PDF quality?",
    a: "No. Pages are copied losslessly — text, images, and formatting stay exactly as they were.",
  },
];

export default function MergePage() {
  return (
    <ToolShell
      title="Merge PDF files"
      description="Combine multiple PDFs into a single document. Reorder them however you like — everything happens on your device."
      faq={FAQ}
      adSlotId="merge-below-workspace"
    >
      <MergeTool />
    </ToolShell>
  );
}
