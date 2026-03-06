"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/cms/types";

export default function SiteHeader({ site }: { site: SiteSettings }) {
  const pathname = usePathname() || "/";

  return (
    <header className="header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-sm font-medium">{site.title}</div>

  <nav className="site-nav flex gap-6 text-sm opacity-90">
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
        </nav>
      </div>
      
    </header>
  );
}