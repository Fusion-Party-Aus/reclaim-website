import {
  approvedSiteIds,
  graphAvailableOnSite,
  type PublicationDocument,
} from './publication-rules'

/** Independent read guard. Missing graph nodes fail closed, including nested required references. */
export function selectPublishedForSite(
  documents: readonly PublicationDocument[],
  siteId: string
): PublicationDocument[] {
  if (!approvedSiteIds.includes(siteId)) return []
  const graph = new Map(documents.map((doc) => [doc.id, doc]))
  const available = (id: string) => graphAvailableOnSite(graph, id, siteId)
  return documents
    .filter((doc) => available(doc.id))
    .map((doc) => ({
      ...doc,
      ...(doc.references
        ? {
            references: doc.references
              .filter((ref) => available(ref.targetId))
              .map((ref) => ({ ...ref })),
          }
        : {}),
    }))
}

export interface ScopedContentAdapter {
  /** Complete candidate + dependency graph; extract reference paths using actual schema declarations. */
  readGraph(): Promise<readonly PublicationDocument[]>
}
/** Prospective shared-dataset service, deliberately not wired into legacy runtime reads. */
export function createScopedContentService(adapter: ScopedContentAdapter, siteId: string) {
  if (!approvedSiteIds.includes(siteId)) throw new Error(`Unknown publication Site: ${siteId}`)
  async function list() {
    return selectPublishedForSite(await adapter.readGraph(), siteId)
  }
  return Object.freeze({
    list,
    async bySlug(slug: string) {
      const matches = (await list()).filter((doc) => doc.slug === slug)
      // Duplicate published slugs inside one Site are ambiguous and fail closed.
      return matches.length === 1 ? matches[0] : null
    },
  })
}
