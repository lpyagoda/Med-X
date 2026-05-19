---
name: adr-005-obsidian-in-repo
description: Keep the project knowledge base inside the repo at ./obsidian/, not centralised
metadata:
  type: decision
---

**Status:** accepted — 2026-05-19.
**Decision:** The project's Obsidian-style knowledge base lives at **`./obsidian/`** inside this repo, not in a central `C:\www\obsidian\<project>\` directory.

## Context
Earlier work used a central `C:\www\obsidian\` directory with per-project subfolders (e.g., `ecz-realt/`). For Med-X the user explicitly chose to invert this: *"я бы память обсидиан перенес в корень проекта"*.

## Why this is better
- **Travels with the code** via git — clone the repo, you have the context. No second sync mechanism needed.
- **No naming clashes** across projects, no risk of someone editing the wrong project's notes.
- **Monorepo-friendly** if we ever consolidate projects.
- **Easier to point IDE agents at it** — they're already in the repo.

## Tradeoffs
- Cross-project knowledge (general patterns, shared utilities) has no home here. Acceptable — that's what auto-memory (`C:\www\Claude_Account_2\...`) is for.
- Anyone with repo access can read decisions. Acceptable — this is internal documentation, no secrets.

## Layout
Same conventions as the legacy central setup:
- `MEMORY.md` — index of one-liners
- per-domain subfolders (`architecture/`, `ui/`, `admin/`, `decisions/`, `changelog/`)
- each `.md` carries frontmatter (`name`, `description`, `metadata.type`)
- cross-link with `[[name]]` (Obsidian-native syntax)

## Related
- AGENTS.md (top-level — instructs all agents to read `obsidian/` before editing)
