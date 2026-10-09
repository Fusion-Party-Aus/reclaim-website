import { describe, it, expect } from 'vitest'
import { resolveDeployment } from './deployment.mjs'
import { starterContent } from './starter-content.mjs'

describe('deployment configuration', () => {
  it('existing Victoria deployments retain identity and content source', () => {
    const config = resolveDeployment()
    expect(config.siteUrl).toBe('https://vic.fusionparty.org.au')
    expect(config.projectId).toBe('qwl3f8jb')
    expect(config.dataset).toBe('production')
    expect(config.label).toBe('Fusion Party Victoria')
  })

  it('Queensland uses the same project with isolated content', () => {
    const config = resolveDeployment({ PUBLIC_BRANCH: 'qld' })
    expect(config.dataset).toBe('qld')
    expect(config.projectId).toBe('qwl3f8jb')
    expect(config.siteUrl).toBe('https://qld.fusionparty.org.au')
    expect(starterContent(config)[0].movementMetrics.length).toBe(0)
    expect(JSON.stringify(starterContent(config))).not.toContain('Victoria')
  })

  it('Studio and site resolve the same Queensland source', () => {
    expect(resolveDeployment({ SANITY_STUDIO_BRANCH: 'qld' })).toEqual(
      resolveDeployment({ PUBLIC_BRANCH: 'qld' })
    )
  })

  it('misconfigured branches fail instead of silently publishing Victoria', () => {
    expect(() => resolveDeployment({ PUBLIC_BRANCH: 'ql' })).toThrow(/Unknown/)
    expect(() =>
      resolveDeployment({ PUBLIC_BRANCH: 'qld', PUBLIC_SANITY_DATASET: 'production' })
    ).toThrow(/same Sanity project and dataset/)
  })

  it('custom canonical origin and a separate project are supported', () => {
    const config = resolveDeployment({
      PUBLIC_BRANCH: 'qld',
      SITE_URL: 'https://qld.fusionparty.org.au/',
      PUBLIC_SANITY_PROJECT_ID: 'other123',
      PUBLIC_SANITY_DATASET: 'production',
    })
    expect(config.siteUrl).toBe('https://qld.fusionparty.org.au')
    expect(config.dataset).toBe('production')
  })

  it('Victoria presentation config preserves the previously hardcoded values', () => {
    const config = resolveDeployment()
    expect(config.navigation.fallback).toEqual([
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Policies', href: '/policies' },
      { label: 'Vision', href: '/vision' },
      { label: 'Research', href: '/research' },
    ])
    expect(config.navigation.cta).toEqual({ label: 'Get involved', href: '/get-involved' })
    expect(config.contact.email).toBe('contact@fusionparty.org.au')
    expect(config.contact.pressEmail).toBe('press@fusionparty.org.au')
    expect(config.contact.helloEmail).toBe('hello@fusionparty.org.au')
    expect(config.contact.preselectionEmail).toBe('preselection@fusionparty.org.au')
    expect(config.contact.techEmail).toBe('tech@fusionparty.org.au')
    expect(config.contact.phone).toBe('0410 249 574')
    expect(config.contact.address).toBe('254 McLeod Lane\nMansfield VIC 3722\nAustralia')
    expect(config.contact.discord).toBe('https://www.fusionparty.org.au/discord')
    expect(config.analytics.plausibleScriptUrl).toBe(
      'https://analytics.fusionparty.org.au/js/pa-HF_gBIYZhzFUGLXpsvgWh.js'
    )
    expect(config.seo.nationalOrganizationUrl).toBe('https://fusionparty.org.au/#organization')
    expect(config.seo.logoPath).toBe('/logo-rings-color.png')
    expect(config.seo.defaultOgImage).toBe('/og/default.png')
    expect(config.cta).toEqual({
      getInvolved: '/get-involved',
      donate: '/get-involved#donate',
      donateNational: 'https://fusionparty.org.au/donate',
      contact: '/contact',
      costings: '/costings',
      electorates: '/electorate',
      transportScore: 'https://transportscore.fusionparty.org.au',
    })
    expect(config.footer.networkBrandingUrl).toBe('https://www.fusionparty.org.au')
    expect(config.footer.newsletterEndpoint).toBe('/api/newsletter')
  })

  it('blank Plausible overrides use the resolved analytics script URL', () => {
    const config = resolveDeployment({ PUBLIC_PLAUSIBLE_SRC: '  \t ' })
    expect(config.analytics.plausibleScriptUrl).toBe(
      'https://analytics.fusionparty.org.au/js/pa-HF_gBIYZhzFUGLXpsvgWh.js'
    )
  })

  it('exposes the resolved surface theme token for the web manifest', () => {
    const config = resolveDeployment()
    expect(config.themeTokens['surface-base']).toMatch(/^#[\da-f]{6}$/i)
  })

  it('Queensland presentation config uses its own values, never Victoria copy', () => {
    const victoria = resolveDeployment()
    const config = resolveDeployment({ PUBLIC_BRANCH: 'qld' })
    expect(config.navigation.fallback).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Policies', href: '/policies' },
      { label: 'Contact', href: '/contact' },
    ])
    expect(config.navigation.cta).toEqual({ label: 'Get involved', href: '/contact' })
    expect(config.navigation).not.toEqual(victoria.navigation)
    expect(config.analytics.plausibleScriptUrl).toBe(
      'https://analytics.fusionparty.org.au/js/pa-6TB7kWpUyzQNp_ONfw6M_.js'
    )
    expect(config.socialAccounts).toEqual([])
    expect(config.assets.hero).toBe('https://qld.fusionparty.org.au/solo-full-colour.svg')
    expect(victoria.socialAccounts).toHaveLength(4)
    expect(config.contact.phone).toBe(undefined)
    expect(config.contact.address).toBe(undefined)
    expect(config.contact.email).toBe(victoria.contact.email)
    expect(config.seo.defaultOgImage).toBe('/og/qld-default.png')
    expect(config.seo.defaultOgImage).not.toBe(victoria.seo.defaultOgImage)
    expect(config.cta.getInvolved).toBe('/contact')
    expect(config.cta.donate).toBe('https://fusionparty.org.au/donate')
    expect(config.cta.electorates).toBe('/electorates')
    expect(config.cta.costings).toBe(undefined)
    expect(config.cta.transportScore).toBe(undefined)
  })

  it('uses the registered QLD analytics site and accepts an explicit script override', () => {
    const config = resolveDeployment({
      PUBLIC_BRANCH: 'qld',
      PUBLIC_PLAUSIBLE_SRC: 'https://analytics.example.org/js/pa-test.js',
    })
    expect(config.analytics.plausibleScriptUrl).toBe('https://analytics.example.org/js/pa-test.js')
    const victoria = resolveDeployment({
      PUBLIC_PLAUSIBLE_SRC: 'https://analytics.example.org/js/pa-test.js',
    })
    expect(victoria.analytics.plausibleScriptUrl).toBe(
      'https://analytics.example.org/js/pa-test.js'
    )
  })
})
