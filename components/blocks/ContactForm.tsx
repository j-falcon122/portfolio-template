"use client";

import { useState, type FormEvent } from "react";
import { withBasePath } from "@/lib/basePath";

const fieldIds = {
  name: "contact-name",
  email: "contact-email",
  message: "contact-message",
} as const;

type FormStatus = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  submitLabel?: string;
};

export default function ContactForm({ submitLabel }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();

    try {
      const response = web3formsKey
        ? await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: web3formsKey,
              ...payload,
              subject: `Portfolio contact from ${payload.name}`,
            }),
          })
        : await fetch(withBasePath("/api/contact"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; success?: boolean; error?: string; message?: string }
        | null;

      const ok = web3formsKey
        ? response.ok && data?.success === true
        : response.ok && data?.ok === true;

      if (!ok) {
        setStatus("error");
        setErrorMessage(
          data?.error ||
            data?.message ||
            "Could not send your message. Check form configuration and try again."
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check your connection and try again.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="contact-block__form" noValidate onSubmit={handleSubmit}>
      <div className="contact-block__field">
        <label className="contact-block__label" htmlFor={fieldIds.name}>
          Name
        </label>
        <input
          id={fieldIds.name}
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={isSubmitting}
          className="contact-block__input"
        />
      </div>
      <div className="contact-block__field">
        <label className="contact-block__label" htmlFor={fieldIds.email}>
          Email
        </label>
        <input
          id={fieldIds.email}
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isSubmitting}
          className="contact-block__input"
        />
      </div>
      <div className="contact-block__field">
        <label className="contact-block__label" htmlFor={fieldIds.message}>
          Message
        </label>
        <textarea
          id={fieldIds.message}
          name="message"
          rows={5}
          required
          disabled={isSubmitting}
          className="contact-block__textarea"
        />
      </div>

      {status === "success" ? (
        <p className="contact-block__status contact-block__status--success" role="status">
          Message sent. Thanks — I&apos;ll get back to you soon.
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p className="contact-block__status contact-block__status--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="contact-block__button"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Sending…" : submitLabel || "Send Message"}
      </button>
    </form>
  );
}
