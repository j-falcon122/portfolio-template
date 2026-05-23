import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import SiteBrand from "@/components/SiteBrand";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
    <img src={src} alt={alt} className={className} />
  ),
}));

describe("SiteBrand accessibility", () => {
  it("passes axe checks", async () => {
    const { container } = render(<SiteBrand title="Portfolio Template" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("exposes descriptive logo alt text", () => {
    render(<SiteBrand title="Portfolio Template" logoAlt="Jordan Falcon logo" />);
    expect(screen.getByRole("img", { name: "Jordan Falcon logo" })).toBeInTheDocument();
  });
});
