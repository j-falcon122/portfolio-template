const raw = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

/** Subpath prefix for GitHub Pages project sites (e.g. `/portfolio-template`). */
export const basePath = raw.endsWith("/") ? raw.slice(0, -1) : raw;

/** Prefix internal routes and public assets when deployed under a subpath. */
export function withBasePath(path: string): string {
  if (!path) return path;
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!basePath) return normalized;
  if (normalized === basePath || normalized.startsWith(`${basePath}/`)) {
    return normalized;
  }

  return `${basePath}${normalized}`;
}

/** Prefix a CMS or public-folder asset path (no-op for absolute URLs). */
export function withAssetPath(path: string | undefined): string {
  if (!path) return "";
  return withBasePath(path);
}
