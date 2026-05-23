/** Canonical page slug for routes, section ids, and hash targets (no leading slash). */
export function normalizePageSlug(slug: string | undefined | null): string {
  const trimmed = (slug ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "home";
  return trimmed;
}
