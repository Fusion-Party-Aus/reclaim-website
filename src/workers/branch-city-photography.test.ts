// @vitest-environment node
import { describe, expect, it } from 'vitest'
import worker from './branch-agnostic-test'
import { branchCityPhotography } from '../../config/branch-city-photography.mjs'

const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
const decode = (value: string | undefined) =>
  value?.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"')
describe('incumbent homepage identity with branch city photography', () => {
  for (const id of ['nsw', 'sa', 'nt', 'act', 'tas', 'wa', 'qld']) {
    it(`renders ${id} own credited city hero and decorative folds`, async () => {
      const photo = branchCityPhotography[id]
      const response = worker.fetch(new Request(`https://${id}.fusionparty.org.au/`))
      expect(response.status).toBe(200)
      const html = await response.text()
      const body = html.match(/<body\b[^>]*>/)?.[0] || ''
      const main = html.match(/<main\b[^>]*>/)?.[0] || ''
      expect(attribute(body, 'class')?.split(/\s+/)).toContain('public-editorial')
      expect(attribute(main, 'class')?.split(/\s+/)).toContain('fusion-home')
      const image = [...html.matchAll(/<img\b[^>]*>/g)]
        .map(([tag]) => tag)
        .find((tag) => decode(attribute(tag, 'src')) === photo.src)
      expect(image).toBeDefined()
      if (!image) throw new Error('Missing state city hero')
      expect(decode(attribute(image, 'alt'))).toBe(photo.alt)
      expect(attribute(image, 'width')).toBe('1800')
      expect(attribute(image, 'height')).toBe('1100')
      expect(attribute(image, 'fetchpriority')).toBe('high')
      expect(html).toContain(`href="${photo.creditUrl}"`)
      expect(decode(html)).toContain(photo.photographer)
      const folds = [...html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)]
        .map(([svg]) => svg)
        .find((svg) => attribute(svg.split('>')[0], 'class')?.split(/\s+/).includes('home-ribbons'))
      expect(folds).toBeDefined()
      expect(folds).toContain('aria-hidden="true"')
      expect(folds?.match(/<path\b/g)).toHaveLength(6)
      const csp = response.headers.get('Content-Security-Policy') || ''
      const images =
        csp.split(';').find((directive) => directive.trim().startsWith('img-src ')) || ''
      expect(images).toContain('https://images.unsplash.com')
      expect(images).not.toMatch(/https:\s|\*/)
      expect(csp).toContain("default-src 'none'")
      expect(html).not.toMatch(/api\.sanity\.io|cdn\.sanity\.io/)
    })
  }
})
