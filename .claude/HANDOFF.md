# Handoff — avrg-site — 2026-07-21 (evening)

## Where we are
Dock add-animation session SHIPPED and DEPLOYED: dock-add-lab.html now has
THREE path variants (ramp = Dylan's drawn beats / toss / swoop) with per-path
saved knob presets, a landing press + shadow compression + synth thunk, and a
scrub-p slider; the whole thing was then ported into k-home-dual as the mobile
**dock-lite** (`dockAdd()`, `DOCK_TUNE`, receipt icon in the topbar, Dock
switcher row) and is live on GitHub Pages for phone checks:
https://bluechewbill.github.io/avrg-site/redesign/k-home-dual.html
Everything committed (f05fdd4) and pushed; Pages serves repo root off main,
so push = deploy.

## Next task
**Canva background-removal image cleanup pipeline.** Dylan's call: the cards
need the image tune-up BEFORE the mobile tweak lot, so this comes first.
Concretely, in rough order:
1. Name batch 1: open redesign/card-lab/batch-review.html, rename
   `canva/batch1-pNN.png` → `<site-name>.png` per its pixel-matcher guesses
   (STRONG guesses near-certain; p04≈p05 are the same board).
2. Export the remaining Canva designs as Dylan finishes bg-dropping them —
   recipe is in CLAUDE.md's Canva bullet (search-designs → export-design with
   transparent_background → curl → `swift trim.swift` → drop in canva/).
   CONFIRM the possible duplicate 13-page design DAHP73pk2x4 before exporting
   (avoid double batches).
3. When Dylan's ready: the hand-holding Sheet→Bulk Create walkthrough
   ("like im 90") — guided clicks, budget patience. Name column in the sheet
   makes page order = row order so future batch names automate.
"Done" = batch 1 named and feeding edge-compare.html, remaining designs
exported+trimmed, and a decision on which cutout source (Canva vs Vision)
wins per board.

## Read these, skip the rest
- CLAUDE.md — the Canva bullet in Open threads (full export recipe + state)
  and the card-lab lines in Layout (where cuts/ and canva/ live).
- redesign/card-lab/batch-review.html — the naming contact sheet (serve from
  repo root :8123 like everything else).
- redesign/card-lab/edge-compare.html — only when comparing named Canva cuts
  against the Vision cuts.

Everything else in the repo is NOT needed. The dock/bay/animation code does
NOT need to be read for this task.

## Context that isn't in the code
- Preview: `avrg-root` (:8123), never file://. NOTE 2026-07-21: another
  session's server may already hold :8123 — if preview_start errors, just
  open a browser tab straight at localhost:8123 (it's the same static
  server); don't fight over the port.
- Canva MCP connector is the export path — no Canva UI needed. Batch 1
  (design DAHP8HCfS4o, 12 boards) already exported/trimmed in
  redesign/card-lab/canva/.
- Dock decisions this session (don't re-litigate): paths live as key arrays
  in one spline engine (new path = ~5 lines of dots); site reads BAKED
  numbers (`DOCK_TUNE` in k-home-dual) — tuning loop is lab → re-bake, no
  live knobs on the site. Landing press is p-domain (slow-mo safe), squashed
  about the card's bottom edge. Receipt icon sits UNDER the lightbox scrim
  (z1000 vs lb 5000) — known, acceptable for now; drawer+thunk are the
  confirmation mid-lightbox.
- Dylan's sequencing call (2026-07-21): animations are solid; the pending
  "whole lot of tweaks" waits until the card images are tuned up. Canva
  cleanup is the gate.
- Tone bar unchanged: quiet-but-physical, "doesn't corrupt the clean cards."

## Parked / later
- **Seat-variant reaction session** (drop/skid/seatdraw, SEAT row in the
  switcher) — was queued last handoff, superseded by the dock session; still
  unpicked, switcher row still live.
- **Dock path pick** (ramp/toss/swoop, Dock row) — all three live on mobile;
  pick + row retirement later. Full dock display-case takeover build after.
- Mobile polish list (legibility variants, collection-card decode trigger) —
  explicitly BEHIND the card image tune-up now.
- Receipt icon empty-state escalation (red 0 decode, annoyed shake) — specced
  in CLAUDE.md's dock scoping, not built.
- Bay drag-and-drop, cursor-gravity physics, header cleanup, home-logo
  motion, buttons reaction session — unchanged from before.
