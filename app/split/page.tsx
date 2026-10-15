import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import SplitTool from "./SplitTool";

export const metadata: Metadata = {
  title: "Split PDF Online Free — Extract Pages Without Uploading | PrivatePDF",
  description:
    "Split a PDF by page ranges and extract the pages you need. Runs 100% in your browser — your document is never uploaded. Free, no sign-up.",
};

const FAQ = [
  {
    q: "How do I split a PDF into separate pages?",
    a: "Drop your PDF above, then pick pages with the number buttons or type ranges like 1-3, 5, 8-10. Click Split and the new PDF downloads instantly.",
  },
  {
    q: "Is it safe to split sensitive documents here?",
    a: "Yes — splitting happens entirely on your device. Unlike most PDF sites, your file is never uploaded to a server, so there is nothing to leak or retain.",
  },
  {
    q: "Can I extract non-consecutive pages?",
    a: "Yes. Select any combination of individual pages and ranges. The output keeps your chosen pages in ascending order.",
  },
  {
    q: "Does splitting reduce quality?",
    a: "No. Pages are copied losslessly from the original PDF.",
  },
];

export default function SplitPage() {
  return (
    <ToolShell
      title="Split PDF"
      description="Extract exactly the pages you need — pick them individually or type ranges like 1-3, 5."
      faq={FAQ}
      adSlotId="split-below-workspace"
    >
      <SplitTool />
    </ToolShell>
  );
}
