// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { resolveSite } from '../../config/sites.mjs'
import { sharedBranchBaseContent } from '../../config/shared-branch-base.mjs'
import { branchCityPhotography } from '../../config/branch-city-photography.mjs'
import { createLandingResponse } from './site-landing'
import { getStaticBranchLandingContent, type BranchLandingContent } from './branch-landing-content'

const site = resolveSite('https://nsw.fusionparty.org.au')
if (site.kind !== 'landing') throw new Error('Expected landing fixture')
const url = new URL(site.canonicalOrigin)
const fixture: BranchLandingContent = Object.freeze({
  siteId: 'nsw',
  base: Object.freeze({
    ...sharedBranchBaseContent,
    introduction: 'A second adapter supplies this reviewed introduction.',
  }),
  photography: branchCityPhotography.nsw,
})
describe('pure branch landing content adapter boundary', () => {
  it('composes immutable static content without supplying existing branches', () => {
    const content = getStaticBranchLandingContent('nsw')
    expect(content.siteId).toBe('nsw')
    expect(content.base).toBe(sharedBranchBaseContent)
    expect(content.photography).toBe(branchCityPhotography.nsw)
    expect(Object.isFrozen(content)).toBe(true)
    for (const id of ['vic', 'national', 'unknown'])
      expect(() => getStaticBranchLandingContent(id)).toThrow()
  })
  it('supplies Tasmania with the approved shared base and its own Hobart photograph', () => {
    const content = getStaticBranchLandingContent('tas')
    expect(content.siteId).toBe('tas')
    expect(content.base).toBe(sharedBranchBaseContent)
    expect(content.photography).toBe(branchCityPhotography.tas)
    expect(content.photography.city).toBe('Hobart')
    expect(Object.isFrozen(content)).toBe(true)
  })
  it('supplies Western Australia with the approved shared base and its own Perth photograph', () => {
    const content = getStaticBranchLandingContent('wa')
    expect(content.siteId).toBe('wa')
    expect(content.base).toBe(sharedBranchBaseContent)
    expect(content.photography).toBe(branchCityPhotography.wa)
    expect(content.photography.city).toBe('Perth')
    expect(Object.isFrozen(content)).toBe(true)
  })
  it('supplies the newly approved Queensland landing with its own Brisbane photograph', () => {
    const content = getStaticBranchLandingContent('qld')
    expect(content.siteId).toBe('qld')
    expect(content.base).toBe(sharedBranchBaseContent)
    expect(content.photography).toBe(branchCityPhotography.qld)
    expect(content.photography.city).toBe('Brisbane')
    expect(Object.isFrozen(content)).toBe(true)
  })
  it('renders a second adapter supplied DTO rather than fetching static content inside the renderer', async () => {
    const network = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('No network inside pure renderer')
    })
    try {
      const html = await createLandingResponse(site, url, 'GET', fixture).text()
      expect(html).toContain(fixture.base.introduction)
      expect(html).not.toContain(sharedBranchBaseContent.introduction)
      expect(html).toContain('Fusion Party New South Wales')
      expect(html).toContain('https://nsw.fusionparty.org.au/')
      expect(network).not.toHaveBeenCalled()
    } finally {
      network.mockRestore()
    }
  })
  it('rejects a DTO from another site or outside the explicitly National-owned branch scope', () => {
    const invalid: BranchLandingContent[] = [
      { ...fixture, siteId: 'nt' },
      { ...fixture, base: { ...fixture.base, siteIds: ['nt'] } },
    ]
    for (const content of invalid)
      expect(() => createLandingResponse(site, url, 'GET', content)).toThrow()
    // Deliberately model invalid external runtime input, beyond the literal owner type.
    const wrongOwner: BranchLandingContent = {
      ...fixture,
      // @ts-expect-error Invalid external owner must fail closed beyond TypeScript's literal type.
      base: { ...fixture.base, ownerSiteId: 'vic' },
    }
    expect(() => createLandingResponse(site, url, 'GET', wrongOwner)).toThrow()
  })
  it('rejects script URLs, credentialed destinations and lookalike hosts before rendering', () => {
    for (const href of [
      'javascript:alert(1)',
      'https://www.fusionparty.org.au.attacker.example/join',
      'https://editor:secret@www.fusionparty.org.au/join',
      'https://www.fusionparty.org.au:8443/join',
      'http://www.fusionparty.org.au/join',
    ]) {
      const content = {
        ...fixture,
        base: { ...fixture.base, links: { ...fixture.base.links, join: href } },
      }
      expect(() => createLandingResponse(site, url, 'GET', content)).toThrow()
      const policy = {
        ...fixture,
        base: { ...fixture.base, policyAreas: [{ ...fixture.base.policyAreas[0], href }] },
      }
      expect(() => createLandingResponse(site, url, 'GET', policy)).toThrow()
    }
    for (const src of [
      'javascript:alert(1)',
      'https://images.unsplash.com.attacker.example/photo-1',
      'https://user:secret@images.unsplash.com/photo-1',
    ]) {
      expect(() =>
        createLandingResponse(site, url, 'GET', {
          ...fixture,
          photography: { ...fixture.photography, src },
        })
      ).toThrow()
    }
    for (const creditUrl of [
      'javascript:alert(1)',
      'https://unsplash.com.attacker.example/photos/fake',
      'https://user:secret@unsplash.com/photos/fake',
    ]) {
      expect(() =>
        createLandingResponse(site, url, 'GET', {
          ...fixture,
          photography: { ...fixture.photography, creditUrl },
        })
      ).toThrow()
    }
  })
  it('rejects photograph CSS injection and out-of-range crop positions', () => {
    for (const position of [
      '50% 50%;background:url(https://attacker.example)',
      '50% 50%" onerror="alert(1)',
      '-1% 50%',
      '101% 50%',
      '50% 100.1%',
      'NaN% 50%',
    ]) {
      expect(() =>
        createLandingResponse(site, url, 'GET', {
          ...fixture,
          photography: { ...fixture.photography, position },
        })
      ).toThrow()
    }
  })
})
