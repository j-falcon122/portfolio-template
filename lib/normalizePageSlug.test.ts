import { describe, expect, it } from "vitest";
import { normalizePageSlug } from "@/lib/normalizePageSlug";

describe("normalizePageSlug", () => {
  it("strips leading and trailing slashes", () => {
    expect(normalizePageSlug("/work/")).toBe("work");
    expect(normalizePageSlug("///about///")).toBe("about");
  });

  it("defaults empty values to home", () => {
    expect(normalizePageSlug("")).toBe("home");
    expect(normalizePageSlug("   ")).toBe("home");
    expect(normalizePageSlug(null)).toBe("home");
    expect(normalizePageSlug(undefined)).toBe("home");
  });

  it("preserves plain slugs", () => {
    expect(normalizePageSlug("contact")).toBe("contact");
  });
});
