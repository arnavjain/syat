# Syāt design contract

## The job of the first screen

Help a person understand, in one glance, that this is a calm place to read a current story from more than one standpoint. The first meaningful action is opening a story, not asking an AI a question.

## Shared system

All three directions use the same content model, source cards, timeline, perspective language, mobile navigation, and accessibility rules. They differ in emphasis, not in product structure.

| Direction | What it feels like | Signature | Where it appears |
| --- | --- | --- | --- |
| A — Annotated Evidence | alert, editorial, studious | open-corner perspective frame and a narrow change spine | an optional high-contrast reading setting |
| B — Warm Commons | comfortable, vivid, belonging | large rounded editorial surfaces with a stitched frame edge | the preview default |
| C — Signal Garden | media-led, playful but quiet | layered media tray with stamped source labels | Explore and feature-story experiments |

## Preview default: Warm Commons

The supplied offline prototype’s marigold, aubergine, hibiscus, cobalt, teal, and paper cues become a system instead of a collage.

| Token | Hex | Use |
| --- | --- | --- |
| marigold | `#FFC63B` | moments of orientation and active state, never large body backgrounds |
| aubergine | `#241021` | text, navigation, and strong surfaces |
| hibiscus | `#D81E5B` | change and editorial attention |
| cobalt | `#2B4BFF` | documented information and links |
| rain-teal | `#0B7A5E` | community and accepted context |
| paper | `#F4EDDD` | primary reading field |
| clay | `#E6D8C2` | quiet borders and secondary panels |

Typography is a measured literary serif for story titles and key questions, paired with a humanist sans-serif for navigation, body copy, and evidence. Hindi must use a purpose-built Devanagari fallback, never a browser’s accidental fallback.

## Layout and responsiveness

- Reading column: `42–72ch`; wide view adds a context rail rather than widening prose.
- Touch targets: at least 44 by 44 CSS pixels.
- Nav: a top editorial bar on wide screens and a stable bottom bar on small screens.
- Cards: rounded but not pill-shaped. Use three related radii only: 12px detail, 20px card, 30px feature surface.
- On a small screen, the story and source trail stack. The perspective tray scrolls horizontally only when it has more than two items.
- The feature image is a real editorial object with credit, not an abstract gradient or fake device screenshot.

## Interaction

- Presses move by a subtle `scale(.98)` with a 120–160ms transition.
- Tabs cross-fade or shift an existing underline/frame in under 220ms; no decorative looping movement.
- Reframe opens as a deliberate task surface. The main reading page stays quiet.
- Reduced-motion settings turn movement into short opacity changes.

## Things we will not do

- No generic dark gradient hero, fake social proof, made-up metrics, endless equal cards, or decorative dashboards.
- No copyright-unclear editorial photography, publisher thumbnails, or photorealistic AI recreations of news events.
- No arbitrary rounded pill for the News/Timeless choice; it uses a structured editorial marker.
