# Handoff — avrg-site — 2026-07-21

## Where we are
Bay seating sprint SHIPPED in k-home-dual: the +List flight into the desktop
drawer is now a rAF arc that lands on the shelf item's measured rect (no
crossfade seam, count holds until touchdown, landing answered by shelf thunk /
rack recoil / count bump), with THREE seat variants on a temporary SEAT row in
the dev switcher — drop / skid / seatdraw. Mobile side: the dock add-animation
timing toy exists at redesign/dock-add-lab.html (the 1.5s wind-up S-curve with
knobs). Separately, the Canva mass-export blocker is DEAD — solved via the
Canva MCP connector; batch 1 (12 boards) is trimmed and sitting in
redesign/card-lab/canva/ awaiting names. Everything committed.

## Next task
**Seat-variant reaction session.** Dylan flips the SEAT row on :8123
(k-home-dual, Frame v3 card, open the drawer, add boards) and reacts; you tune
the winner's numbers (SEAT_TUNE + the keyframes) live, then retire the loser
variants and the SEAT switcher row. "Done" = one seating, tuned, switcher row
gone, and the choice logged in CLAUDE.md. If reactions run fast, same session
can continue into dock-add-lab knob tuning (that's a pick-numbers session, not
a build).

## Read these, skip the rest
- CLAUDE.md — sprint item 2's "SEATING REWORKED" paragraph (what each variant
  does + where the knobs live). Read first, it's dense and current.
- redesign/k-home-dual.html — ONLY the bay flight region: search `SEAT_TUNE`
  (flight knobs + bayFlight driver + flyToBay), and the seat CSS: search
  `seatDrop` (keyframes for drop/skid/seatline/thunk/recoil/bump). The SEAT
  switcher wiring is at search `SEAT_KEY`.
- redesign/dock-add-lab.html — only if the session gets to mobile tuning.

Everything else in the repo is NOT needed. Do not explore beyond this list.

## Context that isn't in the code
- Preview: `avrg-root` (:8123), never file://. The belt moves — clicking card
  chips by screenshot coordinates misses; dispatch clicks on `.fc-list` nodes
  or use the lightbox chip. Clear localStorage for a clean lisst.
- Flight design decisions (don't re-litigate): the real item renders hidden
  (.preseat) BEFORE the flight so the landing rect is measured, never guessed;
  the clone becomes the item in the same frame; the count chip waits for
  touchdown (pendingSeat set). Variant offsets are matched pairs — the flight
  END equals the seat animation's FROM (drop: -9px y; skid: +19px x, 2deg),
  so if you retune one side, retune both.
- The closed-drawer add rides the same bayFlight to the resting dot — it's not
  a variant, it stays regardless of the pick.
- Seatdraw's line lives in the shelf and is wiped by any renderBay — fine at
  normal click rates, known cosmetic loss under rapid-fire adds.
- Canva pipeline (parked but primed): recipe in CLAUDE.md's Canva bullet.
  batch1-pNN naming is a 1-minute human step via card-lab/batch-review.html
  (STRONG guesses near-certain; p04≈p05 same board). Next batches: Dylan adds
  a NAME COLUMN to the Canva sheet → page order = row order → names automate.
  Dylan wants a hand-holding walkthrough of Sheet→Bulk Create when he's ready
  ("like im 90") — that's a guided-clicks session, budget patience.
- Desktop photo folder ~/Desktop/backgroundremovalcanva deduped this session
  (33 exact copies → Trash, 237 unique remain). Nothing left to do there.
- Tone check for tuning: the bar is "doesn't corrupt the clean cards" —
  landings should read quiet-but-physical, not bouncy.

## Parked / later
- Retiring the SEAT switcher is part of THIS next task; the ground/card rows stay.
- Dock build proper (mobile) — after the toy's numbers feel right.
- Bay drag-and-drop (proximity + drag release), cursor-gravity board physics
  (sprint item 3), header cleanup, home-logo motion, buttons reaction session.
- Mobile polish list from the 2026-07-20 handoff (legibility variants,
  collection-card decode trigger) — superseded in priority by the seat pick,
  still open.
- Canva: export remaining designs once Dylan bulk-removes them (one MCP call);
  possible duplicate 13-page design DAHP73pk2x4 in his account — confirm
  before exporting to avoid double batches.
