import type {
  GalleryVideoItem,
  VideoCarouselBlock as VideoCarouselBlockType,
} from "@/lib/cms/types";
import CarouselClient from "./CarouselClient";

function toGalleryItems(items: VideoCarouselBlockType["items"]): GalleryVideoItem[] {
  const out: GalleryVideoItem[] = [];
  for (const item of items) {
    const videoUrl = item.videoUrl?.trim();
    const embedUrl = item.embedUrl?.trim();
    if (!videoUrl && !embedUrl) continue;

    const label = item.title || item.alt;
    out.push({
      type: "video",
      src: videoUrl || embedUrl || "",
      ...(label ? { alt: label } : {}),
      ...(item.poster ? { poster: item.poster } : {}),
      ...(embedUrl ? { embedUrl } : {}),
      ...(videoUrl ? { videoUrl } : {}),
    });
  }
  return out;
}

export default function VideoCarouselBlock({
  title,
  items = [],
}: VideoCarouselBlockType) {
  const galleryItems = toGalleryItems(items);
  if (!galleryItems.length) return null;

  return (
    <section className="video-carousel page-container page-container--carousel py-12" id="video-carousel">
      {title ? <h2 className="gallery__title">{title}</h2> : null}
      <CarouselClient
        items={galleryItems}
        className="video-carousel__slider relative"
        showControls={galleryItems.length > 1}
      />
    </section>
  );
}
