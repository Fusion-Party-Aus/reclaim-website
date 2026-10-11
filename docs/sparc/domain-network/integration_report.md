# Domain network integration verification

Date: 11 October 2026 (Australia/Melbourne).

## Scope and environment

The initial runtime registry contains only `vic` and `qld`, using their existing canonical hostnames and Sanity project `qwl3f8jb`, with datasets `production` and `qld` respectively. No aliases or additional sites were activated. All CMS reads were public published-perspective reads. No content was seeded or changed by these checks.

The same Astro development server served both hostnames on port 4322 with `SITE_RUNTIME_MODE=production`. Node HTTP requests supplied the actual Host header. Chromium mapped the two canonical hostnames to loopback and retained their separate browser origins. Local Vite hostname protection required `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.fusionparty.org.au`; this was an environment setting for testing, not a production configuration change.

## Completed evidence

- All seven registry behavior tests passed when executed directly with Node's test API from a temporary import-only adaptation of `config/sites.test.mjs`. They cover preserved legacy presentation and dataset identity, deep immutability, normalized URL hosts, unknown-host rejection and override resistance, explicit development/preview selection, ID/host validation, unsafe canonical URLs, and runtime credential/binding exclusion.
- Direct execution of a temporary bundled runtime passed concurrent VIC/QLD dataset binding, published/no-token client configuration, disabled CDN, frozen context, client encapsulation, and error propagation. The bundle existed only under `/tmp`.
- The initial real-content end-to-end runner passed six interleaved HTTP home requests; site-specific identity, canonical URL and theme; unknown-host 404/no-store; and Chromium visits to both sites at 1440px desktop and 390px mobile, including reverse-order repeated visits. Home headings matched independent published CMS reads when present. Main headings and document horizontal overflow checks passed.
- A single batched inspection of the four initial desktop/mobile screenshots found preserved VIC and distinct QLD page content with no obvious clipping. The QLD published dataset currently contains an existing policy titled “Test”; tests did not create that document.

Initial screenshot evidence: `/tmp/fusion-site-network-qa/{vic,qld}-{1440,390}.png`. Astro's development toolbar is visible in desktop captures and contributes shadow-DOM headings; assertions correctly scope headings to `main`.

## Defects found and corrections

- Cold compilation exceeded the original request timeout. The runner now permits 120 seconds per HTTP request, with a separate 30-second independent CMS-read timeout.
- Playwright's global heading locator included four development-toolbar shadow-DOM headings. The regression assertion now scopes to `main h1`.
- Expanded route verification found `/faq` returning HTTP 500 because the remaining `FAQPageSchema` package barrel imported a missing build-time virtual configuration after the discovery integration was removed. The page was changed to emit its own script-safe JSON-LD from the request site. Final confirmation is recorded below.

## Final route confirmation

The final expanded run passed with exit status 0 after the FAQ correction. Both sites passed:

- HTTP 200 and request-site identity/canonical/theme on `/policies`, `/research`, `/blog`, `/faq`, `/electorates`, `/vision`, `/manifesto`, and `/contact`.
- Published policy detail slugs selected independently from each dataset, plus a published VIC research detail. QLD research detail was explicitly skipped because its published dataset has no research slug.
- Exact policy and research document ID sets in `/api/policies.json` and `/api/research.json` matched independent published dataset reads; all returned canonical item origins belonged to the selected site.
- `/api/policies.txt`, `/api/research.txt`, `/api/policy-changes.json`, `/rss.xml`, `/robots.txt`, `/llms.txt`, and policy/research/blog/content/news sitemap endpoints returned 200 with site-specific origins. Every emitted sitemap `<loc>` used the request site's canonical origin.
- `/site.webmanifest` returned the site's label, theme color, and brand-icon namespace. `/sw.js` used the site's cache namespace.
- Chromium completed eight desktop/mobile home-to-policies visits across the two hostnames, including reverse-order repetitions. Independent CMS home-heading checks, canonical and theme checks passed. Mobile keyboard Enter opened the navigation, Escape closed it, focus returned to the toggle, and the reopened policies link navigated successfully.

Final policy-page screenshots were captured and inspected together at `/tmp/fusion-site-network-routes/{vic,qld}-{1440,390}.png`. These preserve both site identities and show no obvious content clipping. Mobile QLD full-page screenshots include an approximately 19px right-side strip even though the document overflow assertion passes; development UI or late capture geometry was not isolated, so these screenshots are not production pixel-diff baselines. No further screenshot passes were performed.

The reusable command is:

```sh
QA_SCREENSHOT_DIR=/tmp/fusion-site-network-routes node scripts/qa/check-site-network.mjs http://127.0.0.1:4322 --routes
```

## Limits and release gates

Vitest was attempted with fork workers, one thread worker, and an escalated thread worker. Each run timed out starting workers before assertions executed. These attempts are not passing tests; direct verification above provides narrower behavior evidence. The full repository suite and build results must be assessed separately.

The browser uses a local Astro development server in production host-resolution mode. These checks do not establish Cloudflare Worker deployment behavior, production cache behavior, real service-worker installation/offline operation, or domain/DNS rollout correctness. Form submissions, membership writes, OAuth provider exchange, and email delivery were not exercised. Blog/FAQ/electorate detail slugs, investigations, generic CMS pages, and every individual policy/research detail were not exhaustively visited. Additional proposed sites, authenticated Studio sessions, and preview authorization were outside this initial two-site runtime check. No push or deployment was performed by this verification task.

## Empty state landing follow-up (12 October 2026)

The maintainer approved initial CMS-free empty landing Sites for NSW, SA, NT and ACT on the test Worker. Focused Vitest passed 12 tests across `config/landing-sites.test.mjs` and `src/lib/site-landing.test.ts`. Independent direct execution also passed all four resolver/response contracts: distinct state identity, own canonical root, no fabricated CMS/deployment mapping, immutable landing records, unavailable routes 404/no-store, HEAD without bodies, unsupported methods 405, and root-only discovery. All four landing records were rejected by the content-context constructor before any CMS client factory call (zero calls). Existing VIC/QLD sources and currently unavailable National/TAS/WA/alias hosts remained unchanged in these direct checks.

The old local development server no longer existed. A single restart attempt could not become ready while the host had severe RAM/swap/IO pressure; the orchestrator stopped it to release resources. The local HTTP attempt therefore ended with connection refused and is **not** a passing landing E2E result. No new landing browser screenshots were captured. Actual built-Worker HTTP and deployed-test browser confirmation remain required. `scripts/qa/check-state-landings.mjs` is ready for the four-host HTTP contract without CMS reads. The earlier VIC/QLD browser evidence above predates this landing extension and does not prove the final built Worker.

### Landing-only test Worker artifact (12 October)

The narrowed test deployment uses the native Worker entry `src/workers/branch-agnostic-test.ts`, built by `scripts/branch/build-test-worker.mjs`; the full Astro target remains available separately as `build:test:app`. Added six Worker boundary regression cases in `src/workers/branch-agnostic-test.test.ts`. Parent captured missing-entry import RED before implementing; the dedicated behavior tests were written after the entry existed, so their own RED run is not claimed.

An independent native Node import of the actual generated `dist-branch-agnostic-test/server/worker.mjs` passed 65 scenarios: four landing identities/canonicals; HEAD status, all headers and empty bodies for root/discovery/unavailable API; unsupported methods; unavailable pages/APIs/assets; eight excluded hosts including VIC/QLD and lookalike domains; and ignored query/forwarded-host overrides. This confirms the bundled request handler, not Cloudflare routing or browser rendering. Build-script review found explicit target selection and no CMS/session/CRM bindings, secrets, deployment call or asset upload in the builder.

The first local HTTP attempt was blocked by sandbox networking (`EPERM`); the authorized retry returned `ECONNREFUSED` on port 4322 because Wrangler was not listening. Actual local HTTP and deployed browser confirmation remain pending at this point. No new screenshots were taken.

## Final landing artifact verification (12 October 2026)

The native esbuild build passed and produced a roughly 3.6 KB Worker. Focused landing tests passed 12 cases; independent execution of the actual bundle passed 65 checks. Scoped TypeScript checking and `git diff --check` passed. A local Cloudflare Wrangler runtime, using its supported 2025-01-29 compatibility baseline, passed actual HTTP checks for all four state hosts, distinct identity, HEAD, unavailable-route 404, unsupported-method 405 and root-only discovery. The source configuration retains compatibility date 2026-10-11; the local runtime baseline difference is a verification limitation.

The broader Astro build and full repository suite were canceled under severe host memory/swap pressure and are not claimed passing. These results validate the narrowed landing artifact; deployed host/browser checks remain required. No live CMS changes or VIC/QLD deployment changes were performed.
