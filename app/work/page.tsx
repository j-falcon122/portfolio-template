import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { redirectToSinglePageAnchorIfNeeded } from "@/lib/singlePageNav";

export default async function WorkPage() {
  const jump = await redirectToSinglePageAnchorIfNeeded("work");
  if (jump) return jump;

  const cms = getCms();
  const page = await cms.getPageBySlug("work");
  return <BlockRenderer blocks={page?.blocks || []} />;
}
