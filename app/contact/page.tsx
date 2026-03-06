import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function ContactPage() {
	const cms = getCms();
	const page = await cms.getPageBySlug("contact");
	return <BlockRenderer blocks={page?.blocks || []} />;
}
