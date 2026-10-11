# Authenticated Sanity preview

Public request content remains fixed to Sanity's published perspective without a token. Drafts use a separate server-constructed content service only after a signed Site/browser preview session is validated. No Origin-only trust, public environment token, or global draft toggle enables preview.

## Explicit Site settings

VIC uses the existing server-only SANITY_API_READ_TOKEN, plus VIC_PREVIEW_SESSION_SECRET (at least 32 bytes) and VIC_PREVIEW_STATE_STORE. QLD requires QLD_SANITY_API_READ_TOKEN, QLD_PREVIEW_SESSION_SECRET and QLD_PREVIEW_STATE_STORE. Unconfigured Sites never borrow VIC settings. The service binding must be separate from OAuth state storage.

POST /issue on the private atomic service receives `{state,siteId,session,expiresAt}` and returns 201 only for a durable insert-if-absent. The preview state key is a SHA-256 digest including purpose, Site and the Sanity handshake secret. It remains claimed for at least 61 minutes. The backend must reject duplicates atomically; a Workers KV read/write or process-local Map is not an acceptable implementation. No backend or binding was provisioned by this change; enable preview fails 503 until an audited service is configured.

## Handshake and sessions

Sanity Studio should generate the supported secret URL for `/api/preview/enable` using its presentation configuration. This work preserves the user's existing Studio changes and does not edit that configuration. Enable requires HTTPS and validates the URL with `validatePreviewUrl` from `@sanity/preview-url-secret` 4.0.7. It additionally requires the private secret document updated within the past hour. Indefinite share-access secrets are deliberately excluded from this short-lived, one-use handshake. Origin is never accepted as authentication.

A valid, atomically claimed handshake receives independent browser and HMAC session cookies, bound to one Site/browser for 30 minutes. Cookies are host-only, Secure and HttpOnly, using SameSite=None to support Studio's cross-origin presentation iframe. Safe relative return paths are accepted; external, protocol-relative and handshake URLs are discarded. No token or handshake secret is put into the redirected page URL. Replay is rejected before issuing cookies.

Authenticated HTML responses must receive private/no-store and noindex/nofollow headers. Public machine feeds, discovery files, assets and integration APIs continue using published content. The installed service worker excludes API/preview routes and responses marked private, no-store or noindex. Exit Preview submits a same-origin POST that clears both cookies; signed tokens also expire automatically. A stolen pair of cookies remains usable until expiry, so HTTPS, HttpOnly and the short lifetime are essential.

## Validation and remaining readiness

Unit and boundary tests cover valid and invalid secrets, Origin-only/missing handshake, replay, unavailable configuration, Site/browser binding, expiry, safe redirects and the separation of published/draft client configuration. Provider validation is faked in local unit tests; supported library/private-document validation still needs verification with an approved live preview.

Deployment readiness remains blocked by atomic replay service implementation/provisioning, per-Site credentials, Studio presentation setup and browser verification in an HTTPS approved preview. No live content cutover, Sanity token write, DNS change, deployment or paid resource selection was performed.
