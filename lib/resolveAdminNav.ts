import { getDeployEnv } from "@/lib/deployEnv";
import { SITE_ADMIN_NAV } from "@/lib/siteAdminNav";

export function resolveAdminNav():
  | { href: string; label: string }
  | undefined {
  const deploy = getDeployEnv();
  const fromEnv =
    process.env.ADMIN_NAV_URL?.trim() ||
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() ||
    "";
  const fromSite = SITE_ADMIN_NAV?.href?.trim() || "";
  const remoteOrCommitted = fromEnv || fromSite;

  const label =
    process.env.ADMIN_NAV_LABEL?.trim() ||
    process.env.NEXT_PUBLIC_ADMIN_LABEL?.trim() ||
    SITE_ADMIN_NAV?.label?.trim() ||
    "Admin";

  const devStudioPort = process.env.SANITY_DEV_PORT?.trim() || "3333";
  const disableLocalShortcut =
    process.env.DISABLE_DEV_SANITY_MANAGE_NAV === "1";

  const localStudioHref =
    deploy === "local" && !disableLocalShortcut
      ? `http://localhost:${devStudioPort}`
      : "";

  if (deploy === "local") {
    if (
      process.env.ADMIN_NAV_PREFER_REMOTE === "1" &&
      remoteOrCommitted
    ) {
      return { href: remoteOrCommitted, label };
    }
    if (localStudioHref) return { href: localStudioHref, label };
    return remoteOrCommitted
      ? { href: remoteOrCommitted, label }
      : undefined;
  }

  if (remoteOrCommitted) return { href: remoteOrCommitted, label };
  return undefined;
}
