// Central product configuration.
//
// CHECKOUT_URL is a PLACEHOLDER — wire it to the real payment link
// (LemonSqueezy / Gumroad / Stripe) before launching paid Pro.

export const SITE_NAME = "PrivatePDF";
export const SITE_URL = "https://privatepdfapp.vercel.app";
export const CHECKOUT_URL = "https://example.com/checkout";
// Flip to true once CHECKOUT_URL points at the real payment link.
// While false, Pro buttons render as disabled "Coming soon" instead of
// linking anywhere.
export const CHECKOUT_READY = false;

// Free-plan limits. Files or batches beyond these show the Pro upsell.
export const FREE_MAX_FILE_MB = 50;
export const FREE_MAX_MERGE_FILES = 5;

// ---------------------------------------------------------------------------
// Display-ad infrastructure (secondary revenue stream).
//
// Ads are OFF by default. To enable later:
//   1. Set ADS_ENABLED = true
//   2. Put your AdSense publisher ID in AD_CLIENT (e.g. "ca-pub-1234567890123456")
//   3. Paste your AdSense <ins> snippet into components/AdSlot.tsx
//
// The AdSlot component renders NOTHING while disabled — no empty boxes,
// no reserved space, no layout shift. Placements are deliberately kept out
// of the file-processing flow: one slot below the landing hero, one below
// each tool's workspace. Never popups, never interstitials — trust first.
// ---------------------------------------------------------------------------
export const ADS_ENABLED = false;
export const AD_CLIENT = "";
