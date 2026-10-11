import { describe, expect, it } from 'vitest'
import { resolveHomeContent, selectHomePolicies } from './content'
import { createMockPolicy } from '../../test/helpers'

const branch = {
  label: 'Fusion Test State',
  state: 'Test State',
  tagline: 'Our future',
  description: 'State description',
}

describe('shared homepage content', () => {
  it('starts a branch without invented campaign data or another state’s content', () => {
    const home = resolveHomeContent(null, branch)
    expect(home.hero.title).toBe(branch.tagline)
    expect(home.hero.eyebrow).toBe(branch.label)
    expect(home.movementMetrics).toEqual([])
    expect(home.hero.stats).toEqual([])
    expect(home.joinCards).toEqual([])
  })

  it('supports campaign and participation content together without a branch selector', () => {
    const home = resolveHomeContent(
      {
        hero: { title: 'Our campaign', showCTA: false },
        movementMetrics: [{ label: 'Members', current: 14, goal: 100 }],
        participatoryResources: [{ label: 'Petitions', url: 'https://example.org/petitions' }],
        participatoryStages: [{ title: 'Review', description: 'Review the evidence' }],
      },
      branch
    )
    expect(home.hero.title).toBe('Our campaign')
    expect(home.hero.showCTA).toBe(false)
    expect(home.movementMetrics[0].current).toBe(14)
    expect(home.resources).toHaveLength(1)
    expect(home.stages).toHaveLength(1)
  })

  it('omits metrics with invalid goals while retaining real zero counts', () => {
    const home = resolveHomeContent(
      {
        movementMetrics: [
          { label: 'Valid', current: 0, goal: 100 },
          { label: 'Invalid', current: 10, goal: 0 },
          { label: 'Invalid', current: -2, goal: 100 },
        ],
      },
      branch
    )
    expect(home.movementMetrics.map((metric) => metric.label)).toEqual(['Valid'])
  })

  it('does not expose draft or foreign featured policies as adopted policies', () => {
    const adopted = createMockPolicy({ _id: 'adopted', status: 'adopted' })
    const draft = createMockPolicy({ _id: 'draft', status: 'draft' })
    const foreign = createMockPolicy({ _id: 'foreign', status: 'adopted' })
    expect(selectHomePolicies([adopted, draft], [draft, foreign])).toEqual([adopted])
  })

  it('accepts empty CMS reference lists and deleted references', () => {
    const adopted = createMockPolicy({ _id: 'adopted', status: 'adopted' })
    expect(selectHomePolicies([adopted], null)).toEqual([adopted])
    expect(selectHomePolicies([adopted], [null])).toEqual([adopted])
  })

  it('preserves featured policy ordering using the current branch’s adopted documents', () => {
    const first = createMockPolicy({ _id: 'first', status: 'adopted' })
    const second = createMockPolicy({ _id: 'second', status: 'adopted' })
    expect(selectHomePolicies([first, second], [second, first])).toEqual([second, first])
  })
})
