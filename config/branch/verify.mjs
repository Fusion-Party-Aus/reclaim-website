/**
 * Branch-agnostic framework — Verifier (parity + leakage).
 *
 * Two fail-closed assertions over a ResolvedBranch descriptor:
 *   verifyParity   — the descriptor is self-consistent with the manifest.
 *   verifyLeakage  — the built output carries no other Branch's identity.
 *
 * Both are pure over their inputs; leakage is pure over
 * (descriptor, manifest, built output) with the output reader injected.
 *
 * See docs/sparc/branch-agnostic/architecture_blueprint.md §7 and
 * docs/sparc/branch-agnostic/algorithm_specification.md §7.3, §7.4, §8.
 */

import { ERROR_CODES, assert, BranchConfigError } from './contract.mjs'
import { isBranchOwned } from './assets.mjs'

/** @param {unknown} value */
function isBlank(value) {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
}

/** @param {unknown} value */
function isObject(value) {
  return value !== null && typeof value === 'object'
}

/**
 * Assert the resolved descriptor is self-consistent with the manifest entry it
 * claims to be: slug/key match, and theme, assets, analytics and deploy config
 * all present. Fails closed with PARITY_FAILURE naming the offending field.
 *
 * @param {import('./contract.mjs').ResolvedBranch} resolved
 * @param {import('./contract.mjs').BranchManifest} manifest
 * @returns {void}
 */
export function verifyParity(resolved, manifest) {
  const slug = resolved?.identity?.slug

  assert(
    !isBlank(slug),
    ERROR_CODES.PARITY_FAILURE,
    'identity.slug',
    'Resolved branch has no identity.slug; cannot verify parity.'
  )

  const entry = isObject(manifest?.branches) ? manifest.branches[slug] : undefined

  assert(
    isObject(entry),
    ERROR_CODES.PARITY_FAILURE,
    `branches.${slug}`,
    `Resolved branch '${slug}' is not registered in the manifest (slug/key mismatch).`
  )

  assert(
    entry.identity?.slug === slug,
    ERROR_CODES.PARITY_FAILURE,
    `branches.${slug}.identity.slug`,
    `Manifest key '${slug}' does not match its identity.slug '${entry.identity?.slug}'.`
  )

  assert(
    isObject(resolved.theme),
    ERROR_CODES.PARITY_FAILURE,
    'theme',
    `Resolved branch '${slug}' has no theme.`
  )
  assert(
    resolved.theme.slug === slug,
    ERROR_CODES.PARITY_FAILURE,
    'theme.slug',
    `Resolved theme slug '${resolved.theme.slug}' is not owned by branch '${slug}'.`
  )
  assert(
    isObject(resolved.theme.tokens),
    ERROR_CODES.PARITY_FAILURE,
    'theme.tokens',
    `Resolved branch '${slug}' has no theme tokens.`
  )

  const rawAssets = resolved.assets?.raw
  assert(
    isObject(rawAssets),
    ERROR_CODES.PARITY_FAILURE,
    'assets.raw',
    `Resolved branch '${slug}' has no assets.`
  )
  for (const field of ['ogDefault', 'hero', 'favicon', 'pwaManifest']) {
    assert(
      !isBlank(rawAssets[field]),
      ERROR_CODES.PARITY_FAILURE,
      `assets.${field}`,
      `Resolved branch '${slug}' is missing required field 'assets.${field}'.`
    )
  }

  const rawAnalytics = resolved.analytics?.raw
  assert(
    isObject(rawAnalytics),
    ERROR_CODES.PARITY_FAILURE,
    'analytics.raw',
    `Resolved branch '${slug}' has no analytics binding.`
  )
  assert(
    rawAnalytics.enabled === false || !isBlank(rawAnalytics.siteId),
    ERROR_CODES.PARITY_FAILURE,
    'analytics.siteId',
    `Resolved branch '${slug}' is missing required field 'analytics.siteId' while analytics are enabled.`
  )

  const deploy = resolved.deploy
  assert(
    isObject(deploy),
    ERROR_CODES.PARITY_FAILURE,
    'deploy',
    `Resolved branch '${slug}' has no deploy config.`
  )
  assert(
    !isBlank(deploy.workerName),
    ERROR_CODES.PARITY_FAILURE,
    'deploy.workerName',
    `Resolved branch '${slug}' is missing required field 'deploy.workerName'.`
  )
  assert(
    !isBlank(deploy.wranglerConfig),
    ERROR_CODES.PARITY_FAILURE,
    'deploy.wranglerConfig',
    `Resolved branch '${slug}' is missing required field 'deploy.wranglerConfig'.`
  )
  assert(
    Array.isArray(deploy.kvNamespaces),
    ERROR_CODES.PARITY_FAILURE,
    'deploy.kvNamespaces',
    `Resolved branch '${slug}' is missing required field 'deploy.kvNamespaces'.`
  )
}

/**
 * Throw LEAKAGE_FAILURE when a foreign token appears in the built output.
 *
 * @param {string} output
 * @param {string} me
 * @param {string} foreign
 * @param {unknown} token
 * @param {string} field
 * @param {'identity'|'asset'|'analytics'|'cache'} kind
 */
function assertNoLeak(output, me, foreign, token, field, kind) {
  if (isBlank(token)) return
  if (!output.includes(String(token))) return

  throw new BranchConfigError(
    ERROR_CODES.LEAKAGE_FAILURE,
    field,
    `Branch '${me}' output contains foreign ${kind} token '${token}' from branch '${foreign}'.`,
    { branch: me, foreign, kind, field, token }
  )
}

/**
 * Assert the built output for the resolved branch carries no other Branch's
 * identity label/tagline, OG/hero asset reference, analytics site id or cache
 * namespace. Pure over (descriptor, manifest, output): the output is obtained
 * through the injected reader and nothing is mutated.
 *
 * @param {import('./contract.mjs').ResolvedBranch} resolved
 * @param {import('./contract.mjs').BranchManifest} manifest
 * @param {(resolved: import('./contract.mjs').ResolvedBranch) => unknown} readBuiltOutput
 * @returns {void}
 */
export function verifyLeakage(resolved, manifest, readBuiltOutput) {
  assert(
    typeof readBuiltOutput === 'function',
    ERROR_CODES.LEAKAGE_FAILURE,
    null,
    'verifyLeakage requires a readBuiltOutput function.'
  )

  const me = resolved?.identity?.slug
  assert(
    !isBlank(me),
    ERROR_CODES.LEAKAGE_FAILURE,
    'identity.slug',
    'Resolved branch has no identity.slug; cannot scan for leakage.'
  )

  const built = readBuiltOutput(resolved)
  const output = typeof built === 'string' ? built : JSON.stringify(built ?? '')

  const branches = isObject(manifest?.branches) ? manifest.branches : {}

  for (const [otherSlug, other] of Object.entries(branches)) {
    if (otherSlug === me) continue

    const identity = other?.identity ?? {}
    const assets = other?.assets ?? {}
    const analytics = other?.analytics ?? {}

    assertNoLeak(output, me, otherSlug, identity.label, 'identity.label', 'identity')
    assertNoLeak(output, me, otherSlug, identity.tagline, 'identity.tagline', 'identity')
    if (isBranchOwned(assets.ogDefault, otherSlug) && !isBranchOwned(assets.ogDefault, me)) {
      assertNoLeak(output, me, otherSlug, assets.ogDefault, 'assets.ogDefault', 'asset')
    }
    if (isBranchOwned(assets.hero, otherSlug) && !isBranchOwned(assets.hero, me)) {
      assertNoLeak(output, me, otherSlug, assets.hero, 'assets.hero', 'asset')
    }
    if (analytics.enabled !== false)
      assertNoLeak(output, me, otherSlug, analytics.siteId, 'analytics.siteId', 'analytics')
    assertNoLeak(output, me, otherSlug, `fusion-${otherSlug}`, 'deploy.cacheNamespace', 'cache')
  }
}
