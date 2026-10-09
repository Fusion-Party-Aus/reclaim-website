import { describe, expect, it } from 'vitest'
import { BranchConfigError, ERROR_CODES } from './contract.mjs'
import { buildAllBranches, resolveDeployConfig } from './deploy.mjs'

// Inline, branch-distinct deploy data. The resolver must read the wrangler path
// from this data and never special-case a slug.
const DEPLOY_DATA = {
  vic: {
    workerName: 'fusion-website',
    wranglerConfig: './wrangler.toml',
    kvNamespaces: [{ binding: 'NATIONBUILDER_TOKENS', id: 'vic-token-kv' }],
  },
  qld: {
    workerName: 'fusion-website-qld',
    wranglerConfig: './wrangler.qld.toml',
    kvNamespaces: [{ binding: 'SESSION', id: 'qld-session-kv' }],
  },
  nsw: {
    workerName: 'fusion-website-nsw',
    wranglerConfig: './wrangler.nsw.toml',
    kvNamespaces: [{ binding: 'SESSION', id: 'nsw-session-kv' }],
  },
}

const resolvedFor = (slug, overrides = {}) => ({
  identity: { slug },
  deploy: { ...DEPLOY_DATA[slug], ...overrides },
})

const allowAll = () => true
const virtualFiles = { fileExists: allowAll, realpath: (value) => value }

const captureError = (fn) => {
  try {
    fn()
  } catch (error) {
    return error
  }
  throw new Error('expected resolveDeployConfig to throw')
}

const manifestFixture = () => ({
  schemaVersion: 1,
  defaultBranch: 'vic',
  tokenContract: { requiredRoles: ['fg'], kinds: {} },
  branches: Object.fromEntries(Object.keys(DEPLOY_DATA).map((slug) => [slug, {}])),
})

describe('resolveDeployConfig', () => {
  it('resolves the qld wrangler config path from manifest data', () => {
    const config = resolveDeployConfig(resolvedFor('qld'), {}, { fileExists: allowAll })

    expect(config.workerName).toBe('fusion-website-qld')
    expect(config.wranglerConfigPath.endsWith('wrangler.qld.toml')).toBe(true)
    expect(config.wranglerConfigPath).not.toContain('wrangler.toml')
    expect(config.kvNamespaces).toEqual([{ binding: 'SESSION', id: 'qld-session-kv' }])
  })

  it('resolves a third branch to its own wrangler config (not qld, not vic)', () => {
    const config = resolveDeployConfig(resolvedFor('nsw'), {}, virtualFiles)

    expect(config.workerName).toBe('fusion-website-nsw')
    expect(config.wranglerConfigPath.endsWith('wrangler.nsw.toml')).toBe(true)
    expect(config.wranglerConfigPath).not.toContain('wrangler.qld.toml')
    expect(config.wranglerConfigPath).not.toContain('wrangler.toml')
  })

  it('existence-checks the resolved config path via the injected fileExists', () => {
    const seen = []
    resolveDeployConfig(
      resolvedFor('qld'),
      {},
      {
        fileExists: (configPath) => {
          seen.push(configPath)
          return true
        },
      }
    )

    expect(seen).toHaveLength(1)
    expect(seen[0].endsWith('wrangler.qld.toml')).toBe(true)
  })

  it('defaults compatibility flags and omits the compatibility date when unset', () => {
    const config = resolveDeployConfig(resolvedFor('vic'), {}, { fileExists: allowAll })

    expect(config.compatibilityFlags).toEqual(['nodejs_compat'])
    expect(config.compatibilityDate).toBeUndefined()
  })

  it('preserves explicit compatibility flags and date', () => {
    const config = resolveDeployConfig(
      resolvedFor('qld', {
        compatibilityFlags: ['nodejs_compat', 'global_fetch_strictly_public'],
        compatibilityDate: '2025-01-29',
      }),
      {},
      virtualFiles
    )

    expect(config.compatibilityFlags).toEqual(['nodejs_compat', 'global_fetch_strictly_public'])
    expect(config.compatibilityDate).toBe('2025-01-29')
  })

  it('applies the WORKER_NAME environment override', () => {
    const config = resolveDeployConfig(
      resolvedFor('qld'),
      { WORKER_NAME: 'override-worker' },
      { fileExists: allowAll }
    )

    expect(config.workerName).toBe('override-worker')
  })

  it('throws DEPLOY_CONFIG_MISSING when the Worker name is absent', () => {
    const error = captureError(() =>
      resolveDeployConfig(resolvedFor('qld', { workerName: '' }), {}, { fileExists: allowAll })
    )

    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    expect(error.field).toBe('deploy.workerName')
  })

  it('throws DEPLOY_CONFIG_MISSING when the wrangler config is absent', () => {
    const error = captureError(() =>
      resolveDeployConfig(
        resolvedFor('qld', { wranglerConfig: '   ' }),
        {},
        { fileExists: allowAll }
      )
    )

    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    expect(error.field).toBe('deploy.wranglerConfig')
  })

  it('throws DEPLOY_CONFIG_MISSING when the wrangler config file does not exist', () => {
    const error = captureError(() =>
      resolveDeployConfig(resolvedFor('qld'), {}, { fileExists: () => false })
    )

    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    expect(error.field).toBe('deploy.wranglerConfig')
    expect(error.context.slug).toBe('qld')
  })

  it.each(['../outside/wrangler.toml', '/tmp/wrangler.toml', 'config.json'])(
    'rejects non-contained Wrangler path %s',
    (wranglerConfig) => {
      const error = captureError(() =>
        resolveDeployConfig(resolvedFor('vic', { wranglerConfig }), {}, virtualFiles)
      )
      expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    }
  )

  it('rejects a symlink whose real path escapes the repository', () => {
    const error = captureError(() =>
      resolveDeployConfig(
        resolvedFor('vic'),
        {},
        {
          fileExists: allowAll,
          realpath: () => '/tmp/outside/wrangler.toml',
        }
      )
    )
    expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
  })

  it('wraps canonicalization failures with deploy context', () => {
    const error = captureError(() =>
      resolveDeployConfig(
        resolvedFor('qld'),
        {},
        {
          fileExists: allowAll,
          realpath: () => {
            throw new Error('unavailable')
          },
        }
      )
    )
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    expect(error.field).toBe('deploy.wranglerConfig')
    expect(error.context).toMatchObject({
      slug: 'qld',
      path: expect.stringContaining('wrangler.qld.toml'),
    })
  })

  it('throws DEPLOY_CONFIG_MISSING when a KV namespace binding is incomplete', () => {
    const error = captureError(() =>
      resolveDeployConfig(
        resolvedFor('qld', { kvNamespaces: [{ binding: 'SESSION', id: '' }] }),
        {},
        { fileExists: allowAll }
      )
    )

    expect(error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    expect(error.field).toBe('deploy.kvNamespaces')
  })
})

describe('buildAllBranches', () => {
  it('visits every registered branch and reports per-branch success/failure', () => {
    const visited = []
    const built = []

    const results = buildAllBranches(
      manifestFixture(),
      {},
      {
        resolveBranch: (_manifest, env) => resolvedFor(env.PUBLIC_BRANCH),
        ...virtualFiles,
        buildBranch: (resolved, deploy) => {
          visited.push(resolved.identity.slug)
          built.push(deploy.wranglerConfigPath)
        },
        verify: (resolved) => {
          if (resolved.identity.slug === 'qld') throw new Error('verification failed')
        },
      }
    )

    expect(results.map((result) => result.slug)).toEqual(['vic', 'qld', 'nsw'])
    expect(results.map((result) => result.status)).toEqual(['ok', 'error', 'ok'])
    expect(visited).toEqual(['vic', 'qld', 'nsw'])
    expect(built[0].endsWith('wrangler.toml')).toBe(true)
    expect(built[1].endsWith('wrangler.qld.toml')).toBe(true)
    expect(built[2].endsWith('wrangler.nsw.toml')).toBe(true)
    expect(results[0].error).toBeNull()
    expect(results[1].error.message).toBe('verification failed')
  })

  it('reports a per-branch DEPLOY_CONFIG_MISSING without stopping the matrix', () => {
    const results = buildAllBranches(
      manifestFixture(),
      {},
      {
        resolveBranch: (_manifest, env) => resolvedFor(env.PUBLIC_BRANCH),
        ...virtualFiles,
        fileExists: (configPath) => !configPath.endsWith('wrangler.qld.toml'),
        buildBranch: () => {},
        verify: () => {},
      }
    )

    const qld = results.find((result) => result.slug === 'qld')
    expect(qld.status).toBe('error')
    expect(qld.error.code).toBe(ERROR_CODES.DEPLOY_CONFIG_MISSING)
    expect(results.filter((result) => result.status === 'ok')).toHaveLength(2)
  })

  it('resolves each branch under its own PUBLIC_BRANCH environment', () => {
    const seen = []

    buildAllBranches(
      manifestFixture(),
      { BRANCH: 'vic' },
      {
        resolveBranch: (_manifest, env) => {
          seen.push(env)
          return resolvedFor(env.PUBLIC_BRANCH)
        },
        fileExists: allowAll,
        buildBranch: () => {},
        verify: () => {},
      }
    )

    expect(seen.map((env) => env.PUBLIC_BRANCH)).toEqual(['vic', 'qld', 'nsw'])
    expect(seen.every((env) => env.BRANCH === 'vic')).toBe(true)
  })

  it('returns an empty result list for a manifest with no branches', () => {
    const results = buildAllBranches(
      { ...manifestFixture(), branches: {} },
      {},
      {
        resolveBranch: () => {
          throw new Error('must not resolve any branch')
        },
        fileExists: allowAll,
        buildBranch: () => {},
        verify: () => {},
      }
    )

    expect(results).toEqual([])
  })
})
