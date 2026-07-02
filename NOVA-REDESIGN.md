# Nova Scents - "Nocturne" redesign

A from-scratch visual redesign of the Eurus theme for novascents. One dark
botanical-ink canvas, bone typography, a single amber accent, and your black
NOVA flacons as the only photography. Benchmarked against niche perfumery
(Tom Ford Beauty, Byredo, Le Labo) rather than generic e-commerce.

## What changed

### Design system
- **Fonts (self-hosted, in `assets/`):** Bodoni Moda (display serif, the
  fashion-magazine perfume face) + Archivo (grotesk for UI, body, buttons).
  Loaded via `assets/nova-brand.css`; no external font requests.
- **Palette (in `config/settings_data.json`, applied storefront-wide):**
  - Ink canvas `#0C100D`, surfaces `#121713` / `#1A211C`, footer `#0A0D0B`
  - Bone text `#EDEBE3`, body `#C7C9BF`, muted `#979C92`
  - Amber accent `#E0A43C` (hover `#C4851B`), on-amber text `#171204`
  - Every text/background pair passes WCAG AA (audited; most pass AAA)
- **Shape:** sharp corners everywhere (`buttons_type: square`), tracked
  uppercase button and nav labels, hairline dividers.
- The light/dark mode toggle is disabled: Nocturne is the single theme.

### New sections (all configurable in the theme editor)
- `nova-hero` - full-bleed campaign hero, left-anchored display type,
  slow image drift, mobile/desktop art direction
- `nova-marquee` - one slow scent-note strip (serif, alternating italic)
- `nova-editorial` - image + short story split ("Lyxdoft. Utan lyxpåslag.")
- `nova-spotlight` - signature scent with top/heart/base note pyramid,
  bound to a real product for price and link (default: Ambre Royale)
- `nova-quote` - one large italic brand statement

### Homepage (`templates/index.json`)
Hero → marquee → Bästsäljare (featured-collection, `bastsaljare`) →
editorial → Hitta din doft (collage: Sommar / Signature / Vanilj) →
Ambre Royale spotlight → quote → newsletter.
The previous prototype homepage (luxury-hero WebGL version, Cormorant
Garamond + Jost) is preserved as the alternate template **index.old-home**
(switchable under Home page → template in the editor). Its sections and
`assets/nova.css` remain in the theme but are no longer loaded globally,
so its fonts and palette no longer leak into the rest of the store.

### Header
Transparent over the homepage hero, solid ink elsewhere/on scroll
(`sections/header-group.json`). The promo scrolling strip above the header
was disabled in favour of the single homepage marquee.

## Campaign imagery (generated with your real bottles)

The hero, spotlight and editorial images were generated with Higgsfield
using your actual product photos as locked references. They are currently
hot-linked from Higgsfield's CDN so the homepage works immediately.
**For production, download each URL and upload to Shopify (Content → Files
or directly in each section's image picker) - the picker always wins over
the URL fallback.**

| Placement | URL |
|---|---|
| Hero desktop (16:9) | https://d8j0ntlcm91z4.cloudfront.net/user_3FNhDOTSt2KtPsYKUIj0STNcqCb/hf_20260702_224255_9412d4cf-b3b4-49ea-b6f7-793eca75dcfd.png |
| Hero mobile (4:5) | https://d8j0ntlcm91z4.cloudfront.net/user_3FNhDOTSt2KtPsYKUIj0STNcqCb/hf_20260702_224259_e9190326-4035-4646-b764-9e3b3c183c8e.png |
| Editorial still life (4:5) | https://d8j0ntlcm91z4.cloudfront.net/user_3FNhDOTSt2KtPsYKUIj0STNcqCb/hf_20260702_222907_bcae5400-d410-44c8-9f08-9bde44fd9b34.png |
| Ambre Royale spotlight (16:9) | https://d8j0ntlcm91z4.cloudfront.net/user_3FNhDOTSt2KtPsYKUIj0STNcqCb/hf_20260702_224303_531b5e6e-cba4-427e-a592-9bebc17abd29.png |
| Bottle trio, spare (3:4) | https://d8j0ntlcm91z4.cloudfront.net/user_3FNhDOTSt2KtPsYKUIj0STNcqCb/hf_20260702_224302_7842ff3b-d183-4e8d-8428-8b88ff88a25a.png |

## Install

If this repository is connected to the store through the Shopify GitHub
integration, merging/pushing this branch deploys the theme automatically.
Otherwise:

1. Use the delivered zip (or zip the theme folders yourself) and upload
   via **Online Store → Themes → Add theme → Upload zip file**.
2. Preview. The homepage should render complete: hero + marquee +
   Bästsäljare + editorial + tiles + Ambre Royale + quote + newsletter.
3. Upload the campaign images (table above) through each section's image
   picker to stop hot-linking.
4. Optional polish in the editor: pick collections for the "Hitta din doft"
   tiles, adjust menu links, set your logo (it will sit on the transparent
   header - a light/bone version works best).

## Rollback

- Homepage only: switch the Home page template to **index.old-home**.
- Everything: re-upload your previous theme export zip.
