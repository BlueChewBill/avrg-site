# AVRG — Fingerboard Site

A branded, mobile-first site for posting as one link (e.g. r/fingerboards).
Home = one slow auto-rotating conveyor per collection (hover a side to steer,
drag on touch). Tap a deck → it pulls forward into a lightbox (swipe / ‹ › to walk
the collection). Tap a collection title → that collection's own shelf page.

Design: "Dye Lot Conveyor" — dark-bone paper + ink, Bricolage Grotesque + Space Mono,
rotating deadpan taglines, per-collection accent colors. Built as plain static
files — no build step to view, no React. Just open `index.html` or deploy the
`site/` folder. (The previous design and the other explored directions live in
`../redesign/` — `redesign/index.html` compares them.)

## How content works — it's folder-driven

You manage photos in the **`boards/`** folder (one level up from here), then re-run
one command. There are four collection folders:

```
boards/
  originals/     (orange)
  hand-shaped/   (blue)
  classic/       (yellow)
  resale/        (purple)
```

Inside any collection folder:

- **A loose image** (e.g. `boards/classic/deck1.jpg`) → one board with one photo.
- **A subfolder of images** (e.g. `boards/originals/ocean-fade/1.jpg, 2.jpg, 3.jpg`)
  → one board with multiple angles you can swipe through. The board's name comes
  from the folder name (`ocean-fade` → "Ocean Fade").

So: drop photos in, group multi-angle boards into their own subfolders, done.

### Fill it in / re-sort, then rebuild

After adding, removing, or moving any photos:

```bash
python3 build_site.py
```

That optimizes the images (fast, mobile-friendly) and regenerates the catalog.
Empty collections (like Resale right now) just show "Restocking" until you add boards.

## Edit text & contact

Most copy is generated, but you can hand-edit **`build_site.py`** (collection titles,
taglines, descriptions, accent colors — near the top) and re-run.

Your **Reddit handle** lives in **`data.js`** at the top:

```js
const CONTACT = { reddit: "u/your-reddit-username" };  // <-- change this
```

It powers every "DM … on Reddit" link. (Re-running `build_site.py` regenerates
`data.js`, so set your handle in `build_site.py`'s SITE/CONTACT section if you want it
to stick across rebuilds — or just edit `data.js` after the final build.)

## Put it online

Drag the **`site/`** folder onto https://app.netlify.com/drop for an instant public
URL to post on Reddit. (Cloudflare Pages / Vercel / GitHub Pages work the same way.)

---

### Notes on the current seed

- Your photos were **copied** (not moved) into `boards/` — your original folders
  (`clean shots/`, `completes:routed:shaped/`) are untouched as a backup.
- Starting guess: Originals = clean shots + the 6 completes (as multi-angle boards),
  Hand Shaped = pressed/hand-shaped, Classic = routed, Resale = empty.
  Re-sort however you like, then re-run `build_site.py`.
