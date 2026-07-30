# Architecture Guide

This repository is the reusable `portfolio-core` package consumed by portfolio applications.

## Core Principle

Keep this repo generic, content-driven, and CMS-ready.  
Move business-specific behavior into each derived project repository.

## What Belongs In This Package

- Shared app structure (`app/`, routing patterns, common layout conventions)
- Reusable presentational components (`components/`)
- Content schema and mapping contracts (`lib/cms/types.ts`)
- CMS provider abstraction and integrations (`lib/cms/`)
- Generic page-building blocks (Hero, Gallery, Text, Video, CTA)
- Default development tooling and scripts that are useful across projects

## What Does Not Belong In This Package

- Domain-specific workflows (booking, e-commerce checkout, CRM logic, etc.)
- Product-specific third-party integrations that only one project needs
- Hardcoded business rules for one client/brand/use case
- Custom auth/permissions policies unique to a single project
- Vertical-specific data models that are not reusable

## CMS Strategy

- Use the CMS abstraction in `lib/cms/` as the stable contract.
- Keep pages/components consuming CMS data via shared types in `lib/cms/types.ts`.
- During development, use `CMS_PROVIDER=mock` for fast local iteration.
- In projects requiring managed content, use `CMS_PROVIDER=sanity`.
- Favor schema evolution that remains broadly reusable across multiple downstream projects.

## Consuming This Package

1. Install a tagged `portfolio-core` release in the application repository.
2. Add `portfolio-core` to the application's Next.js `transpilePackages`.
3. Import shared components and utilities from package subpaths.
4. Keep application-specific metadata, branding, content, and business logic in the consumer.
5. Contribute broadly reusable improvements here and publish them under a new version tag.

## Decision Checklist

Before adding new code, ask:

- Is this useful for most future projects?
- Is it content-layer or UI-layer reuse rather than domain logic?
- Can it stay generic without coupling to one business context?

If the answer is mostly "no", implement it in the derived project repo, not here.

## Shared header visibility

Use `useAutoHideHeader` from `portfolio-core/lib/useAutoHideHeader` when a derived
site needs auto-hide behavior without copying scroll listeners:

- `mode: "near-top"` — template default (hide after scroll; reveal near top / focus)
- `mode: "scroll-direction"` — hide on scroll down within a media query; reveal on
  scroll up, tap, or `forceVisible` (e.g. open mobile menu)

Keep visual chrome (CSS / Tailwind) in the consuming app.
