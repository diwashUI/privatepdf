"use client";

import { ReactNode } from "react";

/**
 * Collapsed disclosure for secondary tool settings.
 * Keeps the main flow to 3 steps: pick files → one big button → download.
 * Native <details>/<summary> — keyboard operable, no JS needed.
 */
export default function Options({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-6 rounded-2xl border border-slate-200 bg-slate-50/70">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-semibold text-slate-700 [&::-webkit-details-marker]:hidden">
        Options
        <svg
          className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <div className="border-t border-slate-200 px-5 py-5">{children}</div>
    </details>
  );
}
