import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import ExtractTextTool from "./ExtractTextTool";

export const metadata: Metadata = {
  title: "Extract Text from PDF Online Free — No Upload, 100% Private",
  description:
    "Copy all text out of any PDF into a .txt file for free. Extraction runs entirely in your browser — your documents are never uploaded. No sign-up.",
};

const FAQ = [
  {
    q: "How do I get text out of a PDF?",
    a: "Drop your PDF above and click Extract text. The full text appears as a preview, and you can download it as a .txt file — page breaks are labeled for you.",
  },
  {
    q: "What if my PDF is a scanned document?",
    a: "Scanned pages are pictures of text, not real text, so there is nothing to extract. PrivatePDF will tell you when it finds no text.",
  },
  {
    q: "Is my document uploaded to a server?",
    a: "No. Text extraction happens 100% in your browser with local JavaScript. Your file never leaves your device.",
  },
  {
    q: "What format is the download?",
    a: "A plain .txt file (UTF-8) with each page's text under a labeled heading, ready to paste anywhere.",
  },
  {
    q: "Is this free?",
    a: "Yes — free for files up to 50MB. PrivatePDF Pro ($29 one-time) removes the file-size limit.",
  },
];

export default function ExtractTextPage() {
  return (
    <ToolShell
      title="Extract text from your PDF"
      description="Pull all the text out of a PDF into a plain .txt file."
      faq={FAQ}
      adSlotId="extract-text-below-workspace"
    >
      <ExtractTextTool />
    </ToolShell>
  );
}
