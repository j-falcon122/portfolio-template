# Mock CMS content and syncing

This template uses a simple mock CMS under `content/mock/` for local development. The mock JSON files are intentionally placeholder content so you can quickly prototype and then replace with real CMS data.

Quick notes:

- `content/mock/pages.json` is the primary file used by the mock provider. Edit it to add pages/blocks for local testing.
- `content/sanity/page-stacks.reference.json` lists the recommended slug → block stack for Sanity (`home`, `about`, `work`, `contact`). Copy structure and copy from `pages.json` when creating `page` documents in Studio.
- Local placeholder images live under `public/` (e.g. `placeholder-hero.svg`, `placeholder-work-1.svg`).

## Video on Sanity CDN (recommended)

Large MP4s should **not** live in `public/` for production. Host them on **Sanity’s CDN** and reference HTTPS URLs.

### Option A — Upload script (mock CMS + local dev)

1. Add a **write token** to `.env.local`:
   ```bash
   SANITY_API_WRITE_TOKEN=...   # Sanity → API → Tokens → Editor
   ```
2. Keep MP4s in `public/` temporarily, then run:
   ```bash
   npm run upload:videos
   ```
3. This writes `content/hosted-videos.json` mapping each `/your-file.mp4` path to a `https://cdn.sanity.io/files/...` URL. The mock provider swaps URLs at runtime.
4. Remove the MP4s from `public/` (they are gitignored). Restart `npm run dev`.

See `content/hosted-videos.example.json` for the file shape.

### Option B — Sanity Studio (production CMS)

On **Video** blocks and gallery **Video item** rows you can either:

- **Upload file** — `videoFile` field (MP4 stored on Sanity CDN), or  
- **Paste URL** — `videoUrl` with an HTTPS link (e.g. from Option A’s script output).

The site resolves `coalesce(videoUrl, videoFile.asset->url)` in GROQ. No file upload is required if you paste CDN URLs.

### Option C — External CDN

Set `videoUrl` to any HTTPS MP4 (S3, Cloudflare R2, etc.) in Studio or mock JSON.

| Pattern | CMS field | Example |
|--------|-----------|---------|
| **Embed** | `embedUrl` on the video block | YouTube/Vimeo (normalized for iframes) |
| **Sanity file** | `videoFile` | Upload in Studio → CDN URL |
| **Hosted file** | `videoUrl` | `https://cdn.sanity.io/files/.../clip.mp4` |
| **Mock path** | `videoUrl` in `pages.json` | `/clip.mp4` — replaced when `hosted-videos.json` exists |

Use **one** of `embedUrl` or hosted video per video block; `embedUrl` wins when both are set.

---

Syncing from another project
- Use `./scripts/sync-mock-content.sh /path/to/other/project/content/mock [--copy-assets]` to copy JSON files into this template. The optional `--copy-assets` will rsync the `public/` folder from the other project into this one.

Workflow example
1. In your other project, export or copy the `content/mock/*.json` files.
2. Run the sync script above to bring them into this template.
3. Run `npm run dev` and verify the pages render.

Replace placeholders
- When ready to ship from a new project, replace placeholder images/videos with production assets or remove the `content/mock/` provider and wire your real CMS provider in `lib/cms/index.ts`.
