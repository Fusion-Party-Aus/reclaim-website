# Standards review

Reviewed the current tracked diff and new files against starting commit `236a75e`, using `CONTRIBUTING.md` coding/testing/API-documentation requirements and the Matt Pocock Fowler smell baseline. `AGENTS.md` contains page summaries rather than additional coding rules. Security review also considered SPARC's credential and PII controls. Tool-enforced formatting/type diagnostics are excluded.

## Finding

**Medium — raw query escape hatch in `src/lib/content-service.ts`.** The returned service includes `query: <T = any>(query: string, params?: Record<string, unknown>) => client.fetch<T>(query, params)`. `CONTRIBUTING.md`, “TypeScript”, says “Avoid `any` types” and “Use typed Sanity query functions.” No remaining production caller of `content.query` was found. This exposes arbitrary GROQ through a service otherwise designed around named, typed methods, weakening the boundary where future publication constraints belong. Remove the unused property. This is also possible Speculative Generality, a judgement call rather than a separate hard violation.

No further material standards/security finding was identified in the reviewed snapshot. Host resolution fails closed, public runtime data excludes direct credentials/bindings, named queries bind a request-owned source, and OAuth/preview helpers require site-specific configuration with explicit fail-closed responses. PII write paths were reviewed statically; no external writes were performed.

This is a review of the snapshot before final preview middleware activation, not proof of production runtime or infrastructure readiness. Full automated checks and preview activation verification remain separate release evidence.
