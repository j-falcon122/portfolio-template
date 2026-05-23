import { describe, expect, it } from "vitest";
import { resolveEmbedUrl } from "@/lib/media/resolveEmbedUrl";

describe("resolveEmbedUrl", () => {
  it("converts YouTube watch URLs to embed URLs", () => {
    expect(
      resolveEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("converts youtu.be short links to embed URLs", () => {
    expect(resolveEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
  });

  it("converts Vimeo page URLs to player URLs", () => {
    expect(resolveEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789"
    );
  });

  it("passes through existing embed URLs and invalid input", () => {
    expect(resolveEmbedUrl("https://www.youtube.com/embed/abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    );
    expect(resolveEmbedUrl("not-a-url")).toBe("not-a-url");
    expect(resolveEmbedUrl("")).toBe("");
  });
});
