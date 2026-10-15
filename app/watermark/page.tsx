import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import WatermarkTool from "./WatermarkTool";

export const metadata: Metadata = {
  title: "Watermark PDF Online Free — No Upload, 100% Private",
  description:
    "Stamp DRAFT, CONFIDENTIAL or any text across every page of your PDF for free. Watermarking runs entirely in your browser — your files are never uploaded. No sign-up.",
};

const FAQ = [
  {
    q: "How do I add a watermark to a PDF?",
    a: "Drop your PDF above, type the watermark text (like DRAFT or CONFIDENTIAL), and click Add watermark. It is stamped across every page and the finished file downloads instantly.",
  },
  {
    q: "Is my PDF uploaded to a server?",
    a: "No. The watermark is drawn 100% in your browser with local JavaScript. Your document never leaves your device.",
  },
  {
    q: "Can I change how the watermark looks?",
    a: "Yes. Open Options to switch between diagonal and horizontal, change the text size, and adjust transparency.",
  },
  {
    q: "Will the watermark hide my document's text?",
    a: "The watermark is semi-transparent, so your content stays readable underneath. Keep the transparency low for the lightest touch.",
  },
  {
    q: "Is watermarking free?",
    a: "Yes — free for files up to 50MB. PrivatePDF Pro ($29 one-time) removes the file-size limit.",
  },
];

export default function WatermarkPage() {
  return (
    <ToolShell
      title="Add a watermark to your PDF"
      description="Stamp text like DRAFT or CONFIDENTIAL across every page. It never leaves your device."
      faq={FAQ}
      adSlotId="watermark-below-workspace"
    >
      <WatermarkTool />
    </ToolShell>
  );
}
