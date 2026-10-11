# Domain network security audit

Date: 11 October 2026
Scope: initial VIC/QLD site registry, request middleware, request-scoped public content service and Astro consumer conversion. This report does not certify deployment, National content migration, or authenticated integrations.

## Findings

No critical or high-severity vulnerability was identified in the reviewed request-selection and published-content changes. Production resolution uses the request URL hostname and exact registered hostnames. It ignores SITE_ID overrides, query parameters and forwarded headers. Unknown production hosts receive a non-cacheable 404; configuration failures receive a non-cacheable generic 500 without internal details.

The registry contains only approved existing VIC/QLD origins. Its validator rejects duplicate hosts, malformed identities, inconsistent canonical/CMS presentation, unknown runtime fields and credentials in the CMS object. Registry records and nested values are frozen. Review tightened project/dataset string validation and branch/presentation consistency.

Each request creates its own public Sanity client through a private closure. Project and dataset come from the selected Site, perspective is always published, CDN caching is disabled, and no token is supplied. There is no mutable active-site global or client exposed to pages. Generic lookup values use GROQ parameters; dynamic field identifiers are restricted to simple names. Bespoke `content.query` remains an internal application API; callers must not interpolate untrusted input.

Astro route and component consumers now read deployment and content from request locals. FAQ and electorate detail pages no longer prerender from a single dataset. Archived electorates remain inaccessible through the current-electorate route. Browser developer-message identity derives from the rendered HTML theme rather than a build-selected module.

## Operational conditions and remaining review

- Development and preview require an explicit registered SITE_ID. Production build/runtime configuration must keep SITE_RUNTIME_MODE=production. The prerender exception uses Astro's internal isPrerendered flag and still requires explicit SITE_ID; no request header can activate it.
- Registry presentation is adapted from the existing branch manifest. This preserves existing identity but is a transitional source-of-truth dependency, not complete separation of runtime presentation from operational tooling.
- Legacy `src/lib/sanity.ts` and `src/lib/investigations.ts` remain compatibility modules. Public Astro imports were removed; final API and integration review must ensure no public request handler bypasses the scoped service.
- Existing OAuth endpoints, write integrations and persistent bindings are outside this conversion. Before any shared deployment, review host authorization, credential scope and session/KV isolation separately. No OAuth grant or live write was performed during this audit.
- Browser/offline/cache behavior and generated build-time discovery files require artifact and end-to-end validation before deployment. Unit tests alone cannot certify those boundaries.

## Verification

- Initial baseline: 13 test files and 203 tests passed for deployment, branch contracts, Sanity, sitemap and service-worker behavior.
- Registry contract passed after validation hardening.
- Initial request-context contract passed: isolated clients, published perspective, no exposed client/token and failure propagation.
- Source audit found no imports from the global deployment, Sanity or investigation modules, no client.fetch calls, and no getStaticPaths declarations in Astro files after conversion.
- Site output regression passed both VIC/QLD output tests. The combined run exited with a Vitest forks worker startup timeout before the expanded context suite could run; its same-slug additions remain unverified by this audit. Owned-file lint is tracked by the orchestrator; end-to-end/build results must be added to the integration report.

No environment-file contents were read, credentials added, persistent resources changed, Git operations performed, or production changes made by this audit.

## Integration and preview follow-up

Site integration credential selection now has explicit VIC legacy and QLD-specific mappings. QLD never borrows VIC's credentials or bindings. Token storage is namespaced by Site and provider and the former shared module cache is removed. Legacy token-key reads are VIC-only. OAuth state and preview-handshake replay protection use explicitly separate atomic service boundaries, not KV get/delete. Unprovisioned atomic backends disable the corresponding entrypoints; neither service was provisioned during this work.

OAuth flow tests cover correct flow, missing/expired/replayed state, wrong Site/browser, concurrency and consume-before-exchange behavior. Integration route tests verify alias start canonicalization, alias callback rejection and unset QLD integration failure. Existing providers' successful token/PII flows still need approved preview verification. OAuth refresh-token rotation remains subject to concurrent distributed refresh and is not claimed to be transactional.

Authenticated preview uses supported Sanity secret validation, private time-limited handshake records, an atomic replay claim and signed Site/browser cookies. Public service configuration remains fixed to published. The service-worker install path was found to bypass the existing fetch privacy check; a behavioral VM test reproduced private HTML being precached. Installation now shares the private/no-store/noindex response guard, and cache generation v2 invalidates the previous generation. Browser cache and authenticated middleware verification remain recorded separately by the orchestrator.
