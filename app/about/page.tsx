import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function AboutPage() {
	const cms = getCms();
	const page = await cms.getPageBySlug("about");
	return <BlockRenderer blocks={page?.blocks || []} />;
}
