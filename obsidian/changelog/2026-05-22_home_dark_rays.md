---
name: 2026-05-22-home-dark-rays
description: Home page dark lower-zone rays background update
metadata:
  type: changelog
---

## Changes
- Moved the first-screen ray treatment into a dedicated `HomeBackgroundRays` layer for the lower home-page zone starting at the benefits section.
- Synced the ray fade-in and soft background transition with scroll state from `useScrollBackground`.
- Reworked the lower-zone background from dark navy to a pale blue HVAC-reference-style field with a blur veil and low-opacity rays that dissolve into the background.
- Kept the rays sticky and visible through the CTA area before the footer; allowed vertical overflow so the rays are not cut by the layer.
