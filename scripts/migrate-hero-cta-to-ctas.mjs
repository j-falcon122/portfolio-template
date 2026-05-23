#!/usr/bin/env node
/**
 * Migrate legacy hero.cta (single object) to hero.ctas (array).
 *
 * Usage:
 *   npm run migrate:hero-ctas
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  process.env.SANITY_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error("Set SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function migrateHeroBlock(block) {
  if (!isRecord(block) || block._type !== "hero" || !isRecord(block.cta)) {
    return { block, changed: false };
  }

  const label = typeof block.cta.label === "string" ? block.cta.label.trim() : "";
  const href = typeof block.cta.href === "string" ? block.cta.href.trim() : "";
  const existing = Array.isArray(block.ctas)
    ? block.ctas.filter(
        (row) =>
          isRecord(row) &&
          typeof row.label === "string" &&
          typeof row.href === "string" &&
          row.label.trim() &&
          row.href.trim()
      )
    : [];

  const ctas =
    label && href
      ? existing.some((row) => row.label === label && row.href === href)
        ? existing
        : [
            ...existing,
            {
              _key: `cta-${href.replace(/\W/g, "").slice(-24) || "legacy"}`,
              _type: "object",
              label,
              href,
            },
          ]
      : existing;

  const rest = { ...block };
  delete rest.cta;
  return {
    block: {
      ...rest,
      ...(ctas.length ? { ctas } : {}),
    },
    changed: true,
  };
}

async function main() {
  const pages = await client.fetch(`*[_type == "page"]{_id, title, "slug": slug.current, blocks}`);
  let updatedPages = 0;
  let migratedHeroes = 0;

  for (const page of pages) {
    if (!Array.isArray(page.blocks)) continue;

    let pageChanged = false;
    const blocks = page.blocks.map((block) => {
      const result = migrateHeroBlock(block);
      if (result.changed) {
        pageChanged = true;
        migratedHeroes += 1;
      }
      return result.block;
    });

    if (!pageChanged) continue;

    await client.patch(page._id).set({ blocks }).commit();
    updatedPages += 1;
    console.log(`✓ ${page.slug || page.title || page._id}: migrated hero CTA`);
  }

  if (!updatedPages) {
    console.log("No legacy hero.cta fields found.");
    return;
  }

  console.log(`\nDone. Updated ${updatedPages} page(s), migrated ${migratedHeroes} hero block(s).`);
  console.log("Refresh Sanity Studio — the unknown field warning should be gone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
