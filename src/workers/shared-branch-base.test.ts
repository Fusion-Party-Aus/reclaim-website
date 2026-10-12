// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import worker from './branch-agnostic-test'
import { sharedBranchBaseContent } from '../../config/shared-branch-base.mjs'

const states = {
  nsw: 'New South Wales',
  sa: 'South Australia',
  nt: 'Northern Territory',
  act: 'Australian Capital Territory',
  tas: 'Tasmania',
  wa: 'Western Australia',
  qld: 'Queensland',
}
describe('shared base on existing branch landing roots', () => {
  for (const [id, state] of Object.entries(states)) {
    it(`renders shared National content with ${id} identity and metadata`, async () => {
      const origin = `https://${id}.fusionparty.org.au`
      const response = worker.fetch(new Request(origin))
      expect(response.status).toBe(200)
      const html = await response.text()
      expect(html).toContain('data-base-version="1"')
      expect(html).toContain('data-content-owner="national"')
      const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      expect(
        heading
          ?.replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      ).toBe(sharedBranchBaseContent.heroSlogan)
      const hero = html.match(/<header\b[^>]*class="home-hero"[^>]*>[\s\S]*?<\/header>/)?.[0]
      expect(hero).toBeDefined()
      expect(hero).not.toContain(state)
      expect(hero).not.toContain(`Fusion Party ${state}`)
      const header = html.match(
        /<header\b[^>]*class="site-header[^"]*"[^>]*>[\s\S]*?<\/header>/
      )?.[0]
      expect(header).toContain(state)
      expect(html).toContain(`<title>Fusion Party ${state}</title>`)
      expect(html).toContain(`rel="canonical" href="${origin}/"`)
      const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => tag)
      expect(meta.find((tag) => tag.includes('property="og:url"'))).toContain(
        `content="${origin}/"`
      )
      expect(meta.find((tag) => tag.includes('property="og:title"'))).toContain(state)
      expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/)
      for (const value of sharedBranchBaseContent.values) expect(html).toContain(value.name)
      for (const url of Object.values(sharedBranchBaseContent.links))
        expect(html).toContain(`href="${url}"`)
      expect(html).toMatch(/National|nationally/)
      expect(html).not.toMatch(/Fusion Party Victoria|api\.sanity\.io|cdn\.sanity\.io/)
      for (const match of html.matchAll(/href="(#[^"]+)"/g)) {
        expect(html).toContain(`id="${match[1].slice(1)}"`)
      }
      for (const match of html.matchAll(/href="(\/[^"]*)"/g)) expect(match[1]).toBe('/')
    })
  }
  it('does not read or mutate any network content for supported or unavailable requests', () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('Shared branch base must not access a CMS or network service')
    })
    try {
      for (const id of Object.keys(states))
        for (const path of [
          '/',
          '/robots.txt',
          '/sitemap.xml',
          '/api/policies.json',
          '/policies',
        ]) {
          for (const method of ['GET', 'HEAD', 'POST'])
            worker.fetch(new Request(`https://${id}.fusionparty.org.au${path}`, { method }))
        }
      expect(fetch).not.toHaveBeenCalled()
    } finally {
      fetch.mockRestore()
    }
  })
})
