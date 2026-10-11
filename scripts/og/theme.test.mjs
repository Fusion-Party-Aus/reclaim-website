import { describe, expect, it } from 'vitest'
import { siteRegistry } from '../../config/sites.mjs'
import { ogTheme } from './lib.mjs'

describe('OG Site themes', () => {
  it('uses the resolved Victoria design tokens on a dark surface', () => {
    const theme = ogTheme(siteRegistry.vic.deployment)

    expect(theme.background).toBe('#0B0B0B')
    expect(theme.foreground).toBe('#FFFFFF')
    expect(theme.primary).toBe('#003C71')
    expect(theme.accent).toBe('#3CE0C0')
    expect(theme.isLight).toBe(false)
  })

  it('uses the resolved Queensland tokens on a light surface', () => {
    const theme = ogTheme(siteRegistry.qld.deployment)

    expect(theme.background).toBe('#FFF7EC')
    expect(theme.foreground).toBe('#233D3A')
    expect(theme.primary).toBe('#73182C')
    expect(theme.accent).toBe('#73182C')
    expect(theme.isLight).toBe(true)
  })
})
