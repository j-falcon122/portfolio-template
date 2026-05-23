"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryBlock as GalleryBlockType } from "@/lib/cms/types";

export default function GalleryBlock({ title, items = [] }: GalleryBlockType) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="gallery page-container py-20" id="gallery">
      {title ? <h2 className="mb-10 text-center text-4xl font-bold">{title}</h2> : null}

      <div className="gallery__items grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, idx) => {
          const isVideo = item.type === "video";

          if (isVideo) {
            return (
              <div
                key={idx}
                className="gallery__item relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg"
              >
                <video
                  src={item.src}
                  poster={item.poster?.src}
                  aria-label={item.alt || "Gallery video"}
                  className="gallery__img"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              className={`gallery__item gallery__item--button group relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg ${
                selected === idx ? "gallery__item--selected" : ""
              }`}
              onClick={() => setSelected(idx)}
              aria-pressed={selected === idx}
              aria-label={item.alt || `View gallery item ${idx + 1}`}
            >
              <Image
                src={item.src}
                alt={item.alt || ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className={`gallery__img object-cover transition-transform duration-300 ${
                  selected === idx ? "scale-105" : ""
                } group-hover:scale-110`}
              />
              <span
                className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/35"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
