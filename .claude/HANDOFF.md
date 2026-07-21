# Handoff — avrg-site — 2026-07-20 (evening)

## Where we are
Two things happened today in k-home-dual. First, a scoping session produced the
full mobile dock spec + the site thesis (both written into CLAUDE.md — the spec
is the "Mobile deck" open-thread entry, the thesis lives in the tone check).
Second, mobile pass 1 SHIPPED: fv3 default, SW-chip switcher collapse,
collection cards on the mobile home, the one-scroll shop (selection first, all
sections below, both platforms), and the touch lightbox chip decoding to n/N
position per swipe. All committed and pushed; GitHub Pages now serves main at
https://bluechewbill.github.io/avrg-site/redesign/k-home-dual.html (rebuilds
~1 min after every push — Dylan reviews on his phone at that URL).

## Next task
**Mobile polish sprint** — Dylan's call: "thats the thing most people will
see." No fixed ticket list; start by asking what he saw on his phone since the
pass shipped, then fix what he flags. Known candidates already on record (in
the "Mobile pass 1" open-thread entry): name-over-board legibility on busy
cutouts (top-bold / bottom-bold variants ready as fallbacks), the
collection-card decode flourish trigger (scroll-into-view vs idle cycle vs
on-tap), and whether the n/N decode resolves fast enough at swipe speed.
"Done" = mobile feels intentional end-to-end at the Pages URL.

## Read these, skip the rest
- CLAUDE.md — open threads: "Mobile pass 1" (what shipped + open questions),
  "Mobile deck" (the dock spec), and the three new bullets at the bottom
  (buttons, Canva pipeline, more board sections). Densest orientation; read first.
- redesign/k-home-dual.html — only what the task touches: mobile tile CSS is in
  the `@media (max-width: 940px)` block (search "tcard"), collection-card markup
  in the JS (search "tilegrid.insertAdjacentHTML"), one-scroll nav in
  `renderColPage`, position decode in `populate` (search "wayfinding"),
  switcher collapse (search "swtoggle").

Everything else in the repo is NOT needed. Do not explore beyond this list.

## Context that isn't in the code
- Preview: `avrg-root` (:8123), never file://. The Claude browser pane reports
  hover:hover even at mobile size — touch-gated code (`!canHover`) can't be
  seen there; verify by temporarily forcing the gate (worked today), and the
  phone is the real test.
- Both counts on the collection cards (corner chip + "N BOARDS" line) are
  DELIBERATE — Dylan: "twice is the move." Don't dedupe.
- The n/N chip decode is touch-only on purpose; desktop keeps ref→AVRG hover.
  On touch the hover delegation never binds, so nothing fights the chip.
- The tone law (decided today, in CLAUDE.md): when a ceremony risks tiring,
  never shorten or hide it — escalate absurdity at the same speed.
- The site thesis (his words, paraphrased in CLAUDE.md): polish is the setup,
  "it's just a fingerboard, man" is the punchline. Discovery ladder: angry
  cart → MINE! decode → taglines.
- The Canva mass-export problem is HIS homework, but it now gates mobile card
  quality — if he brings exported cutouts, drop them in redesign/card-lab/canva/
  and swap; edge-compare.html is his comparison tool.
- He has WAY more physical inventory than the 39 boards on site (photo of the
  stacks seen today) — that's what "more board sections" is about.
- Untracked at repo root: nnnoise-whiteBG-turq.svg — his file (likely a
  web-assets candidate), not session output. Left alone; ask before touching.

## Parked / later
- The dock build (mobile deck) — spec is ready, but polish comes first.
- The 1.5s add-animation timing toy — natural first build when dock work starts.
- Desktop home-screen deck behavior (ambient vs acknowledger) — still undecided.
- Sprint item 3 (board weight / cursor gravity); header cleanup; home-logo motion.
- Buttons reaction session; more-board-sections bolt-on point; caliper dims;
  video section; colpage h2 font question; port blackout → production site/.
