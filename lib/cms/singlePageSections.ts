import type { SiteSettings } from "@/lib/cms/types";
import { normalizePageSlug } from "@/lib/normalizePageSlug";

/** Fallback order when CMS omits `singlePageSectionSlugs` or sends an empty list. */
export const DEFAULT_SINGLE_PAGE_SECTION_SLUGS = [
  "home",
  "about",
  "work",
  "contact",
] as const;

export function resolveSinglePageSectionSlugs(site: SiteSettings): string[] {
  const raw = site.singlePageSectionSlugs;
  if (!Array.isArray(raw) || raw.length === 0) {
    return [...DEFAULT_SINGLE_PAGE_SECTION_SLUGS];
  }
  const trimmed = raw
    .map((s) => (typeof s === "string" ? normalizePageSlug(s) : ""))
    .filter(Boolean);
  return trimmed.length > 0 ? trimmed : [...DEFAULT_SINGLE_PAGE_SECTION_SLUGS];
}
