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

export type GalleryBlock = {
  _type: "gallery";
  title?: string;
  items: { src: string; alt?: string }[];
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
};

export type CtaBlock = {
  _type: "cta";
  label: string;
  href: string;
};

export type Block = HeroBlock | GalleryBlock | VideoBlock | TextBlock | CtaBlock;

export type Page = {
  slug: string;
  title?: string;
  blocks: Block[];
};

export type CmsProvider = {
  getSiteSettings: () => Promise<SiteSettings>;
  getPageBySlug: (slug: string) => Promise<Page | null>;
};