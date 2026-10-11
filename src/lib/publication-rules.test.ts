// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { validatePublicationChange, type PublicationDocument } from './publication-rules'
import { createScopedContentService, selectPublishedForSite } from './publication-read'

const doc = (id: string, extra: Partial<PublicationDocument> = {}): PublicationDocument => ({
  id,
  published: true,
  owner: { type: 'branch', branchId: 'vic' },
  siteIds: ['vic'],
  ...extra,
})
const validate = (
  after: PublicationDocument | null,
  documents: PublicationDocument[] = [],
  before?: PublicationDocument
) => validatePublicationChange({ before, after, documents })

describe('authoritative staged publication rules', () => {
  it('rejects missing owner without assuming National or deriving ownership from scope', () => {
    expect(validate(doc('parent', { owner: undefined }))).toContainEqual(
      expect.objectContaining({ code: 'invalid-owner' })
    )
    expect(validate(doc('parent', { owner: { type: 'national' }, siteIds: ['qld'] }))).toEqual([])
    expect(
      validate(doc('parent', { owner: { type: 'branch', branchId: 'unknown' } }))
    ).toContainEqual(expect.objectContaining({ code: 'invalid-owner' }))
  })
  it('allows incomplete drafts but requires explicit published scopes and singleton selection', () => {
    expect(validate(doc('draft', { published: false, owner: undefined, siteIds: [] }))).toEqual([])
    for (const siteIds of [[], ['unknown'], ['vic', 'vic']])
      expect(validate(doc('parent', { siteIds }))).toContainEqual(
        expect.objectContaining({ code: 'invalid-scope' })
      )
    expect(validate(doc('singleton', { singleton: true, siteIds: ['vic', 'qld'] }))).toContainEqual(
      expect.objectContaining({ code: 'singleton-scope' })
    )
  })
  it('requires every required child on every parent Site while optional references can be unavailable', () => {
    const parent = doc('parent', {
      siteIds: ['vic', 'qld'],
      references: [{ key: 'required', targetId: 'child', required: true }],
    })
    expect(validate(parent, [doc('child')])).toContainEqual(
      expect.objectContaining({ code: 'required-reference-unavailable' })
    )
    expect(validate(parent, [doc('child', { siteIds: ['vic', 'qld'] })])).toEqual([])
    expect(
      validate(
        doc('parent', { references: [{ key: 'optional', targetId: 'missing', required: false }] })
      )
    ).toEqual([])
  })
  it('rejects child deletion, unpublish and scope narrowing that break a published parent', () => {
    const child = doc('child', { siteIds: ['vic', 'qld'] })
    const parent = doc('parent', {
      siteIds: ['vic', 'qld'],
      references: [{ key: 'child', targetId: 'child', required: true }],
    })
    for (const next of [null, { ...child, published: false }, { ...child, siteIds: ['vic'] }])
      expect(validate(next, [parent, child], child)).toContainEqual(
        expect.objectContaining({ code: 'published-parent-invalidated' })
      )
    expect(validate(null, [{ ...parent, published: false }, child], child)).toEqual([])
  })
})

describe('independent fail-closed public selection', () => {
  it('isolates identical slugs and intentional sharing without treating ownership as visibility', () => {
    const docs = [
      doc('vic', { slug: 'same' }),
      doc('qld', { slug: 'same', siteIds: ['qld'] }),
      doc('shared', { owner: { type: 'national' }, siteIds: ['vic', 'qld'] }),
      doc('draft', { published: false }),
      doc('missing', { owner: undefined }),
    ]
    expect(selectPublishedForSite(docs, 'vic').map((x) => x.id)).toEqual(['vic', 'shared'])
    expect(selectPublishedForSite(docs, 'qld').map((x) => x.id)).toEqual(['qld', 'shared'])
    expect(selectPublishedForSite(docs, 'unknown')).toEqual([])
  })
  it('rejects parents with unavailable required references and removes unavailable optional references', () => {
    const required = doc('required', {
      references: [{ key: 'child', targetId: 'private', required: true }],
    })
    const optional = doc('optional', {
      references: [
        { key: 'hidden', targetId: 'private', required: false },
        { key: 'visible', targetId: 'public', required: false },
      ],
    })
    const docs = [required, optional, doc('private', { siteIds: ['qld'] }), doc('public')]
    const result = selectPublishedForSite(docs, 'vic')
    expect(result.map((x) => x.id)).toEqual(['optional', 'public'])
    expect(result[0].references).toEqual([{ key: 'visible', targetId: 'public', required: false }])
    expect(optional.references).toHaveLength(2)
  })
  it('fails closed through nested required references and reference cycles', () => {
    const docs = [
      doc('root', { references: [{ key: 'child', targetId: 'child', required: true }] }),
      doc('child', { references: [{ key: 'missing', targetId: 'missing', required: true }] }),
    ]
    expect(selectPublishedForSite(docs, 'vic')).toEqual([])
  })
})

describe('prospective shared content boundary', () => {
  it('binds list and duplicate-slug lookup to one Site and validates graph references', async () => {
    const graph = [
      doc('vic', { slug: 'same' }),
      doc('qld', { slug: 'same', siteIds: ['qld'] }),
      doc('broken', { references: [{ key: 'required', targetId: 'missing', required: true }] }),
    ]
    const adapter = { readGraph: async () => graph }
    const vic = createScopedContentService(adapter, 'vic')
    const qld = createScopedContentService(adapter, 'qld')
    const [left, right] = await Promise.all([vic.bySlug('same'), qld.bySlug('same')])
    expect(left?.id).toBe('vic')
    expect(right?.id).toBe('qld')
    expect((await vic.list()).map((x) => x.id)).toEqual(['vic'])
  })
})

it('fails closed for cyclic required references and same-Site duplicate slugs', async () => {
  const graph = [
    doc('a', { references: [{ key: 'b', targetId: 'b', required: true }] }),
    doc('b', { references: [{ key: 'a', targetId: 'a', required: true }] }),
  ]
  expect(selectPublishedForSite(graph, 'vic')).toEqual([])
  const service = createScopedContentService(
    { readGraph: async () => [doc('first', { slug: 'same' }), doc('second', { slug: 'same' })] },
    'vic'
  )
  expect(await service.bySlug('same')).toBeNull()
})

it('uses the same nested reference availability for publication and public reads', () => {
  const parent = doc('parent', {
    references: [{ key: 'child', targetId: 'child', required: true }],
  })
  for (const child of [
    doc('child', { owner: undefined }),
    doc('child', { references: [{ key: 'grandchild', targetId: 'grandchild', required: true }] }),
  ]) {
    const graph = [parent, child, doc('grandchild', { siteIds: ['qld'] })]
    expect(validate(parent, graph)).toContainEqual(
      expect.objectContaining({ code: 'required-reference-unavailable' })
    )
    expect(selectPublishedForSite(graph, 'vic').some((item) => item.id === parent.id)).toBe(false)
  }
})
