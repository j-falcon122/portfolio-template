/**
 * Optional CMS / admin link shown in the site header.
 * Use this for a project-specific URL without env files, or leave `null`
 * and set `ADMIN_NAV_URL` / `NEXT_PUBLIC_ADMIN_URL` instead (env wins).
 */
export const SITE_ADMIN_NAV: { href: string; label?: string } | null = null;
