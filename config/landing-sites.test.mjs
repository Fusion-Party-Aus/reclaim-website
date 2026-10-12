import { describe, it, expect } from 'vitest'
import { resolveSite, siteRegistry, UnknownSiteHostError } from './sites.mjs'

const branches = {
  nsw: 'New South Wales',
  sa: 'South Australia',
  nt: 'Northern Territory',
  act: 'Australian Capital Territory',
  tas: 'Tasmania',
  wa: 'Western Australia',
}

describe('approved empty state landing Sites', () => {
  for (const [siteId, state] of Object.entries(branches)) {
    it(`resolves ${siteId} with no invented content source`, () => {
      const site = resolveSite(`https://${siteId}.fusionparty.org.au/`)
      expect(site.kind).toBe('landing')
      expect(site.siteId).toBe(siteId)
      expect(site.branchId).toBe(siteId)
      expect(site.canonicalOrigin).toBe(`https://${siteId}.fusionparty.org.au`)
      expect(site.hostnames).toEqual([`${siteId}.fusionparty.org.au`])
      expect(site.landing).toEqual({ label: `Fusion Party ${state}`, state })
      expect(site).not.toHaveProperty('cms')
      expect(site).not.toHaveProperty('deployment')
      expect(Object.isFrozen(site)).toBe(true)
      expect(Object.isFrozen(site.landing)).toBe(true)
      expect(Object.isFrozen(siteRegistry)).toBe(true)
    })
  }

  it('preserves existing content Sites and keeps unapproved hosts unavailable', () => {
    expect(resolveSite('https://vic.fusionparty.org.au').cms.dataset).toBe('production')
    expect(resolveSite('https://qld.fusionparty.org.au').cms.dataset).toBe('qld')
    for (const host of ['fusionparty.org.au', 'www.nsw.fusionparty.org.au']) {
      expect(() => resolveSite(`https://${host}`)).toThrow(UnknownSiteHostError)
    }
  })
})
