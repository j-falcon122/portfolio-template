import { afterEach, describe, expect, it, vi } from "vitest";

describe("withBasePath", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns paths unchanged when no base path is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { withBasePath, withAssetPath } = await import("@/lib/basePath");
    expect(withBasePath("/#home")).toBe("/#home");
    expect(withAssetPath("/logo.png")).toBe("/logo.png");
  });

  it("prefixes internal routes and assets with the base path", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio-template");
    vi.resetModules();
    const { withBasePath, withAssetPath } = await import("@/lib/basePath");
    expect(withBasePath("/#work")).toBe("/portfolio-template/#work");
    expect(withBasePath("/admin")).toBe("/portfolio-template/admin");
    expect(withAssetPath("/jf_logo_transparent.png")).toBe(
      "/portfolio-template/jf_logo_transparent.png"
    );
  });

  it("leaves external URLs unchanged", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio-template");
    vi.resetModules();
    const { withBasePath } = await import("@/lib/basePath");
    expect(withBasePath("https://example.com/x")).toBe("https://example.com/x");
  });
});
