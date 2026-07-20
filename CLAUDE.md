# AVRG site — working notes for Claude

> **This repo is PUBLIC.** Everything committed here — including this file — is readable by anyone. Keep business rationale, personal context, and anything sensitive out; that belongs in Claude's local memory, which points here for project mechanics.

Static site for AVRG handmade fingerboards. No framework, no npm — plain HTML/CSS/JS plus two Python scripts. Media is committed directly (no LFS).

## Commands

- `python3 build_site.py` — rebuild `site/img/` + `site/data.js` from photos. Re-run any time photos in `boards/` or `completes/` are added/removed/moved.
- `python3 seed_boards.py` — one-time seed of `boards/` from the raw photo folders; safe to re-run (skips populated collections).
- Preview servers (`.claude/launch.json`): `avrg-site` serves `site/` on :8765; `avrg-root` serves the repo root on :8123.

## Layout

- `site/` — current live site source. `site/data.js` is **generated** by build_site.py; don't hand-edit it.
- `redesign/` — lettered explorations (`a-` … `i-`). **`h-blackout.html` is the active direction.** Checkpoints are saved as `h-blackout.<date>-checkpoint.html`. `redesign/header-playground.html` is an interactive explorer for top-bar tab hover styles (self-contained tool, not a site page). `redesign/card-lab.html` is the product-card treatment explorer (A–B photo controls vs C–F background-removed cutouts; sample cutouts in `redesign/card-lab/`, made with the `cutout.swift` + `trim.swift` scripts there — `swift cutout.swift in.jpg out.png` then `swift trim.swift out.png`; macOS Vision, no deps). **`redesign/card-lab/cuts/` holds the full batch — one cutout per board (39/39), cut from `site/img/full/`; re-run the swift pair for new boards.** `redesign/j-cards-black.html` / `j-cards-white.html` render the card-lab finalists in the real site frame (topbar + collection sections, live data.js) on the blackout ground and the inverted white ground; bottom-right switcher flips treatments, selection lives in the URL hash (`#s-spread` etc). Their dims/status/sold info rows are placeholder demo data. The white page's ⸺·⸺ frame card is the lead candidate and has three interaction variants — `#s-frame` (chip boxes wipe in from the frame edge, slide back out), `#s-framev` (exit collapses onto the chip's centerline), `#s-framev3` (exits recede into the frame rails + whole card at half speed) — sharing one hover system: corner chips flush to the inner frame, ref decodes to AVRG, name decodes to dims (only boards in the `PH_DIMS` map), status is a dot whose word decodes in. Gotcha baked into v2/v3: enter and exit animate on different axes, so BOTH are keyframes and the exit is armed by a JS-applied `.left` class (a transition can't pick up from an animation-held value, and an unarmed exit animation would fire on page load).
- `redesign/decode-slowmo.html` — decode-effect study tool (huge type, not a site page): sliders for glyph flicker (30–150ms) and swap time (0.25–5s), position-lock mode (per-char cells frozen at final widths), and per-leg direction options: L→R, R→L, In, Out, Collapse (corrupt ends→center then resolve center→out), Sweep (2-glyph head consumes R→L then prints L→R), Sweep 2 (scan full-width → resorb to seed → extend glyphs to full footprint → reveal front eats them), Clps 2 (corrupt in from edges → collapse to center seed → grow to new footprint → resolve center-out). Built because the tagline rotation will get the same treatment — port winners from here.
- `boards/`, `completes/`, `clean shots/` — photography. In a collection folder: a loose image = single-photo board; a subfolder = one board with multiple angles. Originals build from `completes/` and require a description `.txt` per board folder.
- `deploy/` — deployable snapshot (assembled separately; build_site.py does not write here). Actual deployment = drag `site/` to Netlify Drop.
- `videos/web/` — web-ready riding clips (clip-1/2.mp4 + posters); raw `.mov`s are gitignored.

## Gotchas

- Redesign drafts load `../site/data.js` and `../site/img/`, so they only work served from the **repo root** — use the `avrg-root` launch config (:8123), not `avrg-site`.
- Reddit handle and contact email live at the top of `build_site.py` (`REDDIT_HANDLE`, `CONTACT_EMAIL`) and power every DM/contact link.
- The blackout draft's tabs/nav are injected by JS (`#topnav` innerHTML) — tab styling changes are CSS/class work, not markup edits.
- Hover FX conventions in h-blackout: tabs/buttons get the JS decode scramble; DM buttons wear the CSS glitch. The scramble mutates textContent, so it can't be combined with effects that clone or split the label.
- Blackout palette: bg `#000`, bone `#ddd1b6`, ink `#201a15`; per-collection accents orange `#d8511f`, blue `#1f6fb8`, gold `#c98a12`, purple `#6d4fa3`. Fonts: Bricolage Grotesque (display), Space Mono (labels).
- The blackout draft references `../site/` and `../videos/web/` — when porting it to production `site/`, copy those assets in or fix the paths.
- Previewing via `file://` shows stale snapshots in the Claude Code browser pane — always serve over HTTP (`avrg-root`, :8123).
- Board dimensions are deliberately unlisted for launch — don't add specs unprompted.
- Accent color on the lightbox selected states (`.lb-list-btn.on`, thumb highlight border) is kept deliberately — ask before removing.
- Reusable snippets/fonts/palettes live outside the repo in `~/Projects/web-assets` (see its README index).

## Open threads

- Card direction: pick the winning frame-card interaction variant (j-cards-white `#s-frame` / `#s-framev` / `#s-framev3`) and the winning decode directions (decode-slowmo.html), then port into the card page for real and design the tagline rotation with the same picks. Real dims data feeds the `PH_DIMS` map as boards get calipered.

- Caliper specs + nicknames for the 19 Classics (descriptions live in build_site.py / per-board `.txt` files).
- Video section for the riding clips in `videos/web/` (transcoded, waiting on a home).
- Button chrome visual direction — explore with `redesign/header-playground.html`; interaction layer (decode/glitch) already shipped.
- Open question: should `.colpage-inner h2` match the Satoshi Black used on `.band h2`?
- Eventually: port the blackout draft into production `site/` (see path gotcha above).
