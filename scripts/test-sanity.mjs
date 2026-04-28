import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";

if (!projectId) {
  console.error("SANITY_PROJECT_ID not set");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: !!process.env.SANITY_USE_CDN,
  apiVersion: "2024-01-01",
});

console.log("Sanity client created, running small fetch...");

(async () => {
  try {
    const res = await client.fetch('*[_type == "siteSettings"][0]{_id, title}');
    console.log("fetch OK:", res);
    process.exit(0);
  } catch (err) {
    console.error("fetch failed:", err);
    process.exit(1);
  }
})();