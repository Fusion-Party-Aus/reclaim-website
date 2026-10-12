// @vitest-environment node
import { describe, expect, it } from 'vitest'
import worker from './branch-agnostic-test'
import { getSiteBranding } from '../../config/site-branding.mjs'

const states = {
  nsw: 'New South Wales',
  sa: 'South Australia',
  nt: 'Northern Territory',
  act: 'Australian Capital Territory',
  tas: 'Tasmania',
  wa: 'Western Australia',
  qld: 'Queensland',
}
describe('site-scoped landing brand accents', () => {
  for (const [id, state] of Object.entries(states)) {
    it(`renders ${id} approved accent roles and retains its own metadata`, async () => {
      const response = worker.fetch(new Request(`https://${id}.fusionparty.org.au/`))
      const html = await response.text()
      const branding = getSiteBranding(id)
      const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]
        .map(([, css]) => css)
        .join('\n')
      for (const [property, value] of Object.entries({
        '--fusion-accent': branding.accent,
        '--fusion-accent-ink': branding.accentInk,
        '--fusion-accent-dark': branding.accentDark,
        '--fusion-accent-soft': branding.accentSoft,
        '--fusion-accent-display': branding.accentDisplay,
      })) {
        const declarations = [...styles.matchAll(new RegExp(`${property}\\s*:\\s*([^;}]+)`, 'g'))]
        expect(declarations.at(-1)?.[1].trim(), property).toBe(value)
      }
      expect(html).toContain(`<title>Fusion Party ${state}</title>`)
      expect(html).toContain(`href="https://${id}.fusionparty.org.au/"`)
      expect(html).not.toMatch(/api\.sanity\.io|cdn\.sanity\.io/)
    })
  }
})
