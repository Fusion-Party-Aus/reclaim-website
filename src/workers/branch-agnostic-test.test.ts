import { describe, expect, it } from 'vitest'
import worker from './branch-agnostic-test'
import { sharedBranchBaseContent } from '../../config/shared-branch-base.mjs'

const labels = {
  nsw: 'Fusion Party New South Wales',
  nt: 'Fusion Party Northern Territory',
  sa: 'Fusion Party South Australia',
  act: 'Fusion Party Australian Capital Territory',
  tas: 'Fusion Party Tasmania',
  wa: 'Fusion Party Western Australia',
  qld: 'Fusion Party Queensland',
}
const request = (host: string, path = '/', method = 'GET', headers = {}) =>
  new Request(`https://${host}${path}`, { method, headers })

describe('isolated branch-agnostic test Worker', () => {
  it('renders seven approved landings with distinct NSW and NT identity and canonical', async () => {
    const bodies = new Map<string, string>()
    for (const [id, label] of Object.entries(labels)) {
      const response = worker.fetch(request(`${id}.fusionparty.org.au`))
      expect(response.status).toBe(200)
      const html = await response.text()
      const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      expect(
        heading
          ?.replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      ).toBe(sharedBranchBaseContent.heroSlogan)
      expect(html).toContain(`<title>${label}</title>`)
      const hero = html.match(/<header\b[^>]*class="home-hero"[^>]*>[\s\S]*?<\/header>/)?.[0]
      expect(hero).toBeDefined()
      expect(hero).not.toContain(label)
      expect(hero).not.toContain(label.replace('Fusion Party ', ''))
      expect(html).toContain(`rel="canonical" href="https://${id}.fusionparty.org.au/"`)
      expect(html).not.toMatch(/sanity\.io|Fusion Party Victoria/)
      bodies.set(id, html)
    }
    expect(bodies.get('nsw')).not.toBe(bodies.get('nt'))
    expect(bodies.get('nsw')).not.toContain(labels.nt)
    expect(bodies.get('nt')).not.toContain(labels.nsw)
  })

  it('fails closed for unknown hosts and does not take over existing VIC or QLD', async () => {
    for (const host of [
      'vic.fusionparty.org.au',
      'fusionparty.org.au',
      'www.nsw.fusionparty.org.au',
      'nsw.fusionparty.org.au.attacker.example',
      'branch-agnostic-test.workers.dev',
    ]) {
      const response = worker.fetch(
        request(host, '/?siteId=nsw', 'GET', {
          'X-Forwarded-Host': 'nsw.fusionparty.org.au',
        })
      )
      expect(response.status).toBe(404)
      expect(response.headers.get('Cache-Control')).toContain('no-store')
      expect(await response.text()).not.toContain(labels.nsw)
    }
  })

  it('uses actual hostname instead of query or forwarded host overrides', async () => {
    const response = worker.fetch(
      request('nsw.fusionparty.org.au', '/?siteId=nt', 'GET', {
        'X-Forwarded-Host': 'nt.fusionparty.org.au',
      })
    )
    const html = await response.text()
    expect(html).toContain(`<title>${labels.nsw}</title>`)
    expect(html).not.toContain(labels.nt)
  })

  it('does not expose unavailable APIs or state routes', async () => {
    for (const path of [
      '/api/policies.json',
      '/api/research.json',
      '/policies',
      '/sw.js',
      '/site.webmanifest',
    ]) {
      const response = worker.fetch(request('nt.fusionparty.org.au', path))
      expect(response.status).toBe(404)
      expect(response.headers.get('Cache-Control')).toContain('no-store')
    }
  })

  it('supports root-only discovery and body-free HEAD responses', async () => {
    for (const path of ['/', '/robots.txt', '/sitemap.xml', '/api/policies.json']) {
      const get = worker.fetch(request('nsw.fusionparty.org.au', path))
      const head = worker.fetch(request('nsw.fusionparty.org.au', path, 'HEAD'))
      expect(head.status).toBe(get.status)
      expect([...head.headers]).toEqual([...get.headers])
      expect(await head.text()).toBe('')
    }
    const xml = await worker.fetch(request('nt.fusionparty.org.au', '/sitemap.xml')).text()
    expect(xml.match(/<loc>/g)).toHaveLength(1)
    expect(xml).toContain('<loc>https://nt.fusionparty.org.au/</loc>')
  })

  it('rejects unsupported methods without invoking an application or CMS route', () => {
    for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS']) {
      const response = worker.fetch(request('nsw.fusionparty.org.au', '/', method))
      expect(response.status).toBe(405)
      expect(response.headers.get('Allow')).toBe('GET, HEAD')
    }
  })
})
