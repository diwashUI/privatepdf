// Central product configuration.

export const SITE_NAME = "PrivatePDF";
export const SITE_URL = "https://privatepdfapp.vercel.app";

// Paddle checkout (Paddle Billing). The client-side token is safe to expose
// in frontend code per Paddle's docs; it only opens checkouts. Price ID is
// the $29 one-time "PrivatePDF Pro" price created in the Paddle dashboard.
export const PADDLE_CLIENT_TOKEN = "live_93531bd281ba80072bd3c787392";
export const PADDLE_PRICE_ID = "pri_01m5ep3vadnf75wwhtmh1wydhb";
// Flip to true once PADDLE_CLIENT_TOKEN holds the real live_ token from
// Paddle > My account > Settings > Authentication. While false, Pro buttons
// render as disabled "Coming soon" instead of opening checkout.
export const CHECKOUT_READY = true;

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
