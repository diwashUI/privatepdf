import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Faq from "@/components/Faq";

const TOOLS = [
  {
    href: "/merge",
    title: "Merge PDF",
    desc: "Combine multiple PDFs into one document, in any order.",
  },
  {
    href: "/split",
    title: "Split PDF",
    desc: "Extract pages or page ranges into a new PDF.",
  },
  {
    href: "/compress",
    title: "Compress PDF",
    desc: "Shrink file size while keeping pages readable.",
  },
  {
    href: "/images-to-pdf",
    title: "Images to PDF",
    desc: "Turn JPG and PNG photos into a PDF document.",
  },
  {
    href: "/pdf-to-images",
    title: "PDF to Images",
    desc: "Export every page as a high-quality PNG.",
  },
  {
    href: "/rotate",
    title: "Rotate PDF",
    desc: "Fix sideways or upside-down pages in seconds.",
  },
  {
    href: "/watermark",
    title: "Watermark PDF",
    desc: "Stamp DRAFT or CONFIDENTIAL across every page.",
  },
  {
    href: "/page-numbers",
    title: "Page Numbers",
    desc: "Add Page 1, Page 2… exactly where you want them.",
  },
  {
    href: "/extract-text",
    title: "Extract Text",
    desc: "Pull all the text out of a PDF into a .txt file.",
  },
];

const FAQ = [
  {
    q: "Are my files really never uploaded?",
    a: "Yes. Every tool on PrivatePDF runs entirely in your browser using JavaScript. Your files never leave your device — there is no server processing step at all.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There is no sign-up, no login, and no tracking of your documents. Open a tool, drop your files, download the result.",
  },
  {
    q: "Is PrivatePDF free?",
    a: "The core tools are free: merge, split, compress, rotate, convert, watermark, page numbers, and text extraction, for files up to 50MB. PrivatePDF Pro ($29 one-time) unlocks batch processing, larger files, and priority processing — still 100% in your browser.",
  },
  {
    q: "Which browsers are supported?",
    a: "Any modern browser: Chrome, Edge, Firefox, and Safari, on desktop and mobile. Everything runs locally, so it even works offline once the page has loaded.",
  },
  {
    q: "What happens to my files after I close the tab?",
    a: "Nothing is stored anywhere. Because files never leave your device, there is nothing to delete from a server — closing the tab is the entire cleanup.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center sm:pt-16">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
          Free PDF tools that <span className="text-blue-600">never upload</span> your files
        </h1>
        <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Files never leave your device — no uploads, no sign-up.
        </p>
      </section>

      <AdSlot slot="landing-below-hero" />

      {/* ── TOOL GRID ── */}
      <section className="mx-auto max-w-6xl px-4 py-8" aria-label="PDF tools">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
            >
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">{t.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t.desc}</p>
              <span className="mt-4 inline-block min-h-[44px] text-sm font-semibold text-blue-600" aria-hidden>
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div id="faq" className="mx-auto max-w-6xl px-4 pb-16">
        <Faq items={FAQ} />
      </div>
    </div>
  );
}
