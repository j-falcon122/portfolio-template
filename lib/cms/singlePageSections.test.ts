import { describe, expect, it } from "vitest";
import {
  DEFAULT_SINGLE_PAGE_SECTION_SLUGS,
  resolveSinglePageSectionSlugs,
} from "@/lib/cms/singlePageSections";
import type { SiteSettings } from "@/lib/cms/types";

describe("resolveSinglePageSectionSlugs", () => {
  it("uses CMS order when provided", () => {
    const site: SiteSettings = {
      title: "Test",
      nav: [],
      singlePageSectionSlugs: ["work", "home", "contact"],
    };

    expect(resolveSinglePageSectionSlugs(site)).toEqual([
      "work",
      "home",
      "contact",
    ]);
  });

  it("normalizes slug formatting from CMS values", () => {
    const site: SiteSettings = {
      title: "Test",
      nav: [],
      singlePageSectionSlugs: ["/about/", "  work  "],
    };

    expect(resolveSinglePageSectionSlugs(site)).toEqual(["about", "work"]);
  });

  it("falls back to defaults when CMS list is empty or invalid", () => {
    const site: SiteSettings = {
      title: "Test",
      nav: [],
      singlePageSectionSlugs: [],
    };

    expect(resolveSinglePageSectionSlugs(site)).toEqual([
      ...DEFAULT_SINGLE_PAGE_SECTION_SLUGS,
    ]);
    expect(
      resolveSinglePageSectionSlugs({
        title: "Test",
        nav: [],
      })
    ).toEqual([...DEFAULT_SINGLE_PAGE_SECTION_SLUGS]);
  });
});
