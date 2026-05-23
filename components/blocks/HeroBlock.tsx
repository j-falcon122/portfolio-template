import Image from "next/image";
import type { HeroBlock as HeroBlockType } from "@/lib/cms/types";
import { getCms } from "@/lib/cms";
import SinglePageNavLink from "@/components/SinglePageNavLink";

export default async function HeroBlock({
  brandTitle,
  headline,
  subheadline,
  cta,
  ctas,
  backgroundImage
}: HeroBlockType) {
  const site = await getCms().getSiteSettings();
  const heroCtas =
    ctas?.length
      ? ctas
      : cta?.label && cta?.href
        ? [cta]
        : [];

  return (
    <section className="relative -mt-[var(--header-height)] min-h-screen w-full overflow-hidden">
      {backgroundImage?.src ? (
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <div className="hero__content flex flex-col items-center justify-center px-6 py-10 text-center text-white">
          {brandTitle ? (
            <div className="hero__brand mb-6 text-sm tracking-[0.18em] uppercase">{brandTitle}</div>
          ) : null}

          <h1 className="hero__headline text-5xl font-bold leading-tight md:text-7xl">{headline}</h1>

          {subheadline ? (
            <p className="hero__sub mt-5 max-w-3xl text-lg md:text-2xl">{subheadline}</p>
          ) : null}

          {heroCtas.length ? (
            <div className="hero__ctas">
              {heroCtas.map((item, index) => (
                <SinglePageNavLink
                  key={`${item.href}-${index}`}
                  href={item.href}
                  navigationMode={site.navigationMode}
                  className={`hero__cta${index > 0 ? " hero__cta--secondary" : ""}`}
                >
                  {item.label}
                </SinglePageNavLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}