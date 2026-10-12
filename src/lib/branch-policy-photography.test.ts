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
describe('policy card photography at the public renderer boundary', () => {
  it('renders all three approved photographs lazily with dimensions and visible attribution', async () => {
    const content = getStaticBranchLandingContent('nsw')
    const html = await createLandingResponse(site, url, 'GET', content).text()
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
    for (const area of content.base.policyAreas) {
      const photo = area.photography
      expect(photo).toBeDefined()
      const image = images.find((tag) => decode(attribute(tag, 'src')) === photo.src)
      expect(image).toBeDefined()
      if (!image) throw new Error('Missing National policy image')
      expect(decode(attribute(image, 'alt'))).toBe(photo.alt)
      expect(attribute(image, 'width')).toBe('640')
      expect(attribute(image, 'height')).toBe('400')
      expect(attribute(image, 'loading')).toBe('lazy')
      const credit = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)]
        .map(([tag]) => tag)
        .find((tag) => decode(attribute(tag, 'href')) === photo.creditUrl)
      expect(decode(credit)?.replace(/<[^>]*>/g, '')).toContain(photo.photographer)
    }
  })
  it('rejects hostile nested photograph and credit URLs supplied by another adapter', () => {
    const content = getStaticBranchLandingContent('nsw')
    for (const key of ['src', 'creditUrl']) {
      for (const value of [
        'javascript:alert(1)',
        'https://images.unsplash.com.attacker.example/photo-1',
        'https://user:secret@images.unsplash.com/photo-1',
      ]) {
        const areas = content.base.policyAreas.map((area, index) =>
          index === 0 ? { ...area, photography: { ...area.photography, [key]: value } } : area
        )
        expect(() =>
          createLandingResponse(site, url, 'GET', {
            ...content,
            base: { ...content.base, policyAreas: areas },
          })
        ).toThrow()
      }
    }
  })
})
