import type { ContactBlock as ContactBlockType } from "@/lib/cms/types";

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
              {email ? <p><strong>Email:</strong> {email}</p> : null}
              {phone ? <p><strong>Phone:</strong> {phone}</p> : null}
              {location ? <p><strong>Location:</strong> {location}</p> : null}
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
                      rel="noreferrer"
                      className="contact-block__social-link"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <form className="contact-block__form">
            <div className="contact-block__field">
              <label className="contact-block__label">Name</label>
              <input
                type="text"
                className="contact-block__input"
              />
            </div>
            <div className="contact-block__field">
              <label className="contact-block__label">Email</label>
              <input
                type="email"
                className="contact-block__input"
              />
            </div>
            <div className="contact-block__field">
              <label className="contact-block__label">Message</label>
              <textarea rows={5} className="contact-block__textarea" />
            </div>
            <button type="button" className="contact-block__button">
              {submitLabel || "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
