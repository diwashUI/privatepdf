import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import { CHECKOUT_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Pricing — Free PDF Tools, $29 Pro | PrivatePDF",
  description:
    "PrivatePDF is free for everyday PDF tasks. Pro unlocks batch processing, larger files, and priority speed for a single $29 payment — still 100% private.",
};

const FAQ = [
  {
    q: "Why is Pro a one-time payment instead of a subscription?",
    a: "PDF tools don't need a server on our end — everything runs in your browser — so there's no ongoing cost to pass on to you. Pay once, use it forever.",
  },
  {
    q: "What do I get with Pro?",
    a: "Batch processing (merge or convert many files at once), files over 50MB, more images per conversion, and priority processing speed. All still 100% in your browser.",
  },
  {
    q: "Is the free plan really free?",
    a: "Yes. Merge up to 5 PDFs, split, compress, rotate, and convert — for files up to 50MB — free forever, no account needed.",
  },
  {
    q: "Do Pro files still stay private?",
    a: "Absolutely. Pro changes limits, not architecture. Your files never leave your device on any plan.",
  },
];

const FREE_FEATURES = [
  "Merge up to 5 PDFs at once",
  "Split, compress & rotate",
  "JPG/PNG to PDF and PDF to PNG",
  "Files up to 50MB",
  "No account, no watermarks",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited batch processing",
  "Files over 50MB",
  "Unlimited images per conversion",
  "Priority processing speed",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Simple pricing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Free for everyday use. One payment for Pro — no subscription, ever.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-bold text-slate-900">Free</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$0</p>
          <p className="mt-1 text-sm text-slate-500">Free forever</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/merge"
            className="mt-8 block rounded-full border border-slate-300 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Start free
          </Link>
        </div>

        <div className="relative rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-xl">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Most popular
          </span>
          <h2 className="text-lg font-bold text-slate-900">Pro</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            $29 <span className="text-base font-normal text-slate-500">one-time</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Pay once, yours forever</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={CHECKOUT_URL}
            className="mt-8 block rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go Pro
          </a>
        </div>
      </div>

      <div className="mt-16">
        <Faq items={FAQ} />
      </div>
    </div>
  );
}
