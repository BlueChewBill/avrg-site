#!/usr/bin/env python3
"""Build the AVRG site from boards/<collection>/.

Folder rules inside each collection folder (boards/originals, boards/classic, ...):
  - a loose image file      -> a single-photo board
  - a SUBFOLDER of images   -> one board with multiple angles (name from folder)

Outputs optimized images into site/img/ and writes site/data.js.
Re-run any time you add/remove/move photos:   python3 build_site.py
"""
import os, subprocess, json
from concurrent.futures import ThreadPoolExecutor

# >>> SET YOUR REDDIT HANDLE HERE (powers every "DM ... on Reddit" link) <<<
REDDIT_HANDLE = "u/AVRG_FB"
CONTACT_EMAIL = "avrg.fb@gmail.com"   # inquiry inbox (form submissions land here)

ROOT  = os.path.dirname(os.path.abspath(__file__))
BOARDS = os.path.join(ROOT, "boards")
SITE  = os.path.join(ROOT, "site")
THUMB = os.path.join(SITE, "img", "thumb")
FULL  = os.path.join(SITE, "img", "full")
IMG_EXT = (".jpg", ".jpeg", ".png")

# Collection metadata. "src" = source folder (relative to project root).
#   require_desc=True -> only subfolders that contain a description .txt count as boards,
#   so deck folders without a .txt are ignored. Each board = its images + that .txt's text.
COLLECTIONS = [
    {"id": "originals", "title": "Originals - Completes",
     "tagline": "each board has unique geometry, set up with various hardware", "accent": "#e84a27",
     "src": "completes", "require_desc": True, "layout": "stack",
     "description": "One of a kind boards that shred. Large variety in size and hardware. Not your typical fingerboard experience, but one I found enjoyable enough to keep set up."},
    {"id": "hand-shaped", "title": "Hand Shaped",
     "tagline": "shaped by hand, no stencil no router", "accent": "#4a9eff",
     "src": "boards/hand-shaped", "cover_file": "PS43.jpg",
     "pair_top_bottom": True, "layout": "pairs", "ref": "HS",
     "description": "way too much time was spent hand sanding these"},
    {"id": "classic", "title": "Router Shaped",
     "tagline": "pressed in a NFB aluminum mold and shaped with a router", "accent": "#f5c842",
     "src": "boards/classic", "cover_src": "clean shots/IMG_1589.JPG",
     "pair_top_bottom": True, "layout": "pairs", "ref": "CL",
     "description": "shapers that match the mold, rounding, countersink, and finishing practice"},
    {"id": "resale", "title": "Resale",
     "tagline": "Pre-owned, still proper", "accent": "#8b5cf6",
     "src": "boards/resale",
     "description": "Boards and parts from the collection and from the community. Quality stuff that deserves a new home."},
]

for d in (THUMB, FULL):
    os.makedirs(d, exist_ok=True)

def imgs(folder):
    return sorted(f for f in os.listdir(folder)
                  if not f.startswith(".") and os.path.splitext(f)[1].lower() in IMG_EXT)

def prettify(slug):
    out = []
    for w in slug.replace("_", " ").replace("-", " ").split():
        if w.isupper():
            out.append(w)                  # keep acronyms (DGFB, NFB)
        elif len(w) <= 3 and not w.isdigit():
            out.append(w.upper())          # OG, etc.
        else:
            out.append(w.capitalize())
    return " ".join(out)

jobs = []  # (src_path, outbase)

def read_desc(folder):
    """Return (text, has_txt) from the first .txt file in a board folder."""
    txts = sorted(f for f in os.listdir(folder)
                  if f.lower().endswith(".txt") and not f.startswith("."))
    if not txts:
        return "", False
    try:
        with open(os.path.join(folder, txts[0]), encoding="utf-8", errors="replace") as fh:
            return fh.read().strip(), True
    except Exception:
        return "", True

def pair_loose(loose):
    """Join loose images into top+bottom pairs by file order: 1st+2nd are one board,
    3rd+4th the next, and so on (a trailing odd one out stays single). `loose` is
    already sorted — e.g. NR04+NR05, NR06+NR07, ... or PS03+PS04, PS07+PS09, ..."""
    return [loose[i:i + 2] for i in range(0, len(loose), 2)]

def scan_collection(col):
    folder = os.path.join(ROOT, col.get("src") or os.path.join("boards", col["id"]))
    boards = []
    if not os.path.isdir(folder):
        col["boards"] = boards
        return
    entries = sorted(os.listdir(folder))
    subdirs = [e for e in entries if os.path.isdir(os.path.join(folder, e)) and not e.startswith(".")]
    loose   = [e for e in entries if e in imgs(folder)]
    n = 0
    # multi-photo boards (subfolders) first
    for sd in subdirs:
        subpath = os.path.join(folder, sd)
        files = imgs(subpath)
        if not files:
            continue
        desc, has_txt = read_desc(subpath)
        if col.get("require_desc") and not has_txt:
            continue  # not a board folder (e.g. a deck category) — skip
        n += 1
        base = f"{col['id']}-{n:02d}"
        photos, thumbs = [], []
        for k, f in enumerate(files, 1):
            ob = f"{base}-{k}"
            jobs.append((os.path.join(subpath, f), ob))
            thumbs.append(f"img/thumb/{ob}.jpg")
            photos.append(f"img/full/{ob}.jpg")
        if col.get("cover_file") == sd:
            col["_cover"] = thumbs[0]
        boards.append({"id": base, "name": prettify(sd), "description": desc,
                       "thumb": thumbs[0], "thumbs": thumbs, "photos": photos})
    # loose images: optionally joined into top/bottom pairs, else one board each
    groups = pair_loose(loose) if col.get("pair_top_bottom") else [[f] for f in loose]
    for grp in groups:
        n += 1
        base = f"{col['id']}-{n:02d}"
        photos, thumbs = [], []
        for k, f in enumerate(grp, 1):
            ob = base if len(grp) == 1 else f"{base}-{k}"
            jobs.append((os.path.join(folder, f), ob))
            thumbs.append(f"img/thumb/{ob}.jpg")
            photos.append(f"img/full/{ob}.jpg")
            if col.get("cover_file") == f:
                col["_cover"] = thumbs[-1]
        boards.append({"id": base, "name": "", "description": "",
                       "thumb": thumbs[0], "thumbs": thumbs, "photos": photos})
    prefix = col.get("ref")
    if prefix:
        for idx, b in enumerate(boards, 1):
            b["ref"] = f"{prefix} {idx}"
    col["boards"] = boards

for col in COLLECTIONS:
    scan_collection(col)

def process(job):
    src, base = job
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "68",
                    "-Z", "700", src, "--out", os.path.join(THUMB, base + ".jpg")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "74",
                    "-Z", "1500", src, "--out", os.path.join(FULL, base + ".jpg")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print(f"Processing {len(jobs)} images...")
with ThreadPoolExecutor(max_workers=8) as ex:
    list(ex.map(process, jobs))

# Hero backdrop (optimized) — reuse the deck-stack shot pulled from the draft.
hero_src = os.path.join(SITE, "img", "draft-hero.jpg")
if os.path.exists(hero_src):
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "78",
                    "-Z", "1600", hero_src, "--out", os.path.join(SITE, "img", "hero.jpg")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for col in COLLECTIONS:
    print(f"  {col['title']}: {len(col['boards'])} boards")

# Dedicated cover images (cover_src) — any image -> img/cover-<id>.jpg, used as the tile cover
for col in COLLECTIONS:
    cs = col.get("cover_src")
    if not cs:
        continue
    src = os.path.join(ROOT, cs)
    if os.path.exists(src):
        outn = f"cover-{col['id']}.jpg"
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "74",
                        "-Z", "900", src, "--out", os.path.join(SITE, "img", outn)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        col["_cover"] = f"img/{outn}"
    else:
        print(f"  ! cover_src missing for {col['id']}: {cs}")

# Cover for each collection = first board's thumb (None if empty)
DISPLAY_KEYS = ("id", "title", "tagline", "accent", "description", "layout")
out_cols = []
for col in COLLECTIONS:
    cover = col.get("_cover") or (col["boards"][0]["thumb"] if col["boards"] else None)
    out = {k: col[k] for k in DISPLAY_KEYS if k in col}
    out["cover"] = cover
    out["boards"] = col["boards"]
    out_cols.append(out)

SITE_CFG = {
    "heroImage": "img/hero.jpg",
    "logo": "img/logo-circle.png",
    "brandText": "No two the same. Each deck is hand-shaped from scratch — no molds, no templates, no production line. The grain, the contour, the feel — tuned for only the most serious of FB nerds.",
    "taglines": ["Celebrating the mundane", "It could be worse",
                 "Because sometimes, that’s good enough",
                 "By no means the middle, but pretty close"],
}

js = (
    "// AVRG site data — generated by build_site.py. Re-run after editing boards/.\n"
    "// Safe to hand-edit collection copy/taglines below; board lists are regenerated.\n\n"
    "const CONTACT = " + json.dumps({"reddit": REDDIT_HANDLE, "email": CONTACT_EMAIL}) + ";\n\n"
    "const SITE = " + json.dumps(SITE_CFG, indent=2, ensure_ascii=False) + ";\n\n"
    "const COLLECTIONS = " + json.dumps(out_cols, indent=2, ensure_ascii=False) + ";\n"
)
with open(os.path.join(SITE, "data.js"), "w", encoding="utf-8") as fh:
    fh.write(js)
print("Wrote site/data.js")
