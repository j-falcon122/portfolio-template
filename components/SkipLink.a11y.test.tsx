import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import SkipLink from "@/components/SkipLink";

describe("SkipLink accessibility", () => {
  it("passes axe checks", async () => {
    const { container } = render(<SkipLink />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("links to main content", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content"
    );
  });
});
