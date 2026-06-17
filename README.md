# Nova Scents — Shopify Theme (Eurus)

This branch contains the **Nova Scents** Shopify theme (Eurus 9.4.0) with the
theme files at the repository root, structured for **Shopify's GitHub
integration**.

## Connect to Shopify
Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub** →
authorize the Shopify GitHub app → select this repo and the **`shopify-theme`**
branch. Connect to a **draft** theme first, preview, then publish.

## How sync works
- Push to `shopify-theme` → the connected theme updates automatically.
- Theme-editor changes (mostly `config/settings_data.json`) commit back here.
- Avoid editing the same files in the customizer and git at the same time to
  prevent merge conflicts.

## Customizations on top of stock Eurus
- `assets/custom.css` — luxury polish layer (loaded last in `layout/theme.liquid`):
  gold accent system, button/card micro-interactions, accessible focus rings,
  header-on-scroll elevation, scroll-reveal styles, `prefers-reduced-motion` guard.
- `assets/custom.js` — vanilla scroll-reveal + header-on-scroll (reduced-motion aware).
- `sections/luxury-hero.liquid` — opt-in animated hero (Ken Burns zoom, gold light
  sweep, staggered reveal). Add via **Add section → Luxury hero**.
