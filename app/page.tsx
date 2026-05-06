import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function HomePage() {
  const cms = getCms();
  // gather all mock pages to render in a single vertical scroll
  const slugs = ["home", "about", "work", "contact"];
  const pages = await Promise.all(slugs.map((s) => cms.getPageBySlug(s)));

  return (
    <>
      {pages.map((p, i) => (
        <section id={p?.slug || `section-${i}`} key={p?.slug || i} className="page-section">
          <BlockRenderer blocks={p?.blocks || []} />
        </section>
      ))}
    </>
  );
}