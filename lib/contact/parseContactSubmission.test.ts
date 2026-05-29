import { describe, expect, it } from "vitest";
import { parseContactSubmission } from "./parseContactSubmission";

describe("parseContactSubmission", () => {
  it("accepts valid input", () => {
    const result = parseContactSubmission({
      name: "Jordan Falcon",
      email: "jordan@example.com",
      message: "Hello there",
    });
    expect(result).toEqual({
      ok: true,
      data: {
        name: "Jordan Falcon",
        email: "jordan@example.com",
        message: "Hello there",
      },
    });
  });

  it("rejects missing fields", () => {
    expect(parseContactSubmission({ email: "a@b.com", message: "hi" })).toEqual({
      ok: false,
      error: "Name is required.",
    });
    expect(parseContactSubmission({ name: "A", message: "hi" })).toEqual({
      ok: false,
      error: "Email is required.",
    });
    expect(parseContactSubmission({ name: "A", email: "a@b.com" })).toEqual({
      ok: false,
      error: "Message is required.",
    });
  });

  it("rejects invalid email", () => {
    expect(
      parseContactSubmission({
        name: "A",
        email: "not-an-email",
        message: "hi",
      })
    ).toEqual({
      ok: false,
      error: "Enter a valid email address.",
    });
  });
});
