#!/usr/bin/env node
/**
 * Remove duplicate page documents (e.g. slug "/work" vs "work").
 * Keeps canonical ids: page-home, page-about, page-work, page-contact.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  process.env.SANITY_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error("Set SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

function normalizeSlug(slug) {
  const s = (slug ?? "").trim().replace(/^\/+|\/+$/g, "");
  return s || "home";
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

const pages = await client.fetch(
  `*[_type == "page"]{ _id, "slug": coalesce(slug.current, slug) }`
);

const canonicalIds = new Set([
  "page-home",
  "page-about",
  "page-work",
  "page-contact",
]);

const bySlug = new Map();
for (const p of pages) {
  const key = normalizeSlug(p.slug);
  if (!bySlug.has(key)) bySlug.set(key, []);
  bySlug.get(key).push(p);
}

const toDelete = [];
for (const [, docs] of bySlug) {
  const canonical = docs.find((d) => canonicalIds.has(d._id));
  const keep = canonical ?? docs.find((d) => !d.slug?.startsWith("/")) ?? docs[0];
  for (const d of docs) {
    if (d._id !== keep._id) toDelete.push(d);
  }
}

if (!toDelete.length) {
  console.log("No duplicate page documents to remove.");
  process.exit(0);
}

console.log(`Removing ${toDelete.length} duplicate page(s):`);
for (const d of toDelete) {
  console.log(`  - ${d._id} (slug: ${d.slug})`);
  await client.delete(d._id);
}
console.log("Done. Run npm run seed:sanity to refresh canonical pages.");
