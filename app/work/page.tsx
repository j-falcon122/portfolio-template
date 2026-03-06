import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function WorkPage() {
	const cms = getCms();
	const page = await cms.getPageBySlug("work");
	return <BlockRenderer blocks={page?.blocks || []} />;
}
