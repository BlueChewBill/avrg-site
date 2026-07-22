# Handoff — avrg-site — 2026-07-22 (evening)

## Where we are
Card sprint, going well. This session shipped the ONE CARD SPEC: `.d7f` is
authored once in cqw (CSS container units), so belt slots, shelf grids, and
the fv3 lightbox render the same card at different sizes by construction —
aspects locked ~1.51 everywhere, the lightbox IS the grid card blown up, and
the open/close flight anchors whole-panel-to-panel so every edge lands (the
mobile bottom-off landing and the desktop double-frame are gone). Desktop got
the lift-out + site-fade (empty slot stays visible; no scrim on the card lb
anywhere). Three follow-up fixes landed same-session after Dylan's phone/
desktop checks: the `#lb[hidden]` display bug (empty lb shell floated over
every page), the scrollbar-vanish reflow (grid re-columned 3→4 on open), and
desktop de-lock + bar-less sheet. All pushed through 174dde3, live on Pages,
Dylan confirmed.

## Next task
**More slight card tweaks — Dylan opens the next chat with specifics**, same
pattern as this session (he leads with what to tweak, often with frame
grabs). Done = looks right on his phone via Pages + desktop. Card tweaks now
go in ONE place: the base `.d7f` block in k-home-dual.html — each dimension
is a px-fallback line + a cqw line; keep BOTH in sync (N px at the 232
reference = N × 0.431034cqw).

## Read these, skip the rest
- CLAUDE.md — the k-home-dual bullet's ONE CARD SPEC passage (how the spec,
  flight, lock, and hidden-rule work now) + the universal-scrim-fade gotcha.
- redesign/k-home-dual.html — only what the tweak touches. Anchors:
  `.d7f {` (the cqw spec block), `#lb.fv3` (lightbox-only remainder: ambient
  shadow, nav, height guard), `anchors(` / `flipFrom` / `openLb` / `closeLb`
  (flight + lift-out), `lockScroll` (scroll lock), `lockCardScale` (grid
  downscale — unchanged).

Everything else in the repo is NOT needed. Don't re-derive the cqw math —
the comment at `.d7f {` states the formula.

## Context that isn't in the code
- **Tweak mechanics:** edit the base `.d7f` cqw block once — belt, grid, and
  lightbox all follow. fv3-lb-only chrome (nav seat/arrows) is cqw at a 430
  reference (N px at 430 = N × 0.232558cqw). Always update the px fallback
  beside each cqw line (pre-2022 Safari path).
- **Dylan hasn't reacted to the enlarged lb chrome yet.** The lightbox card
  is a true enlargement now — name ~21px at 430, chips proportionally
  bigger than the old hand-tuned (smaller) look. If he says it reads loud,
  decide spec-wide vs lb-only before touching numbers.
- **Desktop lb width guard:** `max(300px, min(430px, (100dvh − tbh −
  120px)/1.53))` — short windows shrink the whole card (cqw scales it);
  the sheet scrolls for thumbs/desc below.
- **Don't re-add a page-scroll lock on desktop.** The vanishing scrollbar
  is what re-columned Dylan's grid; it took two rounds to settle
  (scrollbar-gutter: stable tried and reverted — spec limitation). Lock is
  `dockActive()`-only; `#vlb` still locks unconditionally on purpose.
- **`#lb` display rules:** must not outgun `#lb[hidden] { display: none }`
  — the id-vs-class miss shipped an invisible-to-assertions, fully visible
  empty shell over the site. Lesson applied session-wide: screenshot END
  STATES (closed lb, post-close page); `hidden: true` was true while the
  thing was on screen.
- **Pane workflow:** the Edit hook re-fronts a `file://` tab after every
  edit — measurements on the backgrounded HTTP tab return garbage (frozen
  viewport/media queries). Close stray tabs + front the HTTP tab before
  measuring. Synthetic hover can't drive `:hover` choreography — verify via
  `.tset` or rect math. Port 8123 may be held by another session's static
  server — just navigate to it. (Also saved to Claude's memory.)
- Ground/card localStorage values are `black|white` / `photo|framev3|paper|
  zoned`; same-URL hash navigation doesn't reload — use location.reload().

## Parked / later
- Decode flourish touch trigger + name-over-board legibility variants
  (queued from mobile pass 1).
- Dock behavior, page header, buttons — Dylan named these as next after the
  card tweaks (header reveals not designed; buttons = reaction session,
  show variants against his collected references).
- Belt `.d5`/`.paper` furniture pass still hand-tuned (only d7f retired).
- Cutout payload / pre-scaled srcset (mobile perf); mobile scroll-shadow
  motion (vibes not yet described — ask, then build behind the touch gate).
- j-cards-black/white still carry the raw %-max-height iOS pattern — fix
  when porting.
