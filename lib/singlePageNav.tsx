import { getCms } from "@/lib/cms";
import SinglePageAnchorRedirect from "@/components/SinglePageAnchorRedirect";

/** When the site is in single-page mode, `/slug` URLs hand off to an in-page anchor on `/`. */
export async function redirectToSinglePageAnchorIfNeeded(slug: string) {
  const site = await getCms().getSiteSettings();
  if ((site.navigationMode ?? "routes") !== "single-page") return null;
  return <SinglePageAnchorRedirect slug={slug} />;
}
