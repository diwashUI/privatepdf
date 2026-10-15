import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/config";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Evaluated once at build time (stable for prerendering).
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PrivatePDF — Free PDF Tools That Never Upload Your Files",
    template: "%s | PrivatePDF",
  },
  description:
    "Merge, split, compress, watermark, number pages, rotate and convert PDFs 100% in your browser. Your files never leave your device — no uploads, no sign-up, free.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
};

const TOOLS = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/compress", label: "Compress PDF" },
  { href: "/images-to-pdf", label: "Images to PDF" },
  { href: "/pdf-to-images", label: "PDF to Images" },
  { href: "/rotate", label: "Rotate PDF" },
  { href: "/watermark", label: "Watermark" },
  { href: "/page-numbers", label: "Page Numbers" },
  { href: "/extract-text", label: "Extract Text" },
];

function Logo() {  return (
    <Link href="/" className="flex items-center gap-2" aria-label="PrivatePDF home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">PrivatePDF</span>
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white text-slate-900 antialiased`}>
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Logo />
            <nav className="hidden max-w-3xl flex-wrap items-center justify-end gap-1 lg:flex" aria-label="PDF tools">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {t.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/pricing"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Pricing
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden" aria-label="PDF tools mobile">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>

        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                Free PDF tools that run entirely in your browser. Your files never leave your device.
              </p>
            </div>
            <nav aria-label="Tools">
              <p className="text-sm font-semibold text-slate-900">Tools</p>
              <ul className="mt-3 columns-2 gap-6 space-y-2 text-sm text-slate-500">
                {TOOLS.map((t) => (
                  <li key={t.href} className="break-inside-avoid">
                    <Link href={t.href} className="inline-flex min-h-[44px] items-center hover:text-slate-900">{t.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Company">
              <p className="text-sm font-semibold text-slate-900">PrivatePDF</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link href="/pricing" className="inline-flex min-h-[44px] items-center hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/#faq" className="inline-flex min-h-[44px] items-center hover:text-slate-900">FAQ</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
            © {YEAR} PrivatePDF. Files are processed locally — nothing is uploaded, ever.
          </div>
        </footer>
      </body>
    </html>
  );
}
