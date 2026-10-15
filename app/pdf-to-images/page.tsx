import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import PdfToImagesTool from "./PdfToImagesTool";

export const metadata: Metadata = {
  title: "PDF to PNG Online Free — Convert Pages Without Uploading | PrivatePDF",
  description:
    "Export every PDF page as a high-quality PNG image, free. Conversion runs 100% in your browser — your document is never uploaded.",
};

const FAQ = [
  {
    q: "How do I convert PDF pages to images?",
    a: "Drop your PDF above, choose 1x or 2x resolution, and click Convert. Each page renders as a PNG you can download individually or all at once.",
  },
  {
    q: "Are my documents uploaded during conversion?",
    a: "No. Pages are rendered to images locally in your browser. Nothing is sent to any server at any point.",
  },
  {
    q: "What resolution are the exported images?",
    a: "1x matches the page's on-screen size; 2x doubles it for sharper results (great for printing or zooming). PNG is lossless in both cases.",
  },
  {
    q: "Is there a page limit?",
    a: "The free plan converts PDFs up to 50MB. Very large documents convert fine — it just takes a little longer in your browser.",
  },
];

export default function PdfToImagesPage() {
  return (
    <ToolShell
      title="PDF to Images"
      description="Turn every page of your PDF into a PNG image — right here in your browser."
      faq={FAQ}
      adSlotId="pdf-to-images-below-workspace"
    >
      <PdfToImagesTool />
    </ToolShell>
  );
}
