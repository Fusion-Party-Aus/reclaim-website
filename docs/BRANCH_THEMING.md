# Branch theming

Fusion branches share one Astro codebase and component set. Each branch's theme
is declared in `config/branches.mjs` and applied to the whole deployment. The
manifest is the source of truth for the theme slug and semantic token values;
the matching CSS theme file maps those roles onto the site's existing CSS
custom properties.

## Theme selection and generation

The `BRANCH`, `PUBLIC_BRANCH` or `SANITY_STUDIO_BRANCH` environment value
selects a manifest entry. If unset, the manifest default (`vic`) is used. The
resolver returns an immutable branch descriptor and fails closed if the branch
or its theme configuration is missing or invalid. `config/deployment.mjs` is a
compatibility facade for older callers.

The layout sets `data-theme` from the resolved branch slug. The CSS selector
`:root[data-theme='<slug>']` activates the branch theme. No page or shared
component selects its own branch theme.

`config/branches.mjs` declares the required token roles centrally in
`tokenContract`. The current roles are `primary`, `primary-dark`,
`on-primary`, `secondary`, `on-secondary`, `surface-base`, `surface-raised`,
`fg`, `muted`, `line` and `focus`. All are color roles. `config/branch/theme.mjs`
validates that each branch supplies the contract and maps its roles to the
established CSS properties:

| Manifest role    | CSS custom property      |
| ---------------- | ------------------------ |
| `primary`        | `--color-magenta`        |
| `primary-dark`   | `--color-magenta-dark`   |
| `on-primary`     | `--color-on-primary`     |
| `secondary`      | `--color-mint`           |
| `on-secondary`   | `--color-on-secondary`   |
| `surface-base`   | `--color-surface-base`   |
| `surface-raised` | `--color-surface-raised` |
| `fg`             | `--color-fg`             |
| `muted`          | `--color-muted`          |
| `line`           | `--color-line`           |
| `focus`          | `--color-focus`          |

The mapping preserves the existing CSS vocabulary. For example, a branch's
`primary` value becomes the `--color-magenta` value under its theme selector;
the manifest property name does not have to match the CSS property name.

`scripts/branch/generate-theme-index.mjs` reads every branch key from the
manifest, validates token values and mapped declarations in each CSS theme, and
generates the ordered `@import` list in `src/styles/themes/index.css`. It does
not author theme CSS files. `npm run predev` and `npm run prebuild` run this
generator before starting the dev server or building; normal runs update the
generated index. CI and manual checks can verify it is current with:

```bash
node scripts/branch/generate-theme-index.mjs --check
```

## Adding a branch theme

1. Add a branch entry in `config/branches.mjs`, including `theme.slug` equal to
   its branch slug and all required `theme.tokens` roles. Choose values for the
   intended identity, contrast, surfaces and foregrounds.
2. Create `src/styles/themes/<slug>.css`. In
   `:root[data-theme='<slug>']`, declare the mapped CSS custom properties for
   every required role. Add other branch-specific presentation overrides only
   where needed. Keep selectors scoped to the branch theme.
3. If the theme needs named Tailwind color utilities, declare them in that
   stylesheet's `@theme` block. Manifest role validation does not generate
   additional CSS utility names.
4. Run the theme generator (or start a dev server/build, which runs it), then
   review the generated `src/styles/themes/index.css`. Do not hand-author or
   manually maintain the import list.
5. Build and verify the branch as described below, checking readability,
   keyboard focus and contrast on representative pages and surfaces.

The token contract currently covers the shared semantic role properties, not
every CSS variable a theme may use. Existing themes also include supporting
palette values, editorial variables and component-specific refinements.

## Current palettes

Victoria uses the shared dark-first palette; its explicit `vic` theme preserves
the established result. Queensland uses maroon and eucalyptus on an ivory and
paper light-first canvas. In `config/branches.mjs`, Queensland's core manifest
values include primary `#731E32`, secondary `#233D3A`, surface base `#FFF7EC`,
raised surface `#FFFDF8`, and foreground `#233D3A`. The full Queensland design
system page is at `/qld/design-system` when viewing the Queensland deployment.

The QLD stylesheet includes additional palette utilities and overrides beyond
the required manifest-role mappings. Keep its gold/ochre contrast rule in mind:
brand gold is suitable as a surface or highlight, while ochre is used when the
gold family needs to carry text on a light background.

## Branch build and verification

Use the generic branch commands for local work and individual builds:

```bash
BRANCH=<slug> npm run dev:branch
BRANCH=<slug> npm run build:branch
```

`npm run dev:qld` and `npm run build:qld` are QLD convenience aliases. To
exercise every manifest entry, run:

```bash
npm run verify:branches
```

That command builds each branch separately, then checks resolved parity and
scans built output for branch-content leakage. CI runs this matrix, so new
manifest entries must have valid theme CSS and build configuration to pass.

See [BRANCH_DEPLOYMENTS.md](BRANCH_DEPLOYMENTS.md) for the complete manifest
fields, external resource setup, and deployment workflow.
