import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import ContactBlock from "@/components/blocks/ContactBlock";

describe("ContactBlock accessibility", () => {
  it("passes axe checks", async () => {
    const { container } = render(
      <ContactBlock
        _type="contact"
        title="Get in touch"
        email="hello@example.com"
        phone="555 123 4567"
        submitLabel="Send Message"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("associates labels with form fields", () => {
    render(
      <ContactBlock
        _type="contact"
        title="Get in touch"
        email="hello@example.com"
        submitLabel="Send Message"
      />
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Message" })).toHaveAttribute(
      "type",
      "submit"
    );
  });

  it("uses actionable contact links", () => {
    render(
      <ContactBlock
        _type="contact"
        title="Get in touch"
        email="hello@example.com"
        phone="555 123 4567"
      />
    );

    expect(screen.getByRole("link", { name: "hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com"
    );
    expect(screen.getByRole("link", { name: "555 123 4567" })).toHaveAttribute(
      "href",
      "tel:5551234567"
    );
  });
});
