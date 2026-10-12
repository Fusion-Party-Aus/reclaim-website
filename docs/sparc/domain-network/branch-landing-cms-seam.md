# Branch landing content seam

The native Worker remains CMS-free. `BranchLandingContent` is the renderer's interface: resolved Site ID, National-owned shared base and that branch's city photography. `getStaticBranchLandingContent(siteId)` is the current adapter. A test fixture supplies a second adapter through the same renderer interface, proving that presentation does not require static records.

The renderer accepts the DTO as its fourth argument and validates Site ID, explicit National ownership/scope, destination hosts and safe crop coordinates before producing HTML. It does no network I/O. Host resolution and canonical identity remain in the trusted registry, outside editable content. GET/HEAD root rendering uses content; 404/405/discovery responses do not load it.

A later CMS adapter belongs at content acquisition in the Worker: resolve the actual host, await published content for that Site, validate/decode it into `BranchLandingContent`, then pass it to `createLandingResponse`. No renderer rewrite or CMS client import in presentation is needed. Introducing CMS image hosts also requires an explicit CSP/destination policy update; arbitrary editable asset hosts are not allowed by the current interface.

Future adapters must preserve published-only reads, site scoping, fail-closed ownership, and preview separation. Do not infer a VIC/QLD fallback, share credentials, create datasets or seed content as part of adding an adapter. Existing separate VIC/QLD datasets remain untouched. Shared CMS consolidation, editor access and cutover/rollback remain staged work under #77.

Shared National policy areas include image metadata (source, alt, photographer and credit URL); these pass the same HTTPS host checks as the city photograph. Branch branding is deliberately outside the editable content DTO: it comes from the approved trusted Site registry. A future CMS adapter can change editorial content without changing host identity or brand configuration.

Latest maintainer direction supersedes the earlier QLD exclusion: Queensland now uses this Worker with the shared approved base, Brisbane photograph and maroon accent. Only VIC remains on its existing content deployment. The legacy QLD CMS record/dataset is retained for rollback; no dataset wipe or live consolidation is included.
