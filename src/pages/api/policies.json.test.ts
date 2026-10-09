// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }))
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch }) }))
vi.mock('@sanity/image-url', () => ({ default: () => ({ image: vi.fn() }) }))
import { GET } from './policies.json'

interface TestPolicy {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  summary: string
  status?: 'adopted' | 'draft' | 'archived'
  topics?: string[]
  sourceUrl?: string
  references?: Array<{ _key?: string; title: string; url: string }>
  _updatedAt?: string
}

const adoptedPolicy: TestPolicy = {
  _id: 'policy-adopted',
  _type: 'policy',
  title: 'Adopted policy',
  slug: { current: 'adopted-policy' },
  summary: 'An adopted policy.',
  status: 'adopted',
  topics: ['housing'],
  sourceUrl: 'https://github.com/fusion-party/platform/blob/main/housing.md',
  references: [{ _key: 'ref-1', title: 'Report', url: 'https://example.org/report' }],
  _updatedAt: '2026-10-01T00:00:00Z',
}

const legacyPolicy: TestPolicy = {
  _id: 'policy-legacy',
  _type: 'policy',
  title: 'Legacy policy without status',
  slug: { current: 'legacy-policy' },
  summary: 'A policy stored before the status field existed.',
}

const draftPolicy: TestPolicy = {
  _id: 'policy-draft',
  _type: 'policy',
  title: 'Draft policy',
  slug: { current: 'draft-policy' },
  summary: 'Should not be published.',
  status: 'draft',
}

const policies: TestPolicy[] = [adoptedPolicy, legacyPolicy, draftPolicy]

async function fetchPolicies() {
  fetch.mockImplementation((query: string) => {
    if (query.includes('"manifestoPage"')) return Promise.resolve(null)
    if (query.includes('"researchResource"')) return Promise.resolve([])
    if (query.includes('"policy"')) {
      const adoptedOnly = query.includes("coalesce(status, 'adopted') == 'adopted'")
      return Promise.resolve(
        adoptedOnly
          ? policies.filter((policy) => (policy.status ?? 'adopted') === 'adopted')
          : policies
      )
    }
    return Promise.resolve(null)
  })
  const response = await GET({} as Parameters<typeof GET>[0])
  return { response, body: JSON.parse(await response.text()) }
}

describe('policy API', () => {
  it('exposes status, topics, source_url and references with sensible defaults', async () => {
    const { body } = await fetchPolicies()
    const byId = Object.fromEntries(body.policies.map((policy: any) => [policy.id, policy]))

    expect(byId['policy-adopted']).toMatchObject({
      status: 'adopted',
      topics: ['housing'],
      source_url: 'https://github.com/fusion-party/platform/blob/main/housing.md',
      references: [{ title: 'Report', url: 'https://example.org/report' }],
    })
    expect(byId['policy-legacy']).toMatchObject({
      status: 'adopted',
      topics: [],
      source_url: 'https://vic.fusionparty.org.au/policies/legacy-policy',
      references: [],
    })
  })

  it('returns adopted policies by default and excludes drafts', async () => {
    const { body } = await fetchPolicies()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("coalesce(status, 'adopted')"))
    expect(body.policy_count).toBe(2)
    expect(body.policies.map((policy: any) => policy.id)).toEqual([
      'policy-adopted',
      'policy-legacy',
    ])
    expect(body.policies).not.toContainEqual(expect.objectContaining({ id: 'policy-draft' }))
  })

  it('keeps the existing fields and response headers', async () => {
    const { response, body } = await fetchPolicies()
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(body.policies[0]).toMatchObject({
      title: 'Adopted policy',
      slug: 'adopted-policy',
      canonical_url: 'https://vic.fusionparty.org.au/policies/adopted-policy',
      summary: 'An adopted policy.',
      authority: { publisher: 'Fusion Party Victoria', adopted_policy: true },
      updated_at: '2026-10-01T00:00:00Z',
      supporting_research: [],
    })
  })
})
