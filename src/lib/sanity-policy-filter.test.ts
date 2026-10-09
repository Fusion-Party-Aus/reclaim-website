// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }))
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch }) }))
vi.mock('@sanity/image-url', () => ({ default: () => ({ image: vi.fn() }) }))

import { getAdoptedPolicyBySlug, getPolicies } from './sanity'

beforeEach(() => fetch.mockReset())

describe('public policy filters', () => {
  it('preserves the thisTerm option when filtering to adopted policies', async () => {
    fetch.mockResolvedValue([])

    await getPolicies({ thisTerm: false, adoptedOnly: true })

    expect(fetch).toHaveBeenCalledWith(
      `*[_type == "policy" && thisTerm == false && coalesce(status, 'adopted') == 'adopted'] | order(_createdAt desc)`
    )
  })

  it('filters policy detail to adopted status and binds the slug as a parameter', async () => {
    const slug = 'policy" || _type == "private'
    fetch.mockResolvedValue(null)

    await getAdoptedPolicyBySlug(slug)

    expect(fetch).toHaveBeenCalledWith(
      `*[_type == "policy" && coalesce(status, 'adopted') == 'adopted' && slug.current == $slug][0]`,
      { slug }
    )
  })
})
