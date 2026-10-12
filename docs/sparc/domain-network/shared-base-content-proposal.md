# Shared branch base content proposal

Planning snapshot: 12 October 2026. Local implementation drafted; no CMS document, push or deployment changes made. Maintainer approved the shared base copy in chat on 12 October 2026.

## Current evidence

Public GETs confirmed NSW and NT each serve their own coming-soon title and state name, with a National homepage link. The National homepage currently presents an Australian party, a free and fair society, community participation, and six named values: Personal Liberty, Advancement, Ecological Harmony, Safety, Ethical Conduct and Equity. Its navigation offers National join, volunteer, donate, contact, values and policy destinations. Source: [National homepage](https://fusionparty.org.au/), [NSW](https://nsw.fusionparty.org.au/), [NT](https://nt.fusionparty.org.au/). These are published source material, not proof of approval for every branch to adopt every claim. Direct destination GETs returned 200 for volunteer, values and contact, redirecting to the www National origin. An initial direct Join GET returned 403; the subsequent web source fetch rendered the membership page and its State field. These status checks do not test form submission or membership processing.

The approved roster is National plus VIC, NSW, SA, QLD, TAS, WA, NT and ACT, without aliases. The current landing Worker serves only NSW, SA, NT and ACT. VIC and QLD retain their existing sites and separate datasets. National, TAS and WA are not activated by this proposal.

`.agents/product-marketing.md` already distinguishes National identity from branch policy. The older PRODUCT.md contains Victorian campaign targets and historical numbers; those are unsuitable shared content inputs.

## Concrete first release

The exact draft is in `config/shared-branch-base.mjs`; the renderer supplies the local preparation notice and clearly labelled National links. This draft supersedes the illustrative wording below. TAS and WA have prepared shared-content eligibility only; no hostname activation is included.

Keep one local homepage per active new branch. Share an introduction, short values section and participation section on that page rather than manufacturing empty policy/candidate pages. Add only real destination links; optional deeper local pages can follow when substantive approved material exists.

Exact draft homepage content lives in `config/shared-branch-base.mjs` and `src/lib/site-landing.ts`. Review the rendered [desktop preview](/tmp/fusion-shared-base-desktop.png) or [mobile preview](/tmp/fusion-shared-base-mobile.png). The local HTML preview is `/tmp/fusion-shared-base-preview.html` (temporary review files, not deploy artifacts).

- Each homepage uses its own state name, title, canonical and Open Graph identity.
- Shared content includes a National introduction and six paraphrased National values.
- State policies and candidate information remain unpublished, with an explicit preparation notice.
- Join, volunteer, contact, values, policy and privacy links clearly lead to the National website.

No donation CTA in the first base until destination usability and applicable wording are reviewed. No local candidate recruitment claim, fundraising target, member count, election deadline, electoral-system advice, authorisation name, contact address or social account is invented. Existing National governance/privacy pages may be linked after destination checks; do not imply those automatically satisfy branch-specific disclosure requirements.

## Reuse model and isolation

Use a static, immutable `sharedBranchBaseContent` record owned by National with an explicit content allowlist of NSW, SA, TAS, WA, NT and ACT; only the four existing landing Site IDs are active. It contains draft introduction/value descriptions and absolute National link destinations. Each landing record supplies only siteId, state name and canonical origin; no CMS dataset or VIC content fallback. A pure composition function returns shared content plus local identity. The Worker bundles the same reviewed record once; it never fetches VIC/QLD or copies content into another dataset.

Keep editorial provenance (source URL, review date and version) beside the shared record. A later shared CMS can map the same material to `owner=national` and explicit `siteIds`; do not activate the staged CMS/publication model or migration to deliver this release. State-specific content is a separately reviewed override, not inferred from shared copy. Unknown hosts stay 404; the approved nine-site roster does not activate five additional runtime contexts.

## Visitor experience and verification

Lead with the state identity, then answer what Fusion is, what it values and what the visitor can do. Use one clear primary participation action and a small set of labelled National links. This reduces uncertainty and choice overload without fabricated urgency, social proof or local campaign activity. Preserve the established bold accessible identity; no redesign is necessary to ship substantive copy.

Acceptance: all four active branch homepages share the same approved base version while showing distinct state heading, title and canonical; NSW never renders NT identity; National links are explicitly labelled; existing unavailable local routes remain 404; no CMS/integration import enters the lean bundle; VIC/QLD hosts remain rejected by this Worker and their sites are unchanged. Actual bundled Worker HTTP, desktop/mobile reading and keyboard focus were checked locally; external pages were checked read-only without submitting forms.

Content decision: maintainer approved the concrete shared base draft in chat on 12 October 2026. This covers the introduction, six National values and clearly labelled National links. State policies and candidates remain unpublished; VIC/QLD datasets remain untouched.

## Local verification completed

26 focused tests passed across shared content, landing registry, renderer and Worker suites. Built artifact audit passed: four bundled inputs, no CMS imports, external runtime dependencies or deployment bindings. Scoped TypeScript and ESLint passed. Actual local Cloudflare runtime passed all four state host checks, HEAD, unavailable routes, rejected writes and root-only discovery. Desktop (1440px) and mobile (390px) browser checks passed without horizontal overflow; keyboard focus is visible. No forms were submitted. National membership and volunteer source pages confirm location fields; volunteer also offers participation choices. Privacy destination corrected to `/privacy_policy` from the National footer.

At approval time, the shared draft was local commit `bb1e6ba`, and the remote deployment branch remained `976424a`. Publication targets only the existing `branch-agnostic-test` Worker; TAS/WA activation and VIC/QLD CMS changes are outside this release.

## Source review

Read-only source review on 12 October 2026 confirmed the draft value names and descriptions against [National values](https://www.fusionparty.org.au/our_values), the separate [National policy overview](https://www.fusionparty.org.au/policy), [National contact](https://www.fusionparty.org.au/contact), [membership](https://www.fusionparty.org.au/join), [volunteering](https://www.fusionparty.org.au/volunteer), and the footer-linked [privacy policy](https://www.fusionparty.org.au/privacy_policy). These checks establish destination content, not successful form processing.
