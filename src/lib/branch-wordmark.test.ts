// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import { resolveSite } from '../../config/sites.mjs'
import { createLandingResponse } from './site-landing'

vi.mock('../../public/fusion-wordmark.svg', () => ({
  default:
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 37"><text>Fusion</text></svg>',
}))
const rawWordmark =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 37"><text>Fusion</text></svg>'
describe('embedded wordmark attribute boundary', () => {
  it('preserves a complete SVG data URL containing quotes without leaking SVG markup into the header', async () => {
    const site = resolveSite('https://nsw.fusionparty.org.au')
    if (site.kind !== 'landing') throw new Error('Expected landing fixture')
    const html = await createLandingResponse(site, new URL(site.canonicalOrigin)).text()
    const dom = new JSDOM(html)
    try {
      const header = dom.window.document.querySelector('.site-header')
      const image = header?.querySelector('img[alt="Fusion"]')
      expect(image?.getAttribute('src')).toBe(rawWordmark)
      expect(header?.querySelectorAll('text')).toHaveLength(0)
      expect(header?.textContent).not.toContain('viewBox')
      expect(header?.querySelectorAll('.brand svg')).toHaveLength(1)
      const oldHtml = html.replaceAll(
        rawWordmark
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;'),
        rawWordmark
      )
      const broken = new JSDOM(oldHtml)
      try {
        expect(
          broken.window.document.querySelector('img[alt="Fusion"]')?.getAttribute('src')
        ).not.toBe(rawWordmark)
      } finally {
        broken.window.close()
      }
    } finally {
      dom.window.close()
    }
  })
})
