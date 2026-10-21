import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PrivatePDF",
  description: "PrivatePDF's terms of service for the free tools and Pro purchase.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: October 21, 2026</p>

      <Section title="The service">
        <p>
          PrivatePDF provides free PDF tools that run entirely in your browser, plus an
          optional paid upgrade (PrivatePDF Pro) that removes the free-plan limits. By
          using the site or purchasing Pro, you agree to these terms.
        </p>
      </Section>

      <Section title="Pro license">
        <ul className="list-disc space-y-2 pl-5">
          <li>Pro is a one-time payment of $29 USD — not a subscription.</li>
          <li>
            Pro activates on the browser you completed checkout from. There are no
            accounts, so moving to a new browser or device requires access to that
            browser&apos;s data or your purchase receipt.
          </li>
          <li>Pro removes limits; it does not change how the tools work — your files still never leave your device.</li>
        </ul>
      </Section>

      <Section title="Acceptable use">
        <p>
          Don&apos;t misuse the tools — for example, processing files you have no right
          to use, or attempting to disrupt the site. We may restrict access for abuse.
        </p>
      </Section>

      <Section title="Availability">
        <p>
          The tools are provided as-is. We aim to keep the site reliable, but we
          don&apos;t guarantee uninterrupted availability, and browser-based processing
          depends on your device&apos;s capabilities.
        </p>
      </Section>

      <Section title="Liability">
        <p>
          To the maximum extent permitted by law, PrivatePDF is not liable for any
          indirect or consequential damages arising from use of the site. Our total
          liability for paid Pro is limited to the amount you paid ($29 USD).
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may update these terms as the product evolves. Continued use of the site
          after changes means you accept the updated terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
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
