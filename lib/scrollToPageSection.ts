import { normalizePageSlug } from "@/lib/normalizePageSlug";

/** Matches SiteHeader `h-16` and `--header-height` in globals.css */
export const PAGE_HEADER_OFFSET_PX = 64;

export function normalizePageSectionId(hashOrSlug: string): string {
  return normalizePageSlug(hashOrSlug.replace(/^#/, ""));
}

function findPageSection(sectionId: string): HTMLElement | null {
  const id = normalizePageSectionId(sectionId);
  const byId = document.getElementById(id);
  if (byId) return byId;

  const sections = document.querySelectorAll<HTMLElement>("section.page-section[id]");
  for (const section of sections) {
    if (normalizePageSlug(section.id) === id) return section;
  }
  return null;
}

/** Scroll so the section top sits just below the fixed header. */
export function scrollToPageSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth"
): boolean {
  if (typeof window === "undefined") return false;

  const el = findPageSection(sectionId);
  if (!el) return false;

  // scroll-snap on <html> can pull the viewport to the wrong section after programmatic scroll
  const html = document.documentElement;
  const prevSnap = html.style.scrollSnapType;
  html.style.scrollSnapType = "none";

  const root = document.documentElement;
  const offset = parseFloat(getComputedStyle(root).getPropertyValue("--header-height")) || PAGE_HEADER_OFFSET_PX;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  html.style.scrollBehavior = "auto";
  window.scrollTo({ top: Math.max(0, top), behavior });
  window.setTimeout(() => {
    html.style.scrollSnapType = prevSnap;
    html.style.scrollBehavior = "";
  }, behavior === "smooth" ? 700 : 0);

  return true;
}

/** Retry once on the next frame when DOM from streaming SSR may not be ready yet. */
export function scrollToPageSectionWhenReady(
  sectionId: string,
  behavior: ScrollBehavior = "smooth"
): void {
  let attempts = 0;
  const tryScroll = () => {
    if (scrollToPageSection(sectionId, behavior)) return;
    attempts += 1;
    if (attempts < 12) requestAnimationFrame(tryScroll);
  };
  tryScroll();
}
