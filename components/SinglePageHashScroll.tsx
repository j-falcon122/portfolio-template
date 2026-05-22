"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToPageSectionWhenReady } from "@/lib/scrollToPageSection";

function syncScrollFromHash() {
  const raw = typeof window !== "undefined" ? window.location.hash : "";
  const id = raw && raw.length > 1 ? decodeURIComponent(raw.slice(1)) : "home";
  scrollToPageSectionWhenReady(id, raw ? "smooth" : "auto");
}

/** Ensures `/` scrolls to the correct section for `location.hash` (with header offset). */
export default function SinglePageHashScroll() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (pathname !== "/") return;

    syncScrollFromHash();
    window.addEventListener("hashchange", syncScrollFromHash);
    return () => window.removeEventListener("hashchange", syncScrollFromHash);
  }, [pathname]);

  return null;
}
