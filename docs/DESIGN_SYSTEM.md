# Fusion Party — Neo-Brutalist Design System

> Every deviation costs brand equity. This document is the source of truth.

**Live reference**: [`/design-system`](http://localhost:4321/design-system) — the interactive Astro page is the canonical browsable version. This MD is the decision-rules companion document.

---

## 1. Aesthetic Foundation

The site uses **neo-brutalism** — an aesthetic defined by:

- Hard, flat shadows (no blur, no softness)
- Bold visible borders (minimum 4px solid black)
- High contrast flat colour
- Uppercase type with tight tracking
- Interactive elements that physically "press" (translate on hover)

These are not preferences. They are the rules. Softening any of them shifts the visual register away from the brand.

---

## 2. Colour System

### 2.1 Palette

| Token             | Hex       | Role                                    |
| ----------------- | --------- | --------------------------------------- |
| `--color-magenta` | `#C926F2` | Primary brand — Fusion identity         |
| `--color-mint`    | `#5EFFD8` | Secondary brand — Fusion identity       |
| `--color-yellow`  | `#FFED00` | Accent — functional alerts and emphasis |
| `--color-black`   | `#010102` | Structure — borders, text, shadows      |
| `--color-white`   | `#FFFFFF` | Canvas — page backgrounds               |

Lavender (`#9A94E7`) exists in the token set but has no defined role at this stage. **Do not use it in new UI without a specific rationale decision.**

### 2.2 Colour Hierarchy Decision Rules

These rules answer "which colour do I use here?" for every common situation. **There should be no scenario where two of these rules resolve to the same answer.**

#### Primary CTA (main campaign actions: join, volunteer, donate)

→ **Magenta background, white text**  
Rationale: Magenta is the primary Fusion Party brand colour. Campaign-critical actions get the highest-attention colour.

#### Secondary CTA (supporting actions: learn more, read policy, share)

→ **Mint background, black text**  
Rationale: Mint is the secondary brand colour. It signals "proceed" without competing with magenta for attention.

#### Warning, alert, or financial callout (policy costs, deadlines, urgent notices)

→ **Yellow background, black text**  
Rationale: Yellow has no brand association — its only job is functional emphasis. It reads as "pay attention" without alarm (unlike red).

#### Category labels and badges

→ **Mint by default.** Use Magenta only when the badge is the primary visual anchor of a card. Use Yellow only for "new", "urgent", or time-sensitive status.

#### Section header backgrounds

→ **Cycle through Magenta → Mint → Yellow** across major page sections _only_ if differentiation is needed. White is always acceptable and preferred if in doubt.

#### Hover / interactive state colour-flip

→ The hover rule is **translate + reduced shadow**, not a colour change. Colour changes on hover should be minimal (e.g. border-bottom swap). Never introduce a new colour in a hover state that isn't already present on the page.

#### Error and form states

→ `--color-red` (`#FF3B30`) for error, `--color-green` (`#34C759`) for success. These are functional only — never use them decoratively.

#### What yellow is NOT for

- Hero section backgrounds
- Primary headlines
- Large background blocks spanning more than ~300px height
- Formal or policy document framing

### 2.3 Dark Mode

Dark mode is **not currently implemented** and requires a fundamentally separate treatment, not an inversion of the light palette.

The light palette is contrast-dependent in ways that break under inversion:

- Magenta on white (high contrast) → Magenta on dark grey = reduced contrast
- Yellow shadows on black borders disappear against dark backgrounds
- Hard shadows require light backgrounds to read as shadows at all

**If dark mode is added**, it should be treated as a separate palette definition with:

- Dark canvas: `#0D0D0D` or similar near-black (not `#000000`)
- Magenta remains at full saturation (it survives dark-mode contrast)
- Mint requires a brightness reduction (~70% lightness) to avoid eye-strain
- Yellow is removed from functional use in dark mode (poor contrast on dark)
- All shadows replaced with light-colour variants (`#FFFFFF` or `#9A94E7`)
- A new `@media (prefers-color-scheme: dark)` block added to `global.css`

Do not improvise dark mode. Until it is properly specced and implemented do not add `prefers-color-scheme` overrides to components — they will be inconsistent.

---

## 3. Typography System

### 3.1 Typefaces

| Font          | Role                             | Usage                                                 |
| ------------- | -------------------------------- | ----------------------------------------------------- |
| Anton         | Ghost watermark only             | Large decorative background text at low opacity       |
| Space Grotesk | H2 headings                      | Section-level headings                                |
| Archivo Black | H3–H6, component labels, buttons | All UI headings and interactive labels                |
| Inter         | Body copy, prose                 | All paragraph text, captions, metadata                |
| Chakra Petch  | Accent / label                   | Optional alternative for stat values, callout numbers |
| Bebas Neue    | Emergency substitute only        | Only if Archivo Black is unavailable                  |

### 3.2 Type Scale

All sizes below are **CSS computed values**. The `clamp()` values are what ships in responsive CSS.

| Name           | CSS Class   | Min  | Ideal | Max   | rem (at 16px base) | Use                             |
| -------------- | ----------- | ---- | ----- | ----- | ------------------ | ------------------------------- |
| 8xl Hero       | (custom)    | 64px | 12vw  | 176px | 4rem–11rem         | Full-bleed hero display         |
| 6xl Display    | `text-8xl`  | 56px | 8vw   | 128px | 3.5rem–8rem        | Page hero H1                    |
| 4xl Section    | `text-5xl`  | 36px | 4vw   | 64px  | 2.25rem–4rem       | Section title H1/H2             |
| 2xl Card Title | `text-3xl`  | 24px | 2.5vw | 40px  | 1.5rem–2.5rem      | Card H3, feature headings       |
| xl Subhead     | `text-2xl`  | 20px | —     | 32px  | 1.25rem–2rem       | H4, component subheadings       |
| lg Base+       | `text-xl`   | 18px | —     | 24px  | 1.125rem–1.5rem    | Lead paragraphs, large labels   |
| md Base        | `text-base` | 16px | —     | 16px  | 1rem               | Body copy                       |
| sm Caption     | `text-sm`   | 14px | —     | 14px  | 0.875rem           | Metadata, captions, breadcrumbs |
| xs Micro       | `text-xs`   | 12px | —     | 12px  | 0.75rem            | Badges, legal small print       |

### 3.3 Responsive Breakpoints

Tailwind breakpoints in use:

| Name  | Width  | Notes                 |
| ----- | ------ | --------------------- |
| `sm`  | 640px  | Mobile → small tablet |
| `md`  | 768px  | Tablet                |
| `lg`  | 1024px | Desktop               |
| `xl`  | 1280px | Large desktop         |
| `2xl` | 1536px | Wide screen           |

**Typography responsive rules:**

- Hero text: always use `clamp()`. Never fixed sizes above 4xl.
- Card titles: fixed at `2xl` (24px). Do not scale down further.
- Body: always 16px / `text-base`. Never `text-sm` for paragraph content.
- Button labels: always `text-sm` uppercase tracked at `0.08em`. Never scale with breakpoint.

### 3.4 Line Heights

| Context          | Value      | Why                                                         |
| ---------------- | ---------- | ----------------------------------------------------------- |
| Hero / display   | `0.85–0.9` | Tight stacking for graphic impact                           |
| Section headings | `1.0–1.1`  | Close but legible                                           |
| Body / prose     | `1.6–2.0`  | Comfortable reading; `2.0` used to clear inline box-shadows |
| Buttons / labels | `1.0`      | Single-line, no wrapping                                    |

### 3.5 Letter Spacing

- Headings: `-0.02em` to `-0.04em` (tight) — creates condensed, graphic feel
- Uppercase labels, buttons, badges: `+0.08em` to `+0.12em` (tracked out)
- Body: `0` (never modify tracking on paragraph text)

---

## 4. Shadow System

All shadows are **hard, flat, offset-only**. No blur. No spread beyond the offset.

### 4.1 Shadow Tokens

```css
--shadow-brutal-sm: 5px 5px 0px #000 --shadow-brutal: 10px 10px 0px #000 /* default */
  --shadow-brutal-lg: 15px 15px 0px #000 --shadow-brutal-xl: 20px 20px 0px #000;
```

Coloured shadows (magenta, mint, yellow) are available for accent use. Use sparingly — one coloured shadow per visual cluster maximum.

### 4.2 Hover Rule

On hover, elements **translate into their own shadow** — they do not change colour or scale:

```css
/* Standard pattern */
.component {
  transform: translate(0, 0);
  box-shadow: 6px 6px 0px #000;
}
.component:hover {
  transform: translate(4px, 4px); /* moves toward shadow */
  box-shadow: 2px 2px 0px #000; /* shadow shrinks to match */
}
.component:active {
  transform: translate(6px, 6px);
  box-shadow: none;
}
```

**Never** use `scale()`, `blur()`, or opacity changes on hover for core interactive elements.

### 4.3 Shadow Hierarchy

Use shadow size to communicate elevation / importance:

| Size    | Offset  | When to use                                 |
| ------- | ------- | ------------------------------------------- |
| `sm`    | 4–5px   | Inline elements, badges, small highlights   |
| Default | 6–10px  | Cards, buttons, most components             |
| `lg`    | 12–15px | Heroes, featured CTAs, section containers   |
| `xl`    | 20px    | Modals, overlays, page-level feature blocks |

---

## 5. Ghost Watermark

Anton at large scale, low opacity, used as background texture for hero sections and section backgrounds.

### 5.1 Specification

| Property       | Value                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| Font           | Anton                                                                     |
| Text           | Typically a single capitalised word or acronym (e.g. "RECLAIM", "FUSION") |
| Opacity        | `0.03` – `0.08`                                                           |
| Rotation       | `-3deg` to `-8deg`                                                        |
| Position       | `absolute`, flush or slightly outside the container                       |
| z-index        | Behind all content (`z-index: 0` or lower)                                |
| Pointer events | `none`                                                                    |
| User select    | `none`                                                                    |

### 5.2 When to Use

Use the ghost watermark **only** when:

- The section has a clear single-word identity it needs to reinforce (page name, policy category, movement term)
- The section has enough vertical height that the letterform reads as texture rather than competition (minimum ~400px)
- The background is solid white, solid black, or solid magenta (it disappears on patterned backgrounds)

### 5.3 When NOT to Use

Do not use the ghost watermark when:

- The section is shorter than ~300px
- There is already significant typographic density in the section (it reads as clutter)
- The background is coloured other than white/black/magenta (transparency interaction becomes unpredictable)
- Two adjacent sections both want to use it (only one side of a divider gets it)
- The word doesn't relate to the section content — decorative use only compounds confusion

**The default assumption is no ghost watermark.** Add it intentionally; never add it as a background filler.

---

## 6. Borders

- Minimum: **4px solid black** — no exceptions. Sub-4px borders don't exist in the system.
- Standard: **5–6px solid black**
- Heavy / structural: **8px solid black**
- Asymmetric accent: `border-left: 12px` in brand colour (used on cards to create visual anchor)

Anti-rules:

- No `border-radius` — ever. Hard corners only.
- No `border-style: dashed` or `dotted`.
- No `border-opacity` — borders are always 100% opacity.

---

## 7. Motion and Animation

All motion should feel **physical and deliberate**, not decorative.

- **Interactive translate** on hover/active: this is the core animation idiom
- **Floating icons**: `float-gentle` (4s) or `float-slow` (6s) for background decoration
- **No entrance animations** on page content — the site is not a presentation
- **Reduced motion**: all animations must respect `prefers-reduced-motion: reduce`

---

## 8. Component Quick Rules

| Component                | Colour                                                 | When                                         |
| ------------------------ | ------------------------------------------------------ | -------------------------------------------- |
| `BrutalButton` primary   | Magenta                                                | Main campaign CTA                            |
| `BrutalButton` secondary | Mint                                                   | Supporting action                            |
| `BrutalButton` yellow    | Yellow                                                 | Warn or urgency only                         |
| `BrutalCard` magenta     | Magenta                                                | Featured or primary card only (one per grid) |
| `BrutalCard` mint        | Mint                                                   | Success, secondary highlight                 |
| `BrutalCard` yellow      | Yellow                                                 | Alert, costing, financial callout            |
| `BrutalBadge`            | Mint (default), Magenta (primary), Yellow (new/urgent) | Labels and tags                              |
| `CTA`                    | Magenta (join/donate), Mint (newsletter/updates)       | End-of-section banners                       |
| Section header           | Rotate: Magenta → Mint → Yellow or stay white          | Major page sections                          |

---

## 9. Layout Patterns

These are compositional patterns, not components. They describe how elements are combined.

### 9.1 Section Header Pattern

Every major section follows the same opening structure:

```html
<!-- Number badge -->
<div
  class="bg-[accent] text-[contrast] px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black"
>
  01
</div>

<!-- Heading -->
<h2
  class="text-4xl md:text-6xl font-black uppercase leading-[0.9]"
  style="font-family: 'Archivo Black'"
>
  Section Heading<br />
  <span class="text-magenta">Second Line</span>
</h2>

<!-- Supporting text -->
<p class="mt-3 font-black border-l-8 border-[accent] pl-4 text-black/70">
  One line of supporting text, left-bar style.
</p>
```

Section accent colours rotate: Magenta → Mint → Yellow → Black → repeat.

### 9.2 Triple Stripe

Used at the top of hero / full-bleed sections to signal brand and establish a header:

```html
<div class="absolute top-0 left-0 w-full h-3 bg-magenta z-20"></div>
<div class="absolute top-3 left-0 w-full h-2 bg-mint z-20"></div>
<div class="absolute top-5 left-0 w-full h-1 bg-yellow z-20"></div>
```

Proportions: **12px / 8px / 4px** (3:2:1 ratio). Do not change the order (magenta always top).

### 9.3 Geometric Corner Accents

Clip-path triangles used to add visual dynamism to sections without adding visual weight:

```html
<!-- Bottom-right fill -->
<div
  class="absolute bottom-0 right-0 w-56 h-56 bg-yellow"
  style="clip-path: polygon(100% 0, 100% 100%, 0 100%);"
></div>

<!-- Top-left fill -->
<div
  class="absolute top-0 left-0 w-24 h-24 bg-mint"
  style="clip-path: polygon(0 0, 100% 0, 0 100%);"
></div>
```

Use one corner accent per section maximum. Never fill more than two corners of the same element.

### 9.4 Alert Bar

Full-width magenta band at page top for announcements or navigation:

```html
<div class="alert-bar border-y-4 border-black">Message text | <a href="...">Link</a></div>
```

See `.alert-bar` in `global.css` for full definition. Links inside alert bars use yellow; hover turns mint.

---

## Appendix: What This System Does Not Cover

| Gap                                  | Resolution                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| Dark mode                            | Intentionally deferred. Needs separate palette spec before implementation.                 |
| Print stylesheet                     | Not in scope for current POC phase.                                                        |
| Animation for prefers-reduced-motion | Components must opt-in; see section 7.                                                     |
| Email design                         | Outside this system. Email requires its own constraints.                                   |
| Data visualisation colours           | Use Magenta → Mint → Yellow as ordinal sequence; extend with Lavender if >3 series needed. |

---

_Last updated: February 2026 — supersedes DESIGN_RATIONALE.md_
