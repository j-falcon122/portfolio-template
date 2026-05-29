import type { ContactBlock as ContactBlockType } from "@/lib/cms/types";
import ContactForm from "./ContactForm";

export default function ContactBlock({
  title,
  subtitle,
  email,
  phone,
  location,
  socialLinks = [],
  submitLabel,
}: ContactBlockType) {
  return (
    <section className="contact-block">
      <div className="contact-block__inner">
        {title ? (
          <h2 className="contact-block__title">{title}</h2>
        ) : null}
        {subtitle ? (
          <p className="contact-block__subtitle">{subtitle}</p>
        ) : null}

        <div className="contact-block__content">
          <div className="contact-block__info">
            <h3 className="contact-block__info-title">Contact Information</h3>
            <div className="contact-block__info-items">
              {email ? (
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${email}`} className="contact-block__info-link">
                    {email}
                  </a>
                </p>
              ) : null}
              {phone ? (
                <p>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="contact-block__info-link">
                    {phone}
                  </a>
                </p>
              ) : null}
              {location ? (
                <p>
                  <strong>Location:</strong> {location}
                </p>
              ) : null}
            </div>

            {socialLinks.length ? (
              <div className="contact-block__social">
                <h4 className="contact-block__social-title">Follow Me</h4>
                <div className="contact-block__social-links">
                  {socialLinks.map((social, i) => (
                    <a
                      key={`${social.href}-${i}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-block__social-link"
                      aria-label={`${social.label} (opens in new tab)`}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <ContactForm submitLabel={submitLabel} />
        </div>
      </div>
    </section>
  );
}
