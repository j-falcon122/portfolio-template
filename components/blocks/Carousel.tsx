"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/cms/types";
import { withAssetPath } from "@/lib/basePath";
import { resolveEmbedUrl } from "@/lib/media/resolveEmbedUrl";

export default function Carousel({
  items = [],
  className = "",
  showControls = true,
}: {
  items?: GalleryItem[];
  className?: string;
  showControls?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const pauseInactiveVideos = () => {
      const root = rootRef.current;
      if (!root) return;
      const idx = emblaApi.selectedScrollSnap();
      root.querySelectorAll(".embla__slide").forEach((slide, i) => {
        const video = slide.querySelector("video");
        if (video && i !== idx) video.pause();
      });
    };

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      pauseInactiveVideos();
    };
    emblaApi.on("select", onSelect);
    onSelect();

    if (items.length > 0) {
      emblaApi.scrollTo(0);
    }

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, items.length]);

  useEffect(() => {
    if (!emblaApi) return;

    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root || !root.contains(document.activeElement)) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    if (isPlaying) {
      autoplayRef.current = window.setInterval(() => emblaApi.scrollNext(), 4000);
    } else if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    return () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isPlaying, emblaApi]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPlay = () => setIsPlaying(false);
    const videos = Array.from(root.querySelectorAll("video")) as HTMLVideoElement[];

    videos.forEach((v) => v.addEventListener("play", onPlay));

    return () => {
      videos.forEach((v) => v.removeEventListener("play", onPlay));
    };
  }, [items.length]);

  const mergeRefs = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    emblaRef(el);
  };

  const slideLabel =
    items.length > 0 ? `Slide ${selectedIndex + 1} of ${items.length}` : "";

  return (
    <div
      className={className}
      aria-roledescription="carousel"
      aria-label={items[selectedIndex]?.alt || "Media carousel"}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slideLabel}
      </p>
      <div className="embla" ref={mergeRefs} tabIndex={0}>
        <div className="embla__container">
          {items.map((item, idx) => {
            const keyStr =
              item.type === "image"
                ? item.src
                : item.embedUrl || item.videoUrl || item.src || String(idx);

            return (
              <div key={keyStr} className="embla__slide">
                {item.type === "image" ? (
                  <Image
                    src={withAssetPath(item.src)}
                    alt={item.alt || ""}
                    width={1600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                ) : item.embedUrl ? (
                  <div className="video-carousel__frame">
                    <iframe
                      src={resolveEmbedUrl(item.embedUrl)}
                      title={item.alt || "Video"}
                      className="video-carousel__media"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="video-carousel__frame">
                    <video
                      src={withAssetPath(item.videoUrl ?? item.src)}
                      controls
                      playsInline
                      preload="metadata"
                      poster={item.poster?.src ? withAssetPath(item.poster.src) : undefined}
                      className="video-carousel__media"
                      aria-label={item.alt || "Video"}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {items[selectedIndex]?.alt ? (
        <p className="video-carousel__caption mt-3 text-center text-sm text-neutral-600">
          {items[selectedIndex]?.alt}
        </p>
      ) : null}

      {items.length > 1 && showControls ? (
        <div className="carousel-controls mt-5">
          <div className="carousel-controls__inner">
            <div className="carousel-controls__actions">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="carousel-controls__btn carousel-controls__btn--nav"
                aria-label="Previous slide"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="carousel-controls__btn carousel-controls__btn--play"
                aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <div className="carousel-controls__dots" role="group" aria-label="Choose slide">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-current={i === selectedIndex ? "true" : undefined}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`carousel-controls__dot${i === selectedIndex ? " carousel-controls__dot--active" : ""}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="carousel-controls__btn carousel-controls__btn--nav"
              aria-label="Next slide"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
