import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import RotateTool from "./RotateTool";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online Free — No Upload | PrivatePDF",
  description:
    "Rotate PDF pages 90 or 180 degrees for free. Fixed entirely in your browser — your document is never uploaded to any server.",
};

const FAQ = [
  {
    q: "How do I rotate pages in a PDF?",
    a: "Drop your PDF above, choose 90° clockwise, 90° counter-clockwise, or 180°, pick all pages or a range like 1-3, then download the fixed PDF.",
  },
  {
    q: "Is my PDF uploaded when I rotate it?",
    a: "No. Rotation happens 100% on your device in the browser. Your file never touches a server.",
  },
  {
    q: "Can I rotate only some pages?",
    a: "Yes — rotate every page, or type ranges like 2-4, 7 to rotate just those pages.",
  },
  {
    q: "Does rotating change anything else in the PDF?",
    a: "No. Only the page orientation changes; text, images, and layout stay exactly the same.",
  },
];

export default function RotatePage() {
  return (
    <ToolShell
      title="Rotate PDF"
      description="Fix sideways or upside-down pages — rotate all pages or just the ones you pick."
      faq={FAQ}
      adSlotId="rotate-below-workspace"
    >
      <RotateTool />
    </ToolShell>
  );
}
