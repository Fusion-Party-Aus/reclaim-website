// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }))
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch }) }))
vi.mock('@sanity/image-url', () => ({ default: () => ({ image: vi.fn() }) }))
import { GET as policy } from './policy-sitemap.xml'
import { GET as blog } from './blog-sitemap.xml'
import { GET as research } from './research-sitemap.xml'

for (const [name, handler, prefix, frequency] of [
  ['policy', policy, 'policies', 'weekly'],
  ['blog', blog, 'blog', undefined],
  ['research', research, 'research', 'monthly'],
] as const) {
  describe(`${name} sitemap`, () => {
    it('keeps routable documents when a CMS date is malformed', async () => {
      fetch.mockResolvedValue([
        { slug: { current: 'rights&results' }, _updatedAt: 'invalid' },
        { slug: { current: 'fresh' }, _updatedAt: '2026-10-09T00:00:00Z' },
        { title: 'No route' },
      ])
      const response = await handler({} as Parameters<typeof handler>[0])
      const xml = await response.text()
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8')
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=900')
      expect(xml).toContain(`/${prefix}/rights&amp;results</loc>`)
      if (frequency) expect(xml).toContain(`<changefreq>${frequency}</changefreq>`)
      else expect(xml).not.toContain('<changefreq>')
      if (prefix !== 'policies') expect(xml).toContain(`/${prefix}</loc>`)
      expect(xml).toContain('<lastmod>2026-10-09T00:00:00.000Z</lastmod>')
      expect(xml).not.toContain('invalid')
      expect(xml).not.toContain('undefined')
    })
  })
}
