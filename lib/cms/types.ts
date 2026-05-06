export type NavItem = { label: string; href: string };

export type SiteSettings = {
  title: string;
  nav: NavItem[];
  footerText?: string;
};

export type HeroBlock = {
  _type: "hero";
  brandTitle?: string;
  headline: string;
  subheadline?: string;
  cta?: { label: string; href: string };
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