// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveSite } from '../../config/sites.mjs'
import { getStaticBranchLandingContent } from './branch-landing-content'
import { createLandingResponse } from './site-landing'

const site = resolveSite('https://nsw.fusionparty.org.au')
if (site.kind !== 'landing') throw new Error('Expected landing fixture')
const url = new URL(site.canonicalOrigin)
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
const decode = (value: string | undefined) =>
  value?.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"')
describe('value photography at the public renderer boundary', () => {
  it('renders each approved value image with lazy dimensions, matching alt and visible credit', async () => {
    const content = getStaticBranchLandingContent('nsw')
    const html = await createLandingResponse(site, url, 'GET', content).text()
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
    for (const value of content.base.values) {
      expect(value.photography).toBeDefined()
      const photo = value.photography
      const image = images.find((tag) => decode(attribute(tag, 'src')) === photo.src)
      expect(image).toBeDefined()
      if (!image) throw new Error(`Missing value photograph for ${value.name}`)
      expect(decode(attribute(image, 'alt'))).toBe(photo.alt)
      expect(attribute(image, 'width')).toBe('180')
      expect(attribute(image, 'height')).toBe('180')
      expect(attribute(image, 'loading')).toBe('lazy')
      const credit = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)]
        .map(([tag]) => tag)
        .find((tag) => decode(attribute(tag, 'href')) === photo.creditUrl)
      expect(decode(credit)?.replace(/<[^>]*>/g, '')).toContain(photo.photographer)
    }
  })
  it('rejects injected script, credentialed or lookalike value photograph destinations', () => {
    const content = getStaticBranchLandingContent('nsw')
    for (const [key, host] of [
      ['src', 'images.unsplash.com'],
      ['creditUrl', 'unsplash.com'],
    ]) {
      for (const destination of [
        'javascript:alert(1)',
        `https://${host}.attacker.example/photo`,
        `https://user:secret@${host}/photo`,
      ]) {
        const values = content.base.values.map((value, index) =>
          index === 0
            ? { ...value, photography: { ...value.photography, [key]: destination } }
            : value
        )
        expect(() =>
          createLandingResponse(site, url, 'GET', { ...content, base: { ...content.base, values } })
        ).toThrow()
      }
    }
  })
})
