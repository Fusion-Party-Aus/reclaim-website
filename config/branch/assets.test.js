import { describe, it, expect } from 'vitest'
import { ERROR_CODES, BranchConfigError } from './contract.mjs'
import {
  isBranchOwned,
  resolveAssets,
  resolveAnalytics,
  resolveServiceWorkerCache,
} from './assets.mjs'

/**
 * Inline fixtures. `resolved` is the mid-resolution descriptor shape the spec's
 * derivation functions receive: identity + canonicalOrigin + the RAW asset set
 * (before `resolveAssets` swaps `assets` for the resolved form).
 */
function vicResolved(overrides = {}) {
  return {
    identity: { slug: 'vic' },
    branchSlugs: ['vic', 'qld', 'nsw'],
    canonicalOrigin: 'https://vic.fusionparty.org.au',
    deploy: { cacheVersion: undefined },
    assets: {
      ogDefault: '/og/vic-default.png',
      hero: '/vic/hero.png',
      favicon: '/vic/favicon.svg',
      pwaManifest: '/vic/manifest.json',
      logo: '/vic/logo.svg',
      ogTemplate: '/og/vic-template.png',
    },
    analytics: { siteId: 'pa-HF_gBIYZhzFUGLXpsvgWh' },
    ...overrides,
  }
}

function qldResolved(overrides = {}) {
  return {
    identity: { slug: 'qld' },
    branchSlugs: ['vic', 'qld', 'nsw'],
    canonicalOrigin: 'https://qld.fusionparty.org.au',
    deploy: { cacheVersion: undefined },
    assets: {
      ogDefault: '/og/qld-default.png',
      hero: '/qld/hero.png',
      favicon: '/qld/favicon.svg',
      pwaManifest: '/qld/site.webmanifest',
      logo: '/qld/logo.svg',
      ogTemplate: '/og/qld-template.png',
    },
    analytics: { siteId: 'pa-QldSiteId123' },
    ...overrides,
  }
}

function thrownBy(fn) {
  try {
    fn()
  } catch (error) {
    return error
  }
  throw new Error('expected function to throw')
}

describe('resolveAssets', () => {
  it('recognizes foreign assets from any registered branch slug', () => {
    const slugs = ['vic', 'qld', 'nsw']
    expect(isBranchOwned('/og/nsw-default.png', 'vic', slugs)).toBe(false)
    expect(isBranchOwned('/nsw/hero.png', 'vic', slugs)).toBe(false)
    expect(isBranchOwned('/solo-full-colour.svg', 'vic', slugs)).toBe(true)
    expect(isBranchOwned('/og/nsw-default.png', 'nsw', slugs)).toBe(true)
  })

  it('resolves and absolutises the Victoria asset set', () => {
    const assets = resolveAssets(vicResolved())
    expect(assets.ogDefault).toBe('https://vic.fusionparty.org.au/og/vic-default.png')
    expect(assets.hero).toBe('https://vic.fusionparty.org.au/vic/hero.png')
    expect(assets.logo).toBe('https://vic.fusionparty.org.au/vic/logo.svg')
    expect(assets.favicon).toBe('/vic/favicon.svg')
    expect(assets.pwaManifest).toBe('/vic/manifest.json')
    expect(assets.ogTemplate).toBe('/og/vic-template.png')
  })

  it('resolves a second branch to its own origin and assets', () => {
    const assets = resolveAssets(qldResolved())
    expect(assets.ogDefault).toBe('https://qld.fusionparty.org.au/og/qld-default.png')
    expect(assets.hero).toBe('https://qld.fusionparty.org.au/qld/hero.png')
    expect(assets.logo).toBe('https://qld.fusionparty.org.au/qld/logo.svg')
    expect(assets.pwaManifest).toBe('/qld/site.webmanifest')
    // distinct from Victoria, never shared
    expect(assets.ogDefault).not.toBe(resolveAssets(vicResolved()).ogDefault)
  })

  it('treats optional assets as absent rather than fabricating a path', () => {
    const assets = resolveAssets(
      vicResolved({ assets: { ...vicResolved().assets, logo: undefined, ogTemplate: undefined } })
    )
    expect(assets.logo).toBeNull()
    expect(assets.ogTemplate).toBeNull()
  })

  it('throws ASSET_MISSING when a required asset is absent', () => {
    const error = thrownBy(() =>
      resolveAssets(vicResolved({ assets: { ...vicResolved().assets, ogDefault: '' } }))
    )
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.ASSET_MISSING)
    expect(error.field).toBe('assets.ogDefault')
  })

  it('throws ASSET_LEAKAGE when an asset belongs to another branch', () => {
    const error = thrownBy(() =>
      resolveAssets(
        qldResolved({ assets: { ...qldResolved().assets, ogDefault: '/og/vic-default.png' } })
      )
    )
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.ASSET_LEAKAGE)
    expect(error.field).toBe('assets.ogDefault')
    expect(error.context).toMatchObject({ slug: 'qld', path: '/og/vic-default.png' })
  })

  it('rejects assets owned by any other manifest branch, including a third branch', () => {
    const error = thrownBy(() =>
      resolveAssets({
        ...vicResolved(),
        branchSlugs: ['vic', 'qld', 'nsw'],
        assets: { ...vicResolved().assets, hero: '/nsw/hero.png' },
      })
    )
    expect(error.code).toBe(ERROR_CODES.ASSET_LEAKAGE)
  })

  it('allows safe shared root-relative assets such as logos and favicons', () => {
    const assets = resolveAssets(
      qldResolved({
        assets: { ...qldResolved().assets, logo: '/logo-rings-color.png', favicon: '/favicon.svg' },
      })
    )
    expect(assets.logo).toBe('https://qld.fusionparty.org.au/logo-rings-color.png')
    expect(assets.favicon).toBe('/favicon.svg')
  })

  it.each([
    '/../qld/hero.png',
    '/%2e%2e/qld/hero.png',
    '//evil.example/qld.png',
    'https://evil.example/qld.png',
    '/vic/hero.png',
    'https:\\evil/qld.png',
  ])('rejects unsafe or foreign asset %s', (hero) => {
    const error = thrownBy(() =>
      resolveAssets(qldResolved({ assets: { ...qldResolved().assets, hero } }))
    )
    expect(error.code).toBe(ERROR_CODES.ASSET_LEAKAGE)
  })
})

describe('resolveAnalytics', () => {
  it('derives a branch-scoped script URL from the branch site id', () => {
    const analytics = resolveAnalytics(qldResolved())
    expect(analytics.siteId).toBe('pa-QldSiteId123')
    expect(analytics.scriptUrl).toBe('https://analytics.fusionparty.org.au/js/pa-QldSiteId123.js')
    expect(analytics.scriptUrl).toContain(analytics.siteId)
    expect(analytics.initPath).toBe('/plausible-init.js')
  })

  it('derives a different script URL for each branch and never a shared literal', () => {
    const vic = resolveAnalytics(vicResolved())
    const qld = resolveAnalytics(qldResolved())
    expect(vic.scriptUrl).not.toBe(qld.scriptUrl)
    expect(vic.scriptUrl).toContain('pa-HF_gBIYZhzFUGLXpsvgWh')
    expect(qld.scriptUrl).toContain('pa-QldSiteId123')
  })

  it('throws ANALYTICS_SITE_ID_MISSING when the branch has no site id', () => {
    const error = thrownBy(() => resolveAnalytics(qldResolved({ analytics: { siteId: '   ' } })))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.ANALYTICS_SITE_ID_MISSING)
    expect(error.field).toBe('analytics.siteId')
    expect(error.context).toMatchObject({ slug: 'qld' })
  })

  it('allows explicitly disabled analytics without an ID or script URL', () => {
    expect(resolveAnalytics(qldResolved({ analytics: { enabled: false } }))).toEqual({
      enabled: false,
    })
  })
})

describe('resolveServiceWorkerCache', () => {
  it('derives a branch-scoped cache name from slug and cache version', () => {
    expect(resolveServiceWorkerCache(vicResolved())).toBe('fusion-vic-1')
    expect(resolveServiceWorkerCache(qldResolved())).toBe('fusion-qld-1')
  })

  it('uses the declared cache version when present', () => {
    expect(resolveServiceWorkerCache(qldResolved({ deploy: { cacheVersion: '7' } }))).toBe(
      'fusion-qld-7'
    )
  })

  it('never returns the shared fusion-vic-v1 literal for another branch', () => {
    const qldCache = resolveServiceWorkerCache(qldResolved())
    expect(qldCache).not.toBe('fusion-vic-v1')
    expect(qldCache).not.toContain('vic')
  })

  it('produces cache names that differ between branches', () => {
    expect(resolveServiceWorkerCache(vicResolved())).not.toBe(
      resolveServiceWorkerCache(qldResolved())
    )
  })
})
