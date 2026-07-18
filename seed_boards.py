#!/usr/bin/env python3
"""One-time seed of boards/<collection>/ from the existing photo folders.
Non-destructive: copies images only (skips .txt/.MOV/.DNG/etc).
Safe to re-run: skips any collection folder that already has content.

After this, MANAGE PHOTOS IN  boards/  — then run  build_site.py.
  - loose image in a collection  -> a single-photo board
  - a SUBFOLDER of images        -> one board with multiple angles (name = folder)
"""
import os, shutil

ROOT = "/Users/dylan/Desktop/AVRG"
SRC_PARENT = os.path.join(ROOT, "completes:routed:shaped")
SRC_CLEAN = os.path.join(ROOT, "clean shots")
BOARDS = os.path.join(ROOT, "boards")
IMG_EXT = (".jpg", ".jpeg", ".png")

def imgs(folder):
    if not os.path.isdir(folder):
        return []
    return sorted(f for f in os.listdir(folder)
                  if not f.startswith(".") and os.path.splitext(f)[1].lower() in IMG_EXT)

def has_content(folder):
    return os.path.isdir(folder) and any(not f.startswith(".") for f in os.listdir(folder))

for c in ("originals", "hand-shaped", "classic", "resale"):
    os.makedirs(os.path.join(BOARDS, c), exist_ok=True)

# --- Originals: clean shots (loose) + completes (as multi-photo subfolders) ---
dest = os.path.join(BOARDS, "originals")
if has_content(dest):
    print("originals already populated — skipping seed")
else:
    for f in imgs(SRC_CLEAN):
        shutil.copy2(os.path.join(SRC_CLEAN, f), os.path.join(dest, f))
    completes = ["og-orange-piro", "peach-piro", "purple-purple",
                 "rainbow", "shortsteep-DGFB", "yellow-blue"]
    for slug in completes:
        srcd = os.path.join(SRC_PARENT, slug)
        files = imgs(srcd)
        if not files:
            continue
        sub = os.path.join(dest, slug)
        os.makedirs(sub, exist_ok=True)
        for f in files:
            shutil.copy2(os.path.join(srcd, f), os.path.join(sub, f))
    print(f"originals seeded: {len(imgs(SRC_CLEAN))} loose + {len(completes)} multi-photo")

# --- Hand Shaped: pressedhandshaped (loose) ---
dest = os.path.join(BOARDS, "hand-shaped")
if has_content(dest):
    print("hand-shaped already populated — skipping seed")
else:
    src = os.path.join(SRC_PARENT, "pressedhandshaped")
    for f in imgs(src):
        shutil.copy2(os.path.join(src, f), os.path.join(dest, f))
    print(f"hand-shaped seeded: {len(imgs(src))}")

# --- Classic: pressedrouted (loose) ---
dest = os.path.join(BOARDS, "classic")
if has_content(dest):
    print("classic already populated — skipping seed")
else:
    src = os.path.join(SRC_PARENT, "pressedrouted")
    for f in imgs(src):
        shutil.copy2(os.path.join(src, f), os.path.join(dest, f))
    print(f"classic seeded: {len(imgs(src))}")

# --- Resale: intentionally empty (you'll add pre-owned) ---
print("resale left empty — add boards when ready")
print("\nDone. Now run:  python3 build_site.py")
