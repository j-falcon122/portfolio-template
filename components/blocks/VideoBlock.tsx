import type { VideoBlock as VideoBlockType } from "@/lib/cms/types";
import { withAssetPath } from "@/lib/basePath";
import { resolveEmbedUrl } from "@/lib/media/resolveEmbedUrl";

export default function VideoBlock({ title, embedUrl, videoUrl }: VideoBlockType) {
  const embedSrc = embedUrl ? resolveEmbedUrl(embedUrl) : undefined;

  return (
    <section className="page-container py-12">
      {title ? <h2 className="mb-4 text-2xl font-semibold">{title}</h2> : null}

      {embedSrc ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-100">
          <iframe
            src={embedSrc}
            title={title || "Embedded video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : videoUrl ? (
        <video
          controls
          className="w-full rounded-lg"
          playsInline
          preload="metadata"
          aria-label={title || "Video"}
        >
          <source src={withAssetPath(videoUrl)} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p className="text-sm text-neutral-500">No video available.</p>
      )}
    </section>
  );
}
