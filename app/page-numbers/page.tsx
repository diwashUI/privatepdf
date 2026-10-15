import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import PageNumbersTool from "./PageNumbersTool";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online Free — No Upload, 100% Private",
  description:
    "Number every page of your PDF (Page 1, Page 2…) for free. Choose the position and starting number. Runs entirely in your browser — your files are never uploaded. No sign-up.",
};

const FAQ = [
  {
    q: "How do I add page numbers to a PDF?",
    a: "Drop your PDF above, pick where the numbers go, and click Add page numbers. Every page gets stamped (Page 1, Page 2…) and the finished file downloads instantly.",
  },
  {
    q: "Can I start numbering from a different number?",
    a: "Yes. Set the first page number — handy when the first pages are a cover or title page you don't want counted as page 1.",
  },
  {
    q: "Where can the page numbers appear?",
    a: "Top or bottom of the page, on the left, center, or right — six positions to choose from.",
  },
  {
    q: "Is my PDF uploaded to a server?",
    a: "No. Numbering happens 100% in your browser with local JavaScript. Your document never leaves your device.",
  },
  {
    q: "Is this free?",
    a: "Yes — free for files up to 50MB. PrivatePDF Pro ($29 one-time) removes the file-size limit.",
  },
];

export default function PageNumbersPage() {
  return (
    <ToolShell
      title="Add page numbers to your PDF"
      description="Stamp Page 1, Page 2… on every page, exactly where you want them."
      faq={FAQ}
      adSlotId="page-numbers-below-workspace"
    >
      <PageNumbersTool />
    </ToolShell>
  );
}
