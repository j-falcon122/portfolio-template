import fs from "node:fs";
import path from "node:path";
import type {
  Block,
  GalleryBlock,
  Page,
  VideoBlock,
  VideoCarouselBlock,
} from "./types";

/** Maps local/public paths (or keys) to HTTPS CDN URLs — see content/hosted-videos.example.json */
export type HostedVideoMap = Record<string, string>;

const MAP_PATH = path.join(process.cwd(), "content", "hosted-videos.json");

let cachedMap: HostedVideoMap | null | undefined;

function loadHostedVideoMap(): HostedVideoMap | null {
  if (cachedMap !== undefined) return cachedMap;
  try {
    if (!fs.existsSync(MAP_PATH)) {
      cachedMap = null;
      return null;
    }
    const raw = JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) as {
      videos?: HostedVideoMap;
    };
    const videos = raw?.videos;
    if (!videos || typeof videos !== "object") {
      cachedMap = null;
      return null;
    }
    const map: HostedVideoMap = {};
    for (const [key, value] of Object.entries(videos)) {
      if (typeof value === "string" && value.startsWith("https://")) {
        map[key] = value;
      }
    }
    cachedMap = Object.keys(map).length ? map : null;
    return cachedMap;
  } catch {
    cachedMap = null;
    return null;
  }
}

function resolveUrl(url: string, map: HostedVideoMap): string {
  if (!url || url.startsWith("https://") || url.startsWith("http://")) return url;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return map[normalized] ?? map[url] ?? url;
}

function applyToGallery(block: GalleryBlock, map: HostedVideoMap): GalleryBlock {
  return {
    ...block,
    items: block.items.map((item) => {
      if (item.type !== "video") return item;
      const src = resolveUrl(item.src, map);
      const videoUrl = item.videoUrl ? resolveUrl(item.videoUrl, map) : src;
      return { ...item, src, videoUrl };
    }),
  };
}

function applyToVideo(block: VideoBlock, map: HostedVideoMap): VideoBlock {
  if (!block.videoUrl) return block;
  return { ...block, videoUrl: resolveUrl(block.videoUrl, map) };
}

function applyToVideoCarousel(
  block: VideoCarouselBlock,
  map: HostedVideoMap
): VideoCarouselBlock {
  return {
    ...block,
    items: block.items.map((item) => {
      if (!item.videoUrl) return item;
      return { ...item, videoUrl: resolveUrl(item.videoUrl, map) };
    }),
  };
}

function applyToBlock(block: Block, map: HostedVideoMap): Block {
  if (block._type === "gallery") return applyToGallery(block, map);
  if (block._type === "video") return applyToVideo(block, map);
  if (block._type === "videoCarousel") return applyToVideoCarousel(block, map);
  return block;
}

export function applyHostedVideoUrlsToPage(page: Page): Page {
  const map = loadHostedVideoMap();
  if (!map) return page;
  return {
    ...page,
    blocks: page.blocks.map((b) => applyToBlock(b, map)),
  };
}

export function applyHostedVideoUrlsToPages(pages: Page[]): Page[] {
  return pages.map(applyHostedVideoUrlsToPage);
}
