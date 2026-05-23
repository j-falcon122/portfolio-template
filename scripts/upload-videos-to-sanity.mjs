#!/usr/bin/env node
/**
 * Upload MP4s from public/ to Sanity assets and write content/hosted-videos.json.
 * Requires SANITY_API_WRITE_TOKEN (Editor token with upload permission) in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outPath = path.join(root, "content", "hosted-videos.json");

const FILES = [
  {
    key: "/video-from-rawpixel-id-26889016-sd.mp4",
    file: "video-from-rawpixel-id-26889016-sd.mp4",
  },
  {
    key: "/video-from-rawpixel-id-17154898-sd.mp4",
    file: "video-from-rawpixel-id-17154898-sd.mp4",
  },
  {
    key: "/vecteezy_young-woman-travelling-on-a-train-during-the-daytime-looking_31113935.mp4",
    file: "vecteezy_young-woman-travelling-on-a-train-during-the-daytime-looking_31113935.mp4",
  },
];

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  process.env.SANITY_WRITE_TOKEN?.trim();

if (!projectId) {
  console.error("Set SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!token) {
  console.error(
    "Set SANITY_API_WRITE_TOKEN in .env.local (Sanity → Project → API → Tokens → Editor)."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

async function uploadOne(fileName) {
  const filePath = path.join(publicDir, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  const stat = fs.statSync(filePath);
  console.log(`Uploading ${fileName} (${(stat.size / 1024 / 1024).toFixed(1)} MB)...`);
  const asset = await client.assets.upload("file", fs.createReadStream(filePath), {
    filename: fileName,
    contentType: "video/mp4",
  });
  const url = asset.url;
  if (!url?.startsWith("https://")) {
    throw new Error(`Upload succeeded but no HTTPS url for ${fileName}`);
  }
  console.log(`  → ${url}`);
  return url;
}

const videos = {};

for (const { key, file } of FILES) {
  videos[key] = await uploadOne(file);
}

const payload = {
  _generatedAt: new Date().toISOString(),
  _dataset: dataset,
  _projectId: projectId,
  videos,
};

fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`\nWrote ${outPath}`);
console.log("Restart next dev. You can remove the MP4s from public/ once URLs resolve in the app.");
