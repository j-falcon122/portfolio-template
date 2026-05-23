#!/usr/bin/env node
/**
 * Seed Sanity from content/mock/*.json + content/hosted-videos.json.
 * Uploads local images from public/ and wires HTTPS video URLs on the CDN.
 *
 * Requires SANITY_API_WRITE_TOKEN (or SANITY_WRITE_TOKEN) in .env.local.
 *
 * Usage:
 *   npm run seed:sanity
 *   npm run seed:sanity -- --only work
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  process.env.SANITY_WRITE_TOKEN?.trim();

let onlySlug;
const onlyEq = process.argv.find((a) => a.startsWith("--only="));
if (onlyEq) {
  onlySlug = onlyEq.split("=")[1];
} else {
  const onlyIdx = process.argv.indexOf("--only");
  if (onlyIdx !== -1 && process.argv[onlyIdx + 1]) {
    onlySlug = process.argv[onlyIdx + 1];
  }
}

if (!projectId || !token) {
  console.error("Set SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

const imageCache = new Map();

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function loadHostedVideos() {
  const file = path.join(root, "content", "hosted-videos.json");
  if (!fs.existsSync(file)) return {};
  const data = loadJson("content/hosted-videos.json");
  return data.videos && typeof data.videos === "object" ? data.videos : {};
}

function resolveVideoUrl(url, hosted) {
  if (!url) return url;
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  const key = url.startsWith("/") ? url : `/${url}`;
  return hosted[key] ?? hosted[url] ?? url;
}

async function uploadImageFromPublic(src) {
  if (!src?.startsWith("/")) return null;
  if (imageCache.has(src)) return imageCache.get(src);

  const filePath = path.join(publicDir, src.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    console.warn(`  skip image (missing): ${src}`);
    return null;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === ".svg"
      ? "image/svg+xml"
      : ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";

  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType,
  });
  const ref = { _type: "reference", _ref: asset._id };
  imageCache.set(src, ref);
  return ref;
}

async function imageFieldFromSrc(src, alt) {
  const asset = await uploadImageFromPublic(src);
  if (!asset) return undefined;
  return {
    _type: "image",
    asset,
    ...(alt ? { alt } : {}),
  };
}

async function convertGalleryItem(item, hosted) {
  if (item.type === "video" || item._type === "videoItem") {
    const videoUrl = resolveVideoUrl(item.videoUrl || item.src, hosted);
    if (!videoUrl?.startsWith("https://")) {
      console.warn(`  skip gallery video (no HTTPS url): ${item.videoUrl || item.src}`);
      return null;
    }
    const block = {
      _type: "videoItem",
      _key: `video-${videoUrl.slice(-12)}`,
      videoUrl,
      ...(item.alt ? { alt: item.alt } : {}),
    };
    if (item.poster?.src) {
      const poster = await imageFieldFromSrc(item.poster.src, item.poster.alt);
      if (poster) block.poster = poster;
    }
    return block;
  }

  const src = item.src;
  if (!src) return null;
  const image = await imageFieldFromSrc(src, item.alt);
  if (!image) return null;
  return {
    _key: `img-${src.replace(/\W/g, "")}`,
    ...image,
  };
}

async function convertBlock(block, hosted) {
  const t = block._type;
  const key = `${t}-${block.title || block.headline || block.label || Math.random().toString(36).slice(2, 8)}`
    .replace(/\W/g, "")
    .slice(0, 40);

  switch (t) {
    case "text":
      return {
        _type: "textBlock",
        _key: key,
        ...(block.title ? { title: block.title } : {}),
        body: block.body || "",
      };

    case "hero": {
      const row = {
        _type: "hero",
        _key: key,
        headline: block.headline || "Home",
        ...(block.brandTitle ? { brandTitle: block.brandTitle } : {}),
        ...(block.subheadline ? { subheadline: block.subheadline } : {}),
        ...(block.ctas?.length
          ? { ctas: block.ctas }
          : block.cta
            ? { ctas: [block.cta] }
            : {}),
      };
      if (block.backgroundImage?.src) {
        const bg = await imageFieldFromSrc(
          block.backgroundImage.src,
          block.backgroundImage.alt
        );
        if (bg) row.backgroundImage = bg;
      }
      return row;
    }

    case "about": {
      const row = {
        _type: "about",
        _key: key,
        ...(block.title ? { title: block.title } : {}),
        ...(block.body ? { body: block.body } : {}),
        ...(block.stats ? { stats: block.stats } : {}),
      };
      if (block.image?.src) {
        const img = await imageFieldFromSrc(block.image.src, block.image.alt);
        if (img) row.image = img;
      }
      return row;
    }

    case "contact":
      return {
        _type: "contact",
        _key: key,
        ...(block.title ? { title: block.title } : {}),
        ...(block.subtitle ? { subtitle: block.subtitle } : {}),
        ...(block.email ? { email: block.email } : {}),
        ...(block.phone ? { phone: block.phone } : {}),
        ...(block.location ? { location: block.location } : {}),
        ...(block.submitLabel ? { submitLabel: block.submitLabel } : {}),
        ...(block.socialLinks ? { socialLinks: block.socialLinks } : {}),
      };

    case "gallery": {
      const items = [];
      for (const item of block.items || []) {
        const converted = await convertGalleryItem(item, hosted);
        if (converted) items.push(converted);
      }
      return {
        _type: "gallery",
        _key: key,
        ...(block.title ? { title: block.title } : {}),
        items,
      };
    }

    case "video": {
      const videoUrl = resolveVideoUrl(block.videoUrl, hosted);
      if (!videoUrl?.startsWith("https://") && !block.embedUrl) {
        console.warn(`  skip video block (no HTTPS url): ${block.title}`);
        return null;
      }
      return {
        _type: "video",
        _key: key,
        ...(block.title ? { title: block.title } : {}),
        ...(block.embedUrl ? { embedUrl: block.embedUrl } : {}),
        ...(videoUrl?.startsWith("https://") ? { videoUrl } : {}),
      };
    }

    case "videoCarousel": {
      const items = [];
      for (const item of block.items || []) {
        if (item.embedUrl) {
          items.push({
            _type: "carouselVideoItem",
            _key: `embed-${String(item.title || item.embedUrl).replace(/\W/g, "").slice(0, 24)}`,
            ...(item.title ? { title: item.title } : {}),
            embedUrl: item.embedUrl,
            ...(item.alt ? { alt: item.alt } : {}),
          });
          continue;
        }
        const videoUrl = resolveVideoUrl(item.videoUrl || item.src, hosted);
        if (!videoUrl?.startsWith("https://")) {
          console.warn(`  skip carousel item (no HTTPS url): ${item.title || item.alt}`);
          continue;
        }
        const row = {
          _type: "carouselVideoItem",
          _key: `vc-${videoUrl.slice(-16).replace(/\W/g, "")}`,
          videoUrl,
          ...(item.title ? { title: item.title } : {}),
          ...(item.alt ? { alt: item.alt } : {}),
        };
        if (item.poster?.src) {
          const poster = await imageFieldFromSrc(item.poster.src, item.poster.alt);
          if (poster) row.poster = poster;
        }
        items.push(row);
      }
      if (!items.length) return null;
      return {
        _type: "videoCarousel",
        _key: key,
        ...(block.title ? { title: block.title } : {}),
        items,
      };
    }

    case "cta":
      return {
        _type: "cta",
        _key: key,
        label: block.label || "Learn more",
        href: block.href || "/",
      };

    default:
      console.warn(`  skip unknown block type: ${t}`);
      return null;
  }
}

async function seedPage(page, hosted) {
  const slug = page.slug;
  if (!slug) return;

  console.log(`\nPage: ${slug}`);
  const blocks = [];
  for (const block of page.blocks || []) {
    const converted = await convertBlock(block, hosted);
    if (converted) blocks.push(converted);
  }

  const doc = {
    _id: `page-${slug}`,
    _type: "page",
    title: page.title || slug,
    slug: { _type: "slug", current: slug },
    blocks,
  };

  await client.createOrReplace(doc);
  console.log(`  ✓ ${blocks.length} blocks → page-${slug}`);
}

async function seedSiteSettings(site) {
  console.log("\nSite settings");
  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    title: site.title || "Portfolio",
    nav: site.nav || [],
    ...(site.footerText ? { footerText: site.footerText } : {}),
    ...(site.navigationMode ? { navigationMode: site.navigationMode } : {}),
    ...(site.singlePageSectionSlugs?.length
      ? { singlePageSectionSlugs: site.singlePageSectionSlugs }
      : {}),
  };
  await client.createOrReplace(doc);

  const duplicates = await client.fetch(
    `*[_type == "siteSettings" && _id != "siteSettings"]._id`
  );
  for (const id of duplicates) {
    await client.delete(id);
    console.log(`  removed duplicate siteSettings: ${id}`);
  }
  console.log("  ✓ siteSettings");
}

const hosted = loadHostedVideos();
const pages = loadJson("content/mock/pages.json");
const site = loadJson("content/mock/site.json");

const filtered = onlySlug
  ? pages.filter((p) => p.slug === onlySlug)
  : pages;

if (onlySlug && filtered.length === 0) {
  console.error(`No page with slug "${onlySlug}" in pages.json`);
  process.exit(1);
}

console.log(`Seeding dataset "${dataset}" (project ${projectId})`);
if (Object.keys(hosted).length) {
  console.log(`Using ${Object.keys(hosted).length} hosted video URL(s)`);
} else {
  console.warn("No content/hosted-videos.json — run npm run upload:videos first for MP4s.");
}

if (!onlySlug) await seedSiteSettings(site);
for (const page of filtered) {
  await seedPage(page, hosted);
}

console.log("\nDone. Publish documents in Studio if your dataset requires it.");
console.log("Ensure .env.local has CMS_PROVIDER=sanity and restart: npm run dev");
