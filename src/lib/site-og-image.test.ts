import { describe, expect, it } from 'vitest'
import { siteOgImage } from './site-og-image'

describe('siteOgImage', () => {
  it('places shared OG image paths in the active Site namespace', () => {
    expect(siteOgImage('vic', '/og/default.png')).toBe('/og/vic/default.png')
    expect(siteOgImage('qld', '/og/policies/test.png')).toBe('/og/qld/policies/test.png')
  })

  it('normalizes the legacy QLD default image name', () => {
    expect(siteOgImage('qld', '/og/qld-default.png')).toBe('/og/qld/default.png')
  })

  it('preserves images outside the local OG asset directory', () => {
    expect(siteOgImage('qld', 'https://cdn.example.test/image.png')).toBe(
      'https://cdn.example.test/image.png'
    )
    expect(siteOgImage('qld', '/custom/social-card.png')).toBe('/custom/social-card.png')
  })
})
