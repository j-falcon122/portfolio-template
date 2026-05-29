import { getCms } from "@/lib/cms";
import { resolveSinglePageSectionSlugs } from "@/lib/cms/singlePageSections";
import { normalizePageSlug } from "@/lib/normalizePageSlug";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function HomePage() {
  const cms = getCms();
  const site = await cms.getSiteSettings();
  const singlePage = (site.navigationMode ?? "routes") === "single-page";

  if (!singlePage) {
    const home = await cms.getPageBySlug("home");
    return <BlockRenderer blocks={home?.blocks || []} />;
  }

  const sectionSlugs = resolveSinglePageSectionSlugs(site);
  const pages = await Promise.all(sectionSlugs.map((s) => cms.getPageBySlug(s)));

  return (
    <>
      {pages.map((p, i) => {
        const slug = normalizePageSlug(p?.slug ?? sectionSlugs[i] ?? `section-${i}`);
        return (
          <section
            id={slug}
            key={slug}
            className={`page-section page-section--${slug}`}
            aria-label={p?.title || slug}
          >
            <div className="page-section__inner">
              {slug !== "home" && p?.title ? (
                <h2 className="page-section__title">{p.title}</h2>
              ) : null}
              <BlockRenderer blocks={p?.blocks || []} />
            </div>
          </section>
        );
      })}
    </>
  );
}
