import type { SiteSettings } from "@/lib/cms/types";

export default function SiteFooter({ site }: { site: SiteSettings }) {
  return (
    <footer className="mx-auto mt-12 max-w-6xl border-t border-neutral-200 px-6 py-10 text-center text-sm text-neutral-500">
      {site.footerText || `© ${site.title}`}
    </footer>
  );
}