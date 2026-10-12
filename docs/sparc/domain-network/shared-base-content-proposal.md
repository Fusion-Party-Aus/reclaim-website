# Shared branch base content proposal

Planning snapshot: 12 October 2026. Local implementation drafted; no CMS document, push or deployment changes made. Maintainer approved the shared base copy in chat on 12 October 2026.

## Current evidence

Public GETs confirmed NSW and NT each serve their own coming-soon title and state name, with a National homepage link. The National homepage currently presents an Australian party, a free and fair society, community participation, and six named values: Personal Liberty, Advancement, Ecological Harmony, Safety, Ethical Conduct and Equity. Its navigation offers National join, volunteer, donate, contact, values and policy destinations. Source: [National homepage](https://fusionparty.org.au/), [NSW](https://nsw.fusionparty.org.au/), [NT](https://nt.fusionparty.org.au/). These are published source material, not proof of approval for every branch to adopt every claim. Direct destination GETs returned 200 for volunteer, values and contact, redirecting to the www National origin. An initial direct Join GET returned 403; the subsequent web source fetch rendered the membership page and its State field. These status checks do not test form submission or membership processing.

The approved roster is National plus VIC, NSW, SA, QLD, TAS, WA, NT and ACT, without aliases. The current landing Worker serves only NSW, SA, NT and ACT. VIC and QLD retain their existing sites and separate datasets. National, TAS and WA are not activated by this proposal.

`.agents/product-marketing.md` already distinguishes National identity from branch policy. The older PRODUCT.md contains Victorian campaign targets and historical numbers; those are unsuitable shared content inputs.

## Concrete first release

The exact draft is in `config/shared-branch-base.mjs`; the renderer supplies the local preparation notice and clearly labelled National links. This draft supersedes the illustrative wording below. TAS and WA have prepared shared-content eligibility only; no hostname activation is included.

Keep one local homepage per active new branch. Share an introduction, short values section and participation section on that page rather than manufacturing empty policy/candidate pages. Add only real destination links; optional deeper local pages can follow when substantive approved material exists.

Exact draft homepage content lives in `config/shared-branch-base.mjs` and `src/lib/site-landing.ts`. The current implementation supersedes the initial plain preview: it now follows the incumbent folded homepage and the supplied National concept. Review source and finish evidence below.

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

Acceptance: all four active branch homepages share the same approved base version and hero while showing distinct masthead identity, title and canonical; NSW never renders NT identity; National links are explicitly labelled; existing unavailable local routes remain 404; no CMS/integration import enters the lean bundle; VIC/QLD hosts remain rejected by this Worker and their sites are unchanged. Actual bundled Worker HTTP, desktop/mobile reading and keyboard focus were checked locally; external pages were checked read-only without submitting forms.

Content decision: maintainer approved the concrete shared base draft in chat on 12 October 2026. This covers the introduction, six National values and clearly labelled National links. State policies and candidates remain unpublished; VIC/QLD datasets remain untouched.

## Local verification completed

26 focused tests passed across shared content, landing registry, renderer and Worker suites. Built artifact audit passed: four bundled inputs, no CMS imports, external runtime dependencies or deployment bindings. Scoped TypeScript and ESLint passed. Actual local Cloudflare runtime passed all four state host checks, HEAD, unavailable routes, rejected writes and root-only discovery. Desktop (1440px) and mobile (390px) browser checks passed without horizontal overflow; keyboard focus is visible. No forms were submitted. National membership and volunteer source pages confirm location fields; volunteer also offers participation choices. Privacy destination corrected to `/privacy_policy` from the National footer.

At approval time, the shared draft was local commit `bb1e6ba`, and the remote deployment branch remained `976424a`. Publication targets only the existing `branch-agnostic-test` Worker; TAS/WA activation and VIC/QLD CMS changes are outside this release.

## Source review

Read-only source review on 12 October 2026 confirmed the draft value names and descriptions against [National values](https://www.fusionparty.org.au/our_values), the separate [National policy overview](https://www.fusionparty.org.au/policy), [National contact](https://www.fusionparty.org.au/contact), [membership](https://www.fusionparty.org.au/join), [volunteering](https://www.fusionparty.org.au/volunteer), and the footer-linked [privacy policy](https://www.fusionparty.org.au/privacy_policy). These checks establish destination content, not successful form processing.

## Adaptation of supplied National concept (12 October)

Visual source: maintainer-supplied `Fusion Australia_ A Better Future Together.png`. Preserve its fold rhythm, deep purple/cyan brand accents, large expressive typography, city-photo hero, airy values row, contrasting participation band and clear footer. Treat pictured stories, events and numbers as concept placeholders rather than publishable content. Its Melbourne photo must be replaced with the verified photo for each active branch.

Latest maintainer direction removes the branch name from the hero. The single H1 is now “A better future, built together.” Branch identity remains in the masthead, page title, canonical and Open Graph metadata. The hero contains no branch announcement; the local readiness notice sits in the mission fold. Two actions: “Explore national policy” and “Join Fusion nationally”. Local readiness copy stays visible without dominating the whole page.

Recommended truthful fold sequence:

1. **Hero:** city image, shared slogan H1, short mission line and participation/value actions. No local registration/election claims.
2. **Mission:** H2 “Good ideas. Better lives.” with proposed copy: “We bring people together around ideas that improve lives. Explore Fusion’s national values and policy work, and help shape what comes next.” This is modest connective copy for maintainer review; do not assert an unverified formal process or guaranteed result.
3. **Shared values:** retain the six published National value names. Short descriptions should paraphrase the actual National values page and link there, without transferring state policy commitments. Avoid sourcing portraits or ornamental stock images until provenance is established; typography and simple marks can carry this fold.
4. **National policy:** H2 “Explore Fusion’s national policy”. Prefer three existing published category names over the concept's invented state-platform cards: “Fair + Inclusive Society”, “Ethical Governance”, “Climate Rescue”. Neutral labels underneath can say “Read the national policy”; no unsupported state-specific promises or new numerical targets. Link to `/fair_inclusive_society`, `/ethical_governance`, `/climate_rescue` on the National origin. The first page directly supports housing/health/fairness themes; National homepage navigation independently names transparency/whistleblowing and climate/transport themes. Do not elevate transport to a separate local platform solely because the concept shows a tram.
5. **Participation:** H2 “Help shape what comes next.” with National join, volunteer and contact destinations. Donation and free-membership claims remain subject to the earlier checks. An optional “National news and events” pair of external links can replace mock article/event lists after browser verification; never create dated cards or claim there are local events.
6. **Footer:** distinct branch identity, National organisation link, reviewed privacy/governance destinations and photo credit. Do not copy the concept's authorisation name/address onto a new branch without confirmation.

Omit the concept's 24-candidate/100%-volunteer/all-states metric band, mock news headlines, scheduled events, electoral-system explainer and substantive climate campaign fold from this base release. These require current evidence, jurisdiction context or additional editorial approval. The approved National values can support a shared base without those elements.

The National homepage supplies `/blog` and `/events` as navigation destinations; its footer also links `/news`. Prefer the explicit main-navigation `/blog` destination for “National news”. These links are National content, not local feeds. Direct checks are recorded below; a successful GET alone does not validate a form or guarantee future listings.

Destination checks: curl GET returned 200 for National ethical governance, climate rescue and events, each redirecting to the www National origin. Both `/blog` and `/news` returned 200 at `https://www.fusionparty.org.au/news`; use that verified final destination for the optional National news link. Earlier urllib requests were challenged with 403, so browser verification remains part of acceptance. No live news/events content was copied or seeded.

## Final styling and CMS seam acceptance

Maintainer approved shared copy, then required incumbent folds/city photos and supplied a National concept to adapt. The implementation retains state identity, uses the existing Fusion mark and wordmark, Georgia/Barlow typography, purple/teal tokens, actual hero/participation ribbon paths, and responsive city imagery. Added concept slogan and mission band plus three explicitly National policy areas; no concept statistics, mock news, dated events or local platform promises were copied.

Desktop/mobile browser checks confirmed loaded logo/font/photos, no horizontal overflow, visible folds and responsive policy layout. The initial SVG data URL quoting defect found by the browser was fixed and covered by a parser regression test. Actual local Cloudflare HTTP checks now verify mission, introduction, city photo, folds, embedded fonts and National links on every active host, alongside prior route/HEAD/write/discovery safeguards.

The renderer accepts a validated `BranchLandingContent` record. Static content and a fixture adapter exercise the same interface; future CMS acquisition remains outside presentation. See `branch-landing-cms-seam.md` and the independent finish review in `docs/design/branch-landing-finish-review.md`. No datasets, legacy branch CSS/components, hostname activation or CMS bindings were changed.
