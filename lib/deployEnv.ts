/** Where this deployment is running; drives admin URL behavior and sane defaults. */
export type DeployEnv = "local" | "qa" | "production";

/**
 * Local = your machine (`next dev`) unless SITE_ENV overrides.
 * QA = preview/staging hosts (e.g. Vercel `VERCEL_ENV=preview`).
 * Production = prod hosts (default when `NODE_ENV=production`).
 *
 * Set explicitly with `SITE_ENV=local | qa | staging | preview | production`.
 * On Vercel, `VERCEL_ENV` is used when SITE_ENV is unset.
 */
export function getDeployEnv(): DeployEnv {
  const site = process.env.SITE_ENV?.trim().toLowerCase();

  if (site === "local") return "local";
  if (site === "qa" || site === "staging" || site === "preview") return "qa";
  if (site === "production" || site === "prod") return "production";

  const vercel = process.env.VERCEL_ENV?.trim();
  if (vercel === "preview") return "qa";
  if (vercel === "production") return "production";

  if (process.env.NODE_ENV === "development") return "local";

  return "production";
}
