"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/cms/types";

export default function SiteHeader({
  site,
  adminNav,
}: {
  site: SiteSettings;
  adminNav?: { href: string; label: string };
}) {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floating = isHome && !isScrolled;
  const containerClass = floating
    ? "bg-transparent text-white"
    : "bg-white/95 text-neutral-900 shadow-sm backdrop-blur";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${containerClass}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          {site.title}
        </Link>

        <nav className="site-nav flex gap-6 text-sm">
          {site.nav?.map((item) => {
            const active = item.href === pathname || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "nav-link--active" : ""}`}
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