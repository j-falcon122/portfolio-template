"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/cms/types";

export default function Carousel({ items = [], className = "", showControls = true }: { items?: GalleryItem[]; className?: string; showControls?: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayRef = useRef<number | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalAssets = items.length || 0;

  // log initial asset count
  useEffect(() => {
    console.log(`Carousel initialized with ${totalAssets} assets`);
    setLoadedCount(0);
  }, [totalAssets]);

  const onAssetLoaded = useCallback(() => {
    setLoadedCount((c) => {
      const next = c + 1;
      console.log(`Asset loaded: ${next}/${totalAssets}`);
      return next;
    });
  }, [totalAssets]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (emblaApi) console.log('Embla initialized:', emblaApi);
    else console.log('Embla not yet initialized');
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    // ensure we start at slide 0 on mount — only when items exist
    if (items.length > 0) emblaApi.scrollTo(0);
    return () => {
      if (emblaApi) emblaApi.off("select", onSelect);
    };
  }, [emblaApi, items.length]);

  useEffect(() => {
    if (!emblaApi) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
      else if (e.key === "ArrowRight") emblaApi.scrollNext();
      else if (e.key === " ") setIsPlaying((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    if (isPlaying) {
      autoplayRef.current = window.setInterval(() => emblaApi.scrollNext(), 4000);
    } else {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }
    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isPlaying, emblaApi]);

  // pause autoplay when a video element inside the carousel starts playing
  useEffect(() => {
    const onPlay = () => setIsPlaying(false);
    const onPause = () => {};
    const root = rootRef.current;
    if (!root) return;
    const videos = Array.from(root.querySelectorAll('video')) as HTMLVideoElement[];
    videos.forEach((v) => v.addEventListener('play', onPlay));
    videos.forEach((v) => v.addEventListener('pause', onPause));
    return () => {
      videos.forEach((v) => v.removeEventListener('play', onPlay));
      videos.forEach((v) => v.removeEventListener('pause', onPause));
    };
  }, [rootRef, items.length]);

  return (
    <div className={className}>
      <div className="embla" ref={(el) => {
        emblaRef(el as any);
        rootRef.current = el;
      }}>
        <div className="embla__container">
          {items.map((item, idx) => {
            const keyStr =
              item.type === "image"
                ? item.src
                : item.embedUrl || item.videoUrl || item.src || idx;
            return (
              <div key={keyStr} className="embla__slide">
              {item.type === "image" ? (
                <Image src={item.src} alt={item.alt || ""} width={1600} height={900} className="w-full h-auto object-cover" />
              ) : item.embedUrl ? (
                <iframe
                  src={item.embedUrl}
                  title={item.alt || "Video"}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={item.videoUrl ?? item.src}
                  controls
                  poster={item.poster?.src}
                  className="w-full h-auto"
                />
              )}
              </div>
            );
          })}
        </div>
      </div>

  {items.length > 1 && showControls ? (
        <div className="carousel-controls mt-4">
          <div className="controls-inner flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <button onClick={() => {
                console.log('Carousel Prev clicked, emblaApi=', !!emblaApi);
                if (emblaApi) emblaApi.scrollPrev();
                else console.warn('Prev clicked but emblaApi not ready');
              }} className="px-3 py-2 bg-white rounded pointer-events-auto">Prev</button>
              <button onClick={() => { console.log(isPlaying ? 'Carousel Pause clicked' : 'Carousel Play clicked'); setIsPlaying((p) => !p); }} className="px-3 py-2 bg-white rounded pointer-events-auto">
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <div className="flex gap-2">
              {items.map((_, i) => (
                <button key={i} onClick={() => { console.log(`Carousel dot ${i} clicked, emblaApi=`, !!emblaApi); if (emblaApi) emblaApi.scrollTo(i); else console.warn('Dot clicked but emblaApi not ready'); }} className={`w-2 h-2 rounded-full ${i === selectedIndex ? "bg-black" : "bg-white/60"} pointer-events-auto`} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>

            <button onClick={() => { console.log('Carousel Next clicked, emblaApi=', !!emblaApi); if (emblaApi) emblaApi.scrollNext(); else console.warn('Next clicked but emblaApi not ready'); }} className="px-3 py-2 bg-white rounded pointer-events-auto">Next</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
