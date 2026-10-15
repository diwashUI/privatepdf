import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Faq from "@/components/Faq";

const TOOLS = [
  {
    href: "/merge",
    title: "Merge PDF",
    desc: "Combine multiple PDFs into one document, in any order.",
    keywords: "merge pdf",
  },
  {
    href: "/split",
    title: "Split PDF",
    desc: "Extract pages or page ranges into a new PDF.",
    keywords: "split pdf",
  },
  {
    href: "/compress",
    title: "Compress PDF",
    desc: "Shrink file size while keeping pages readable.",
    keywords: "compress pdf",
  },
  {
    href: "/images-to-pdf",
    title: "Images to PDF",
    desc: "Turn JPG and PNG photos into a PDF document.",
    keywords: "jpg to pdf",
  },
  {
    href: "/pdf-to-images",
    title: "PDF to Images",
    desc: "Export every page as a high-quality PNG.",
    keywords: "pdf to png",
  },
  {
    href: "/rotate",
    title: "Rotate PDF",
    desc: "Fix sideways or upside-down pages in seconds.",
    keywords: "rotate pdf",
  },
];

const FAQ = [
  {
    q: "Are my files really never uploaded?",
    a: "Yes. Every tool on PrivatePDF runs entirely in your browser using JavaScript. Your files never leave your device — there is no server processing step at all. You can verify this yourself: open DevTools, go to the Network tab, and process a file. You will see zero upload requests.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There is no sign-up, no login, and no tracking of your documents. Open a tool, drop your files, download the result.",
  },
  {
    q: "Is PrivatePDF free?",
    a: "The core tools are free: merge, split, compress, rotate, and convert, for files up to 50MB. PrivatePDF Pro ($29 one-time) unlocks batch processing, larger files, and priority processing — still 100% in your browser.",
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

function CheckIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          100% client-side · no uploads
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
          PDF tools that <span className="text-blue-600">never upload</span> your files
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          Merge, split, compress, rotate and convert PDFs — processed entirely in your
          browser. Your documents never touch a server.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/merge"
            className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Merge PDFs free
          </Link>
          <Link
            href="/compress"
            className="rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Compress a PDF
          </Link>
        </div>
        <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><CheckIcon /> No sign-up</span>
          <span className="flex items-center gap-1.5"><CheckIcon /> No watermarks</span>
          <span className="flex items-center gap-1.5"><CheckIcon /> Works offline</span>
        </div>
      </section>

      <AdSlot slot="landing-below-hero" />

      {/* ── TOOL GRID ── */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-label="PDF tools">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Every PDF tool you need
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          Pick a tool. Your files stay on your device from start to finish.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRIVACY PROOF ── */}
      <section id="privacy" className="border-y border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600">
            Privacy, provable
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Don&apos;t trust us. Verify us.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Every other PDF site uploads your documents to their servers first. PrivatePDF
            has no server step at all — and you can prove it in ten seconds:
          </p>
          <ol className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {[
              ["1", "Open DevTools", "Press F12 (or Cmd+Option+I on Mac)."],
              ["2", "Watch the Network tab", "Then merge or compress any PDF."],
              ["3", "See zero uploads", "No file data ever leaves your device."],
            ].map(([n, title, desc]) => (
              <li key={n} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-2xl font-bold text-blue-600">{n}</p>
                <p className="mt-2 font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          How it works
        </h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
          {[
            ["Drop your files", "Select PDFs or images from your device. Nothing is sent anywhere."],
            ["Processed locally", "Your browser does all the work — merge, split, compress — in milliseconds."],
            ["Download the result", "Save the finished file. Close the tab and nothing remains anywhere."],
          ].map(([title, desc], i) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {i + 1}
              </p>
              <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="mx-auto max-w-4xl px-4 pb-4">
        <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Free for everyday use. Pro when you need more.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-400">
            Batch processing, files over 50MB, and priority speed — one $29 payment, yours forever.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            See pricing
          </Link>
        </div>
      </section>

      <div id="faq" className="mx-auto max-w-6xl px-4 pb-16">
        <Faq items={FAQ} />
      </div>
    </div>
  );
}
