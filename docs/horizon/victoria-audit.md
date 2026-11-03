# Victoria Horizon integration audit — 3 November 2026

## Sources and design decisions

Implementation starts from Reclaim `85d714539f819931fc0cd8255f34c892dbd1d245` on `feat/victoria-horizon-home`.
Horizon was inspected through its `feat/headless-poc` default branch: `DESIGN.md`, root guidance, `frontend/src/layouts/BaseLayout.astro`, `HeroSplit.astro`, `Ribbon.astro`, and public SVGs. Its backend is Django/Wagtail; that architecture is intentionally not imported. Reclaim retains Astro, Sanity and its branch resolver.

The canonical wordmark comes unchanged from Horizon `frontend/public/fusion_horizon_wordmark.svg`. The canonical **light-mode** mark comes unchanged from Engage `public/fusion_horizon_logo_light.svg`, as directed by Ethan. The dark-mode Horizon mark is not shipped. The ribbon geometry now comes from Signal's `public/horizon-ribbons.js` at `f19d53fff86eb67bd6e4a3907efe796cd054b54c`, following Ethan's direction: exact folded/sweep paths and gradient stops are adapted to server-rendered SVG in `src/lib/horizon-ribbons.ts`. The hero and participation band use the folded surfaces; a low-opacity sweep accents the introduction. Victoria's silver `#A8A8AD` is the decorative accent from Signal's confirmed roster; blue remains the accessible interactive ink. No canvas pipeline or client-side rendering dependency is imported. Purple `#32105A`, blue `#003C71`, paper `#F8F5FB`, text `#54465F`, white and hairline `#DED6E7` come from the reference implementation. Newsreader replaces the reference headline family by explicit editorial direction; Outfit remains the body face. Both are bundled locally with their package licences. The hero photograph comes from the existing Sanity homepage, not a generated or uncleared reference photograph. Missing alt text treats it as decorative; editors can add alt text in Studio.

## Architecture and existing pipelines

- `src/pages/index.astro` selects VictoriaHome, QueenslandHome or BranchHome through `DEPLOYMENT.contentProfile`. Existing profile names remain compatible.
- `config/branches.mjs` owns branch identity, content dataset, token contract and deployment identity. Victoria uses `production`; Queensland uses `qld`. Queensland manifest values and its stylesheet are untouched.
- `src/styles/themes/vic.css` owns the Victoria palette; `horizon.css` owns the scoped component language. Shared header/footer switch their brand only for `DEPLOYMENT.slug === 'vic'`.
- `src/lib/sanity.ts` remains the sole data layer. The existing published perspective is retained. Latest posts explicitly exclude draft IDs and future publication dates, sort newest first and select three. Blog listing and direct article access also reject future dates.
- Blog documents are `blogPost`; `/blog` is the listing and `/blog/[slug]` the article route. Homepage cards and listing graphics use width-only image transforms and intrinsic aspect ratios.
- Research is `researchResource`, fetched by `getResearchResources`, with `/research` and `/research/[slug]` plus machine-readable API feeds. Homepage selection puts featured resources first and fills any remaining places with recent eligible resources, excluding future/invalid dates.
- Policies are `policy`, with `status` (`adopted`, `draft`, `archived`); existing missing status semantics mean adopted. `homePage.theftSection.featuredPolicies` is already an ordered reference list expanded by `getHomePage`. Homepage selection preserves that order, ignores missing/non-adopted records, deduplicates and fills from adopted policies. Proposals are never relabelled adopted.
- Homepage headings, hero, introductions and featured policy choices use the existing document. No article, research or policy card is hardcoded.

## Existing election architecture and additive change

`electorate` already separates `house: lower|upper`, has slug, election grouping, archive flag, candidate biography/commitments, and an `htv` array containing candidate names, party, alignment tier, ballot order and suggested vote. `/electorates/[slug]` renders those tickets. Candidate name is required; it has no independent recommendation publication state, reliable official electorate ID, editorial update date or source list. It cannot safely represent all 88 districts and 8 regions without presenting Fusion candidates.

Existing documents, routes, archived candidates and ticket rendering are retained. A separate additive `electionGuide` type supports official electorate identifier, name, chamber, election year, editorial status, publication/update dates, rich-text approved recommendation and cited sources. Only published Sanity documents with `status=published`, year 2026, complete identifiers, nonempty recommendation/sources and elapsed publication date are queried. No recommendations or political rankings were generated. `/election` lists districts and regions separately; `/election/[slug]` renders the approved content and sources. Existing blog posts can opt into coverage through `electionCoverage` and `electionYear`. The homepage election section appears only when published guides or tagged articles exist; navigation exposes the coverage hub even before the first publication.

## Obsolete messaging

Removed from VictoriaHome: candidate spotlights/list, registration and campaign metrics (including invented fallback counts), contesting-election alert, campaign recruitment and legacy slogan. Active header/footer links no longer promote `/stand` or the candidate directory. Historical candidates remain available. `/stand` redirects Victoria visitors to `/get-involved`, retaining its CMS record. Utility-page branding and the policy-page brand label use the branch name. Historical strategy slides, letterhead legal text, articles, quotations, policy language such as “reignite it”, and archived candidate copy are not rewritten.

## Sanity coordination — no content published or drafts overwritten

- `drafts.DYZVAW4yRUmcIv7eyyqoTp` was not present at audit time. The **published** `DYZVAW4yRUmcIv7eyyqoTp` had already been updated at `2026-11-03T02:15:27Z`: purpose statement, disabled alert, featured policy references and participation introduction. Those are consumed as-is. Legacy nested candidate/metric/card fields are retained but no longer rendered by VictoriaHome.
- `drafts.main-navigation` exists. It has the revised tagline but still has `nav-stand` pointing to `/stand`. Its intended policy/research navigation is supported; the frontend suppresses obsolete recruitment and adds publication/coverage links. Do not blindly publish the draft until reviewed with the frontend.
- No published article, policy or research document was modified. Schema additions are optional and backward compatible; no migration/deletion is needed.

Existing published 2026 articles explicitly tagged `election` are included as a backward-compatible coverage fallback when `electionCoverage` is unset. Setting it to false opts out; setting it true with `electionYear=2026` explicitly opts in. The coverage hub lists all eligible articles, while the homepage selects three. This classifies existing editorial metadata; it does not infer positions or generate rankings.
