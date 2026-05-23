import { notFound } from "next/navigation";
import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { redirectToSinglePageAnchorIfNeeded } from "@/lib/singlePageNav";

export default async function HomeAliasPage() {
  const jump = await redirectToSinglePageAnchorIfNeeded("home");
  if (jump) return jump;

  const cms = getCms();
  const page = await cms.getPageBySlug("home");
  if (!page) return notFound();
  return <BlockRenderer blocks={page.blocks || []} />;
}