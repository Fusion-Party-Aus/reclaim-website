# Verification and handover — 3 November 2026

## Passing checks

- `npm test -- --run`: **262 tests pass across 22 files**, including added editorial selection tests and existing branch, Sanity, policy-feed and service-worker tests.
- `NODE_ENV=development npm run type-check`: **0 errors, 0 warnings**, 62 informational/deprecation hints. Development selects the existing Node adapter; the default Cloudflare adapter cannot initialise network-interface inspection in this host without a temporary host shim.
- `npm run lint`: **0 errors**, 93 existing warnings. Changed-feature formatting checks pass. Whole-repository `format:check` still flags unrelated pre-existing files; these were not reformatted wholesale.
- `npx tsc --project studio/tsconfig.json --noEmit`: passes after installing the Studio's declared dependencies with `npm ci --ignore-scripts`.
- Node-adapter Astro build completes, including existing static electorate/FAQ routes. Existing large-bundle warnings remain.
- Built SSR homepage returns **200** against the production Sanity dataset. It displays the Melton council question article, Preston submission and toll-cap analysis, three real research resources, and the curated Data Centres / Complete Neighbourhoods / Open Government policies.
- Built SSR navigation checks return **200** for `/blog`, the Melton article, `/research`, the SRL audit resource, `/policies`, Complete Neighbourhoods, `/election`, `/get-involved`, and `/contact`.
- Rendered homepage HTML contains none of `Reignite Democracy`, `Contesting Victoria`, `Registered Members`, `Candidates Ready`, or `No candidate yet`.
- Square image inspected in rendered markup: `1080x1080.png?w=800&fit=max&auto=format`, without a height/crop transform; CSS uses intrinsic height. Canonical light mark and wordmark were rasterised and visually inspected for correct source assets.
- The election article query was checked against live published metadata: it returns the toll-cap and Melbourne/Madrid housing-politics articles using their existing explicit `election` tag. No political recommendations or rankings were generated.

## Contrast and structural review

New homepage colour pairs have calculated contrast ratios: purple/white **15.47:1**, body text/white **8.68:1**, body text/paper **8.04:1**, white/purple **15.47:1**, blue/white **11.14:1**. These exceed AA normal-text thresholds for those pairs; they are not a claim of a completed site-wide accessibility audit.

Source review confirms one main landmark and one H1 on the homepage, ordered section/card headings, semantic dates, named navigation, retained skip link, keyboard-focus rings on white and purple, mobile navigation Escape handling, reduced motion, responsive grids and uncropped editorial graphics. Historical candidate pages have a legacy notice pointing to current coverage, without claiming the 2026 election has ended.

## External verification limits — release remains blocked

The standard `npm run build` reaches the Cloudflare/workerd prerender stage but fails resolving `qwl3f8jb.apicdn.sanity.io` in this environment. Earlier initialisation also encountered `uv_interface_addresses` restrictions. A temporary, untracked `/tmp` shim supplied loopback metadata only to permit local build tooling; it is not part of the PR and does not change production networking. A Node-adapter build is supplementary evidence, not a substitute for a passing Cloudflare release build.

The available browser could not connect to the local preview, and the host's local HTTP connection also failed despite Astro reporting readiness. Therefore **desktop/mobile screenshots, browser accessibility scanning, visual layout verification and interactive keyboard checks remain unverified**. No synthetic screenshots are supplied. Complete the browser checklist in `sanity-release.md` in a reachable development/preview environment before approving release.

Queensland's manifest and theme CSS are unchanged, conditional brand changes are Victoria-only, and the existing branch test suite passes. A separate Queensland Node build is checked during handover; production branch builds and Queensland browser regression checks remain release gates.

No Sanity draft was overwritten or published. No schema was deployed, no production deployment was made, and main was not merged. The PR must remain a draft until release gates are completed.
