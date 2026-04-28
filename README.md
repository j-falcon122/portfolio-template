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

Admin & CMS integration

This template includes a lightweight CMS abstraction and an `/admin` route protected by NextAuth (GitHub provider). Follow these steps to enable editing with Sanity Studio and secure access:

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Create a GitHub OAuth App (Developer Settings → OAuth Apps) and add the callback URL:
   - Local dev: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://your-site.com/api/auth/callback/github`
3. Set `GITHUB_ID` and `GITHUB_SECRET` in `.env.local`.
4. Set `NEXTAUTH_SECRET` (generate a random 32+ char string).
5. If you plan to use Sanity:
   - Create a Sanity project and Studio, define schemas that map to `lib/cms/types.ts` (page, siteSettings, blocks).
   - Deploy the Studio (Sanity hosting or Vercel) and set `SANITY_STUDIO_URL`.
   - Set `CMS_PROVIDER=sanity` and `SANITY_PROJECT_ID` in `.env.local`.
6. Run the dev server and visit `/admin`. Unauthenticated users will be prompted to sign in with GitHub. Authenticated users will be redirected to the Studio URL.

Notes:
- The current admin page redirects to the Studio; optionally I can add an in-app admin UI if you prefer editing inside this Next app.
- To restrict admin access to a GitHub org or user list, set `ADMIN_GITHUB_ORG` or `ADMIN_GITHUB_USERS` in `.env.local` and I can wire the server-side check.

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
