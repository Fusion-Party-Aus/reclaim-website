// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }))
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch }) }))
vi.mock('@sanity/image-url', () => ({ default: () => ({ image: vi.fn() }) }))
import { getDocumentBySlug } from './sanity'

beforeEach(() => fetch.mockReset())

describe('document lookup', () => {
  it('passes quoted route slugs as data rather than query syntax', async () => {
    const slug = 'missing" || _type == "private'
    fetch.mockResolvedValue(null)
    expect(await getDocumentBySlug('policy', slug)).toBeNull()
    expect(fetch).toHaveBeenCalledWith('*[_type == $type && slug.current == $slug][0]', {
      type: 'policy',
      slug,
    })
  })
})
