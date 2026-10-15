import { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import Faq, { FaqItem } from "@/components/Faq";

interface ToolShellProps {
  title: string;
  description: string;
  faq: FaqItem[];
  children: ReactNode;
  adSlotId: string;
}

/**
 * Shared frame for every tool page: one h1, description, the interactive
 * workspace (client children), an ad slot BELOW the workspace, then FAQ.
 */
export default function ToolShell({ title, description, faq, children, adSlotId }: ToolShellProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">{description}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          100% private — processed in your browser, never uploaded
        </p>
      </header>

      <div className="mt-8">{children}</div>

      <AdSlot slot={adSlotId} />

      <Faq items={faq} />
    </div>
  );
}
