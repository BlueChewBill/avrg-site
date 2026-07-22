# Handoff — avrg-site — 2026-07-22 (late)

## Where we are
Two things shipped and PUSHED (through 75e4b64, plus the wrap commit after):
the mobile chip-seam fix (1px frame tuck, see the black-on-black gotcha in
CLAUDE.md) and **the lb sun** — cursor-as-light-source physics on the desktop
fv3 lightbox board. Shadow throws away from the cursor, ducks under the board
on a center-cross, darkens to a contact pool near the overhead vanish, fades
at a graze; the board pulls toward the cursor on two always-on springs (the
slow one's lag IS the parked creep — no on/off seam) and 85% of the pull is
subtracted from the shadow so it stays planted while the board slides over
it. Dylan's read: "looks and feels great", and the session ended with the
site reframed as **portfolio material** — it "reads like someones thing".

## Next tasks — Dylan's own queue, dictated end of session
1. **Card shadow behavior.** Design law he stated, now also in the sprint-3
   stage-2 amendment in CLAUDE.md: card/panel shadows may move/grow for
   depth but get NO fade/ink dynamics — "the board is the only real physical
   thing, it gets the real shadow physics." Work = define what card shadows
   DO do (depth without sun physics), grid cards included.
2. **Deck/bay CLOSE choreography, desktop + mobile.** The open/creep-in is
   "stellar" — the shut is the gap. Desktop: inner-arrow quick-shut and the
   slow drain exist but haven't had a design pass. Mobile: the dock has no
   real close (the full takeover case is still unbuilt). See the reordered
   NEXT in CLAUDE.md sprint item 2.
3. **Buttons.** "Fine enough placeholders but need to go." Reaction session:
   build variants speaking the card language (rail draws, chip wipes,
   decodes) against his collected references. Show options, don't ask for
   a spec.
4. **Shaped board dimensions.** His caliper numbers are MEASURED and READY —
   pure type-in session, he dictates. Land them where the fv3 name→dims
   decode reads (`jmeta`/`b.dims` in k-home-dual), permanent home
   build_site.py → data.js per the inventory-ID plumbing thread.

(4 is a 15-minute warm-up; 3 needs his references in hand; 1 and 2 are
design/build. Let him pick the order.)

## Read these, skip the rest
- CLAUDE.md — the k-home-dual bullet (ONE CARD SPEC + lb sun passages), the
  sprint list (items 2 and 3 carry the new amendments), and the
  black-on-black overlap gotcha.
- redesign/k-home-dual.html — **the SUN TUNING LEGEND banner at the `SUN`
  const**: every knob, unit (ref-px, 232 space), and which way to turn it.
  Any shadow/feel work starts there. Bay work: `BAY_TUNE` + the bay comment
  block; dock: `DOCK_TUNE` / `dockAdd()`.

## Context that isn't in the code
- **How to tune with Dylan:** he gives feel-words ("nervous", "reads as
  on/off", "room to crawl at the edges") — each one maps to a mechanical
  cause; find it, change the physics, show a numeric trace as receipt.
  This loop worked all session; repeat it.
- The sun is desktop-only by gate (hover:hover + >940px + not reduced-motion)
  — phone checks via Pages won't show it; verify sun work in a desktop
  browser.
- Shadow-alpha knobs (aDark .53 / aFaint .19) were flagged lower-confidence
  than the rest — if he reacts to shadow ink, those move first (or aPow to
  re-shape where the darkening lives).
- **Pane workflow:** the Edit hook re-fronts a `file://` tab after every
  edit — close it and re-front the HTTP tab (:8123, another session's server
  may hold the port; just navigate). Synthetic hover can't drive `:hover`
  choreography — the sun is testable because it's pointer-EVENT-driven
  (dispatch PointerEvents); CSS hover states are not. Screenshot END states.
- Ground/card localStorage: `avrg-k-ground` = black|white, `avrg-k-card` =
  photo|framev3|paper|zoned; same-URL hash nav doesn't reload.

## Parked / later
- Sun → grid cards port (sprint 3 stage 1: lean + aim-assist + the ducked
  sun at grid scale) — after the queue above.
- Seat-variant pick (drop/skid/seatdraw switcher) still awaiting reaction.
- Decode flourish touch trigger + name-over-board legibility variants.
- Cutout payload / pre-scaled srcset (mobile perf).
- j-cards-black/white: stale flush-chip geometry + raw %-max-height iOS
  pattern — fix only when porting.
