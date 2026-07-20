# Handoff — avrg-site — 2026-07-20

## Where we are
Sprint item 2 (the card bay / cart / "the deck") is BUILT and tuned in
`redesign/k-home-dual.html`, after heavy iteration: resting marks → proximity-driven
drawer crawl → lock/quick-close, the lightbox "lean", live +List chips with fly-in,
and the want-word chip decode. Item 1 (nav arrows on the card) was already done.
Item 3 (board weight / cursor gravity) is NOT started. The session ended clean;
animation fine-tuning from here is safe — the driver architecture isolates each knob.

## Next task
A THINKING-OUT-LOUD session, not a build. Dylan wants to scope before touching code:
- How the deck/drawer behaves on the home screen (still undecided — don't decide it for him).
- Card behavior around the deck: the eventual drag-and-drop with a satisfying "click"
  into place (trigger: proximity + drag release, or auto-animate from the +List chip).
- What fun placeholders look like for cards that have been moved into the deck
  (a hole in the shelf where the board was — treatment unexplored).
Expect the card-lab pattern: build small concrete variants for him to react to,
don't ask him for a spec. Header cleanup + home-logo motion are also queued in
CLAUDE.md open threads if he steers there.

## Read these, skip the rest
- CLAUDE.md — sprint item 2 entry (full driver architecture + NEXT direction) and
  the open-threads list. Read this FIRST; it's the densest summary.
- redesign/k-home-dual.html — only the bay CSS block (search "cart bay") and the
  bay JS driver (search "BAY_TUNE"). The rest of the file is the h-blackout engine
  plus j-card treatments; don't re-read it for this task.

Everything else in the repo is NOT needed. Do not explore beyond this list.

## Context that isn't in the code
- The bay is progress-driven for a reason: CSS-transition staging caused a corner
  stutter (two eased segments meeting = velocity discontinuity). Horizontal motion
  is now ONE eased distance split arithmetically between panel and drawer. Do not
  reintroduce per-segment easing on the travel.
- The cursor is the motor: p always climbs in-zone, rate scales with distance
  (linear ramp first 3/4 of the 195px zone, quadratic kick near the edge). This was
  Dylan's key feel decision: "youre doing the drawer opening just as much as
  cueing the animation."
- The inner line never slows; the outer frame does all catching-up. Also his call.
- Face connects only at max visibility; shadow/chip gate on that landing.
- Invite stays live over the lightbox scrim ON PURPOSE — likely becomes the
  "add to deck from inspection" flow.
- Want-word decode: card-hover triggered, pool Want?/Like?/Need?/Mine ! (inflection
  matters to him), no immediate repeats, chip fill is width-locked (letter-spacing
  made 6ch insufficient — min-width calc(6ch + .96em)).
- Tone direction, in his words: AVRG ("average" / "a very real goober") having an
  over-the-top website IS the joke. Lean maximal, keep it quiet-clean per card.
- Side thread, Canva cutouts: mass background-drop is figured out, MASS EXPORT is
  still a struggle (his homework). Canva removal is a 2–3x quality jump over the
  swift pipeline — "necessary now that the shadows do heavy lifting." Last touches
  reserved for the home stretch; new files sit in redesign/card-lab/canva/ +
  redesign/card-lab/edge-compare.html (his comparison tool, uncommitted).
- Preview: serve repo root (avrg-root, :8123) — k-home-dual needs ../site/ paths.
  fv3 card mode only for the bay; hidden on touch/mobile.

## Parked / later
- Sprint item 3 (board weight: cursor-gravity lean, aim-assist damping) — after the
  scoping session.
- Header reveal-animation cleanup; home-logo gap/dot animation (open threads).
- Caliper dims for PH_DIMS, video section home, colpage h2 font question,
  eventual port of blackout → production site/.
