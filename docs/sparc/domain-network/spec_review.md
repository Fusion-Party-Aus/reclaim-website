# Spec review against 236a75e

Reviewed the uncommitted implementation and staged files against epic #75 and
children #76–#87. This is staged progress, not an all-epic completion assessment.

1. **Discovery routability defect (#83):** “Every public discovery endpoint queries
   content through the Site-bound interface.” `content-sitemap.xml.ts` emits
   `/investigations` regardless of its feature flag, omits enabled investigation
   detail slugs, and includes archived electorate detail paths even though the
   current detail renderer hides archived entries. Emit only routable Site content.

2. **Staged validation mismatch (#82):** “Required-reference integrity is checked
   on parent publication.” `validatePublicationChange` checks direct child
   publication/scope, while `selectPublishedForSite` recursively rejects children
   whose own required references are unavailable. Parent publication can therefore
   pass even though the independent read guard drops the parent. Align graph
   availability semantics before connecting a writer or shared read adapter.

3. **Preview integration pending (#80):** “Draft access … only through the separate
   preview interface” and preview responses “private/no-store, noindex.” At this
   review snapshot, handshake/session/draft-service modules and entry/exit routes
   exist, but middleware still constructs only public context. The parent is
   implementing the authenticated middleware and Exit Preview UI; verify completed
   HTTP behavior before considering this slice finished.

**Static/output audit:** No conflicting robots, sitemap, manifest or service-worker
files remain under `public/`. Runtime endpoints replace fixed-origin build
integrations; brand icons deliberately prerender collision-safe Site paths.
Existing ignored `dist/client` still contains historical fixed-VIC discovery and
manifest files. That stale directory is not evidence of current output; a clean
production build and host-level checks must prove no static shadowing remains.

**Intentional gates:** #76 retains a presentation compatibility facade; public
routes now use request-bound context (#79). #81 fails closed without approved
Site-specific credentials and atomic-state bindings; live provider verification
remains required. #82 schema/read helpers and #85 migration planner are staged,
unregistered and do not change legacy dataset reads. #77 writer approval, #84
supported writer integration, asset transport/live migration, #86 remaining Site
activation/content and #87 quota/rollback/cutover evidence remain gated. The
approved nine-Site roster intentionally supersedes the original eight. No
unrequested production activation or destructive migration was found.

**Follow-up:** Findings 1 and 2 were subsequently fixed with failing regression
checks first: sitemap routability now follows Site flags/live electorates;
publication and public reads share recursive graph availability. Required-reference
cycles conservatively fail closed pending approved schema-specific policy.
