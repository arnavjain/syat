# Syāt brand files

The mark is an S under a macron: the ā of "Syāt", which is the one letter that makes the
name its own. An earlier abstract mark of three arcs was rejected by Google's brand
review as not uniquely identifying the project, and it did read more like a loading
spinner than like anything belonging here. Drawing it from the name fixes that.

## Which file to use

| File | Use |
|---|---|
| `syat-logo-120.png` | **Google OAuth consent screen.** 120x120, no transparency, full-bleed background so Google's circular crop lands cleanly. |
| `syat-logo-512.png` | General app icon. Rounded square, transparent outside the corners. |
| `syat-logo-512-transparent.png` | Placing the mark on your own background. No panel behind it. |
| `syat-logo.svg` | Source, rounded square. Scale to any size. |
| `syat-logo-transparent.svg` | Source, no background panel. |
| `syat-logo-google.svg` | Source for the Google export, full-bleed. |

The header on the site uses `src/components/syat-logo.tsx`, which draws the same mark
inline and takes its colours from the CSS custom properties so it follows the theme.

## Colours

| Role | Hex |
|---|---|
| Aubergine (ground) | `#241021` |
| Marigold | `#ffc63b` |
| Cobalt | `#2b4bff` |
| Hibiscus | `#b4144b` |
| Paper (centre) | `#f4eddd` |

## Regenerating

```bash
node -e '
const sharp = require("sharp"), fs = require("fs");
sharp(fs.readFileSync("brand/syat-logo-google.svg"), { density: 900 })
  .resize(120, 120).flatten({ background: "#241021" }).png()
  .toFile("brand/syat-logo-120.png");
'
```
