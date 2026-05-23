"use client";

import { useLayoutEffect } from "react";

/** Client navigation so `/#slug` works (server redirects cannot set fragments reliably). */
export default function SinglePageAnchorRedirect({ slug }: { slug: string }) {
  useLayoutEffect(() => {
    const target = slug === "home" ? "/#home" : `/#${slug}`;
    window.location.replace(target);
  }, [slug]);
  return (
    <p className="mx-auto max-w-6xl px-6 pt-24 text-sm text-neutral-500">Opening section…</p>
  );
}
