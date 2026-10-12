import { describe, it, expect, vi } from 'vitest'
import { resolveSite } from '../../config/sites.mjs'
import { createLandingResponse } from './site-landing'
import { createSiteContext } from './site-context'
import { sharedBranchBaseContent } from '../../config/shared-branch-base.mjs'

const landingIds = ['nsw', 'sa', 'nt', 'act', 'tas', 'wa', 'qld'] as const

describe('CMS-free empty state landing responses', () => {
  for (const siteId of landingIds) {
    it(`renders only ${siteId} identity and canonical root without creating a CMS client`, async () => {
      const site = resolveSite(`https://${siteId}.fusionparty.org.au/`)
      if (site.kind !== 'landing') throw new Error('Expected landing Site')
      const clientFactory = vi.fn(() => {
        throw new Error('Landing must never create a CMS client')
      })
      // Deliberately exercise the runtime boundary as well as TypeScript's content-only API.
      // @ts-expect-error A landing Site is intentionally invalid for the content-only context.
      expect(() => createSiteContext(site, { clientFactory })).toThrow()
      expect(clientFactory).not.toHaveBeenCalled()
      const response = createLandingResponse(site, new URL(`${site.canonicalOrigin}/`))
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/html')
      const html = await response.text()
      expect(html).toContain(site.landing.label)
      expect(html).toContain(`href="${site.canonicalOrigin}/"`)
      expect(html.match(/<h1(?:\s[^>]*)?>/g)).toHaveLength(1)
      const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      expect(
        heading
          ?.replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      ).toBe(sharedBranchBaseContent.heroSlogan)
      expect(html).not.toContain('cdn.sanity.io')
      expect(html).not.toContain('api.sanity.io')
      expect(html).not.toContain('Fusion Party Victoria')
    })
  }

  it('rejects unavailable state pages and APIs instead of borrowing a content Site', async () => {
    const site = resolveSite('https://nsw.fusionparty.org.au')
    if (site.kind !== 'landing') throw new Error('Expected landing Site')
    for (const path of [
      '/policies',
      '/research',
      '/contact',
      '/faq',
      '/api/policies.json',
      '/site.webmanifest',
      '/sw.js',
    ]) {
      const response = createLandingResponse(site, new URL(path, site.canonicalOrigin))
      expect(response.status).toBe(404)
      expect(response.headers.get('Cache-Control')).toContain('no-store')
      expect(await response.text()).not.toContain('Victoria')
    }
  })

  it('serves root-only discovery without advertising unavailable content', async () => {
    const site = resolveSite('https://sa.fusionparty.org.au')
    if (site.kind !== 'landing') throw new Error('Expected landing Site')
    const robots = createLandingResponse(site, new URL('/robots.txt', site.canonicalOrigin))
    expect(robots.status).toBe(200)
    expect(await robots.text()).toContain(`Sitemap: ${site.canonicalOrigin}/sitemap.xml`)
    const sitemap = createLandingResponse(site, new URL('/sitemap.xml', site.canonicalOrigin))
    expect(sitemap.status).toBe(200)
    const xml = await sitemap.text()
    expect(xml.match(/<loc>/g)).toHaveLength(1)
    expect(xml).toContain(`<loc>${site.canonicalOrigin}/</loc>`)
    expect(xml).not.toContain('/policies')
  })

  it('supports HEAD without bodies and fails closed for unsupported methods', async () => {
    const site = resolveSite('https://nt.fusionparty.org.au')
    if (site.kind !== 'landing') throw new Error('Expected landing Site')
    for (const path of ['/', '/robots.txt', '/sitemap.xml', '/policies']) {
      const get = createLandingResponse(site, new URL(path, site.canonicalOrigin), 'GET')
      const head = createLandingResponse(site, new URL(path, site.canonicalOrigin), 'HEAD')
      expect(head.status).toBe(get.status)
      expect(head.headers.get('Content-Type')).toBe(get.headers.get('Content-Type'))
      expect(await head.text()).toBe('')
    }
    for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS']) {
      const response = createLandingResponse(site, new URL('/', site.canonicalOrigin), method)
      expect(response.status).toBe(405)
      expect(response.headers.get('Allow')).toBe('GET, HEAD')
    }
  })
})
