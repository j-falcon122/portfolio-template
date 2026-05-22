"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import type { SiteSettings } from "@/lib/cms/types";
import { resolveNavHref } from "@/lib/resolveNavHref";
import { scrollToPageSectionWhenReady } from "@/lib/scrollToPageSection";

function sectionKeyFromNavHref(href: string): string | null {
  if (href === "/" || href === "") return "home";
  const m = href.match(/^\/([^/]+)\/?$/);
  return m ? m[1] : null;
}

export default function SiteHeader({
  site,
  adminNav,
}: {
  site: SiteSettings;
  adminNav?: { href: string; label: string };
}) {
  const pathname = usePathname() || "/";
  const navMode = site.navigationMode ?? "routes";
  const singlePage = navMode === "single-page";
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncHash = () => setHash(typeof window !== "undefined" ? window.location.hash : "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const floating = isHome && !isScrolled;
  const containerClass = floating
    ? "bg-transparent text-white"
    : "bg-white/95 text-neutral-900 shadow-sm backdrop-blur";

  function handleSinglePageNavClick(
    e: MouseEvent<HTMLAnchorElement>,
    resolvedHref: string
  ) {
    if (!singlePage || !resolvedHref.startsWith("/#")) return;
    e.preventDefault();
    const sectionId = resolvedHref.slice(2);

    if (!isHome) {
      window.location.assign(resolvedHref);
      return;
    }

    window.history.pushState(null, "", resolvedHref);
    setHash(resolvedHref.slice(1));
    scrollToPageSectionWhenReady(sectionId);
  }

  function isNavActive(itemHref: string): boolean {
    if (singlePage && isHome) {
      const section = sectionKeyFromNavHref(itemHref);
      const current = hash.replace(/^#/, "") || "home";
      if (section === "home") return current === "home";
      if (section) return current === section;
      return false;
    }
    return (
      itemHref === pathname || (itemHref !== "/" && pathname.startsWith(itemHref))
    );
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${containerClass}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {singlePage && isHome ? (
          <a
            href="/#home"
            className="text-lg font-semibold tracking-wide"
            onClick={(e) => handleSinglePageNavClick(e, "/#home")}
          >
            {site.title}
          </a>
        ) : (
          <Link href="/" className="text-lg font-semibold tracking-wide">
            {site.title}
          </Link>
        )}

        <nav className="site-nav flex gap-6 text-sm">
          {site.nav?.map((item) => {
            const resolvedHref = resolveNavHref(item.href, navMode);
            const active = isNavActive(item.href);
            const className = `nav-link ${active ? "nav-link--active" : ""}`;
            // Next.js <Link> often skips native fragment scroll on `/`. Use <a> for same-page hashes.
            const useNativeAnchor = resolvedHref.startsWith("/#");
            if (useNativeAnchor) {
              return (
                <a
                  key={`${item.href}-${resolvedHref}`}
                  href={resolvedHref}
                  className={className}
                  onClick={(e) => handleSinglePageNavClick(e, resolvedHref)}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={`${item.href}-${resolvedHref}`} href={resolvedHref} className={className}>
                {item.label}
              </Link>
            );
          })}
          {adminNav ? (
            /^https?:\/\//i.test(adminNav.href) ? (
              <a
                href={adminNav.href}
                className="nav-link"
                target={
                  /localhost|127\.0\.0\.1/i.test(adminNav.href)
                    ? undefined
                    : "_blank"
                }
                rel={
                  /localhost|127\.0\.0\.1/i.test(adminNav.href)
                    ? undefined
                    : "noopener noreferrer"
                }
              >
                {adminNav.label}
              </a>
            ) : (
              <Link href={adminNav.href} className="nav-link">
                {adminNav.label}
              </Link>
            )
          ) : null}
        </nav>
      </div>
    </header>
  );
}