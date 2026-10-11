// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { resolveSite } from '../../config/sites.mjs'
import { resolveSiteIntegrations } from './site-integrations'

describe('Site integration configuration', () => {
  const values: Record<string, string> = {
    NATIONBUILDER_SLUG: 'legacy-vic',
    NATIONBUILDER_API_TOKEN: 'vic-token',
    QLD_NATIONBUILDER_SLUG: 'queensland',
    QLD_NATIONBUILDER_API_TOKEN: 'qld-token',
    AEC_CRM_API_URL: 'https://crm-vic.example',
    AEC_CRM_API_KEY: 'vic-crm',
  }
  const readSecret = (name: string) => values[name]
  it('maps legacy settings only to VIC and prefixes QLD settings explicitly', () => {
    const vic = resolveSiteIntegrations(
      resolveSite('https://vic.fusionparty.org.au'),
      readSecret,
      {}
    )
    const qld = resolveSiteIntegrations(
      resolveSite('https://qld.fusionparty.org.au'),
      readSecret,
      {}
    )
    expect(vic.nationbuilder.NATIONBUILDER_SLUG).toBe('legacy-vic')
    expect(qld.nationbuilder.NATIONBUILDER_SLUG).toBe('queensland')
    expect(qld.nationbuilder.NATIONBUILDER_API_TOKEN).toBe('qld-token')
    expect(qld.membership.url).toBeUndefined()
  })
  it('never borrows VIC secrets or token bindings for an unconfigured QLD integration', () => {
    const qld = resolveSiteIntegrations(
      resolveSite('https://qld.fusionparty.org.au'),
      (name) => (name.startsWith('QLD_') ? undefined : values[name]),
      { NATIONBUILDER_TOKENS: {} }
    )
    expect(qld.nationbuilder.NATIONBUILDER_SLUG).toBeUndefined()
    expect(qld.nationbuilder.NATIONBUILDER_TOKENS).toBeUndefined()
    expect(qld.membership.url).toBeUndefined()
  })
})
