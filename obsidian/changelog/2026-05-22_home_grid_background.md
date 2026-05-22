---
name: 2026-05-22-home-grid-background
description: Continuous grid background behind the home categories, DURR Dental, and popular products sections
metadata:
  type: changelog
---

## Done

- Moved the hero grid treatment out of `HeroSection`.
- Added a single shared `home-continuous-grid` layer around the home categories, DURR Dental, and popular products sections.
- Kept the grid at the same 256px rhythm so it stays continuous across those sections.
- Added a sticky viewport vignette layer so the grid fades out at the top and bottom of the visible area.

## Verification

- `npm run build` passed.
- Checked the home page in the in-app browser at `http://127.0.0.1:5173/`; the grid is continuous behind the requested blocks.
