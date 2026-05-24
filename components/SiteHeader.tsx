"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import type { SiteSettings } from "@/lib/cms/types";
import { withBasePath } from "@/lib/basePath";
import { resolveNavHref } from "@/lib/resolveNavHref";
import { scrollToPageSectionWhenReady } from "@/lib/scrollToPageSection";
import SiteBrand from "@/components/SiteBrand";

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
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);
  const [isHeaderFocused, setIsHeaderFocused] = useState(false);
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const hash = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("hashchange", onStoreChange);
      return () => window.removeEventListener("hashchange", onStoreChange);
    },
    () => window.location.hash,
    () => ""
  );

  const hashSection = hash.replace(/^#/, "");
  const isHomeHash = !hashSection || hashSection === "home";

  const mouseRevealZone = 72;

  useEffect(() => {
    const onScroll = () => {
      setIsAtTop(window.scrollY <= 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      setIsMouseNearTop(e.clientY <= mouseRevealZone);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const headerVisible = !hasMounted || isAtTop || isMouseNearTop || isHeaderFocused;

  // Match SSR on first paint; apply hash/scroll styling after mount to avoid hydration mismatch
  const useHeroNavStyle = hasMounted
    ? isHome && isAtTop && isHomeHash
    : isHome;
  const headerState = useHeroNavStyle
    ? "site-header--at-top"
    : "site-header--solid";

  function handleSinglePageNavClick(
    e: ReactMouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    const hashMatch = href.match(/#([^/?#]+)$/);
    if (!singlePage || !hashMatch) return;
    e.preventDefault();
    const sectionId = hashMatch[1];
    const targetHref = withBasePath(`/#${sectionId}`);

    if (!isHome) {
      window.location.assign(targetHref);
      return;
    }

    window.history.pushState(null, "", targetHref);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
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

  function navAriaCurrent(itemHref: string, active: boolean) {
    if (!active) return undefined;
    return singlePage && isHome ? "location" : "page";
  }

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 w-full transition-transform duration-300 ease-out ${headerState} ${
        headerVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
      onFocusCapture={() => setIsHeaderFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsHeaderFocused(false);
        }
      }}
    >
      <div className="site-header__inner flex h-[var(--header-height)] w-full max-w-full items-center justify-between gap-6 px-6 sm:px-10 lg:px-12">
        <div className="site-header__brand-wrap shrink-0">
          {singlePage && isHome ? (
            <Link
              href="/#home"
              className="site-header__brand text-lg font-semibold tracking-wide no-underline"
              onClick={(e) => handleSinglePageNavClick(e, "/#home")}
            >
              <SiteBrand title={site.title} />
            </Link>
          ) : (
            <Link
              href="/"
              className="site-header__brand text-lg font-semibold tracking-wide no-underline"
            >
              <SiteBrand title={site.title} />
            </Link>
          )}
        </div>

        <nav className="site-nav flex shrink-0 items-center justify-end gap-6 text-sm" aria-label="Main">
          {site.nav?.map((item) => {
            const resolvedHref = resolveNavHref(item.href, navMode);
            const active = isNavActive(item.href);
            const className = `nav-link no-underline ${active ? "nav-link--active" : ""}`;
            const ariaCurrent = navAriaCurrent(item.href, active);
            // Next.js <Link> often skips native fragment scroll on `/`. Use <a> for same-page hashes.
            const useNativeAnchor = resolvedHref.startsWith("/#");
            const anchorHref = useNativeAnchor
              ? withBasePath(resolvedHref)
              : resolvedHref;
            if (useNativeAnchor) {
              return (
                <a
                  key={`${item.href}-${resolvedHref}`}
                  href={anchorHref}
                  className={className}
                  aria-current={ariaCurrent}
                  onClick={(e) => handleSinglePageNavClick(e, anchorHref)}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={`${item.href}-${resolvedHref}`}
                href={resolvedHref}
                className={className}
                aria-current={ariaCurrent}
              >
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
                aria-label={`${adminNav.label} (opens in new tab)`}
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