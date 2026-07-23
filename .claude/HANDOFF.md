# Handoff — avrg-site — 2026-07-22 (deck session)

## Where we are
Two commits shipped and PUSHED (`c52cda6`, `546df07`). The deck/cart story
went from "board cutout flies to a shelf" to a complete organ in one
session: the WHOLE CARD flies to a full-column display case (one fv3 card
per shelf, Dylan-sized by annotation), the shop keeps a persistent HOLE
where the card left (one card per board — deck or shop, never both),
removes fly home (or exit stage right when the conveyor recycled the slot
off-screen — never chase the loop's bogus position), every landing is a
button press (panel press + synthesized click + LAND flourish), the deck
opens and LOCKS on every add, desktop inspection dims the page to faint
.22 with the other belt rows still drifting while the tapped row freezes
and holds its gap, belt clicks only inspect (adds live in the lb), and
inspecting from the case lifts the shelf card out with a floating ✕ for
removal without inspection. Also: the lb close flight arrives intact now
(no mid-air chrome drain) and lands with the same beat.

## Next task
**Deck CLOSE choreography — the shut motion itself** (queue item 2, the
one remaining gap; the order landing→close was agreed). Today shipped
*when* it closes (stay-open, arrow/Esc only); the *how* is still the
placeholder rewind (`durClose .4` / `durShut 1.4` just run bayP backward
through the same pose). Done = the shut reads as its own gesture, plus
the mobile dock's real close (the full takeover case is still unbuilt).
Proposal on the table from the design discussion (not yet reacted to):
face disconnects FIRST, shadow + count chip die on departure (they gated
on landing, they should die on leaving), drawer tucks home faster than
the panel (reverse asymmetry — inner led the open), marks land with a
1px overshoot tick, resting dot pulses once as afterglow ("your stuff's
in there"), maybe a soft felt-damper thock from the sound kit. Alternates
if Dylan picks differently: flip-lab (board bottoms switcheroo — he's
excited about it) or the shaped-dims type-in (15-min warmup, his caliper
numbers are ready).

## Read these, skip the rest
- CLAUDE.md — k-home-dual bullet: the CARD PAYLOAD / DECK HOLES / CASE
  INSPECTION passages (today's system, incl. the recycler gotcha), and
  sprint item 2's NEXT paragraph.
- redesign/k-home-dual.html — `BAY_TUNE` + `bayTick`/`bayPose` (the shut
  lives here; segments/thresholds are the knobs), the `.bay` CSS comment
  block (geometry), `landBeat`/`kclick`/`kthunk` (the landing language a
  shut should echo), `flyFromBay` (the return/exit flights).
- redesign/dock-add-lab.html — only if the mobile dock close gets built:
  the lab-first pattern (tune with scrub slider, re-bake numbers).

Everything else in the repo is NOT needed for this task.

## Context that isn't in the code
- **One-card ontology is now law**: a board's card is in the deck OR the
  shop, never both. Dylan drove this ("it shouldn't leave a card behind
  it") — any new deck/dock/lb flow must preserve it.
- **Respect the conveyor's architecture**: boards are tied to fixed loop
  slots. When a target is off-stage, cards EXIT (stage right, rejoin the
  line off-screen) rather than the belt "making room" — Dylan chose this
  himself over belt manipulation. Same reasoning should shape any future
  belt interaction.
- **Annotation sizing works great as a spec channel**: he drew a rect on
  a screenshot twice (card size, drawer extent) and the numbers came off
  it. Offer it when sizing questions come up.
- **Comparison rows pending picks** (retire each on his word): SEAT
  (drop/skid/seatdraw), DOCK (ramp/toss/swoop), LAND (pad default /
  flash / none), SND (on/off). The landing currently layers seat-squash
  + press + thunk + recoil + flourish — if he calls it busy, thin the
  SEAT variant first, not the press.
- **Sound is placeholder by design**: kclick/kthunk are stand-ins; the
  real audio pass is a final-touches item (per-ground sound sets — Switch
  snaps on white, Apple cah-thunk on dark — parked in CLAUDE.md open
  threads with the sun/cloudy/moon ground trio).
- **Known rough edge** (deliberately left for the close session):
  removing via the LB chip while inspecting a deck-held board just
  reappears the shop slot with no flight — needs a decision about where
  the lb card goes when its board leaves the deck mid-inspection.
- **Pane verification gotchas earned today**: the browser pane flips the
  site to MOBILE below 941px viewport width (belts collapse to 0×0 — if
  belt probes find nothing, resize to ≥1280 first); and when a per-frame
  writer exists (the belt recycler stomps inline visibility every frame),
  assert COMPUTED style, not classList — the class-only probe "passed"
  while the holes were visually broken on belts.
- The `.hold` mirror rule (state class must copy `:hover` values
  VERBATIM or animations restart) and the recycler/`.indeck` interplay
  are both documented in CLAUDE.md — read before touching card chrome or
  belt styling.

## Parked / later
- flip-lab.html — board-bottom reveal (behind-the-back switcheroo won the
  discussion; pivot-at-dot vs slide-behind variants + scan-wipe control;
  bottoms are a `-top`↔`-bottom` suffix swap, some boards already use
  bottom as display face, boards without both files don't flip).
- Header bar: icons-between-dots, containers get mini-bay dropdowns /
  actions get decode chips, `$` hover leans the bay in; lands the
  mobile-fits-on-screen win.
- +List chip enticement (accent fill + tag glyph, keep the want-words).
- Mobile tilt (= the sun, needs iOS permission gate) / pinch (board-only
  zoom, spring home) / tap-to-flip — needs real-device testing via Pages.
- Sun → grid cards port; seat-variant pick; decode flourish touch
  trigger; cutout srcset; j-pages iOS pattern (fix when porting).
- Buttons reaction session (his references), shaped-dims type-in.
