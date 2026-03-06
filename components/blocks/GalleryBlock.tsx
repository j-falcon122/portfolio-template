"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryBlock as GalleryBlockType } from "@/lib/cms/types";

export default function GalleryBlock({ title, items = [] }: GalleryBlockType) {
	// track a simple selected image (not required) — keep hooks at top-level
	const [selected, setSelected] = useState<number | null>(null);

	return (
		<section className="max-w-6xl mx-auto py-12">
			{title ? <h2 className="mb-6 text-2xl font-semibold">{title}</h2> : null}

					<div className="gallery__items grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{items.map((item, idx) => (
							<div
								key={idx}
								className="gallery__item overflow-hidden rounded cursor-pointer"
								onClick={() => setSelected(idx)}
							>
								<Image
									src={item.src}
									alt={item.alt || ""}
									width={800}
									height={600}
									className={`gallery__img w-full h-auto object-cover transition-transform duration-150 ${selected === idx ? 'scale-105' : ''}`}
								/>
							</div>
						))}
					</div>
		</section>
	);
}
