import { describe, expect, it } from 'vitest'
import { siteBranding, getSiteBranding } from './site-branding.mjs'

const accents = {
  national: '#00C9D2',
  vic: '#A8A8AD',
  nsw: '#FFE6EA',
  qld: '#912D35',
  wa: '#FFD600',
  sa: '#ED174B',
  tas: '#008344',
  act: '#472D8C',
  nt: '#E88700',
}
function luminance(hex) {
  expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((part) => {
      const value = Number.parseInt(part, 16) / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (values[0] + 0.05) / (values[1] + 0.05)
}
describe('approved site branding roster', () => {
  it('preserves all nine exact approved accents in immutable records', () => {
    expect(Object.keys(siteBranding).sort()).toEqual(Object.keys(accents).sort())
    expect(Object.isFrozen(siteBranding)).toBe(true)
    for (const [id, accent] of Object.entries(accents)) {
      const branding = getSiteBranding(id)
      expect(branding).toBe(siteBranding[id])
      expect(branding.accent).toBe(accent)
      expect(Object.isFrozen(branding)).toBe(true)
    }
    expect(() => {
      siteBranding.nsw.accent = '#000000'
    }).toThrow()
    for (const id of ['unknown', '', 'NSW', 'constructor', '__proto__'])
      expect(() => getSiteBranding(id)).toThrow()
  })
  it('pairs brand fills and foreground roles with readable contrast', () => {
    for (const [id, branding] of Object.entries(siteBranding)) {
      expect(
        contrast(branding.accentInk, branding.accent),
        `${id}: ink on accent`
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrast(branding.accentDisplay, '#32105a'),
        `${id}: display on purple`
      ).toBeGreaterThanOrEqual(3)
      expect(
        contrast(branding.accentDark, '#ffffff'),
        `${id}: dark on white`
      ).toBeGreaterThanOrEqual(4.5)
      luminance(branding.accentSoft)
    }
  })
})
