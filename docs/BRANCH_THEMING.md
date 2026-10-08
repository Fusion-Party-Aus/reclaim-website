# Branch theming and the Fusion Queensland design system

This document covers two things:

1. The **branch-theme mechanism**: how a Fusion state site gets its own visual
   identity without forking components.
2. The **Fusion Queensland Design System v1.0**: the palette, rules and the
   reference page at `/qld/design-system`.

The browsable design system is the canonical reference for design decisions.
This file is the engineering companion: architecture, extension steps, coverage.

---

## 1. The idea

Fusion branches share one Astro codebase and one set of components. A branch
does not clone the site and rename it. Instead:

- Components render against **semantic role tokens** (`--color-fg`,
  `--color-on-primary`, `--color-line`, and so on), never a brand hex.
- A **branch theme** is a single CSS file that re-points those tokens for a
  deployment.
- The theme applies to the **entire site**, because it is a property of the
  deployment, not of a page.

Same components, same typography, same accessibility rules. Different palette,
surface logic and tone.

---

## 2. How a branch is selected

`PUBLIC_BRANCH` selects the deployment. It is resolved once by the deployment
resolver in `config/deployment.mjs` and surfaced as `DEPLOYMENT`
(`src/lib/deployment.ts`), which already carries the branch identity (slug,
label, tagline, theme colour, site URL, Sanity dataset).

The theme is the visual half of that same identity. `BaseLayout` applies it to
every page:

```astro
<html lang="en-AU" data-theme={DEPLOYMENT.slug}>
  ...
  <meta name="theme-color" content={DEPLOYMENT.themeColor} />
</html>
```

- Unset or `vic` → Victoria (the default token values, no override file needed).
- `qld` → `:root[data-theme='qld']` overrides in
  `src/styles/themes/qld.css` take effect.

No page passes a theme. No component knows about Queensland. One deployment,
one theme.

---

## 3. Adding a branch

1. Copy `src/styles/themes/qld.css` to `src/styles/themes/<slug>.css` and edit
   the values under `:root[data-theme='<slug>']`. The `@theme` block declares
   any branch-specific colour names (so `bg-<name>` utilities exist).
2. Add `@import './<slug>.css';` to `src/styles/themes/index.css`.
3. Add the branch to the `branches` registry in `config/deployment.mjs`
   (slug, label, themeColor, siteUrl).
4. Deploy with `PUBLIC_BRANCH=<slug>`.

No layout or component changes are required. `global.css` imports
`themes/index.css` once, which is what lets each theme's `@theme` block feed
Tailwind's utility generation.

---

## 4. The token contract

Components were refactored to use these semantic tokens instead of raw
`white` / `black` / `grey-dark` values.

| Token                  | Role                               | Victoria           | Queensland         |
| ---------------------- | ---------------------------------- | ------------------ | ------------------ |
| `--color-magenta`      | Primary identity / primary CTA     | `#D428D4` magenta  | `#731E32` maroon   |
| `--color-mint`         | Secondary CTA / links              | `#00DDB8` mint     | `#233D3A` euc. ink |
| `--color-yellow`       | Functional emphasis / alerts       | `#4A7AEB` blue     | `#8F6119` ochre    |
| `--color-lavender`     | Tertiary accent                    | `#7B3FE4` violet   | `#A34A38` brush    |
| `--color-surface-base` | Page canvas                        | `#1A0029` purple   | `#FFF7EC` ivory    |
| `--color-grey-dark`    | Raised panel                       | `#2E004D` purple   | `#FFFDF8` paper    |
| `--color-fg`           | Default text on base + panels      | `#FFFFFF` white    | `#233D3A` euc. ink |
| `--color-muted`        | Secondary text                     | white 50%          | euc. ink 72%       |
| `--color-on-primary`   | Text on a magenta fill             | `#FFFFFF` white    | `#FFF7EC` ivory    |
| `--color-on-secondary` | Text on a mint fill                | `#0F0018` near-blk | `#FFF7EC` ivory    |
| `--color-on-accent`    | Text on a yellow fill              | `#FFFFFF` white    | `#FFF7EC` ivory    |
| `--color-on-tertiary`  | Text on a lavender fill            | `#FFFFFF` white    | `#FFF7EC` ivory    |
| `--color-line`         | Hairline border on raised surfaces | white 10%          | `#E5DCCB` warm     |
| `--color-line-mid`     | Control borders                    | white 20%          | `#DDD0B8` warm     |
| `--color-line-strong`  | Hover borders                      | white 25%          | `#C9B99A` warm     |
| `--color-focus`        | Keyboard focus ring                | `#00DDB8` mint     | `#233D3A` euc. ink |
| `--shadow-brutal*`     | Depth                              | neon glows         | warm soft shadows  |

All Victoria values are byte-identical to the previous hardcoded values, so the
existing site is unchanged. The role names are also kept stable (`magenta`,
`mint`, `yellow`, `lavender`) so every existing `bg-magenta` / `text-mint`
utility repaints automatically.

---

## 5. Fusion Queensland Design System v1.0

### Foundation colours

| Name           | Hex       | Role                                        |
| -------------- | --------- | ------------------------------------------- |
| Maroon         | `#731E32` | Primary identity, CTAs, structural bands    |
| Warm Gold      | `#F4C66A` | Accent fills, rules, highlights, stats      |
| Ivory          | `#FFF7EC` | Canvas, text on maroon and eucalyptus       |
| Eucalyptus Ink | `#233D3A` | Secondary CTA, links, body text, deep bands |

### Supporting colours

| Name           | Hex       | Role                  |
| -------------- | --------- | --------------------- |
| Paper          | `#FFFDF8` | Raised panels         |
| Ochre          | `#8F6119` | Emphasis type, alerts |
| Bottlebrush    | `#A34A38` | Tertiary accent       |
| Eucalyptus Mid | `#3A5B56` | Deep links, hovers    |
| Warm Line      | `#E5DCCB` | Hairline borders      |
| Muted Ink      | `#61716C` | Secondary copy        |

### Measured contrast (WCAG)

Approved:

| Pair                 | Ratio   | Level |
| -------------------- | ------- | ----- |
| Maroon on Ivory      | 10.08:1 | AAA   |
| Eucalyptus on Ivory  | 10.98:1 | AAA   |
| Ivory on Maroon      | 10.08:1 | AAA   |
| Ivory on Eucalyptus  | 10.98:1 | AAA   |
| Gold on Eucalyptus   | 7.30:1  | AAA   |
| Gold on Maroon       | 6.70:1  | AA    |
| Bottlebrush on Ivory | 5.50:1  | AA    |
| Ochre on Ivory       | 5.08:1  | AA    |
| Muted Ink on Ivory   | 4.84:1  | AA    |

Banned (documented on the page as explicit don'ts):

| Pair                 | Ratio  |
| -------------------- | ------ |
| Gold on Ivory        | 1.51:1 |
| Ivory on Gold        | 1.51:1 |
| Eucalyptus on Maroon | 1.09:1 |

The key rule: **gold is a surface, not a text colour on light backgrounds.**
Use Ochre when the gold family must carry type on ivory.

### Deliberate divergences from Victoria

| Element           | Victoria                       | Queensland                     |
| ----------------- | ------------------------------ | ------------------------------ |
| Primary identity  | Reclaim spectrum               | Queensland maroon              |
| Canvas            | Dark purple, dark-first        | Ivory, light-first             |
| Personality       | Bold, reformist, energetic     | Warm, grounded, optimistic     |
| Messaging         | Reignite Democracy             | A better future for Queensland |
| Display casing    | All caps                       | Sentence case                  |
| Depth             | Neon glows                     | Warm maroon-tinted shadows     |
| Shared foundation | Type, components, a11y, assets | Same foundations               |

The design system page (`src/pages/qld/design-system.astro`) renders the whole
system from the **shared components**, which is the proof that the components
repaint from tokens rather than being forked.

---

## 6. Files

Added:

- `src/styles/themes/index.css` — theme index.
- `src/styles/themes/qld.css` — Queensland token overrides + theme rules.
- `src/pages/qld/design-system.astro` — the v1.0 reference page.
- `src/assets/qld/brisbane-cbd.jpg` — imagery treatment specimen
  (Brisbane CBD from Kangaroo Point, Wikimedia Commons).

Modified:

- `src/styles/global.css` — added the semantic role tokens; replaced hardcoded
  hexes in the base, component and utility layers with token references;
  imports `themes/index.css`.
- `src/components/ui/BrutalButton.astro` — semantic on-fill text tokens; added
  the `lavender` variant; added a stable `ui-button` class.
- `src/components/ui/BrutalCard.astro` — semantic surface/text/line tokens;
  accent map now resolves through CSS variables; Queensland accent names added.
- `src/components/ui/BrutalBadge.astro`, `CTA.astro`, `StatCard.astro`,
  `IconBadge.astro` — semantic on-fill tokens and surface tokens.
- `src/layouts/BaseLayout.astro` — applies `data-theme={DEPLOYMENT.slug}` and
  `DEPLOYMENT.themeColor` site-wide.
- `src/env.d.ts` — types `PUBLIC_BRANCH`.
- `.env.example` — documents `PUBLIC_BRANCH`.

Branch identity itself lives in `config/deployment.mjs` (the `branches`
registry) and `src/lib/deployment.ts` (`DEPLOYMENT`). The theme layer reads
from it; it does not keep its own branch list.

---

## 7. Preview and build

```bash
# Victoria (default)
npm run dev
npm run build

# Queensland
npm run dev:qld
npm run build:qld
```

Then open `/qld/design-system`. The deployment resolver defaults the
Queensland Sanity dataset to `qld`. The Queensland scripts explicitly select
that dataset even when a local `.env` contains Victoria settings.

---

## 8. Verification performed

- `astro build` passes with the default theme and with `PUBLIC_BRANCH=qld`.
- `astro check`: 0 errors.
- Victoria regression: full-page screenshots of `/design-system` and `/` before
  and after the token refactor. Pixel differences are antialiasing-level
  (1,675 of ~11.6M pixels on the design system page, 139 on the home page).
- The generated CSS contains the Queensland tokens and utilities
  (`--color-maroon`, `.bg-maroon`, `.text-gold`) and the
  `[data-theme=qld]` override block.

---

## 9. Coverage and follow-ups

The shared components, Header, Footer, editorial styles, and public page styles
now use deployment theme roles. Queensland uses readable ink on paper and light
text on eucalyptus or maroon bands. Profile-card and FAQ category accents also
resolve through branch roles. Original literal values remain as Victoria defaults.

The `/qld/design-system` page follows the active deployment theme. Preview it
with `npm run dev:qld`.

Existing artwork and campaign content still need branch editorial review before
Queensland links to legacy pages. Queensland's empty-content home, vision,
manifesto and policy index avoid copying Victoria's campaign claims. See
[BRANCH_DEPLOYMENTS.md](BRANCH_DEPLOYMENTS.md) for deployment and Studio setup.
