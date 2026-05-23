import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import CtaBlock from "@/components/blocks/CtaBlock";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("CtaBlock accessibility", () => {
  it("passes axe checks", async () => {
    const { container } = render(
      <CtaBlock _type="cta" label="Start a project" href="/contact" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders a link with visible label text", () => {
    render(<CtaBlock _type="cta" label="Start a project" href="/contact" />);
    expect(screen.getByRole("link", { name: "Start a project" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});
