import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import ImagesToPdfTool from "./ImagesToPdfTool";

export const metadata: Metadata = {
  title: "JPG to PDF / PNG to PDF Online Free — No Upload | PrivatePDF",
  description:
    "Convert JPG and PNG images to PDF for free. Photos are combined entirely in your browser — never uploaded. No sign-up, no watermarks.",
};

const FAQ = [
  {
    q: "How do I convert JPG to PDF?",
    a: "Drop your JPG or PNG photos above, arrange them in order, and click Create PDF. Each image becomes one page in the downloaded PDF.",
  },
  {
    q: "Are my photos uploaded anywhere?",
    a: "No. Conversion happens 100% on your device. Your photos never leave your browser — unlike most converters that upload them first.",
  },
  {
    q: "How many images can I convert at once?",
    a: "The free plan handles up to 20 images per PDF. Need more? PrivatePDF Pro ($29 one-time) removes the limit.",
  },
  {
    q: "What image formats are supported?",
    a: "JPG/JPEG and PNG. Each page is sized to match its image, so nothing gets cropped or stretched.",
  },
];

export default function ImagesToPdfPage() {
  return (
    <ToolShell
      title="Images to PDF"
      description="Turn JPG and PNG photos into a PDF — one image per page, in the order you choose."
      faq={FAQ}
      adSlotId="images-to-pdf-below-workspace"
    >
      <ImagesToPdfTool />
    </ToolShell>
  );
}
