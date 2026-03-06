import Image from "next/image";
import Link from "next/link";
import type { HeroBlock as HeroBlockType } from "@/lib/cms/types";

export default function HeroBlock({
  brandTitle,
  headline,
  subheadline,
  cta,
  backgroundImage
}: HeroBlockType) {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      {backgroundImage?.src ? (
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        {brandTitle ? <div className="mb-10 text-sm tracking-wide opacity-90">{brandTitle}</div> : null}

        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          {headline}
        </h1>

        {subheadline ? (
          <p className="mt-4 max-w-2xl text-base opacity-90 md:text-lg">
            {subheadline}
          </p>
        ) : null}

        {cta?.href && cta?.label ? (
          <Link
            href={cta.href}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
          >
            {cta.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}