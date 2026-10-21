"use client";

import { useEffect } from "react";
import Link from "next/link";
import { setPro } from "@/lib/pro";

/**
 * Landing page after a successful Paddle checkout (see
 * ProCheckoutButton's successUrl). Stamps the Pro flag on this device and
 * thanks the buyer. Paddle also emails a proper receipt.
 */
export default function ProSuccessPage() {
  useEffect(() => {
    setPro();
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg
          className="h-8 w-8 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
        You&apos;re Pro now
      </h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        Payment confirmed. Pro is now active on this browser — unlimited batch
        processing, files over 50MB, unlimited images per conversion. Your
        receipt is on its way by email.
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Pro stays on this device. If you switch browsers, just open your
        receipt email — it&apos;s your proof of purchase.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/merge"
          className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Start using Pro
        </Link>
        <Link
          href="/pricing"
          className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Back to pricing
        </Link>
      </div>
    </div>
  );
}
