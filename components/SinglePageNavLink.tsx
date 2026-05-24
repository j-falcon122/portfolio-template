"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationMode } from "@/lib/cms/types";
import { withBasePath } from "@/lib/basePath";
import { resolveNavHref } from "@/lib/resolveNavHref";
import { scrollToPageSectionWhenReady } from "@/lib/scrollToPageSection";

type Props = {
  href: string;
  navigationMode?: NavigationMode;
  className?: string;
  children: React.ReactNode;
};

export default function SinglePageNavLink({
  href,
  navigationMode,
  className,
  children,
}: Props) {
  const pathname = usePathname() || "/";
  const resolved = resolveNavHref(href, navigationMode);
  const singlePage = (navigationMode ?? "routes") === "single-page";
  const onHome = pathname === "/";

  if (singlePage && onHome && resolved.startsWith("/#")) {
    const anchorHref = withBasePath(resolved);
    return (
      <a
        href={anchorHref}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          const sectionId = resolved.slice(2);
          window.history.pushState(null, "", anchorHref);
          scrollToPageSectionWhenReady(sectionId);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={resolved} className={className}>
      {children}
    </Link>
  );
}
