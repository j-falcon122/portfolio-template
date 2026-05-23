import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import SinglePageNavLink from "@/components/SinglePageNavLink";

const mockPathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

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

vi.mock("@/lib/scrollToPageSection", () => ({
  scrollToPageSectionWhenReady: vi.fn(),
}));

describe("SinglePageNavLink accessibility", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
  });

  it("passes axe checks for in-page hash links", async () => {
    const { container } = render(
      <SinglePageNavLink href="/work" navigationMode="single-page" className="hero__cta">
        View selected work
      </SinglePageNavLink>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe checks for route links off the home page", async () => {
    mockPathname.mockReturnValue("/about");

    const { container } = render(
      <SinglePageNavLink href="/work" navigationMode="single-page" className="nav-link">
        Work
      </SinglePageNavLink>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders an accessible link name", () => {
    render(
      <SinglePageNavLink href="/contact" navigationMode="routes">
        Contact
      </SinglePageNavLink>
    );

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});
