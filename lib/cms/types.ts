export type NavItem = { label: string; href: string };

/** `single-page`: `/` stacks section blocks; nav uses in-page anchors (`/#slug`). Sub-routes redirect to anchors. */
export type NavigationMode = "routes" | "single-page";

export type SiteSettings = {
  title: string;
  nav: NavItem[];
  footerText?: string;
  /** Defaults to `routes` when omitted (multi-page). */
  navigationMode?: NavigationMode;
  /**
   * Order of `page` document slugs stacked on `/` when `navigationMode` is `single-page`.
   * Each slug must match a published page. Omit or leave empty to use built-in defaults.
   */
  singlePageSectionSlugs?: string[];
};

export type HeroCta = { label: string; href: string };

export type HeroBlock = {
  _type: "hero";
  brandTitle?: string;
  headline: string;
  subheadline?: string;
  /** @deprecated Use `ctas` — kept for backward compatibility with older content. */
  cta?: HeroCta;
  ctas?: HeroCta[];
  backgroundImage?: { src: string; alt?: string };
};

/** Gallery row used by Carousel and GalleryBlock (Sanity resolves to discriminated union on `type`) */
export type GalleryImageItem = {
  type: "image";
  src: string;
  alt?: string;
};

export type GalleryVideoItem = {
  type: "video";
  src: string;
  alt?: string;
  poster?: { src: string; alt?: string };
  embedUrl?: string;
  videoUrl?: string;
};

export type GalleryItem = GalleryImageItem | GalleryVideoItem;

export type GalleryBlock = {
  _type: "gallery";
  title?: string;
  items: GalleryItem[];
};

export type VideoBlock = {
  _type: "video";
  title?: string;
  embedUrl?: string;
  videoUrl?: string;
};

export type VideoCarouselItem = {
  title?: string;
  videoUrl?: string;
  embedUrl?: string;
  alt?: string;
  poster?: { src: string; alt?: string };
};

export type VideoCarouselBlock = {
  _type: "videoCarousel";
  title?: string;
  items: VideoCarouselItem[];
};

export type TextBlock = {
  _type: "text";
  title?: string;
  body: string;
  image?: { src: string; alt?: string };
};

export type CtaBlock = {
  _type: "cta";
  label: string;
  href: string;
};

export type AboutBlock = {
  _type: "about";
  title?: string;
  body?: string;
  image?: { src: string; alt?: string };
  stats?: { value: string; label: string }[];
};

export type ContactBlock = {
  _type: "contact";
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks?: { label: string; href: string }[];
  submitLabel?: string;
};

export type Block =
  | HeroBlock
  | GalleryBlock
  | VideoBlock
  | VideoCarouselBlock
  | TextBlock
  | CtaBlock
  | AboutBlock
  | ContactBlock;

export type Page = {
  slug: string;
  title?: string;
  blocks: Block[];
};

export type CmsProvider = {
  getSiteSettings: () => Promise<SiteSettings>;
  getPageBySlug: (slug: string) => Promise<Page | null>;
};