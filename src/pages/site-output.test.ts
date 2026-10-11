// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { siteRegistry } from '../../config/sites.mjs'
import { GET as manifest } from './site.webmanifest'
import { GET as worker } from './sw.js'
import { GET as policySitemap } from './policy-sitemap.xml'

function context(siteId: 'vic' | 'qld') {
  const site = siteRegistry[siteId]
  return {
    locals: {
      siteContext: {
        site,
        deployment: site.deployment,
        content: {
          getPolicies: async () => [{ slug: { current: 'same-slug' } }],
        },
      },
    },
  } as unknown as Parameters<typeof manifest>[0]
}

describe('request-specific public outputs', () => {
  it.each(['vic', 'qld'] as const)(
    'uses %s identity in manifest, worker and same-slug sitemap',
    async (siteId) => {
      const ctx = context(siteId)
      const output = await (await manifest(ctx)).json()
      expect(output.short_name).toBe(siteRegistry[siteId].deployment.label)
      expect(output.icons[0].src).toContain(`/brand-icons/${siteId}/`)
      expect(await (await worker(ctx)).text()).toContain(`fusion-${siteId}-`)
      const xml = await (await policySitemap(ctx)).text()
      expect(xml).toContain(`${siteRegistry[siteId].canonicalOrigin}/policies/same-slug`)
      expect(xml).not.toContain(
        `${siteRegistry[siteId === 'vic' ? 'qld' : 'vic'].canonicalOrigin}/`
      )
    }
  )
})

import { GET as robots } from './robots.txt'
import { GET as llms } from './llms.txt'
import { GET as agents } from './agents.md'
import { GET as sitemapIndex } from './sitemap-index.xml'

describe('runtime discovery', () => {
  it('keeps overlapping Site discovery responses on their configured origins', async () => {
    for (const handler of [robots, llms, agents, sitemapIndex]) {
      const [vic, qld] = await Promise.all([
        Promise.resolve(handler(context('vic'))).then((response) => response.text()),
        Promise.resolve(handler(context('qld'))).then((response) => response.text()),
      ])
      expect(vic).toContain(siteRegistry.vic.canonicalOrigin)
      expect(vic).not.toContain(siteRegistry.qld.canonicalOrigin)
      expect(qld).toContain(siteRegistry.qld.canonicalOrigin)
      expect(qld).not.toContain(siteRegistry.vic.canonicalOrigin)
    }
  })
  it('preserves search access and training opt-out', async () => {
    const output = await (await robots(context('qld'))).text()
    expect(output).toContain('Content-Signal: search=yes, ai-train=no, ai-input=yes')
    expect(output).toContain('User-agent: GPTBot\nDisallow: /')
    expect(output).toContain('User-agent: OAI-SearchBot\nAllow: /')
  })
})
