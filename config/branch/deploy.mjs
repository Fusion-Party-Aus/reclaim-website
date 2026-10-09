/**
 * Branch-agnostic framework — deploy config resolver and CI build orchestrator.
 *
 * Resolves a Branch's Worker/wrangler/KV deploy configuration from the descriptor
 * and drives the per-Branch build+verify matrix.
 *
 * See docs/sparc/branch-agnostic/algorithm_specification.md §7 and
 * architecture_blueprint.md §3.2. The wrangler config path is selected from
 * manifest data; there is no per-slug ternary and no `slug === 'qld'` branch.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ERROR_CODES, BranchConfigError, assert } from './contract.mjs'

function deriveRepoRoot() {
  const base = import.meta.url
  if (typeof base === 'string' && base.startsWith('file:')) {
    return fileURLToPath(new URL('../../', base))
  }
  return process.cwd()
}

const REPO_ROOT = fs.realpathSync(deriveRepoRoot())
const DEFAULT_COMPATIBILITY_FLAGS = Object.freeze(['nodejs_compat'])

/** @param {unknown} value */
function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '')
}

/** Return the first argument that is neither null nor blank. */
function firstNonBlank(...values) {
  for (const value of values) {
    if (!isBlank(value)) return value
  }
  return undefined
}

/** Resolve a manifest path against the repository root for existence checking. */
function resolveRepoPath(configPath) {
  assert(
    typeof configPath === 'string' &&
      !path.isAbsolute(configPath) &&
      !configPath.split(/[\\/]/).includes('..') &&
      /^wrangler(?:\.[a-z0-9-]+)?\.toml$/.test(path.basename(configPath.replace(/^\.\//, ''))),
    ERROR_CODES.DEPLOY_CONFIG_MISSING,
    'deploy.wranglerConfig',
    'Wrangler config must be a repository-relative wrangler TOML file.',
    { path: configPath }
  )
  const candidate = path.resolve(REPO_ROOT, configPath)
  assert(
    candidate.startsWith(`${path.resolve(REPO_ROOT)}${path.sep}`),
    ERROR_CODES.DEPLOY_CONFIG_MISSING,
    'deploy.wranglerConfig',
    'Wrangler config must remain inside the repository.',
    { path: configPath }
  )
  return candidate
}

/** Normalise a thrown value into a serialisable result error. */
function toResultError(error) {
  return {
    code: error?.code ?? null,
    field: error?.field ?? null,
    message: error?.message ?? String(error),
  }
}

/**
 * Resolve the deploy configuration for one Branch. Fail-closed: an absent Worker,
 * wrangler config, missing config file or incomplete KV binding throws
 * DEPLOY_CONFIG_MISSING rather than falling back to another Branch.
 *
 * @param {{ identity?: { slug?: string }, deploy?: object }} resolved
 * @param {Record<string, string | boolean | undefined>} [env]
 * @param {{ fileExists?: (path: string) => boolean, realpath?: (path: string) => string }} [deps]
 * @returns {import('./contract.d.mts').DeployConfig}
 */
export function resolveDeployConfig(resolved, env = {}, deps = {}) {
  const fileExists = deps.fileExists ?? fs.existsSync
  const realpath = deps.realpath ?? fs.realpathSync
  const slug = resolved?.identity?.slug ?? null
  const deploy = resolved?.deploy ?? {}

  assert(
    !isBlank(deploy.workerName),
    ERROR_CODES.DEPLOY_CONFIG_MISSING,
    'deploy.workerName',
    `Branch '${slug}' has no Worker name.`,
    { slug }
  )
  assert(
    !isBlank(deploy.wranglerConfig),
    ERROR_CODES.DEPLOY_CONFIG_MISSING,
    'deploy.wranglerConfig',
    `Branch '${slug}' has no wrangler config.`,
    { slug }
  )

  const wranglerConfigPath = resolveRepoPath(deploy.wranglerConfig)
  assert(
    fileExists(wranglerConfigPath),
    ERROR_CODES.DEPLOY_CONFIG_MISSING,
    'deploy.wranglerConfig',
    `Wrangler config '${wranglerConfigPath}' for Branch '${slug}' was not found.`,
    { slug, path: wranglerConfigPath }
  )
  let realConfigPath
  try {
    realConfigPath = realpath(wranglerConfigPath)
  } catch {
    throw new BranchConfigError(
      ERROR_CODES.DEPLOY_CONFIG_MISSING,
      'deploy.wranglerConfig',
      `Wrangler config for Branch '${slug}' could not be canonicalized.`,
      { slug, path: wranglerConfigPath }
    )
  }
  assert(
    realConfigPath.startsWith(`${path.resolve(REPO_ROOT)}${path.sep}`),
    ERROR_CODES.DEPLOY_CONFIG_MISSING,
    'deploy.wranglerConfig',
    'Wrangler config resolves outside the repository.',
    { slug, path: realConfigPath }
  )

  const kvNamespaces = deploy.kvNamespaces ?? []
  for (const ns of kvNamespaces) {
    assert(
      !isBlank(ns?.binding) && !isBlank(ns?.id),
      ERROR_CODES.DEPLOY_CONFIG_MISSING,
      'deploy.kvNamespaces',
      `Branch '${slug}' has an incomplete KV namespace binding.`,
      { slug }
    )
  }

  return {
    workerName: firstNonBlank(env.WORKER_NAME, deploy.workerName),
    wranglerConfigPath: realConfigPath,
    kvNamespaces,
    compatibilityFlags: deploy.compatibilityFlags ?? [...DEFAULT_COMPATIBILITY_FLAGS],
    compatibilityDate: deploy.compatibilityDate ?? undefined,
  }
}

/**
 * CI matrix primitive. Resolve, build and verify every registered Branch, never
 * stopping at the first failure: each Branch yields its own result so a
 * half-configured Branch cannot build green as a clone.
 *
 * @param {{ branches?: Record<string, unknown> }} manifest
 * @param {Record<string, string | boolean | undefined>} [env]
 * @param {{
 *   resolveBranch: (manifest: object, env: object) => object,
 *   buildBranch: (resolved: object, deploy: object, env: object) => void,
 *   verify: (resolved: object, manifest: object, env: object) => void,
 *   fileExists?: (path: string) => boolean,
 * }} deps
 * @returns {Array<{ slug: string, status: 'ok' | 'error', error: object | null }>}
 */
export function buildAllBranches(manifest, env = {}, deps = {}) {
  const { resolveBranch, buildBranch, verify, fileExists, realpath } = deps

  if (typeof resolveBranch !== 'function') {
    throw new TypeError('buildAllBranches requires a resolveBranch dependency')
  }
  if (typeof buildBranch !== 'function') {
    throw new TypeError('buildAllBranches requires a buildBranch dependency')
  }
  if (typeof verify !== 'function') {
    throw new TypeError('buildAllBranches requires a verify dependency')
  }

  const slugs = Object.keys(manifest?.branches ?? {})
  const results = []

  for (const slug of slugs) {
    const branchEnv = { ...env, PUBLIC_BRANCH: slug }
    try {
      const resolved = resolveBranch(manifest, branchEnv)
      const deploy = resolveDeployConfig(resolved, branchEnv, { fileExists, realpath })
      buildBranch(resolved, deploy, branchEnv)
      verify(resolved, manifest, branchEnv)
      results.push({ slug, status: 'ok', error: null })
    } catch (error) {
      results.push({ slug, status: 'error', error: toResultError(error) })
    }
  }

  return results
}
