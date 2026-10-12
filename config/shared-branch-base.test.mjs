import { describe, expect, it } from 'vitest'
import { sharedBranchBaseContent, getBranchBaseContent } from './shared-branch-base.mjs'

const eligible = ['nsw', 'sa', 'tas', 'wa', 'nt', 'act', 'qld']
describe('explicit National-owned shared branch base', () => {
  it('supplies an immutable shared record only to eligible branches', () => {
    expect(sharedBranchBaseContent.version).toBe(1)
    expect(sharedBranchBaseContent.ownerSiteId).toBe('national')
    expect(sharedBranchBaseContent.siteIds).toEqual(eligible)
    expect(sharedBranchBaseContent.introduction.trim().length).toBeGreaterThan(0)
    expect(sharedBranchBaseContent.values).toHaveLength(6)
    expect(new Set(sharedBranchBaseContent.values.map((value) => value.name)).size).toBe(6)
    for (const value of sharedBranchBaseContent.values) {
      expect(value.name.trim().length).toBeGreaterThan(0)
      expect(value.description.trim().length).toBeGreaterThan(0)
      expect(Object.isFrozen(value)).toBe(true)
    }
    for (const id of eligible) expect(getBranchBaseContent(id)).toBe(sharedBranchBaseContent)
    for (const value of [
      sharedBranchBaseContent,
      sharedBranchBaseContent.siteIds,
      sharedBranchBaseContent.values,
      sharedBranchBaseContent.links,
      sharedBranchBaseContent.footer,
      sharedBranchBaseContent.footer.newsletter,
      sharedBranchBaseContent.footer.navColumns,
      sharedBranchBaseContent.footer.resourceLinks,
    ])
      expect(Object.isFrozen(value)).toBe(true)
    expect(sharedBranchBaseContent.footer.navColumns.map((column) => column.badgeLabel)).toEqual([
      'Explore',
      'Get involved',
      'Information',
    ])
    expect(
      sharedBranchBaseContent.footer.navColumns.flatMap((column) => column.links)
    ).toContainEqual({ label: 'Find your electorate', url: '/electorates', external: false })
    for (const column of sharedBranchBaseContent.footer.navColumns) {
      expect(Object.isFrozen(column)).toBe(true)
      expect(Object.isFrozen(column.links)).toBe(true)
      for (const link of column.links) {
        expect(Object.isFrozen(link)).toBe(true)
        const url = new URL(link.url, 'https://qld.fusionparty.org.au')
        expect(url.protocol).toBe('https:')
        expect(['qld.fusionparty.org.au', 'www.fusionparty.org.au']).toContain(url.hostname)
      }
    }
    for (const link of sharedBranchBaseContent.footer.resourceLinks) {
      expect(Object.isFrozen(link)).toBe(true)
      expect(new URL(link.url).hostname).toBe('www.fusionparty.org.au')
    }
    expect(() =>
      sharedBranchBaseContent.values.push({ name: 'Injected', description: 'bad' })
    ).toThrow()
  })
  it('does not override existing Victorian or National content', () => {
    for (const id of ['vic', 'national', 'unknown', '', 'NSW']) {
      expect(() => getBranchBaseContent(id)).toThrow()
    }
  })
  it('links only to official National HTTPS destinations with no credentials or query overrides', () => {
    expect(Object.keys(sharedBranchBaseContent.links).sort()).toEqual(
      ['values', 'policy', 'join', 'volunteer', 'contact', 'privacy'].sort()
    )
    for (const link of Object.values(sharedBranchBaseContent.links)) {
      const url = new URL(link)
      expect(url.protocol).toBe('https:')
      expect(url.hostname).toBe('www.fusionparty.org.au')
      expect(url.username + url.password + url.search + url.hash).toBe('')
    }
  })
  it('keeps the three National policy areas immutable and explicitly linked to their source pages', () => {
    expect(sharedBranchBaseContent.heroSlogan.trim().length).toBeGreaterThan(0)
    expect(sharedBranchBaseContent.missionHeading.trim().length).toBeGreaterThan(0)
    expect(Object.isFrozen(sharedBranchBaseContent.policyAreas)).toBe(true)
    expect(sharedBranchBaseContent.policyAreas.map((area) => new URL(area.href).pathname)).toEqual([
      '/fair_inclusive_society',
      '/ethical_governance',
      '/climate_rescue',
    ])
    for (const area of sharedBranchBaseContent.policyAreas) {
      expect(Object.isFrozen(area)).toBe(true)
      expect(area.title.trim().length).toBeGreaterThan(0)
      expect(area.description.trim().length).toBeGreaterThan(0)
      const url = new URL(area.href)
      expect(url.origin).toBe('https://www.fusionparty.org.au')
      expect(url.username + url.password + url.search + url.hash).toBe('')
    }
    expect(() => {
      sharedBranchBaseContent.policyAreas[0].href = 'https://attacker.example'
    }).toThrow()
  })
})
