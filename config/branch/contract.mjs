/**
 * Branch-agnostic framework — shared contract.
 *
 * FROZEN: this module defines the vocabulary every branch module imports.
 * Do not edit per-module. Propose changes via the orchestrator.
 *
 * See docs/sparc/branch-agnostic/architecture_blueprint.md §4 and §10.
 */

/** Closed error-code set. Every code is a throw, never a fallback. */
export const ERROR_CODES = Object.freeze({
  // Manifest loader
  MANIFEST_MISSING: 'MANIFEST_MISSING',
  MANIFEST_VERSION_UNSUPPORTED: 'MANIFEST_VERSION_UNSUPPORTED',
  MANIFEST_EMPTY: 'MANIFEST_EMPTY',
  MANIFEST_KEY_MISMATCH: 'MANIFEST_KEY_MISMATCH',
  BRANCH_DEFAULT_MISSING: 'BRANCH_DEFAULT_MISSING',
  BRANCH_DEFAULT_UNKNOWN: 'BRANCH_DEFAULT_UNKNOWN',
  TOKEN_CONTRACT_MISSING: 'TOKEN_CONTRACT_MISSING',
  // Resolver — selection/validation
  BRANCH_UNKNOWN: 'BRANCH_UNKNOWN',
  BRANCH_SLUG_INVALID: 'BRANCH_SLUG_INVALID',
  FIELD_REQUIRED: 'FIELD_REQUIRED',
  FIELD_INVALID: 'FIELD_INVALID',
  FIELD_VALIDATION_FAILED: 'FIELD_VALIDATION_FAILED',
  // Resolver — isolation
  SANITY_BINDING_COLLISION: 'SANITY_BINDING_COLLISION',
  SANITY_PROJECT_SHARED: 'SANITY_PROJECT_SHARED',
  STUDIO_APP_COLLISION: 'STUDIO_APP_COLLISION',
  ANALYTICS_COLLISION: 'ANALYTICS_COLLISION',
  WORKER_NAME_COLLISION: 'WORKER_NAME_COLLISION',
  KV_NAMESPACE_COLLISION: 'KV_NAMESPACE_COLLISION',
  // Theme
  THEME_UNKNOWN: 'THEME_UNKNOWN',
  THEME_SLUG_MISMATCH: 'THEME_SLUG_MISMATCH',
  THEME_TOKEN_MISSING: 'THEME_TOKEN_MISSING',
  THEME_TOKEN_INVALID: 'THEME_TOKEN_INVALID',
  THEME_TOKEN_UNKNOWN: 'THEME_TOKEN_UNKNOWN',
  THEME_CONTRACT_VIOLATION: 'THEME_CONTRACT_VIOLATION',
  // Assets / analytics
  ASSET_MISSING: 'ASSET_MISSING',
  ASSET_LEAKAGE: 'ASSET_LEAKAGE',
  ANALYTICS_SITE_ID_MISSING: 'ANALYTICS_SITE_ID_MISSING',
  // Presentation
  PRESENTATION_INVALID: 'PRESENTATION_INVALID',
  // Deploy config
  DEPLOY_CONFIG_MISSING: 'DEPLOY_CONFIG_MISSING',
  // Provisioning
  BRANCH_RESERVED: 'BRANCH_RESERVED',
  BRANCH_ALREADY_REGISTERED: 'BRANCH_ALREADY_REGISTERED',
  CREDENTIAL_MISSING: 'CREDENTIAL_MISSING',
  // Verification
  PARITY_FAILURE: 'PARITY_FAILURE',
  LEAKAGE_FAILURE: 'LEAKAGE_FAILURE',
})

/** Branch slugs are short lowercase identifiers. */
export const SLUG_PATTERN = /^[a-z]{2,6}$/

/** Slugs that may never be provisioned by the branch provisioner. */
export const RESERVED_SLUGS = Object.freeze(['vic'])

/** Branch-free presentation values. Never another Branch's values. */
export const NEUTRAL = Object.freeze({
  navigation: Object.freeze([
    Object.freeze({ label: 'Home', href: '/' }),
    Object.freeze({ label: 'Contact', href: '/contact' }),
  ]),
  contact: Object.freeze({}),
  social: Object.freeze([]),
  seo: Object.freeze({}),
  ctas: Object.freeze([]),
})

/** Thrown for every fail-closed condition. Carries a code from ERROR_CODES. */
export class BranchConfigError extends Error {
  /**
   * @param {string} code
   * @param {string|null} field
   * @param {string} message
   * @param {Record<string, unknown>} [context]
   */
  constructor(code, field, message, context = {}) {
    super(`${code}${field ? ` [${field}]` : ''}: ${message}`)
    this.name = 'BranchConfigError'
    this.code = code
    this.field = field
    this.message = message
    this.context = context
  }
}

/**
 * Assert a condition, throwing a BranchConfigError when it is falsy.
 * @param {unknown} condition
 * @param {string} code
 * @param {string|null} field
 * @param {string} message
 * @param {Record<string, unknown>} [context]
 */
export function assert(condition, code, field, message, context = {}) {
  if (!condition) throw new BranchConfigError(code, field, message, context)
}

/**
 * Build a plain error record (for Result-returning helpers).
 * @param {string} code
 * @param {string|null} field
 * @param {string} message
 * @param {Record<string, unknown>} [context]
 */
export function makeError(code, field, message, context = {}) {
  return { code, field, message, context }
}

/** @param {unknown} value */
export function ok(value) {
  return { ok: true, value, errors: [] }
}

/** @param {Array<object>} errors */
export function fail(errors) {
  return { ok: false, value: null, errors }
}

/** Validate a slug shape; throws BRANCH_SLUG_INVALID. */
export function assertSlug(slug, field = 'slug') {
  assert(
    typeof slug === 'string' && SLUG_PATTERN.test(slug),
    ERROR_CODES.BRANCH_SLUG_INVALID,
    field,
    `Invalid branch slug: ${JSON.stringify(slug)} (expected ${SLUG_PATTERN})`
  )
  return slug
}
