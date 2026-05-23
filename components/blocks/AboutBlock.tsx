import Image from "next/image";
import type { AboutBlock as AboutBlockType } from "@/lib/cms/types";

export default function AboutBlock({
  title,
  body,
  image,
  stats = [],
}: AboutBlockType) {
  return (
    <section className="about-block">
      <div className="about-block__inner">
        <div className="about-block__media">
          {image?.src ? (
            <Image
              src={image.src}
              alt={image.alt || "About image"}
              width={1000}
              height={1200}
              className="about-block__image"
            />
          ) : (
            <div className="about-block__image about-block__image--placeholder" />
          )}
        </div>

        <div className="about-block__content">
          {title ? (
            <h2 className="about-block__title">{title}</h2>
          ) : null}
          {body ? (
            <p className="about-block__body">{body}</p>
          ) : null}

          {stats.length ? (
            <div className="about-block__stats">
              {stats.map((stat, i) => (
                <div key={`${stat.label}-${i}`} className="about-block__stat">
                  <div className="about-block__stat-value">{stat.value}</div>
                  <div className="about-block__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
