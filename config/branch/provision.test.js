import { describe, it, expect } from 'vitest'
import { BranchConfigError, ERROR_CODES } from './contract.mjs'
import { SINGLETON_TYPES } from './singletons.mjs'
import { buildStarterContent } from './starter-content.mjs'
import { provisionBranch } from './provision.mjs'

/**
 * Inline fixtures only — no network, no real Sanity client. The `adapters`
 * object is the injected Sanity port described in the architecture blueprint
 * §3.1; `manifestWriter` is the atomic ManifestWriter seam.
 */

const CREDENTIALS = { writeToken: 'test-write-token' }

const QLD_IDENTITY = {
  slug: 'qld',
  state: 'Queensland',
  adjective: 'Queensland',
  label: 'Fusion Party Queensland',
  tagline: 'Reason. Rights. Results.',
  themeColor: '#123456',
  siteUrl: 'https://qld.fusionparty.org.au',
}

function vicEntry() {
  return {
    identity: {
      slug: 'vic',
      state: 'Victoria',
      adjective: 'Victorian',
      label: 'Fusion Party Victoria',
      tagline: 'Reignite Democracy',
      themeColor: '#d428d4',
      siteUrl: 'https://vic.fusionparty.org.au',
    },
    sanity: { projectId: 'qwl3f8jb', dataset: 'production', studioAppId: 'vic-app' },
    theme: { slug: 'vic', tokens: {} },
    assets: {
      ogDefault: '/og/vic-default.png',
      hero: '/vic/hero.png',
      favicon: '/vic/favicon.svg',
      pwaManifest: '/vic/site.webmanifest',
    },
    analytics: { siteId: 'pa-vic' },
    deploy: { workerName: 'fusion-vic', wranglerConfig: 'wrangler.toml', kvNamespaces: [] },
  }
}

function baseManifest() {
  return {
    schemaVersion: 1,
    defaultBranch: 'vic',
    branches: { vic: vicEntry() },
    tokenContract: { requiredRoles: ['fg'], kinds: { fg: 'color' } },
  }
}

function makeHarness({ existingDatasets = [] } = {}) {
  const state = {
    manifest: baseManifest(),
    datasets: new Set(existingDatasets),
    docs: new Set(),
    calls: {
      createProject: [],
      listDatasets: [],
      createDataset: [],
      createStudioApp: [],
      deployStudio: [],
      documentExists: [],
      createIfNotExists: [],
      manifestWriter: [],
    },
  }

  const adapters = {
    createProject: async (label, credentials) => {
      state.calls.createProject.push({ label, token: credentials?.writeToken })
      return 'proj-new'
    },
    listDatasets: async (projectId, credentials) => {
      state.calls.listDatasets.push({ projectId, token: credentials?.writeToken })
      return [...state.datasets].map((name) => ({ name }))
    },
    createDataset: async (projectId, dataset, options, credentials) => {
      state.calls.createDataset.push({ projectId, dataset, options })
      state.datasets.add(dataset)
      return { name: dataset }
    },
    createStudioApp: async (projectId, credentials) => {
      state.calls.createStudioApp.push({ projectId, token: credentials?.writeToken })
      return 'app-new'
    },
    deployStudio: async (spec, credentials) => {
      state.calls.deployStudio.push({ spec, token: credentials?.writeToken })
      return { deployed: true }
    },
    documentExists: async (projectId, dataset, documentId, credentials) => {
      state.calls.documentExists.push({ documentId, token: credentials?.writeToken })
      return state.docs.has(documentId)
    },
    createIfNotExists: async (projectId, dataset, document, credentials) => {
      state.calls.createIfNotExists.push({ type: document._type, token: credentials?.writeToken })
      state.docs.add(document._id)
      return document
    },
    manifestWriter: async (manifest, slug, entry) => {
      const next = { ...manifest, branches: { ...manifest.branches, [slug]: entry } }
      state.manifest = next
      state.calls.manifestWriter.push({ slug, entry })
      return next
    },
  }

  return { state, adapters }
}

async function captureError(promise) {
  try {
    await promise
    return null
  } catch (error) {
    return error
  }
}

const sorted = (values) => [...values].sort()

describe('SINGLETON_TYPES', () => {
  it('registers every singleton the site reads, and nothing else', () => {
    expect(SINGLETON_TYPES).toEqual(['homePage', 'navigation', 'footer', 'siteConfig'])
  })

  it('is frozen so the algorithm iterates rather than mutating the registry', () => {
    expect(Object.isFrozen(SINGLETON_TYPES)).toBe(true)
  })
})

describe('buildStarterContent', () => {
  it('builds exactly one document per singleton type', () => {
    const documents = buildStarterContent({ identity: QLD_IDENTITY })
    expect(sorted(documents.map((document) => document._type))).toEqual(sorted(SINGLETON_TYPES))
  })

  it('contains no Victoria-only strings for a non-Victoria branch', () => {
    const json = JSON.stringify(buildStarterContent({ identity: QLD_IDENTITY }))
    expect(json).not.toMatch(/Victoria/i)
    expect(json).not.toMatch(/Victorian/i)
    expect(json).not.toContain('Fusion Party Victoria')
  })

  it('derives its copy from the supplied identity, never a hardcoded branch', () => {
    const json = JSON.stringify(buildStarterContent({ identity: QLD_IDENTITY }))
    expect(json).toContain('Fusion Party Queensland')
    expect(json).toContain('QUEENSLAND')
  })

  it('starts every branch with empty movement metrics, stats and cards', () => {
    const documents = buildStarterContent({ identity: QLD_IDENTITY })
    const homePage = documents.find((document) => document._type === 'homePage')
    expect(homePage.movementMetrics).toEqual([])
    expect(homePage.hero.stats).toEqual([])
    expect(homePage.theftSection.cards).toEqual([])
  })
})

describe('provisionBranch — fail-closed refusals', () => {
  it('refuses a reserved slug with BRANCH_RESERVED', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(state.manifest, 'vic', { identity: QLD_IDENTITY }, CREDENTIALS, adapters)
    )
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.BRANCH_RESERVED)
  })

  it('refuses the manifest default branch unless explicitly allowed', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(state.manifest, 'vic', { allowDefault: false }, CREDENTIALS, adapters)
    )
    expect(error.code).toBe(ERROR_CODES.BRANCH_RESERVED)
  })

  it('requires authorization as well as allowDefault for the manifest default branch', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(
        state.manifest,
        'vic',
        { allowDefault: true, aclMode: 'public' },
        CREDENTIALS,
        adapters
      )
    )
    expect(error.code).toBe(ERROR_CODES.BRANCH_RESERVED)
    expect(Object.values(state.calls).flat()).toHaveLength(0)
  })

  it('refuses an already-registered slug with BRANCH_ALREADY_REGISTERED', async () => {
    const { state, adapters } = makeHarness()
    state.manifest.branches.qld = { ...vicEntry(), identity: QLD_IDENTITY }
    const error = await captureError(
      provisionBranch(state.manifest, 'qld', {}, CREDENTIALS, adapters)
    )
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.BRANCH_ALREADY_REGISTERED)
  })

  it('requires authorizeUpdate before reconciling an existing branch', async () => {
    const { state, adapters } = makeHarness()
    state.manifest.branches.qld = { ...vicEntry(), identity: QLD_IDENTITY }
    const error = await captureError(
      provisionBranch(
        state.manifest,
        'qld',
        { mode: 'update', aclMode: 'public' },
        CREDENTIALS,
        adapters
      )
    )
    expect(error.code).toBe(ERROR_CODES.BRANCH_ALREADY_REGISTERED)
    expect(Object.values(state.calls).flat()).toHaveLength(0)
  })

  it('requires a write token with CREDENTIAL_MISSING', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(state.manifest, 'qld', { identity: QLD_IDENTITY }, {}, adapters)
    )
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.CREDENTIAL_MISSING)
  })

  it('rejects an invalid slug shape with BRANCH_SLUG_INVALID', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(state.manifest, 'VIC', { identity: QLD_IDENTITY }, CREDENTIALS, adapters)
    )
    expect(error.code).toBe(ERROR_CODES.BRANCH_SLUG_INVALID)
  })
})

describe('provisionBranch — creation and seeding', () => {
  it('rejects a caller-supplied cross-branch binding before any adapter side effect', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(
        state.manifest,
        'qld',
        {
          identity: QLD_IDENTITY,
          projectId: 'qwl3f8jb',
          dataset: 'production',
          studioAppId: 'app-new',
          aclMode: 'public',
          theme: { slug: 'qld', tokens: { fg: '#123456' } },
        },
        CREDENTIALS,
        adapters
      )
    )
    expect(error.code).toBe(ERROR_CODES.SANITY_BINDING_COLLISION)
    expect(Object.values(state.calls).flat()).toHaveLength(0)
  })

  it('rejects invalid caller options before any adapter side effect', async () => {
    const { state, adapters } = makeHarness()
    const error = await captureError(
      provisionBranch(
        state.manifest,
        'qld',
        {
          identity: { ...QLD_IDENTITY, siteUrl: 'javascript:alert(1)' },
          aclMode: 'public',
        },
        CREDENTIALS,
        adapters
      )
    )
    expect(error).not.toBeNull()
    expect(Object.values(state.calls).flat()).toHaveLength(0)
  })

  it('creates the project, dataset, Studio app and seeds every singleton type', async () => {
    const { state, adapters } = makeHarness()

    const result = await provisionBranch(
      state.manifest,
      'qld',
      {
        identity: QLD_IDENTITY,
        aclMode: 'public',
        theme: { slug: 'qld', tokens: { fg: '#123456' } },
      },
      CREDENTIALS,
      adapters
    )

    expect(result.slug).toBe('qld')
    expect(result.projectId).toBe('proj-new')
    expect(result.dataset).toBe('production')
    expect(result.studioAppId).toBe('app-new')
    expect(sorted(result.seeded)).toEqual(sorted(SINGLETON_TYPES))
    expect(result.skipped).toEqual([])
    expect(result.manifestUpdated).toBe(true)

    expect(state.calls.createProject).toHaveLength(1)
    expect(state.calls.createDataset.map((call) => call.dataset)).toEqual(['production'])
    expect(state.calls.createStudioApp).toHaveLength(1)
    expect(state.calls.deployStudio).toHaveLength(1)
    expect(state.calls.deployStudio[0].spec).toMatchObject({
      projectId: 'proj-new',
      dataset: 'production',
      studioAppId: 'app-new',
      themeSlug: 'qld',
    })
    expect(sorted(state.calls.createIfNotExists.map((call) => call.type))).toEqual(
      sorted(SINGLETON_TYPES)
    )
  })

  it('writes the manifest entry atomically through the injected manifestWriter', async () => {
    const { state, adapters } = makeHarness()

    await provisionBranch(
      state.manifest,
      'qld',
      {
        identity: QLD_IDENTITY,
        aclMode: 'public',
        theme: { slug: 'qld', tokens: { fg: '#123456' } },
      },
      CREDENTIALS,
      adapters
    )

    expect(state.calls.manifestWriter).toHaveLength(1)
    expect(state.calls.manifestWriter[0].slug).toBe('qld')
    const entry = state.manifest.branches.qld
    expect(entry.identity.slug).toBe('qld')
    expect(entry.sanity).toMatchObject({
      projectId: 'proj-new',
      dataset: 'production',
      studioAppId: 'app-new',
    })
  })

  it('writes the validated manifest entry before seeding so failed seeding retains resource IDs', async () => {
    const { state, adapters } = makeHarness()
    adapters.createIfNotExists = async () => {
      throw new Error('seed failed')
    }

    const error = await captureError(
      provisionBranch(
        state.manifest,
        'qld',
        { identity: QLD_IDENTITY, aclMode: 'public' },
        CREDENTIALS,
        adapters
      )
    )

    expect(error.message).toBe('seed failed')
    expect(state.manifest.branches.qld.sanity).toEqual({
      projectId: 'proj-new',
      dataset: 'production',
      studioAppId: 'app-new',
    })
    expect(error.remoteSideEffects).toContain('manifestWriter')
    expect(error.remoteSideEffects).toContain('deployStudio')
  })

  it('reuses a supplied project, dataset and Studio app instead of creating them', async () => {
    const { state, adapters } = makeHarness({ existingDatasets: ['preview'] })

    const result = await provisionBranch(
      state.manifest,
      'qld',
      {
        identity: QLD_IDENTITY,
        aclMode: 'public',
        theme: { slug: 'qld', tokens: { fg: '#123456' } },
        projectId: 'proj-given',
        dataset: 'preview',
        studioAppId: 'app-given',
      },
      CREDENTIALS,
      adapters
    )

    expect(result.projectId).toBe('proj-given')
    expect(result.dataset).toBe('preview')
    expect(result.studioAppId).toBe('app-given')
    expect(state.calls.createProject).toEqual([])
    expect(state.calls.createStudioApp).toEqual([])
    expect(state.calls.createDataset).toEqual([])
  })

  it('skips creating a dataset that already exists', async () => {
    const { state, adapters } = makeHarness({ existingDatasets: ['production'] })

    await provisionBranch(
      state.manifest,
      'qld',
      {
        identity: QLD_IDENTITY,
        aclMode: 'public',
        theme: { slug: 'qld', tokens: { fg: '#123456' } },
      },
      CREDENTIALS,
      adapters
    )

    expect(state.calls.createDataset).toEqual([])
  })
})

describe('provisionBranch — idempotency', () => {
  it('skips singleton documents that already exist and never overwrites them', async () => {
    const { state, adapters } = makeHarness()

    const first = await provisionBranch(
      state.manifest,
      'qld',
      {
        identity: QLD_IDENTITY,
        aclMode: 'public',
        theme: { slug: 'qld', tokens: { fg: '#123456' } },
      },
      CREDENTIALS,
      adapters
    )
    const writesAfterFirst = state.calls.createIfNotExists.length

    const second = await provisionBranch(
      state.manifest,
      'qld',
      {
        identity: QLD_IDENTITY,
        mode: 'update',
        authorizeUpdate: true,
        aclMode: 'public',
        theme: { slug: 'qld', tokens: { fg: '#123456' } },
      },
      CREDENTIALS,
      adapters
    )

    expect(sorted(first.seeded)).toEqual(sorted(SINGLETON_TYPES))
    expect(second.seeded).toEqual([])
    expect(sorted(second.skipped)).toEqual(sorted(SINGLETON_TYPES))
    expect(second.projectId).toBe(first.projectId)
    expect(state.calls.createIfNotExists.length).toBe(writesAfterFirst)
    expect(state.calls.createProject).toHaveLength(1)
  })
})
