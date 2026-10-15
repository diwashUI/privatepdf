# PrivatePDF

Free PDF tools that never upload your files. Every tool — merge, split, compress,
rotate, image conversion — runs 100% in the browser. There is no server processing
step at all: open DevTools → Network tab → zero upload requests.

## Tools

| Route | What it does |
|---|---|
| `/merge` | Combine multiple PDFs, drag to reorder |
| `/split` | Extract pages via chips or ranges (`1-3, 5`) |
| `/compress` | Shrink file size (High / Medium / Low quality) |
| `/images-to-pdf` | JPG/PNG → PDF, one image per page |
| `/pdf-to-images` | Every PDF page → PNG at 1x/2x |
| `/rotate` | Rotate all pages or ranges by 90°/180°/270° |
| `/pricing` | Free vs Pro ($29 one-time) |

## Privacy architecture

- `pdf-lib` for manipulation, `pdfjs-dist` for rendering/thumbnails — all client-side.
- No API routes, no uploads, no analytics on file contents.
- `lib/config.ts` holds the free-plan limits and the (placeholder) checkout URL.

## Monetization

- **Pro ($29 one-time):** batch processing, files over 50MB, unlimited images — gated
  by `ProGate` when free limits are hit. `CHECKOUT_URL` in `lib/config.ts` is a
  placeholder (`https://example.com/checkout`) — wire it to LemonSqueezy/Gumroad/Stripe.
- **Display ads (future):** `components/AdSlot.tsx` renders nothing while
  `ADS_ENABLED = false`. Set it true + paste your AdSense snippet to enable.
  Slots: below the landing hero, below each tool workspace. Never in the
  processing flow, never popups.

## Develop

```bash
npm install
npm run dev      # dev server
npm test         # vitest (lib/pdf.test.ts)
npm run build    # must pass before pushing
```
