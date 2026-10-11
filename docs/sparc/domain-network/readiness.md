# Domain network readiness

This is staged implementation for epic #75, not a production cutover approval.

## Preserved state

VIC reads `qwl3f8jb/production`; QLD reads `qwl3f8jb/qld`. Existing Worker configurations and dataset contents are unchanged. The pre-existing `studio/sanity.config.ts` research-navigation edit belongs to the user and must be excluded from feature commits unless separately authorised.

Local Astro development requires an explicit registered Site, for example `SITE_ID=vic npm run dev` or `SITE_ID=qld npm run dev`; the command does not silently select VIC.

## Child issue status

| Issue | Local progress                                                                        | Remaining acceptance gates                                                                                                           |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| #76   | Host registry, immutable request context, homepage shell, explicit local/CI selection | Public presentation still uses the validated legacy manifest adapter; production artifact verification                               |
| #77   | Separate-dataset operation approved for now; future gateway policy recorded           | Restricted-gateway feasibility and working editor flow; actual account roles/token/plan audit; no live consolidation                 |
| #78   | User-approved nine-Site roster, no aliases, recorded separately                       | Live #75/#78 now record nine; #86/#87 still need count reconciliation; inactive Sites stay inactive                                  |
| #79   | Astro pages/components, APIs, feeds use request-bound public content                  | Final full regression and production Worker verification                                                                             |
| #80   | Supported handshake and signed Site/browser preview staged                            | Audited atomic replay store, preview secrets/configuration and real authenticated preview acceptance                                 |
| #81   | Site integrations, canonical OAuth, state/session rejection, token isolation          | Audited atomic OAuth state service and binding; real provider preview acceptance                                                     |
| #82   | Pure shared publication validator, scoped read factory, schema field helper           | Actual schema reference-path adapter, real shared read adapter, Studio registration; no shared-read switch                           |
| #83   | Runtime discovery, per-Site SEO/PWA, icons and OG cards                               | Production artifact and preview/offline verification                                                                                 |
| #84   | Shared validation module exists                                                       | Approved routine writer access; authoritative Studio/Signal/migration adapters                                                       |
| #85   | Non-destructive offline migration planner and fixture reconciliation                  | Fixture-only shared-model/migration work approved now; live backups/destination/asset transport/reconciliation/rollback remain gated |
| #86   | Inactive approved roster recorded                                                     | Approved National/remaining content, themes, singleton data and preview hosts                                                        |
| #87   | VIC/QLD live-content local HTTP/browser checks and reports                            | Full nine-Site previews, actual billing/request/bandwidth evidence, real migration/restore and production approval                   |

## Release gates

Do not push a deployment-triggering branch, merge, deploy, change DNS or switch live CMS reads until the exact candidate has passed the required checks and the maintainer approves the concrete cutover. Never delete an old dataset or Worker to obtain capacity. Keep current source datasets and deployments available through preview verification and the agreed rollback window.

Use `integration_report.md`, `security_audit_report.md`, `access-and-quotas.md`, `integrations.md`, `migration.md` and review reports for evidence and limits. Pending checks are not passes. Local Node-adapter E2E does not prove Cloudflare Worker deployment parity.

The offline planner emits review files only; it does not apply CMS mutations. The shared publication schema/read helpers are deliberately unregistered. New production hostnames are deliberately not active. Missing atomic state bindings fail OAuth/preview clearly; that dependency must be resolved before deploying these handlers.

## Refreshed maintainer direction

Live issues #75–#87 were re-read after the 11 October update. #75 now requests
nine Sites and #78 records the complete approved no-alias roster with all six
acceptance boxes checked. #78 remains open; a completed roster decision does not
activate hosts. #86/#87 still use the old eight-Site count, superseded by #78.
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

Before new Sites can render, obtain their approved CMS source strategy, Site
presentation/contact/navigation data, preview routing, content ownership and
publication scope. Before an external test deployment, verify the exact test Worker
account/config/bindings, any attached routes, access restrictions and rollback
target. Planned custom domains are not permission to change production DNS or
serve another Site's fallback content.

## Test Worker target audit and proposed isolation

The current production Astro adapter derives `configPath` from the legacy Branch
resolver. `npm run deploy` defaults to `wrangler.toml`/`fusion-website` and the VIC
token namespace; `BRANCH=qld` selects `wrangler.qld.toml`/`fusion-website-qld` and
the QLD session namespace. Neither selects the user-created test Worker.
`WORKER_NAME=branch-agnostic-test` is insufficient: the returned name override is
not passed to the adapter or Wrangler deploy invocation, which consume the config
path. `SITE_ID` selects runtime preview identity, not a Worker deployment target.

Proposed, not yet implemented: an explicit allowlisted
`DEPLOY_TARGET=branch-agnostic-test` selects only a dedicated
`wrangler.branch-agnostic-test.toml`, exact Worker name `branch-agnostic-test`, and
separate `dist-branch-agnostic-test` output. A dedicated test command should build,
validate and deploy that exact generated configuration, refusing inherited
production route declarations, legacy KV IDs, or a different Worker name. Leave
legacy Branch configs and default production commands unchanged. Use dedicated
test bindings where required; do not copy token/session namespaces or secrets.
Review dry-run/generated output before any remote operation and preserve a test
rollback artifact. Confirm the Cloudflare account and existing dashboard Worker's
routes/settings before deploying; no test configuration exists merely because
the dashboard Worker exists.

In production runtime mode the generic workers.dev hostname is intentionally
unknown and returns 404. An explicitly configured `preview` runtime with
`SITE_ID=vic` or `SITE_ID=qld` permits a pinned single-Site smoke test on the test
Worker; it does not prove simultaneous hostname-based network isolation. Do not
attach planned new branch domains to such a pinned preview. Multi-host Worker
proof needs separately approved test-host routing and complete corresponding
Site configuration/content. New hostnames must never silently borrow VIC/QLD
identity, datasets or integration credentials.
