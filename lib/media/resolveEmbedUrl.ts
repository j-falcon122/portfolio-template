/**
 * Normalizes common YouTube/Vimeo share links to iframe-friendly embed URLs.
 * Pass through values that are already embed URLs or other hosts.
 */
export function resolveEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) return trimmed;
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : trimmed;
    }

    if (host === "player.vimeo.com") return trimmed;
  } catch {
    return trimmed;
  }

  return trimmed;
}
