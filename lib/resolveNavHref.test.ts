import { describe, expect, it } from "vitest";
import { resolveNavHref } from "@/lib/resolveNavHref";

describe("resolveNavHref", () => {
  it("returns href unchanged in routes mode", () => {
    expect(resolveNavHref("/work", "routes")).toBe("/work");
    expect(resolveNavHref("/work", undefined)).toBe("/work");
  });

  it("rewrites internal paths to hash targets in single-page mode", () => {
    expect(resolveNavHref("/", "single-page")).toBe("/#home");
    expect(resolveNavHref("/work", "single-page")).toBe("/#work");
    expect(resolveNavHref("/about/", "single-page")).toBe("/#about");
  });

  it("leaves external and special links unchanged", () => {
    expect(resolveNavHref("https://example.com", "single-page")).toBe(
      "https://example.com"
    );
    expect(resolveNavHref("mailto:hi@example.com", "single-page")).toBe(
      "mailto:hi@example.com"
    );
    expect(resolveNavHref("/admin", "single-page")).toBe("/admin");
    expect(resolveNavHref("/work/case-study", "single-page")).toBe(
      "/work/case-study"
    );
  });
});
