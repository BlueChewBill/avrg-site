# Handoff — avrg-site — 2026-07-22

## Where we are
Mobile card sprint, mid-stride and going well — Dylan is "really stoked on
how it's coming together." This session: (1) Canva cutouts mapped to site
boards and wired into k-home-dual's cards (pixel-match + sheet-order;
`CANVA` map in the JS), with the cl/hs sheet numbers becoming the CANONICAL
card refs (classic-01 = CL 3, non-contiguous on purpose); (2) proportion
lock — mobile grid cards are scale()-reductions of the 232px desktop card;
(3) two real-iPhone bugs fixed (iOS ignores %-max-height in aspect-ratio
boxes; sticky :hover fired chip wipes on tap — all card :hover CSS now
gated `(hover:hover)`); (4) mobile inspection reworked: decoded arrival,
lift-out card with empty slot + aligned return, no scrim (site content
fades over its own ground), card-is-the-hero (no text below), sheet
centered under a still-live topbar; (5) fv3 card got top room so the board
sits optically centered. All committed (through 9f415d1), pushed, and live
on GitHub Pages (bluechewbill.github.io/avrg-site — Pages serves main).

## Next task
**More slight card tweaks — Dylan's words, specifics inbound in the next
chat.** He'll open with what to tweak; expect fv3 geometry/behavior polish
in k-home-dual, verified on his phone via Pages. Done = he says it looks
right on the phone. Still queued from the mobile sprint after that:
collection-card decode flourish touch trigger (scroll-into-view once vs
idle cycle vs on-tap) and name-over-board legibility variants.

## Read these, skip the rest
- CLAUDE.md — Layout: k-home-dual bullet (the two DONE 2026-07-22 blocks +
  proportion lock); Gotchas: the three new iOS/scrim/push entries.
- redesign/k-home-dual.html — only the sections the tweak touches; search
  anchors: `CANVA` (map + refs), `lockCardScale`, `.tset`, `lb-fade`,
  `--tbh`, `padding-top: 52px` (card top room), `openLb`/`closeLb`.

Everything else in the repo is NOT needed. Do not re-derive the Canva
mapping — receipts live at redesign/card-lab/canva-review.html.

## Context that isn't in the code
- **Verify on the real phone via Pages, not just the browser pane.** Two
  bugs this session were invisible in the pane (desktop engine): the
  %-max-height failure and the hover-on-tap. Workflow that worked: edit →
  verify what's verifiable in the pane → commit → push → background
  `until curl | grep` watcher on the Pages URL → Dylan checks his phone.
  Pushes: repo git config pins HTTP/1.1 + 150MB postBuffer (large PNG
  batches timed out on HTTP/2) — already set, don't re-derive.
- **Architecture decision, settled and internalized by Dylan: no separate
  mobile build.** Divergent mobile behavior is intentional and lives
  behind capability gates (`hover:none`/`hover:hover`, ≤940 `dockActive`,
  ≤720 sheet block). He gets it and likes it — frame new mobile asks in
  this pattern.
- **Numbering:** the Canva sheet numbering (cl1–54, hs1–24) is the one
  true inventory ID; site-ordinal refs in data.js are fallback only.
  Cards changing numbers was explicitly blessed. Permanent home for the
  mapping is build_site.py → data.js at production-port time (open
  thread in CLAUDE.md).
- **Mobile contact path is lisst-only now** (product/DM box hidden ≤720).
  Dylan hasn't objected; if he ever wants per-board DM back on mobile
  it's one display rule.
- **Card geometry couplings** (will matter for the incoming tweaks): the
  ref chip is anchored INSIDE .stage, so panel top-room changes need the
  chip's negative-top compensated (-40 grid/-30 belt) — or better, move
  the chip to the panel in the renderer if geometry keeps iterating. The
  proportion lock renders at 232px then scales, so grid-card spec changes
  propagate everywhere; the belt pass is still hand-scaled numbers
  (candidate to retire onto lockCardScale, parked).
- Originals have NO canva cutouts (no ol* batch was ever made) — they
  keep Vision cuts and OG refs; that's correct, not a bug.

## Parked / later
- Cutout payload: mobile downloads full-res canva PNGs; pre-scaled set /
  srcset queued as part of mobile perf (idea surfaced, not banked).
- Mobile scroll shadow behavior — Dylan wants some shadow motion on
  mobile scroll; vision not yet described. Ask for the vibes, build
  behind the touch gate.
- Decode flourish trigger + name legibility variants (from mobile pass 1).
- Belt proportion pass → lockCardScale unification.
- Canva loose ends: 4 unaccounted photos in ~/Desktop shaped folder;
  cl54-bottom re-shoot; Canva-vs-Vision edge decision formally unmade
  (cards now just use Canva).
- Big board on desktop k-home-dual j-cards pages still carry the raw
  %-max-height pattern — fix when porting (noted in CLAUDE.md).
