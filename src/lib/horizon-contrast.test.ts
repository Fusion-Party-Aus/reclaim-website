// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'

const declarations = (file: string) =>
  Object.fromEntries(
    [
      ...readFileSync(new URL(file, import.meta.url), 'utf8').matchAll(
        /(--[\w-]+)\s*:\s*([^;]+);/g
      ),
    ].map((m) => [m[1], m[2].trim()])
  )
const tokens = {
  ...declarations('../styles/global.css'),
  ...declarations('../styles/themes/vic.css'),
}
const color = (name: string): string => {
  const value = tokens[`--color-${name}`]
  if (!value) throw new Error(`Missing semantic colour: ${name}`)
  const reference = /^var\(--color-([\w-]+)\)$/.exec(value)
  return reference ? color(reference[1]) : value
}
const luminance = (hex: string) => {
  const full = hex.length === 4 ? '#' + [...hex.slice(1)].map((x) => x + x).join('') : hex
  if (!/^#[\da-f]{6}$/i.test(full)) throw new Error(`Expected resolved opaque colour, got ${hex}`)
  const [r, g, b] = full
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return r * 0.2126 + g * 0.7152 + b * 0.0722
}
const ratio = (a: string, b: string) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

describe('Victoria semantic contrast contract', () => {
  it.each([
    ['fg', 'surface-base'],
    ['fg', 'surface-raised'],
    ['chalk', 'surface-raised'],
    ['grey-light', 'surface-base'],
    ['muted', 'surface-base'],
    ['muted', 'surface-raised'],
    ['secondary-ink', 'surface-base'],
    ['link', 'surface-base'],
    ['on-primary', 'magenta'],
    ['on-primary', 'magenta-bright'],
    ['on-secondary', 'mint'],
    ['on-secondary', 'mint-bright'],
    ['on-accent', 'yellow'],
    ['on-accent', 'yellow-bright'],
    ['on-tertiary', 'lavender'],
    ['on-dark', 'surface-brand'],
  ])('%s on %s meets WCAG AA for normal text', (fg, bg) =>
    expect(ratio(color(fg), color(bg))).toBeGreaterThanOrEqual(4.5)
  )
  it('keeps control boundaries and the light-surface focus indicator distinguishable', () => {
    expect(ratio(color('line-mid'), color('surface-base'))).toBeGreaterThanOrEqual(3)
    expect(ratio(color('focus'), color('surface-base'))).toBeGreaterThanOrEqual(3)
  })
})
