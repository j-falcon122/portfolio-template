import type { TextBlock as TextBlockType } from "@/lib/cms/types";

export default function TextBlock({ title, body }: TextBlockType) {
	return (
		<section className="text-block page-container prose py-14">
			{title ? <h2 className="mb-5 text-4xl font-bold text-neutral-900">{title}</h2> : null}
			<div className="text-block__body" dangerouslySetInnerHTML={{ __html: body }} />
		</section>
	);
}
