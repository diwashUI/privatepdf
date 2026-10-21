// Pro license state — 100% client-side by design.
//
// After a successful Paddle checkout the buyer lands on /pro/success, which
// stamps this flag, and the free-plan limit checks stop applying on this
// device/browser. No accounts, no backend — matches the app's
// never-uploads-anything architecture.
//
// Deliberately simple: anyone technical could flip this in devtools. A
// hardened license check (Paddle webhooks + server verification) is a later
// build if sales justify it.
export const PRO_STORAGE_KEY = "privatepdf_pro";

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setPro(): void {
  try {
    window.localStorage.setItem(PRO_STORAGE_KEY, "1");
  } catch {
    // Storage unavailable (e.g. private mode). Checkout still succeeded —
    // the Paddle receipt email is the proof of purchase.
  }
}
