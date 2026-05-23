import type { NavigationMode } from "@/lib/cms/types";

/**
 * In single-page mode, rewrite internal path links to hash targets on `/`
 * so the header can scroll to CMS-defined sections without duplicating nav entries.
 */
export function resolveNavHref(
  href: string,
  navigationMode: NavigationMode | undefined
): string {
  const mode = navigationMode ?? "routes";
  if (mode !== "single-page") return href;

  if (/^https?:\/\//i.test(href)) return href;
  if (/^(mailto|tel):/i.test(href)) return href;

  if (href === "/" || href === "") return "/#home";

  const oneSegment = href.match(/^\/([^/]+)\/?$/);
  if (!oneSegment) return href;

  const seg = oneSegment[1];
  if (seg === "admin" || seg.startsWith("_")) return href;

  return `/#${seg}`;
}
