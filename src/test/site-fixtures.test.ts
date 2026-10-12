// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveSite, siteRegistry } from '../../config/sites.mjs'
import { resolveContentSite } from './site-fixtures'

describe('explicit legacy CMS contract fixtures', () => {
  it('retains QLD dataset coverage without changing public host resolution', () => {
    expect(resolveContentSite('https://QLD.fusionparty.org.au/policies?siteId=vic')).toBe(
      siteRegistry.qld
    )
    expect(resolveContentSite('https://qld.fusionparty.org.au').cms.dataset).toBe('qld')
    expect(resolveSite('https://qld.fusionparty.org.au').kind).toBe('landing')
  })
  it('preserves Victoria resolution and rejects landing or unknown content fixtures', () => {
    expect(resolveContentSite('https://vic.fusionparty.org.au')).toBe(siteRegistry.vic)
    for (const host of [
      'nsw.fusionparty.org.au',
      'tas.fusionparty.org.au',
      'qld.fusionparty.org.au.attacker.example',
      'unknown.example',
    ]) {
      expect(() => resolveContentSite(`https://${host}`)).toThrow()
    }
  })
})
