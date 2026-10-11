import { approvedSiteRoster } from '../../config/site-roster.mjs'

export type PublicationOwner = { type: 'national' } | { type: 'branch'; branchId: string }
/** Adapter-extracted graph edge, not an additional Sanity content field. */
export interface PublicationReference {
  /** Schema-declared path, including nested array keys where applicable. */
  key: string
  targetId: string
  required: boolean
}
/** Normalized graph node: adapters must declare required/optional reference paths from schemas. */
export interface PublicationDocument {
  id: string
  owner?: PublicationOwner
  published: boolean
  siteIds: string[]
  singleton?: boolean
  slug?: string
  references?: PublicationReference[]
}
export interface PublicationIssue {
  code: string
  documentId: string
  referencePath?: string
}

export const approvedSiteIds: readonly string[] = Object.freeze(Object.keys(approvedSiteRoster))
export function validOwner(owner: unknown): owner is PublicationOwner {
  if (!owner || typeof owner !== 'object') return false
  const value = owner as Record<string, unknown>
  return value.type === 'national'
    ? Object.keys(value).length === 1
    : value.type === 'branch' &&
        typeof value.branchId === 'string' &&
        value.branchId !== 'national' &&
        approvedSiteIds.includes(value.branchId) &&
        Object.keys(value).every((key) => key === 'type' || key === 'branchId')
}
export function validScope(doc: PublicationDocument): boolean {
  return (
    Array.isArray(doc.siteIds) &&
    doc.siteIds.length > 0 &&
    new Set(doc.siteIds).size === doc.siteIds.length &&
    doc.siteIds.every((siteId) => approvedSiteIds.includes(siteId)) &&
    (!doc.singleton || doc.siteIds.length === 1)
  )
}
export function availableOnSite(doc: PublicationDocument | undefined, siteId: string): boolean {
  return (
    !!doc &&
    doc.published === true &&
    validOwner(doc.owner) &&
    validScope(doc) &&
    doc.siteIds.includes(siteId)
  )
}

/** Shared availability semantics for publishing and public reads. Required cycles fail closed
 * conservatively until schema-specific cycle policy is approved; optional cycles do not block.
 */
export function graphAvailableOnSite(
  graph: ReadonlyMap<string, PublicationDocument>,
  id: string,
  siteId: string,
  visiting: ReadonlySet<string> = new Set()
): boolean {
  const doc = graph.get(id)
  if (!availableOnSite(doc, siteId) || visiting.has(id)) return false
  const next = new Set(visiting).add(id)
  return (doc!.references ?? []).every(
    (ref) => !ref.required || graphAvailableOnSite(graph, ref.targetId, siteId, next)
  )
}

/** Validates a proposed graph change; callers must load the complete affected dependency graph. */
export function validatePublicationChange({
  before,
  after,
  documents,
}: {
  before?: PublicationDocument
  after: PublicationDocument | null
  documents: readonly PublicationDocument[]
}): PublicationIssue[] {
  const issues: PublicationIssue[] = []
  const graph = new Map(documents.map((doc) => [doc.id, doc]))
  if (before) graph.delete(before.id)
  if (after) graph.set(after.id, after)
  if (after?.published) {
    if (!validOwner(after.owner)) issues.push({ code: 'invalid-owner', documentId: after.id })
    if (!validScope(after)) issues.push({ code: 'invalid-scope', documentId: after.id })
    if (after.singleton && after.siteIds?.length !== 1)
      issues.push({ code: 'singleton-scope', documentId: after.id })
    for (const ref of after.references ?? []) {
      if (
        ref.required &&
        (!Array.isArray(after.siteIds) ||
          !after.siteIds.every((siteId) => graphAvailableOnSite(graph, ref.targetId, siteId)))
      )
        issues.push({
          code: 'required-reference-unavailable',
          documentId: after.id,
          referencePath: ref.key,
        })
    }
  }
  if (before) {
    for (const parent of graph.values()) {
      if (!parent.published) continue
      for (const ref of parent.references ?? []) {
        if (
          ref.required &&
          ref.targetId === before.id &&
          !parent.siteIds.every((siteId) => graphAvailableOnSite(graph, ref.targetId, siteId))
        )
          issues.push({
            code: 'published-parent-invalidated',
            documentId: parent.id,
            referencePath: ref.key,
          })
      }
    }
  }
  return issues
}
