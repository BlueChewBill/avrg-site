# Handoff — avrg-site — 2026-07-21 (late)

## Where we are
Canva cleanup, classics collection: DONE end to end. The "name" sheet
(now renamed **classics**, design DAHQEEiHqT4) holds all 54 boards with
correct top/bottom pairing, names cl1–cl54, Bulk Create generated 54 card
designs titled `(Bulk N) classics`, and the full export→slice pipeline ran:
**107 pre-named bg-removed cutouts committed at
`redesign/card-lab/canva/cl<N>-top.png` / `cl<N>-bottom.png`.**
The full recipe lives in CLAUDE.md's Canva bullet (Open threads).

Why the sheet needed surgery (so nobody re-derives it): IMG_5355 was an
accidental feet photo — Dylan re-shot board 12's top, so from board 12 on
the odd=top/even=bottom parity INVERTS (5356=top, 5357=bottom, …). Canva's
bulk upload dropped the junk frame, slid the top column up a row, and
padded with a duplicate. Fixed cell-by-cell via keyboard copy/paste.
Board 54 (teal) has NO bottom photo — 5441 is already the first shaped
board. Desktop `backgroundremovalcanva/classic/top|bottom/` folders were
re-sorted to the true parity (feet photo quarantined in `stray/`).

## Next task
**Repeat the pipeline for the next batch (shaped collection).** Photos are
at `~/Desktop/backgroundremovalcanva/shaped/` (starts IMG_5441). Steps:
verify pairing/parity of the photos FIRST (learn from classics: check for
junk frames before assuming odd/even), Dylan bg-removes + builds the sheet
(or reuse flow), Bulk Create with `classics-card-template` (or a clone),
export + slice with the same script. "Done" = `sh<N>-top/bottom.png` (or
whatever prefix Dylan wants) in `redesign/card-lab/canva/`.

## Read these, skip the rest
- CLAUDE.md — the Canva bullet in Open threads (the full step-by-step recipe).
- redesign/card-lab/canva/ — ls it to see the output naming convention.
- The slice script pattern: slice card L/R halves, scipy ndimage.label,
  keep largest alpha component, crop to bbox (was in session scratchpad —
  trivial to rewrite from the CLAUDE.md description).

Everything else in the repo is NOT needed. The dock/bay/animation code is
untouched this session.

## Context that isn't in the code
- Template gotcha: the bulk-create template must have NO text layer —
  text bakes into exports and can't be cleanly stripped when it overlaps
  the deck. Names live in the design titles + row order instead.
- Cell-level Canva sheet editing that works: select via keyboard only
  (arrow keys — clicking image cells opens a popup that steals ⌘C context
  and pastes become floating objects), then ⌘C / arrows / ⌘V. Range
  selection (shift-click, shift+arrows) does NOT work in Canva Sheets.
- search-designs caps at 25/call; paginate with the continuation token.
  Design titles come from the SHEET's name — rename the sheet before
  regenerating to keep batches distinguishable.
- Housekeeping owed in Canva (optional): trash the 54 obsolete
  `(Bulk N) name` designs (v1, text-bearing) and one stray upload (a
  bg-removed cutout of the feet photo).
- Cutout resolution is ~300×850px (limited by image size on the 2000×1500
  template). Fine for cards; if bigger is ever needed, re-export with
  `width`/`height` params on export-design, or scale the template up.

## Parked / later
- **cl54 bottom re-shoot** — teal classic, underside photo doesn't exist.
  After shooting: drop into sheet D55, regenerate row (or just Bulk Create
  again — dedupe by title), re-export that one card.
- **Canva vs Vision cutout decision** — edge-compare.html, now trivially
  possible since both sets exist named. This gates which cutouts feed the
  site cards.
- Sizes column in the sheet (waits on calipering) → PH_DIMS.
- Everything from the previous handoff's parked list (seat variant pick,
  dock path pick, mobile polish, bay drag-and-drop, header cleanup,
  home-logo motion) — unchanged, still behind the card image work.
