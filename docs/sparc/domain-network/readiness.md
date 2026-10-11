# Domain network readiness

This is staged implementation for epic #75, not a production cutover approval.

## Preserved state

VIC reads `qwl3f8jb/production`; QLD reads `qwl3f8jb/qld`. Existing Worker configurations and dataset contents are unchanged. The pre-existing `studio/sanity.config.ts` research-navigation edit belongs to the user and must be excluded from feature commits unless separately authorised.

Local Astro development requires an explicit registered Site, for example `SITE_ID=vic npm run dev` or `SITE_ID=qld npm run dev`; the command does not silently select VIC.

## Child issue status

| Issue | Local progress                                                                        | Remaining acceptance gates                                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #76   | Host registry, immutable request context, homepage shell, explicit local/CI selection | Public presentation still uses the validated legacy manifest adapter; production artifact verification                                                           |
| #77   | Separate-dataset operation approved for now; future gateway policy recorded           | Restricted-gateway feasibility and working editor flow; actual account roles/token/plan audit; no live consolidation                                             |
| #78   | User-approved nine-Site roster, no aliases, recorded separately                       | Live #75/#78 now record nine; #86/#87 still need count reconciliation; National/TAS/WA remain gated; four additional candidate landing hosts contain no CMS data |
| #79   | Astro pages/components, APIs, feeds use request-bound public content                  | Final full regression and production Worker verification                                                                                                         |
| #80   | Supported handshake and signed Site/browser preview staged                            | Audited atomic replay store, preview secrets/configuration and real authenticated preview acceptance                                                             |
| #81   | Site integrations, canonical OAuth, state/session rejection, token isolation          | Audited atomic OAuth state service and binding; real provider preview acceptance                                                                                 |
| #82   | Pure shared publication validator, scoped read factory, schema field helper           | Actual schema reference-path adapter, real shared read adapter, Studio registration; no shared-read switch                                                       |
| #83   | Runtime discovery, per-Site SEO/PWA, icons and OG cards                               | Production artifact and preview/offline verification                                                                                                             |
| #84   | Shared validation module exists                                                       | Approved routine writer access; authoritative Studio/Signal/migration adapters                                                                                   |
| #85   | Non-destructive offline migration planner and fixture reconciliation                  | Fixture-only shared-model/migration work approved now; live backups/destination/asset transport/reconciliation/rollback remain gated                             |
| #86   | Inactive approved roster recorded                                                     | Approved National/remaining content, themes, singleton data and preview hosts                                                                                    |
| #87   | VIC/QLD live-content local HTTP/browser checks and reports                            | Full nine-Site previews, actual billing/request/bandwidth evidence, real migration/restore and production approval                                               |

## Release gates

Do not push a deployment-triggering branch, merge, deploy, change DNS or switch live CMS reads until the exact candidate has passed the required checks and the maintainer approves the concrete cutover. Never delete an old dataset or Worker to obtain capacity. Keep current source datasets and deployments available through preview verification and the agreed rollback window.

Use `integration_report.md`, `security_audit_report.md`, `access-and-quotas.md`, `integrations.md`, `migration.md` and review reports for evidence and limits. Pending checks are not passes. Local Node-adapter E2E does not prove Cloudflare Worker deployment parity.

The offline planner emits review files only; it does not apply CMS mutations. The shared publication schema/read helpers are deliberately unregistered. No production DNS/deployment changes have been performed. The candidate now resolves NSW/SA/NT/ACT to content-free coming-soon responses; these have no CMS source or inherited VIC/QLD presentation. Missing atomic state bindings fail OAuth/preview clearly; that dependency must be resolved before deploying these handlers.

## Refreshed maintainer direction

Live issues #75–#87 were re-read after the 11 October update. #75 now requests
nine Sites and #78 records the complete approved no-alias roster with all six
acceptance boxes checked. #78 remains open; a completed roster decision alone does not activate hosts. Later session approval
permits content-free coming-soon landing responses for NSW/SA/NT/ACT in the
candidate; National/TAS/WA and full additional CMS Sites remain gated. #86/#87 still use the old eight-Site count, superseded by #78.
Other child issue bodies retain their previous acceptance requirements.

For #77 the maintainer approved keeping separate datasets for now and fixture-only
shared-model/migration work while restricted-gateway feasibility is investigated.
The live #77 comment requires one authoritative gateway for future Studio, Signal
and migration writes. Only named break-glass technical maintainers may bypass it
for service recovery, with audit and post-action review. No paid plan or live CMS
consolidation is approved. Account roles/token permissions and the working editor
workflow remain unverified.

The user reports creating the Cloudflare Worker `branch-agnostic-test`, plans NSW,
SA, NT and ACT domains, and identifies `redesign/brand-direction` as the production
branch. These are session-provided facts, not a verified Worker deployment or DNS
inspection. Treat the test Worker as a separate candidate target; do not replace
existing VIC/QLD Workers or push a production-triggering branch without the exact
candidate checks and approval. Do not infer new datasets, themes, contact details,
editorial content or integration credentials from the hostname roster.

Before additional full CMS-backed Sites can render, obtain their approved CMS source strategy, Site
presentation/contact/navigation data, preview routing, content ownership and
publication scope. Before an external test deployment, verify the exact test Worker
account/config/bindings, any attached routes, access restrictions and rollback
target. Planned custom domains are not permission to change production DNS or
serve another Site's fallback content.

## Isolated landing Worker build and deployment

`npm run build:test` now bundles a small landing-only Worker with esbuild into
`dist-branch-agnostic-test/server/worker.mjs` and writes the explicit deployment
config `dist-branch-agnostic-test/server/wrangler.json`. The generated config names
only `branch-agnostic-test`: it declares no routes, assets, KV bindings, secrets or
CMS credentials. The bundle imports the shared immutable landing registry and
response renderer, without the Astro app, VIC/QLD content services or integrations.
It serves NSW/SA/NT/ACT coming-soon contexts; other hosts, including VIC, QLD and
TAS, return 404. This artifact must never replace either existing branch Worker.

The exact dashboard build command is `npm run build:test`; deploy command is
`npx wrangler deploy --config ./dist-branch-agnostic-test/server/wrangler.json`.
Review the generated config and artifact HTTP checks before deployment. The
separate `npm run build:test:app` retains the larger Astro test build for app
verification; it is not the selected landing artifact. Its source TOML preserves
the previously verified isolated SESSION ID for that optional app build.

Without explicit target selection, the Astro adapter and legacy deploy commands
still select the VIC or QLD Branch config. `npm run deploy` rejects an explicit
test target before any command executes. Do not use that command, root
`wrangler.toml`, automatic `.wrangler/deploy` discovery, or a Worker-name override
for the landing Worker. Keep dashboard build/deploy on the same reviewed candidate.

## Verified test Worker settings and narrowed objective

The current objective is distinct deployed NSW and NT coming-soon pages. The
parent verified dashboard Git settings: repository `fusion/reclaim`, production
branch `redesign/brand-direction`, existing build `npm run build`, deploy
`npx wrangler deploy`, and no environment variables. Those commands must be
changed to the explicit landing build and config commands above.

The existing test SESSION namespace is `1956f688a05a46c29541beb08f42e10c`; the
landing Worker needs no SESSION binding. The dashboard also had the legacy VIC
`NATIONBUILDER_TOKENS` binding. Neither belongs in this generated landing config.
Removing a Worker binding must not delete either namespace or alter VIC/QLD.
No live binding changes are performed by this documentation update; review actual
deployment binding reconciliation before claiming isolation.

The dashboard domain list includes TAS; the narrowed task does not authorize
activating TAS or inventing its CMS/presentation. Validate NSW and NT deployed
hosts separately, preserve a test rollback artifact, and leave VIC/QLD services
and datasets unchanged. New branch landings contain no CMS content.

## Final landing artifact verification (12 October 2026)

The native esbuild build passed and produced a roughly 3.6 KB Worker. Focused landing tests passed 12 cases; independent execution of the actual bundle passed 65 checks. Scoped TypeScript checking and `git diff --check` passed. A local Cloudflare Wrangler runtime, using its supported 2025-01-29 compatibility baseline, passed actual HTTP checks for all four state hosts, distinct identity, HEAD, unavailable-route 404, unsupported-method 405 and root-only discovery. The source configuration retains compatibility date 2026-10-11; the local runtime baseline difference is a verification limitation.

The broader Astro build and full repository suite were canceled under severe host memory/swap pressure and are not claimed passing. These results validate the narrowed landing artifact; deployed host/browser checks remain required. No live CMS changes or VIC/QLD deployment changes were performed.
