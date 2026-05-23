import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { redirectToSinglePageAnchorIfNeeded } from "@/lib/singlePageNav";

export default async function AboutPage() {
  const jump = await redirectToSinglePageAnchorIfNeeded("about");
  if (jump) return jump;

  const cms = getCms();
  const page = await cms.getPageBySlug("about");
  return <BlockRenderer blocks={page?.blocks || []} />;
}
