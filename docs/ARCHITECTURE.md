# Architecture Guide

This repository is a reusable template baseline for future projects.

## Core Principle

Keep this repo generic, content-driven, and CMS-ready.  
Move business-specific behavior into each derived project repository.

## What Belongs In This Template

- Shared app structure (`app/`, routing patterns, common layout conventions)
- Reusable presentational components (`components/`)
- Content schema and mapping contracts (`lib/cms/types.ts`)
- CMS provider abstraction and integrations (`lib/cms/`)
- Generic page-building blocks (Hero, Gallery, Text, Video, CTA)
- Default development tooling and scripts that are useful across projects

## What Does Not Belong In This Template

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

## Deriving New Projects From This Template

1. Copy/fork this template.
2. Rename metadata and branding.
3. Decide whether the project starts with `mock` or `sanity`.
4. Add project-specific business logic only in that new repository.
5. Keep improvements that are generally reusable eligible for back-porting to this template.

## Decision Checklist

Before adding new code, ask:

- Is this useful for most future projects?
- Is it content-layer or UI-layer reuse rather than domain logic?
- Can it stay generic without coupling to one business context?

If the answer is mostly "no", implement it in the derived project repo, not here.
