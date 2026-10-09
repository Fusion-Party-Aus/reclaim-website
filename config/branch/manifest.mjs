/**
 * Branch-agnostic framework — manifest loader.
 *
 * Owns the schema-version gate and the structural shape checks for a
 * BranchManifest. Every failure is fail-closed: a BranchConfigError carrying a
 * code from ERROR_CODES.
 *
 * See docs/sparc/branch-agnostic/algorithm_specification.md §2.1 and
 * architecture_blueprint.md §4.2.
 */

import { ERROR_CODES, assert } from './contract.mjs'

/** The only manifest schema this framework understands. */
export const SUPPORTED_SCHEMA_VERSION = 1

/**
 * Validate the structural shape of a BranchManifest. Throws on the first
 * failure so the error is deterministic.
 *
 * @param {unknown} manifest
 * @returns {void}
 */
export function validateManifestShape(manifest) {
  assert(
    manifest !== null && typeof manifest === 'object',
    ERROR_CODES.MANIFEST_MISSING,
    'manifest',
    'No branch manifest supplied.'
  )

  assert(
    /** @type {Record<string, unknown>} */ (manifest).schemaVersion === SUPPORTED_SCHEMA_VERSION,
    ERROR_CODES.MANIFEST_VERSION_UNSUPPORTED,
    'schemaVersion',
    `Unsupported manifest schema version: ${JSON.stringify(
      /** @type {Record<string, unknown>} */ (manifest).schemaVersion
    )}`,
    { schemaVersion: /** @type {Record<string, unknown>} */ (manifest).schemaVersion }
  )

  const branches = /** @type {Record<string, unknown> | null | undefined} */ (
    /** @type {Record<string, unknown>} */ (manifest).branches
  )
  assert(
    branches !== null &&
      typeof branches === 'object' &&
      !Array.isArray(branches) &&
      Object.keys(branches).length > 0,
    ERROR_CODES.MANIFEST_EMPTY,
    'branches',
    'Branch manifest declares no Branches.'
  )

  const defaultBranch = /** @type {unknown} */ (
    /** @type {Record<string, unknown>} */ (manifest).defaultBranch
  )
  assert(
    typeof defaultBranch === 'string' && defaultBranch.trim() !== '',
    ERROR_CODES.BRANCH_DEFAULT_MISSING,
    'defaultBranch',
    'Branch manifest declares no default Branch.'
  )

  assert(
    Object.hasOwn(branches, /** @type {string} */ (defaultBranch)),
    ERROR_CODES.BRANCH_DEFAULT_UNKNOWN,
    'defaultBranch',
    `Default Branch '${defaultBranch}' is not registered in the manifest.`,
    { defaultBranch }
  )

  const tokenContract = /** @type {Record<string, unknown> | null | undefined} */ (
    /** @type {Record<string, unknown>} */ (manifest).tokenContract
  )
  assert(
    tokenContract !== null &&
      typeof tokenContract === 'object' &&
      Array.isArray(tokenContract.requiredRoles) &&
      tokenContract.requiredRoles.length > 0,
    ERROR_CODES.TOKEN_CONTRACT_MISSING,
    'tokenContract',
    'Branch manifest declares no theme token contract.'
  )

  for (const [key, entry] of Object.entries(/** @type {Record<string, any>} */ (branches))) {
    assert(
      entry !== null &&
        typeof entry === 'object' &&
        entry.identity !== null &&
        typeof entry.identity === 'object' &&
        entry.identity.slug === key,
      ERROR_CODES.MANIFEST_KEY_MISMATCH,
      `branches.${key}.identity.slug`,
      `Branch entry key '${key}' does not match identity.slug.`,
      { key, declaredSlug: entry?.identity?.slug }
    )
  }
}

/**
 * Load a manifest from a source object or module namespace and run the schema
 * gate. Accepts a manifest object directly, or the namespace of a module that
 * exports one as `default` or `branchManifest`.
 *
 * @param {unknown} source
 * @returns {Record<string, any>}
 */
export function loadManifest(source) {
  assert(
    source !== null && typeof source === 'object',
    ERROR_CODES.MANIFEST_MISSING,
    'manifest',
    'No branch manifest supplied.'
  )

  const record = /** @type {Record<string, any>} */ (source)
  let manifest = record
  if (!Object.hasOwn(record, 'schemaVersion')) {
    manifest = record.default ?? record.branchManifest
    assert(
      manifest !== null && typeof manifest === 'object',
      ERROR_CODES.MANIFEST_MISSING,
      'manifest',
      'No branch manifest supplied.'
    )
  }

  validateManifestShape(manifest)
  return manifest
}
