import { redirect } from "next/navigation";
import { getDeployEnv } from "@/lib/deployEnv";

/**
 * Opens CMS / Sanity Studio. Hosted QA/PROD: set ADMIN_NAV_URL (or SANITY_STUDIO_URL).
 * Local deploy only (`getDeployEnv()` → `local`): redirects to `sanity dev` (:3333 by default).
 */
export default function AdminPage() {
  const deploy = getDeployEnv();
  const explicit =
    process.env.SANITY_STUDIO_URL?.trim() ||
    process.env.ADMIN_NAV_URL?.trim() ||
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() ||
    "";

  if (explicit && explicit !== "/admin" && !explicit.startsWith("/admin/")) {
    redirect(explicit);
  }

  if (
    deploy === "local" &&
    process.env.DISABLE_DEV_SANITY_MANAGE_NAV !== "1"
  ) {
    const port = process.env.SANITY_DEV_PORT?.trim() || "3333";
    redirect(`http://localhost:${port}`);
  }

  const projectId = process.env.SANITY_PROJECT_ID?.trim();

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-neutral-800">
      <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Set <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">SANITY_STUDIO_URL</code>{" "}
        or <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">ADMIN_NAV_URL</code> to
        your deployed Sanity Studio URL. For local editing, run{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">npm run sanity:dev</code>{" "}
        (default port {process.env.SANITY_DEV_PORT || "3333"}), keep this site in{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">next dev</code>, then visit{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">/admin</code> — it redirects
        to Studio.
      </p>
      {projectId ? (
        <p className="mt-4 text-sm">
          <a
            className="text-neutral-900 underline underline-offset-2"
            href={`https://manage.sanity.io/projects/${projectId}`}
          >
            Open project in Sanity manage
          </a>
        </p>
      ) : null}
    </div>
  );
}
