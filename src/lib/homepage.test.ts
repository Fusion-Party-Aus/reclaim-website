import { describe, it, expect } from 'vitest'
import { selectPolicies, selectResearch } from './homepage'
import type { Policy, ResearchResource } from '@/types/sanity'
const policy = (id: string, status?: Policy['status']) =>
  ({ _id: id, title: id, slug: { current: id }, status }) as Policy
const research = (id: string, date: string, featured = false) =>
  ({ _id: id, slug: { current: id }, publishedAt: date, featured }) as ResearchResource

describe('homepage editorial selection', () => {
  it('keeps curation order, fills gaps and never presents draft or archived policies as adopted', () => {
    expect(
      selectPolicies(
        [policy('a'), policy('draft', 'draft'), policy('a')],
        [policy('archived', 'archived'), policy('b'), policy('c'), policy('d')]
      ).map((p) => p._id)
    ).toEqual(['a', 'b', 'c'])
  })
  it('handles broken references, absent slugs and empty collections', () => {
    expect(
      selectPolicies([null, { ...policy('bad'), slug: undefined }] as unknown as Policy[])
    ).toEqual([])
    expect(selectPolicies()).toEqual([])
    expect(selectResearch([])).toEqual([])
  })
  it('keeps featured research first, fills remaining places with recent published resources and excludes future dates', () => {
    const now = Date.parse('2026-11-03T00:00:00Z')
    expect(
      selectResearch(
        [
          research('recent', '2026-11-02'),
          research('featured', '2026-10-01', true),
          research('future', '2027-01-01', true),
          research('older', '2026-09-01'),
          research('invalid', 'invalid'),
        ],
        now
      ).map((r) => r._id)
    ).toEqual(['featured', 'recent', 'older'])
  })
})
