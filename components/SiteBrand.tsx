import Image from "next/image";
import { withAssetPath } from "@/lib/basePath";

export const DEFAULT_SITE_LOGO_SRC = "/jf_logo_transparent.png";

type SiteBrandProps = {
  title: string;
  /** Path under `public/` or absolute URL. Omit to use the default logo. */
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
  /** Logo height in Tailwind scale (default `max-h-6`). Width follows aspect ratio. */
  logoClassName?: string;
};

export default function SiteBrand({
  title,
  logoSrc = DEFAULT_SITE_LOGO_SRC,
  logoAlt,
  className = "",
  logoClassName = "max-h-6 w-auto",
}: SiteBrandProps) {
  const alt = logoAlt ?? `${title} logo`;

  return (
    <span className={`site-brand inline-flex items-center gap-2.5 ${className}`.trim()}>
      {logoSrc ? (
        <Image
          src={withAssetPath(logoSrc)}
          alt={alt}
          width={36}
          height={24}
          priority
          className={`site-brand__logo shrink-0 object-contain ${logoClassName}`.trim()}
        />
      ) : null}
      <span className="site-brand__title">{title}</span>
    </span>
  );
}
