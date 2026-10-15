"use client";

interface LiveRegionProps {
  message: string;
}

/**
 * Polite live region: screen readers announce status changes
 * (progress, completion, errors) without moving focus.
 * Render once per tool page and update `message` as work proceeds.
 */
export default function LiveRegion({ message }: LiveRegionProps) {
  return (
    <div aria-live="polite" role="status" className="sr-only">
      {message}
    </div>
  );
}
