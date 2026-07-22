# Handoff — avrg-site — 2026-07-21 (late night)

## Where we are
Canva shaped batch: DONE and committed. 48 cutouts at
`redesign/card-lab/canva/hs<N>-top/bottom.png` (24 boards: hs1–hs21,
hs22.5, hs23, hs24). Sheets duplicated a row AGAIN (hs22 ≡ hs13, caught
by pixel-hash); fix landed as hs22.5. Full recipe + gotchas updated in
CLAUDE.md's Canva bullet. Also removed four dead desk-buddy hooks from
`~/.claude/settings.json` (project folder was renamed, script path 404'd).

## Next task
**Mobile card work** (Dylan's words: "mobile card work" — the mobile
polish sprint from CLAUDE.md's mobile bullet). Open design questions
queued from mobile pass 1, in `redesign/k-home-dual.html`:
- Name-over-board legibility on busy cutouts (top-bold / bottom-bold
  are the fallback variants).
- Collection-card decode flourish (name → "N BOARDS AVAILABLE") touch
  trigger: scroll-into-view once, idle cycle like taglines, or
  on-tap-before-navigate.
- General mobile polish — mobile is what most visitors see.
Serve from repo root (`avrg-root`, :8123); k-home-dual loads
`../site/data.js`.

## Read these, skip the rest
- CLAUDE.md — the k-home-dual bullet (Layout) + the "Mobile pass 1" and
  "Mobile deck (the dock)" bullets (Open threads).
- redesign/k-home-dual.html — only the mobile-scoped sections (search
  `940px`, `renderColPage`, `.picon`, `dockAdd`).

## Context that isn't in the code
- Dylan is prepping MORE image batches for the Canva flow ("the canva
  blender") in parallel — expect another collection soon; the by-hand
  flow (sheet → bulk create → manual zip download → local slice +
  hash-check) is now the canonical cheap path, no browser automation.
- Slice script lives in session scratchpads only — trivially rewritten
  from the CLAUDE.md recipe (L/R halves, scipy largest alpha component,
  bbox crop). Needs a venv with pillow/scipy (no system python has PIL).
- Export zips stay on Dylan's Desktop (`shaped background removed/`) —
  don't need them once cutouts are committed.

## Parked / later
- 52 photos in `~/Desktop/backgroundremovalcanva/shaped/` vs 24 boards
  in the sheet — 4 photos unaccounted; check sheet vs folder next Canva
  session (junk frames or up to 2 missed boards).
- cl54 bottom re-shoot (teal classic, photo never taken).
- Canva vs Vision cutout decision (edge-compare.html) — gates which
  cutouts feed the site cards; now possible for shaped too.
- Seat variant pick, dock path pick, bay drag-and-drop, header cleanup,
  home-logo motion — unchanged, behind the card image + mobile work.
