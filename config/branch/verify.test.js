import { describe, it, expect } from 'vitest'
import { ERROR_CODES } from './contract.mjs'
import { verifyParity, verifyLeakage } from './verify.mjs'

/** A complete two-branch manifest. Every value is branch-distinct. */
function makeManifest() {
  return {
    schemaVersion: 1,
    defaultBranch: 'vic',
    tokenContract: {
      requiredRoles: ['primary', 'fg'],
      kinds: { primary: 'color', fg: 'color' },
    },
    branches: {
      vic: {
        identity: {
          slug: 'vic',
          state: 'Victoria',
          adjective: 'Victorian',
          label: 'Fusion Party Victoria',
          tagline: 'Reason Rights Results',
          themeColor: '#e5007d',
          siteUrl: 'https://vic.fusionparty.org.au',
        },
        sanity: { projectId: 'qwl3f8jb', dataset: 'production', studioAppId: 'studio-vic' },
        theme: { slug: 'vic', tokens: { primary: '#e5007d', fg: '#111111' } },
        assets: {
          ogDefault: '/og/vic-default.png',
          hero: '/hero/vic.png',
          favicon: '/favicon/vic.svg',
          pwaManifest: '/manifest-vic.webmanifest',
        },
        analytics: { siteId: 'pa-vic-aaa' },
        deploy: {
          workerName: 'fusion-vic',
          wranglerConfig: 'wrangler.toml',
          kvNamespaces: [{ binding: 'KV', id: 'kv-vic-1' }],
        },
      },
      qld: {
        identity: {
          slug: 'qld',
          state: 'Queensland',
          adjective: 'Queensland',
          label: 'Fusion Party Queensland',
          tagline: 'Queensland Deserves Better',
          themeColor: '#00843d',
          siteUrl: 'https://qld.fusionparty.org.au',
        },
        sanity: {
          projectId: 'qwl3f8jb',
          dataset: 'qld',
          studioAppId: 'studio-qld',
          allowSharedProject: true,
        },
        theme: { slug: 'qld', tokens: { primary: '#00843d', fg: '#ffffff' } },
        assets: {
          ogDefault: '/og/qld-default.png',
          hero: '/hero/qld.png',
          favicon: '/favicon/qld.svg',
          pwaManifest: '/manifest-qld.webmanifest',
        },
        analytics: { siteId: 'pa-qld-bbb' },
        deploy: {
          workerName: 'fusion-qld',
          wranglerConfig: 'wrangler.qld.toml',
          kvNamespaces: [{ binding: 'KV', id: 'kv-qld-1' }],
        },
      },
    },
  }
}

/** Build a complete ResolvedBranch descriptor for a manifest slug. */
function makeResolved(manifest, slug) {
  const entry = manifest.branches[slug]
  return {
    identity: { ...entry.identity },
    sanity: { ...entry.sanity },
    theme: {
      slug: entry.theme.slug,
      selector: `:root[data-theme='${slug}']`,
      tokens: { ...entry.theme.tokens },
      contract: manifest.tokenContract,
    },
    assets: {
      raw: { ...entry.assets },
      resolved: {
        ogDefault: `https://${slug}.fusionparty.org.au${entry.assets.ogDefault}`,
        hero: `https://${slug}.fusionparty.org.au${entry.assets.hero}`,
        favicon: entry.assets.favicon,
        pwaManifest: entry.assets.pwaManifest,
        logo: null,
        ogTemplate: null,
      },
    },
    analytics: {
      raw: { ...entry.analytics },
      resolved: {
        siteId: entry.analytics.siteId,
        scriptUrl: `https://analytics.fusionparty.org.au/js/${entry.analytics.siteId}.js`,
        initPath: '/plausible-init.js',
      },
    },
    deploy: {
      ...entry.deploy,
      kvNamespaces: entry.deploy.kvNamespaces.map((ns) => ({ ...ns })),
    },
    presentation: { navigation: [], contact: {}, social: [], seo: {}, ctas: [] },
    jurisdiction: `${entry.identity.state}, Australia`,
    description: `${entry.identity.label} — ${entry.identity.tagline}.`,
    canonicalOrigin: entry.identity.siteUrl,
    serviceWorkerCache: `fusion-${slug}-1`,
  }
}

function captureError(fn) {
  try {
    fn()
  } catch (error) {
    return error
  }
  throw new Error('expected function to throw, but it did not')
}

function expectCode(fn, code) {
  const error = captureError(fn)
  expect(error).toBeInstanceOf(Error)
  expect(error.code).toBe(code)
  return error
}

describe('verifyParity', () => {
  it('passes for a complete resolved descriptor', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    expect(() => verifyParity(resolved, manifest)).not.toThrow()
  })

  it('fails with PARITY_FAILURE when identity.slug is missing', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    delete resolved.identity.slug
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('identity.slug')
    expect(error.message).toContain('identity.slug')
  })

  it('fails with PARITY_FAILURE when the manifest key does not match identity.slug', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    manifest.branches.vic.identity.slug = 'nsw'
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('branches.vic.identity.slug')
    expect(error.message).toContain('nsw')
  })

  it('fails with PARITY_FAILURE when the theme is missing', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    resolved.theme = undefined
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('theme')
    expect(error.message).toContain('theme')
  })

  it('fails with PARITY_FAILURE when a required asset is missing', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    resolved.assets.raw.ogDefault = ''
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('assets.ogDefault')
    expect(error.message).toContain('assets.ogDefault')
  })

  it('fails with PARITY_FAILURE when analytics is missing', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    resolved.analytics.raw.siteId = ''
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('analytics.siteId')
    expect(error.message).toContain('analytics.siteId')
  })

  it('fails with PARITY_FAILURE when the deploy config is missing', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    resolved.deploy.workerName = ''
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('deploy.workerName')
    expect(error.message).toContain('deploy.workerName')
  })

  it('fails with PARITY_FAILURE when the branch is not registered', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    resolved.identity.slug = 'nsw'
    const error = expectCode(() => verifyParity(resolved, manifest), ERROR_CODES.PARITY_FAILURE)
    expect(error.field).toContain('branches.nsw')
  })
})

describe('verifyLeakage', () => {
  it('passes when output contains only the resolved branch identity', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const output = [
      resolved.identity.label,
      resolved.identity.tagline,
      resolved.assets.raw.ogDefault,
      resolved.assets.raw.hero,
      resolved.analytics.raw.siteId,
      resolved.serviceWorkerCache,
    ].join('\n')
    expect(() => verifyLeakage(resolved, manifest, () => output)).not.toThrow()
  })

  it('fails with LEAKAGE_FAILURE on a foreign identity label', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const token = manifest.branches.qld.identity.label
    const error = expectCode(
      () => verifyLeakage(resolved, manifest, () => `<p>${token}</p>`),
      ERROR_CODES.LEAKAGE_FAILURE
    )
    expect(error.message).toContain('qld')
    expect(error.message).toContain(token)
    expect(error.context).toMatchObject({ foreign: 'qld', kind: 'identity' })
  })

  it('fails with LEAKAGE_FAILURE on a foreign identity tagline', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const token = manifest.branches.qld.identity.tagline
    const error = expectCode(
      () => verifyLeakage(resolved, manifest, () => token),
      ERROR_CODES.LEAKAGE_FAILURE
    )
    expect(error.message).toContain('qld')
    expect(error.message).toContain(token)
  })

  it('fails with LEAKAGE_FAILURE on a foreign asset path', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const token = manifest.branches.qld.assets.ogDefault
    const error = expectCode(
      () => verifyLeakage(resolved, manifest, () => `<img src="${token}">`),
      ERROR_CODES.LEAKAGE_FAILURE
    )
    expect(error.message).toContain('qld')
    expect(error.message).toContain(token)
    expect(error.context).toMatchObject({ foreign: 'qld', kind: 'asset' })
  })

  it('fails with LEAKAGE_FAILURE on a foreign analytics site id', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const token = manifest.branches.qld.analytics.siteId
    const error = expectCode(
      () => verifyLeakage(resolved, manifest, () => `data-site="${token}"`),
      ERROR_CODES.LEAKAGE_FAILURE
    )
    expect(error.message).toContain('qld')
    expect(error.message).toContain(token)
    expect(error.context).toMatchObject({ foreign: 'qld', kind: 'analytics' })
  })

  it('fails with LEAKAGE_FAILURE on a foreign cache namespace', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const token = 'fusion-qld'
    const error = expectCode(
      () => verifyLeakage(resolved, manifest, () => `const CACHE = '${token}-3';`),
      ERROR_CODES.LEAKAGE_FAILURE
    )
    expect(error.message).toContain('qld')
    expect(error.message).toContain(token)
    expect(error.context).toMatchObject({ foreign: 'qld', kind: 'cache' })
  })

  it('is a pure function of (descriptor, manifest, output)', () => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, 'vic')
    const snapshot = JSON.stringify({ manifest, resolved })
    verifyLeakage(resolved, manifest, () => 'clean output')
    expect(JSON.stringify({ manifest, resolved })).toBe(snapshot)
  })

  it.each(['vic', 'qld'])('accepts only %s manifest branding and cache namespace', (slug) => {
    const manifest = makeManifest()
    const resolved = makeResolved(manifest, slug)
    const foreign = slug === 'vic' ? 'qld' : 'vic'
    const output = JSON.stringify({
      manifest: {
        name: `${resolved.identity.label} — ${resolved.identity.tagline}`,
        theme_color: resolved.identity.themeColor,
      },
      serviceWorker: `const CACHE_NAME = 'fusion-${slug}-v1'`,
      resources: [resolved.assets.raw.ogDefault, resolved.assets.raw.hero],
      analytics: resolved.analytics.raw.siteId,
    })

    expect(() => verifyLeakage(resolved, manifest, () => output)).not.toThrow()
    expect(() =>
      verifyLeakage(resolved, manifest, () => output + ` fusion-${foreign}-v1`)
    ).toThrow()
  })
})
