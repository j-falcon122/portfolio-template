import { createClient, type SanityClient } from "@sanity/client";
import type {
  AboutBlock,
  Block,
  CmsProvider,
  ContactBlock,
  GalleryBlock,
  HeroBlock,
  NavItem,
  Page,
  SiteSettings,
  TextBlock,
  VideoBlock,
} from "../types";

/**
 * Expected Sanity document types (create matching schemas in your Studio):
 *
 * - `siteSettings` (singleton): { title, nav: [{label, href}], footerText }
 * - `page`: { slug (slug type or string), title, blocks: [...] }
 *
 * Block objects use `_type` matching Block union:
 * hero | gallery | video | text | cta | about | contact.
 * Images: use Sanity image fields; asset refs are resolved to `{ src, alt }` via GROQ.
 */

function requireProjectId(): string {
  const id = process.env.SANITY_PROJECT_ID?.trim();
  if (!id) {
    throw new Error(
      "[cms:sanity] Set SANITY_PROJECT_ID when CMS_PROVIDER=sanity."
    );
  }
  return id;
}

function createSanityClient(): SanityClient {
  const apiVersion =
    process.env.SANITY_API_VERSION?.trim() || "2024-01-01";
  const dataset = process.env.SANITY_DATASET?.trim() || "production";
  const token = process.env.SANITY_API_READ_TOKEN?.trim();

  return createClient({
    projectId: requireProjectId(),
    dataset,
    apiVersion,
    useCdn: process.env.SANITY_USE_CDN !== "false",
    ...(token ? { token } : {}),
  });
}

const SITE_SETTINGS_GROQ = `*[_type == "siteSettings"][0]{
  title,
  nav[]{ label, href },
  footerText
}`;

function pageGroq(slug: string): string {
  const normalized = (slug || "").trim();
  const candidates = new Set<string>([normalized]);
  if (normalized === "home") {
    candidates.add("/");
  }
  if (normalized.startsWith("/")) {
    const withoutSlash = normalized.slice(1);
    if (withoutSlash) candidates.add(withoutSlash);
  } else {
    candidates.add(`/${normalized}`);
  }
  const slugFilter = Array.from(candidates)
    .map((candidate) => {
      const safe = JSON.stringify(candidate);
      return `(slug.current == ${safe} || slug == ${safe})`;
    })
    .join(" || ");
  return `*[_type == "page" && (${slugFilter})][0]{
    "slug": coalesce(slug.current, slug),
    title,
    blocks[]{
      _key,
      "_type": select(_type == "textBlock" => "text", _type),
      brandTitle,
      headline,
      subheadline,
      cta,
      title,
      body,
      label,
      href,
      subtitle,
      email,
      phone,
      location,
      submitLabel,
      embedUrl,
      videoUrl,
      socialLinks[]{label, href},
      stats[]{value, label},
      items[]{
        _type,
        videoUrl,
        embedUrl,
        "src": coalesce(asset->url, src),
        "alt": coalesce(alt, asset->altText)
        ,
        poster{
          "src": coalesce(asset->url, src),
          "alt": coalesce(alt, asset->altText)
        }
      },
      image{
        "src": coalesce(asset->url, src),
        "alt": coalesce(alt, asset->altText)
      },
      backgroundImage{
        "src": coalesce(asset->url, src),
        "alt": coalesce(alt, asset->altText)
      }
    }
  }`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeNav(items: unknown): NavItem[] {
  if (!Array.isArray(items)) return [];
  const out: NavItem[] = [];
  for (const row of items) {
    if (!isRecord(row)) continue;
    const label = typeof row.label === "string" ? row.label : "";
    const href = typeof row.href === "string" ? row.href : "";
    if (label || href) out.push({ label, href });
  }
  return out;
}

function normalizeHero(raw: Record<string, unknown>): HeroBlock {
  const bg = raw.backgroundImage;
  let backgroundImage: HeroBlock["backgroundImage"];
  if (isRecord(bg) && typeof bg.src === "string") {
    backgroundImage = {
      src: bg.src,
      ...(typeof bg.alt === "string" ? { alt: bg.alt } : {}),
    };
  }
  const ctaRaw = raw.cta;
  let cta: HeroBlock["cta"];
  if (isRecord(ctaRaw)) {
    const label = typeof ctaRaw.label === "string" ? ctaRaw.label : "";
    const href = typeof ctaRaw.href === "string" ? ctaRaw.href : "";
    if (label || href) cta = { label, href };
  }
  return {
    _type: "hero",
    ...(typeof raw.brandTitle === "string"
      ? { brandTitle: raw.brandTitle }
      : {}),
    headline:
      typeof raw.headline === "string" ? raw.headline : "Untitled",
    ...(typeof raw.subheadline === "string"
      ? { subheadline: raw.subheadline }
      : {}),
    ...(cta ? { cta } : {}),
    ...(backgroundImage ? { backgroundImage } : {}),
  };
}

function normalizeGallery(raw: Record<string, unknown>): GalleryBlock {
  const itemsRaw = raw.items;
  const items: GalleryBlock["items"] = [];
  if (Array.isArray(itemsRaw)) {
    for (const it of itemsRaw) {
      if (!isRecord(it)) continue;
      const type = typeof it._type === "string" ? it._type : "";
      const src = typeof it.src === "string" ? it.src : "";
      const videoUrl = typeof it.videoUrl === "string" ? it.videoUrl : "";
      const alt = typeof it.alt === "string" ? it.alt : undefined;
      const posterRaw = it.poster;
      const poster =
        isRecord(posterRaw) && typeof posterRaw.src === "string"
          ? {
              src: posterRaw.src,
              ...(typeof posterRaw.alt === "string" ? { alt: posterRaw.alt } : {}),
            }
          : undefined;

      if (type === "videoItem" || videoUrl) {
        const embedUrl =
          typeof it.embedUrl === "string" ? it.embedUrl : undefined;
        const videoSrc = videoUrl || src;
        if (!videoSrc && !embedUrl) continue;
        items.push({
          type: "video",
          src: videoSrc || embedUrl || "",
          ...(alt ? { alt } : {}),
          ...(poster ? { poster } : {}),
          ...(embedUrl ? { embedUrl } : {}),
          ...(videoUrl ? { videoUrl } : {}),
        });
        continue;
      }

      if (!src) continue;
      items.push({
        type: "image",
        src,
        ...(alt ? { alt } : {}),
      });
    }
  }
  return {
    _type: "gallery",
    ...(typeof raw.title === "string" ? { title: raw.title } : {}),
    items,
  };
}

function normalizeVideo(raw: Record<string, unknown>): VideoBlock {
  return {
    _type: "video",
    ...(typeof raw.title === "string" ? { title: raw.title } : {}),
    ...(typeof raw.embedUrl === "string"
      ? { embedUrl: raw.embedUrl }
      : {}),
    ...(typeof raw.videoUrl === "string"
      ? { videoUrl: raw.videoUrl }
      : {}),
  };
}

function normalizeText(raw: Record<string, unknown>): TextBlock {
  const imageRaw = raw.image;
  let image: TextBlock["image"];
  if (isRecord(imageRaw) && typeof imageRaw.src === "string") {
    image = {
      src: imageRaw.src,
      ...(typeof imageRaw.alt === "string" ? { alt: imageRaw.alt } : {}),
    };
  }
  return {
    _type: "text",
    ...(typeof raw.title === "string" ? { title: raw.title } : {}),
    body: typeof raw.body === "string" ? raw.body : "",
    ...(image ? { image } : {}),
  };
}

function normalizeAbout(raw: Record<string, unknown>): AboutBlock {
  const imageRaw = raw.image;
  const statsRaw = raw.stats;
  const stats: AboutBlock["stats"] = [];
  if (Array.isArray(statsRaw)) {
    for (const stat of statsRaw) {
      if (!isRecord(stat)) continue;
      const value = typeof stat.value === "string" ? stat.value : "";
      const label = typeof stat.label === "string" ? stat.label : "";
      if (value || label) stats.push({ value, label });
    }
  }

  let image: AboutBlock["image"];
  if (isRecord(imageRaw) && typeof imageRaw.src === "string") {
    image = {
      src: imageRaw.src,
      ...(typeof imageRaw.alt === "string" ? { alt: imageRaw.alt } : {}),
    };
  }

  return {
    _type: "about",
    ...(typeof raw.title === "string" ? { title: raw.title } : {}),
    ...(typeof raw.body === "string" ? { body: raw.body } : {}),
    ...(image ? { image } : {}),
    ...(stats.length ? { stats } : {}),
  };
}

function normalizeContact(raw: Record<string, unknown>): ContactBlock {
  const linksRaw = raw.socialLinks;
  const socialLinks: ContactBlock["socialLinks"] = [];
  if (Array.isArray(linksRaw)) {
    for (const link of linksRaw) {
      if (!isRecord(link)) continue;
      const label = typeof link.label === "string" ? link.label : "";
      const href = typeof link.href === "string" ? link.href : "";
      if (label || href) socialLinks.push({ label, href });
    }
  }
  return {
    _type: "contact",
    ...(typeof raw.title === "string" ? { title: raw.title } : {}),
    ...(typeof raw.subtitle === "string" ? { subtitle: raw.subtitle } : {}),
    ...(typeof raw.email === "string" ? { email: raw.email } : {}),
    ...(typeof raw.phone === "string" ? { phone: raw.phone } : {}),
    ...(typeof raw.location === "string" ? { location: raw.location } : {}),
    ...(typeof raw.submitLabel === "string"
      ? { submitLabel: raw.submitLabel }
      : {}),
    ...(socialLinks.length ? { socialLinks } : {}),
  };
}

function normalizeBlock(raw: unknown): Block | null {
  if (!isRecord(raw)) return null;
  const t = raw._type;
  switch (t) {
    case "hero":
      return normalizeHero(raw);
    case "gallery":
      return normalizeGallery(raw);
    case "video":
      return normalizeVideo(raw);
    case "text":
    case "textBlock":
      return normalizeText(raw);
    case "about":
      return normalizeAbout(raw);
    case "contact":
      return normalizeContact(raw);
    case "cta": {
      const label = typeof raw.label === "string" ? raw.label : "";
      const href = typeof raw.href === "string" ? raw.href : "";
      if (!label && !href) return null;
      return { _type: "cta", label, href };
    }
    default:
      return null;
  }
}

function normalizePage(raw: unknown): Page | null {
  if (!isRecord(raw)) return null;
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  if (!slug) return null;
  const blocksRaw = raw.blocks;
  const blocks: Block[] = [];
  if (Array.isArray(blocksRaw)) {
    for (const b of blocksRaw) {
      const nb = normalizeBlock(b);
      if (nb) blocks.push(nb);
    }
  }
  return {
    slug,
    ...(typeof raw.title === "string" ? { title: raw.title } : {}),
    blocks,
  };
}

let client: SanityClient | null = null;
let warnedMissingSiteSettings = false;
function clientSingleton(): SanityClient {
  if (!client) client = createSanityClient();
  return client;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  title: "Template Portfolio",
  nav: [
    {label: "Home", href: "/"},
    {label: "About", href: "/about"},
    {label: "Work", href: "/work"},
    {label: "Contact", href: "/contact"},
  ],
  footerText: "Publish a siteSettings document in Sanity to customize this.",
};

const provider: CmsProvider = {
  async getSiteSettings(): Promise<SiteSettings> {
    const data = await clientSingleton().fetch<unknown>(SITE_SETTINGS_GROQ);
    if (!isRecord(data)) {
      if (!warnedMissingSiteSettings) {
        console.warn(
          "[cms:sanity] siteSettings document not found. Using defaults until content is published."
        );
        warnedMissingSiteSettings = true;
      }
      return DEFAULT_SITE_SETTINGS;
    }
    const title =
      typeof data.title === "string" ? data.title : "Site";
    return {
      title,
      nav: normalizeNav(data.nav),
      ...(typeof data.footerText === "string"
        ? { footerText: data.footerText }
        : {}),
    };
  },

  async getPageBySlug(slug: string): Promise<Page | null> {
    const raw = await clientSingleton().fetch<unknown>(pageGroq(slug));
    if (!raw) return null;
    return normalizePage(raw);
  },
};

export default provider;
