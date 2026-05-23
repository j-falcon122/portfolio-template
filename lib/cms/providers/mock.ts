import site from "../../../content/mock/site.json";
import pages from "../../../content/mock/pages.json";
import { applyHostedVideoUrlsToPage } from "../hostedVideos";
import type { CmsProvider, Page, SiteSettings } from "../types";

const provider: CmsProvider = {
  async getSiteSettings(): Promise<SiteSettings> {
    return site as SiteSettings;
  },
  async getPageBySlug(slug: string): Promise<Page | null> {
    const page = (pages as Page[]).find((p) => p.slug === slug);
    if (!page) return null;
    return applyHostedVideoUrlsToPage(page);
  }
};

export default provider;