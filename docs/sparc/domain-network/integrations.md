# Site integration isolation

Issue: https://github.com/Fusion-Party-Aus/reclaim-website/issues/81

## Configuration contract

Integration selection uses the trusted Site from request context. Credential names and bindings are explicit configuration, never derived from Host or request headers.

For VIC only, existing unprefixed NATIONBUILDER*SLUG, NATIONBUILDER_API_TOKEN, NATIONBUILDER_CLIENT_ID, NATIONBUILDER_CLIENT_SECRET and AEC_CRM_API_URL/AEC_CRM_API_KEY retain their current meaning. VIC_NATIONBUILDER_TOKENS may be supplied explicitly; the existing NATIONBUILDER_TOKENS binding remains the VIC-only legacy mapping. QLD requires its own QLD* prefixed credentials and QLD_NATIONBUILDER_TOKENS binding. Unconfigured QLD newsletter, membership and OAuth integrations fail closed. New Sites require an explicit mapping before use.

Tokens use a key containing Site identity and the configured provider slug. The old nationbuilder:tokens key is read only for explicitly selected VIC, then subsequent writes use the Site key. No in-memory token cache is shared across requests. This does not claim atomic refresh rotation across Worker instances; a later provider-token coordinator may be needed if concurrent refresh becomes operationally significant.

## OAuth atomic state boundary

OAuth cannot be enabled safely using Workers KV get/delete as a one-time state store. State consumption must atomically check Site, browser-session binding and expiration, then remove the record before the authorization-code exchange. OAuth fails clearly unless an explicitly configured atomic state service is bound for the Site.

The optional VIC_OAUTH_STATE_STORE / QLD_OAUTH_STATE_STORE HTTP Service Binding contract is:

- POST /issue: JSON `{state, siteId, session, expiresAt}`. Insert only if state does not exist. Respond 201 only after durable success; 409 for collision.
- POST /consume: JSON `{state, siteId, session, now}`. In one durable transaction, reject absent, expired, wrong-Site or wrong-session records, otherwise remove and return 200. Invalid/replayed input returns 409.
- No public route, logs containing state/session, or eventually consistent implementation is permitted.

The binding is an adapter boundary, not a deployed service. No storage product, paid resource, deployment or live binding was provisioned by this work. A separately reviewed implementation and provisioning are required before OAuth readiness can be claimed. Cloudflare supports private [HTTP Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/http/); a storage-backed service must provide the atomicity guarantees described by its storage implementation, for example [Durable Object storage transactions](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/).

Canonical OAuth start redirects approved aliases to the configured canonical start without forwarding their query string. Ordinary page visits remain unchanged. State and browser session use independent cryptographic random values and a ten-minute lifetime. The host-only browser cookie is Secure, HttpOnly and SameSite=Lax; callback clears it. Both authorization and code exchange always use the configured canonical callback. Missing state/session/code, expiration, replay, wrong Site and wrong session are rejected before exchange. A failed code exchange still consumes state.

## Data handling and readiness

Newsletter and membership requests carry email/name PII to the Site's configured external provider. Credentials and integration bindings remain server-only. Failure responses avoid upstream bodies and exception text that can expose credentials or PII. No live provider write or OAuth grant is part of local tests.

Readiness requires the Site's secrets, distinct token binding, canonical callback registration, and an audited atomic state service. Existing application tests use fakes; deployment and provider acceptance must be verified in an approved preview before production use.
