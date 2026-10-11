# Shared CMS access and quota evidence

Checked 11 October 2026. No account, dataset, role, content or DNS mutations performed.

## Live project evidence

Connected Sanity reports project `qwl3f8jb` (`fusion`), organisation `oSW8kMPvM` (`fusion-party`), 11 project members, and exactly two public datasets: `production` and `qld`. The connector does not expose the paid plan, assigned roles, token permissions, billing usage, request volume or monthly bandwidth. Those facts remain unverified.

Read-only raw-perspective aggregate queries (no document bodies or personal data retrieved):

| Dataset    | Non-asset documents, including drafts | Image assets | File assets | Stored asset bytes |
| ---------- | ------------------------------------: | -----------: | ----------: | -----------------: |
| production |                                   327 |           22 |           0 |         42,334,694 |
| qld        |                                    40 |            0 |           0 |                  0 |

Asset-byte sums measure document-reported sizes, not billing usage, CDN traffic or image transformation bandwidth. These counts alone cannot establish nine-site free-tier headroom.

## Published plan constraints

[Sanity pricing](https://www.sanity.io/pricing) lists Free with 20 seats, two public datasets, 10,000 documents, 250,000 API requests/month, 1,000,000 CDN requests/month, 100 GB assets and 100 GB bandwidth/month. Check the actual account dashboard before relying on these entitlements. [Roles and permissions](https://www.sanity.io/docs/content-lake/roles-concepts) lists Free Administrator/Viewer roles; custom roles are Enterprise. Broad editor/API credentials can bypass Studio validation. Studio filters are not access control.

Both existing dataset slots are occupied. A third shared destination cannot be assumed available within Free while preserving both sources. No source dataset should be deleted to make space. Options requiring maintainer approval: retain existing datasets for the first hostname-routing milestone; obtain an approved destination/project with verified entitlements and backups; or select another explicitly reviewed migration arrangement. No paid upgrade is selected.

## Recorded writer policy and feasibility still required (#77)

A supported publishing gateway must validate ownership, explicit site publication scope and required references for Studio, Signal and migration writes. Routine editors must lack an independent bypass credential. Only named break-glass technical maintainers may bypass validation for service recovery, with audit and post-action review. On Free, direct Administrator access cannot provide branch-restricted ownership enforcement. A read-only Studio plus authenticated gateway is a possible separate design, but its authentication, role assignments, draft-write experience and operations must be approved and tested before use. No weakening to UI-only validation is accepted.

The maintainer has approved separate datasets for now, fixture-only shared-model/migration work and a restricted-gateway feasibility investigation. The [recorded #77 policy](https://github.com/Fusion-Party-Aus/reclaim-website/issues/77#issuecomment-6108198712) requires a single authoritative gateway for future routine writes. Actual roles/token permissions, bypass prevention and a working editor workflow must still be proved before shared-dataset cutover. No paid plan or live consolidation is approved. Current production reads remain on the separate source datasets.

## Approved hostname roster (#78)

User confirmed nine Sites, no aliases: `national` at `fusionparty.org.au`; `vic`, `nsw`, `sa`, `qld`, `tas`, `wa`, `nt`, `act` at the matching `<siteId>.fusionparty.org.au`. National has no Branch association; each branch Site associates with its matching Branch. The refreshed #75 and #78 now record this nine-Site count; #78 has all decision acceptance boxes checked while remaining open. #86/#87 retain stale eight-Site wording, superseded by #78. Only existing VIC/QLD hosts are active in the implementation registry; all other hosts await content and preview readiness.
