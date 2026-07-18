# Figma — Page 1 colors

Pulled 2026-07-17 from the open Figma file ("Untitled", Page 1, Desktop - 1 frame).
Source: https://www.figma.com/design/glAvMFLtJI3gZi5uQttY0k/Untitled?node-id=3-4

| Hex | Color | Where it's used on the page |
|---------|----------------|-----------------------------|
| `#053B57` | Deep teal navy | Main frame background |
| `#36408E` | Indigo blue | Tall vertical panel, "ORIGINALS" offset/shadow text |
| `#A7AEE2` | Periwinkle | Big content panels, "ORIGINALS" + "SHAPED" headline text, side bar |
| `#79A3A9` | Muted teal | "SHAPED" offset/shadow text |
| `#77F4FF` | Bright cyan | "AVRG" word in "No Mold - AVRG Original" |
| `#FFFFFF` | White | "No Mold" caption text |
| `#FFFAFA` | Snow | Page background, small highlight rectangle |
| `#D9D9D9` | Light gray | Top nav bar, placeholder rectangles |

## As CSS variables

```css
:root {
  --avrg-navy:       #053B57; /* deep teal navy — main bg */
  --avrg-indigo:     #36408E; /* panels, headline shadow */
  --avrg-periwinkle: #A7AEE2; /* panels, headline text */
  --avrg-teal:       #79A3A9; /* secondary headline shadow */
  --avrg-cyan:       #77F4FF; /* accent — "AVRG" highlight */
  --avrg-white:      #FFFFFF; /* caption text */
  --avrg-snow:       #FFFAFA; /* page bg */
  --avrg-gray:       #D9D9D9; /* nav / placeholders */
}
```

Note: the two product photos (deck close-up shots) aren't included — these are just the flat design colors.
