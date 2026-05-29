import { NextResponse } from "next/server";
import { Resend } from "resend";
import { parseContactSubmission } from "@/lib/contact/parseContactSubmission";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured. Set RESEND_API_KEY and CONTACT_FORM_TO_EMAIL in .env.local.",
      },
      { status: 503 }
    );
  }

  const to = process.env.CONTACT_FORM_TO_EMAIL?.trim();
  if (!to) {
    return NextResponse.json(
      {
        error:
          "Contact form recipient is not configured. Set CONTACT_FORM_TO_EMAIL in .env.local.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseContactSubmission(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, message } = parsed.data;
  const from =
    process.env.CONTACT_FORM_FROM_EMAIL?.trim() ||
    "Portfolio Contact <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
  });

  if (error) {
    console.error("[api/contact] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
