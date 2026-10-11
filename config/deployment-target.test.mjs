// @vitest-environment node
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveBuildTarget } from './deployment-target.mjs'

const legacy = {
  workerName: 'fusion-website-qld',
  wranglerConfigPath: '/repository/wrangler.qld.toml',
  kvNamespaces: [{ binding: 'SESSION', id: 'existing-qld-namespace' }],
}

describe('explicit isolated test Worker build target', () => {
  it('preserves legacy Branch selection and output when no target is requested', () => {
    expect(resolveBuildTarget({}, legacy)).toEqual({
      workerName: legacy.workerName,
      wranglerConfigPath: legacy.wranglerConfigPath,
      outputDirectory: './dist',
    })
    expect(
      resolveBuildTarget({ ASTRO_BRANCH_BUILD_OUT_DIR: '/tmp/branch-output' }, legacy)
        .outputDirectory
    ).toBe('/tmp/branch-output')
  })
  it('selects only the dedicated test config and output independently of Branch and Worker-name overrides', () => {
    const selected = resolveBuildTarget(
      {
        DEPLOY_TARGET: 'branch-agnostic-test',
        WORKER_NAME: 'fusion-website',
        ASTRO_BRANCH_BUILD_OUT_DIR: './dist',
      },
      legacy
    )
    expect(selected.workerName).toBe('branch-agnostic-test')
    expect(path.basename(selected.wranglerConfigPath)).toBe('wrangler.branch-agnostic-test.toml')
    expect(path.basename(selected.outputDirectory)).toBe('dist-branch-agnostic-test')
    expect(selected.wranglerConfigPath).not.toBe(legacy.wranglerConfigPath)
  })
  it('rejects unknown explicit deployment targets instead of falling back to production', () => {
    expect(() => resolveBuildTarget({ DEPLOY_TARGET: 'branch-agnostic-typo' }, legacy)).toThrow(
      /target/i
    )
  })
  it('keeps the test source configuration free from production routing, secrets and legacy namespace IDs', () => {
    const selected = resolveBuildTarget({ DEPLOY_TARGET: 'branch-agnostic-test' }, legacy)
    const config = fs.readFileSync(selected.wranglerConfigPath, 'utf8')
    expect(config).toMatch(/^name\s*=\s*"branch-agnostic-test"/m)
    expect(config).not.toMatch(/^\s*(?:routes?|secrets|account_id)\s*=/m)
    expect(config).not.toContain('4be5b5fc9edc49f3bd5a2c040483da0e')
    expect(config).not.toContain('0771f9c48b4840bebd5091051a7bbec8')
    expect(config).toMatch(/^\s*id\s*=\s*"1956f688a05a46c29541beb08f42e10c"/m)
  })
  it('requires an explicitly selected target in the test build command and adapter path', () => {
    const scripts = JSON.parse(
      fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
    ).scripts
    expect(scripts['build:test']).toContain('DEPLOY_TARGET=branch-agnostic-test')
    expect(scripts['build:test']).toContain('SITE_ID=vic')
    expect(scripts['build:test']).toContain('SITE_RUNTIME_MODE=production')
    expect(scripts['build:test']).toContain('NODE_ENV=production')
    expect(scripts['deploy:test']).toBeUndefined()
    const astro = fs.readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8')
    expect(astro).toContain('resolveBuildTarget')
    expect(astro).toContain('configPath: buildTarget.wranglerConfigPath')
    expect(astro).toContain('outDir: buildTarget.outputDirectory')
  })
})
