import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PrivatePDF",
  description:
    "PrivatePDF's privacy policy: your files never leave your device, no accounts, no tracking.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: October 21, 2026</p>

      <Section title="The short version">
        <p>
          PrivatePDF runs entirely in your browser. Your files are never uploaded to our
          servers — because we don&apos;t have servers that receive them. We have no user
          accounts, no analytics trackers, and no way to see your documents even if we
          wanted to.
        </p>
      </Section>

      <Section title="What we don't collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>Your PDF files or their contents — processing happens locally on your device.</li>
          <li>Account information — there are no accounts to create.</li>
          <li>Analytics or tracking data — we run no third-party trackers on this site.</li>
        </ul>
      </Section>

      <Section title="What is stored on your device">
        <p>
          If you purchase PrivatePDF Pro, a small flag is saved in your browser&apos;s
          local storage so the site remembers your Pro status on that device. It never
          leaves your browser, and clearing your site data removes it (your Paddle
          receipt email remains your proof of purchase).
        </p>
      </Section>

      <Section title="Payments">
        <p>
          Payments are processed by Paddle, our merchant of record. When you buy Pro,
          Paddle collects your name, email address, and payment details under its own{" "}
          <a
            href="https://www.paddle.com/legal/privacy"
            className="text-blue-600 underline hover:text-blue-700"
          >
            privacy policy
          </a>
          . We receive only a confirmation that the transaction completed — never your
          card details.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a
            href="mailto:itsaurevya@gmail.com"
            className="text-blue-600 underline hover:text-blue-700"
          >
            itsaurevya@gmail.com
          </a>
          .
        </p>
      </Section>
    </div>
  );
}
