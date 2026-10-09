import { describe, test, expect } from 'vitest'
import { branchManifest } from '../branches.mjs'
import { resolveBranch } from './resolver.mjs'
import { loadManifest } from './manifest.mjs'

const VIC_APP_ID = 'b1vkw1bmcrkhlb4no5vyzdlg'
const QLD_APP_ID = 'pctplpfvvxwavjm1erscuknz'
const VIC_ANALYTICS = 'pa-HF_gBIYZhzFUGLXpsvgWh'
const VIC_KV_ID = '4be5b5fc9edc49f3bd5a2c040483da0e'

function codeOf(fn) {
  try {
    fn()
    return null
  } catch (error) {
    return error.code
  }
}

function clone() {
  return globalThis.structuredClone(branchManifest)
}

describe('resolveBranch — Victoria', () => {
  test('resolves current Victoria values with no environment', () => {
    const vic = resolveBranch(branchManifest, {})
    expect(vic.identity.slug).toBe('vic')
    expect(vic.identity.siteUrl).toBe('https://vic.fusionparty.org.au')
    expect(vic.sanity.projectId).toBe('qwl3f8jb')
    expect(vic.sanity.dataset).toBe('production')
    expect(vic.sanity.studioAppId).toBe(VIC_APP_ID)
    expect(vic.analytics.resolved.siteId).toBe(VIC_ANALYTICS)
    expect(vic.runtime.socialAccounts).toHaveLength(4)
    expect(vic.canonicalOrigin).toBe('https://vic.fusionparty.org.au')
    expect(vic.jurisdiction).toBe('Victoria, Australia')
    expect(vic.description).toContain('Fusion Party Victoria — Reignite Democracy.')
    expect(vic.serviceWorkerCache).toBe('fusion-vic-1')
    expect(vic.theme.selector).toBe(":root[data-theme='vic']")
  })

  test('returns a frozen descriptor', () => {
    const vic = resolveBranch(branchManifest, {})
    expect(Object.isFrozen(vic)).toBe(true)
    expect(Object.isFrozen(vic.identity)).toBe(true)
    expect(Object.isFrozen(vic.sanity)).toBe(true)
    expect(Object.isFrozen(vic.deploy.kvNamespaces)).toBe(true)
  })
})

describe('resolveBranch — Queensland', () => {
  test('resolves current Queensland values with its own dataset and Studio app', () => {
    const qld = resolveBranch(branchManifest, { PUBLIC_BRANCH: 'qld' })
    expect(qld.identity.slug).toBe('qld')
    expect(qld.identity.siteUrl).toBe('https://qld.fusionparty.org.au')
    expect(qld.sanity.projectId).toBe('qwl3f8jb')
    expect(qld.sanity.dataset).toBe('qld')
    expect(qld.sanity.studioAppId).toBe(QLD_APP_ID)
    expect(qld.sanity.allowSharedProject).toBe(true)
    expect(qld.canonicalOrigin).toBe('https://qld.fusionparty.org.au')
    expect(qld.jurisdiction).toBe('Queensland, Australia')
    expect(qld.serviceWorkerCache).toBe('fusion-qld-1')
    expect(qld.analytics.resolved).toEqual({ enabled: false })
    expect(qld.runtime.socialAccounts).toEqual([])
    expect(qld.assets.resolved.hero).toBe('https://qld.fusionparty.org.au/solo-full-colour.svg')
  })

  test('BRANCH and SANITY_STUDIO_BRANCH agree on the same source', () => {
    const viaPublic = resolveBranch(branchManifest, { PUBLIC_BRANCH: 'qld' })
    const viaStudio = resolveBranch(branchManifest, { SANITY_STUDIO_BRANCH: 'qld' })
    const viaGeneric = resolveBranch(branchManifest, { BRANCH: 'qld' })
    expect(viaStudio.sanity).toEqual(viaPublic.sanity)
    expect(viaGeneric.sanity).toEqual(viaPublic.sanity)
  })
})

describe('resolveBranch — slug selection', () => {
  test('rejects an unknown but well-shaped slug', () => {
    expect(codeOf(() => resolveBranch(branchManifest, { PUBLIC_BRANCH: 'nsw' }))).toBe(
      'BRANCH_UNKNOWN'
    )
  })

  test('rejects an invalid slug shape', () => {
    expect(codeOf(() => resolveBranch(branchManifest, { PUBLIC_BRANCH: 'VIC' }))).toBe(
      'BRANCH_SLUG_INVALID'
    )
    expect(codeOf(() => resolveBranch(branchManifest, { BRANCH: 'q' }))).toBe('BRANCH_SLUG_INVALID')
  })

  test('falls back to the declared default when no env slug is supplied', () => {
    expect(resolveBranch(branchManifest, {}).identity.slug).toBe('vic')
  })
})

describe('resolveBranch — environment override precedence', () => {
  test('SITE_URL overrides siteUrl and canonicalOrigin', () => {
    const manifest = clone()
    manifest.branches.vic.identity.allowedOrigins.push('https://example.org')
    const vic = resolveBranch(manifest, { SITE_URL: 'https://example.org/' })
    expect(vic.identity.siteUrl).toBe('https://example.org')
    expect(vic.canonicalOrigin).toBe('https://example.org')
  })

  test.each([
    'https://elsewhere.org',
    'https://user:pass@vic.fusionparty.org.au',
    'https://vic.fusionparty.org.au:444',
    'https://vic.fusionparty.org.au/path',
  ])('rejects unsafe/unlisted SITE_URL %s', (SITE_URL) => {
    expect(codeOf(() => resolveBranch(branchManifest, { SITE_URL }))).toBe('FIELD_INVALID')
  })

  test('Sanity env overrides win over manifest values', () => {
    const vic = resolveBranch(branchManifest, {
      PUBLIC_SANITY_PROJECT_ID: 'other123',
      PUBLIC_SANITY_DATASET: 'preview',
      SANITY_STUDIO_APP_ID: 'app-override',
      PUBLIC_ANALYTICS_SITE_ID: 'pa-override',
      WORKER_NAME: 'worker-override',
    })
    expect(vic.sanity.projectId).toBe('other123')
    expect(vic.sanity.dataset).toBe('preview')
    expect(vic.sanity.studioAppId).toBe('app-override')
    expect(vic.analytics.resolved.siteId).toBe('pa-override')
    expect(vic.deploy.workerName).toBe('worker-override')
  })

  test('blank env values do not override the manifest', () => {
    const vic = resolveBranch(branchManifest, { WORKER_NAME: '   ', PUBLIC_SANITY_DATASET: '' })
    expect(vic.deploy.workerName).toBe('fusion-website')
    expect(vic.sanity.dataset).toBe('production')
  })

  test('disabled analytics stays disabled and emits no site ID or script', () => {
    const qld = resolveBranch(branchManifest, { PUBLIC_BRANCH: 'qld' })
    expect(qld.analytics.resolved).toEqual({ enabled: false })
    expect(qld.runtime.analytics.plausibleScriptUrl).toBeUndefined()
  })
})

describe('resolveBranch — cross-branch isolation after overrides', () => {
  test('a dataset override into another branch fails SANITY_BINDING_COLLISION', () => {
    expect(
      codeOf(() =>
        resolveBranch(branchManifest, { PUBLIC_BRANCH: 'qld', PUBLIC_SANITY_DATASET: 'production' })
      )
    ).toBe('SANITY_BINDING_COLLISION')
  })

  test('a Studio app override into another branch fails STUDIO_APP_COLLISION', () => {
    expect(
      codeOf(() =>
        resolveBranch(branchManifest, { PUBLIC_BRANCH: 'qld', SANITY_STUDIO_APP_ID: VIC_APP_ID })
      )
    ).toBe('STUDIO_APP_COLLISION')
  })

  test('an analytics override into another branch fails ANALYTICS_COLLISION', () => {
    expect(
      codeOf(() =>
        resolveBranch(branchManifest, {
          PUBLIC_BRANCH: 'qld',
          PUBLIC_ANALYTICS_SITE_ID: VIC_ANALYTICS,
        })
      )
    ).toBe('ANALYTICS_COLLISION')
  })

  test('a worker-name override into another branch fails WORKER_NAME_COLLISION', () => {
    expect(
      codeOf(() =>
        resolveBranch(branchManifest, { PUBLIC_BRANCH: 'qld', WORKER_NAME: 'fusion-website' })
      )
    ).toBe('WORKER_NAME_COLLISION')
  })

  test('a shared KV namespace fails KV_NAMESPACE_COLLISION', () => {
    const manifest = clone()
    manifest.branches.qld.deploy.kvNamespaces = [{ binding: 'SESSION', id: VIC_KV_ID }]
    expect(codeOf(() => resolveBranch(manifest, { PUBLIC_BRANCH: 'qld' }))).toBe(
      'KV_NAMESPACE_COLLISION'
    )
  })

  test('a shared project without allowSharedProject fails SANITY_PROJECT_SHARED', () => {
    const manifest = clone()
    delete manifest.branches.qld.sanity.allowSharedProject
    expect(codeOf(() => resolveBranch(manifest, { PUBLIC_BRANCH: 'qld' }))).toBe(
      'SANITY_PROJECT_SHARED'
    )
  })
})

describe('resolveBranch — required fields fail closed', () => {
  const requiredCases = [
    ['identity.state', (m) => (m.branches.vic.identity.state = '')],
    ['identity.adjective', (m) => (m.branches.vic.identity.adjective = '')],
    ['identity.label', (m) => (m.branches.vic.identity.label = '')],
    ['identity.tagline', (m) => (m.branches.vic.identity.tagline = '')],
    ['identity.themeColor', (m) => (m.branches.vic.identity.themeColor = '')],
    ['identity.siteUrl', (m) => (m.branches.vic.identity.siteUrl = '')],
    ['sanity.projectId', (m) => (m.branches.vic.sanity.projectId = '')],
    ['sanity.dataset', (m) => (m.branches.vic.sanity.dataset = '')],
    ['sanity.studioAppId', (m) => (m.branches.vic.sanity.studioAppId = '')],
    ['theme', (m) => (m.branches.vic.theme = null)],
    ['theme.tokens', (m) => (m.branches.vic.theme.tokens = null)],
    ['assets.ogDefault', (m) => (m.branches.vic.assets.ogDefault = '')],
    ['assets.hero', (m) => (m.branches.vic.assets.hero = '')],
    ['assets.favicon', (m) => (m.branches.vic.assets.favicon = '')],
    ['assets.pwaManifest', (m) => (m.branches.vic.assets.pwaManifest = '')],
    ['analytics.siteId', (m) => (m.branches.vic.analytics.siteId = '')],
    ['deploy.workerName', (m) => (m.branches.vic.deploy.workerName = '')],
    ['deploy.wranglerConfig', (m) => (m.branches.vic.deploy.wranglerConfig = '')],
    ['deploy.kvNamespaces', (m) => (m.branches.vic.deploy.kvNamespaces = null)],
    ['deploy.kvNamespaces[].binding', (m) => (m.branches.vic.deploy.kvNamespaces[0].binding = '')],
    ['deploy.kvNamespaces[].id', (m) => (m.branches.vic.deploy.kvNamespaces[0].id = '')],
  ]

  for (const [name, mutate] of requiredCases) {
    test(`missing ${name} throws FIELD_REQUIRED`, () => {
      const manifest = clone()
      mutate(manifest)
      expect(codeOf(() => resolveBranch(manifest, {}))).toBe('FIELD_REQUIRED')
    })
  }

  test('malformed values throw FIELD_INVALID', () => {
    const badColor = clone()
    badColor.branches.vic.identity.themeColor = '#zzz'
    expect(codeOf(() => resolveBranch(badColor, {}))).toBe('FIELD_INVALID')

    const badUrl = clone()
    badUrl.branches.vic.identity.siteUrl = 'not-a-url'
    expect(codeOf(() => resolveBranch(badUrl, {}))).toBe('FIELD_INVALID')

    const badTheme = clone()
    badTheme.branches.vic.theme.slug = 'qld'
    expect(codeOf(() => resolveBranch(badTheme, {}))).toBe('FIELD_INVALID')
  })

  test('several problems aggregate into FIELD_VALIDATION_FAILED', () => {
    const manifest = clone()
    manifest.branches.vic.identity.state = ''
    manifest.branches.vic.identity.label = ''
    expect(codeOf(() => resolveBranch(manifest, {}))).toBe('FIELD_VALIDATION_FAILED')
  })
})

describe('loadManifest — schema gate', () => {
  test('loads a well-formed manifest', () => {
    expect(loadManifest(branchManifest)).toBe(branchManifest)
  })

  test('throws MANIFEST_MISSING when nothing is supplied', () => {
    expect(codeOf(() => loadManifest(null))).toBe('MANIFEST_MISSING')
    expect(codeOf(() => loadManifest(undefined))).toBe('MANIFEST_MISSING')
  })

  test('throws MANIFEST_VERSION_UNSUPPORTED for a wrong schema version', () => {
    expect(codeOf(() => loadManifest({ ...branchManifest, schemaVersion: 2 }))).toBe(
      'MANIFEST_VERSION_UNSUPPORTED'
    )
  })

  test('throws MANIFEST_EMPTY when no branches are declared', () => {
    expect(codeOf(() => loadManifest({ ...branchManifest, branches: {} }))).toBe('MANIFEST_EMPTY')
  })

  test('throws BRANCH_DEFAULT_MISSING when the default is blank', () => {
    expect(codeOf(() => loadManifest({ ...branchManifest, defaultBranch: '' }))).toBe(
      'BRANCH_DEFAULT_MISSING'
    )
  })

  test('throws BRANCH_DEFAULT_UNKNOWN when the default is not registered', () => {
    expect(codeOf(() => loadManifest({ ...branchManifest, defaultBranch: 'nsw' }))).toBe(
      'BRANCH_DEFAULT_UNKNOWN'
    )
  })

  test('throws TOKEN_CONTRACT_MISSING when no token contract is present', () => {
    expect(codeOf(() => loadManifest({ ...branchManifest, tokenContract: undefined }))).toBe(
      'TOKEN_CONTRACT_MISSING'
    )
    expect(
      codeOf(() =>
        loadManifest({ ...branchManifest, tokenContract: { requiredRoles: [], kinds: {} } })
      )
    ).toBe('TOKEN_CONTRACT_MISSING')
  })

  test('throws MANIFEST_KEY_MISMATCH when a key does not match its slug', () => {
    const manifest = clone()
    manifest.branches.qt = manifest.branches.qld
    delete manifest.branches.qld
    expect(codeOf(() => loadManifest(manifest))).toBe('MANIFEST_KEY_MISMATCH')
  })
})
