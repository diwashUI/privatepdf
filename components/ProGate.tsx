"use client";

import { CHECKOUT_READY } from "@/lib/config";
import ProCheckoutButton from "@/components/ProCheckoutButton";

/** Upsell card shown when free-plan limits are exceeded. */
export function ProGate({ reason }: { reason: string }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">PrivatePDF Pro</p>
      <h3 className="mt-2 text-xl font-bold text-slate-900">This needs Pro</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{reason}</p>
      {CHECKOUT_READY ? (
        <ProCheckoutButton className="mt-5 inline-block rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700" />
      ) : (
        <span className="mt-5 inline-block cursor-not-allowed rounded-full bg-slate-200 px-7 py-3 text-sm font-semibold text-slate-500">
          Pro checkout opening soon
        </span>
      )}
      <p className="mt-3 text-xs text-slate-500">One payment. Yours forever. Files still never leave your device.</p>
    </div>
  );
}

export function formatMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
