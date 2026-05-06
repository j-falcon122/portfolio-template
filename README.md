## portfolio-template — minimal Next.js + TypeScript portfolio starter

A compact, copy-friendly template meant to be forked or copied into new projects as a starting point for personal portfolio sites.

Project intent

- This repository is the foundational template you will build from repeatedly.
- The template focuses on shared structure, reusable UI blocks, and CMS-powered content management with Sanity.
- Business-specific logic should live in downstream project repositories, not in this template.
- Your workflow is: evolve this template, start a new project from it, add project-specific domain logic there, and repeat for future projects.

Quick start

1. Copy the folder to a new location, or clone and remove history:

   git clone <this-repo> my-portfolio
   cd my-portfolio
   rm -rf .git

2. Install dependencies:

   npm install

3. Update project metadata in `package.json` (name, author, license).
4. Edit `app/`, `components/`, and `public/` to add your content and assets.
5. Configure `CMS_PROVIDER` in `.env.local`:
   - Use `mock` for local iteration without external services.
   - Use `sanity` to manage content from Sanity Studio.
6. Run the dev server:

   npm run dev

7. Start Sanity Studio (optional, for content editing):

   npm run sanity:dev

What this template includes

- Next.js app router scaffolding in `app/` with example routes.
- A tiny CMS abstraction (`lib/cms/`) with both mock and Sanity providers.
- Reusable, content-driven blocks in `components/blocks/` (Hero, Gallery, Text, Video, CTA).
- Tailwind CSS setup and basic global styles.

Template boundaries (important)

- Keep this repo generic and reusable across many projects.
- Keep content modeling and layout primitives here.
- Avoid adding project-specific business rules, integrations, and domain workflows here.
- Add those business-specific concerns in each derived repository.
- See `docs/ARCHITECTURE.md` for the full boundary and decision checklist.

Tips

- Keep this repo as a lightweight starting point. Remove unused examples and dependencies before publishing.
- Use environment variables for secrets; don't commit `.env` files. See `.gitignore`.

License

This template is MIT licensed. See `LICENSE`.

Init script

This template includes a small helper script at `scripts/init-template.sh` that bootstraps a new project copy. It prompts for a project name and author, updates `package.json`, removes the local `.git` history, and can optionally run `npm install` for you.

Usage:

```bash
bash scripts/init-template.sh --install
```

If you want this template customized for a specific CMS or deployment target, tell me what you need and I can make a targeted version.

Sanity setup checklist

- Ensure `.env.local` has `CMS_PROVIDER=sanity`, `SANITY_PROJECT_ID`, and `SANITY_DATASET`.
- Start Studio with `npm run sanity:dev`.
- Create one `siteSettings` document.
- Create `page` documents with slugs: `home`, `about`, `work`, `contact`.
- Publish documents, then refresh the Next.js app.

QA vs production environments

- See `.env.example` for suggested variables (`SITE_ENV`, `SANITY_DATASET`, `ADMIN_NAV_URL`). The app infers **local** vs **qa** vs **production** from `SITE_ENV` and, on Vercel, `VERCEL_ENV` (preview → QA). **Admin** points at `http://localhost:3333` only when the deploy is treated as **local**; QA and production should set `ADMIN_NAV_URL` to your hosted Sanity Studio in each hosting environment.
