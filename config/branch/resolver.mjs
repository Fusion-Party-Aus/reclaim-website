/**
 * Branch-agnostic framework — BranchResolver (deep module).
 *
 * `resolveBranch(manifest, env)` is PURE, deterministic and fail-closed. It
 * returns an immutable ResolvedBranch, or throws a BranchConfigError carrying a
 * code from ERROR_CODES. It never falls back to another Branch's dataset,
 * project or Studio app.
 *
 * Fixed validation order (algorithm_specification.md Appendix A):
 *   1. validate shape  2. select slug  3. reject unknown slug
 *   4. validate entry  5. apply overrides  6. assert isolation  7. derive
 *
 * See also architecture_blueprint.md §3.1, §4.3, §4.4.
 */

import {
  ERROR_CODES,
  SLUG_PATTERN,
  NEUTRAL,
  BranchConfigError,
  assert,
  assertSlug,
} from './contract.mjs'
import { validateManifestShape } from './manifest.mjs'
import { resolveAssets as validateAndResolveAssets } from './assets.mjs'
import { isSafeHref } from './presentation.mjs'

/** @param {unknown} value */
function isBlank(value) {
  return typeof value !== 'string' || value.trim() === ''
}

/** @param {...unknown} values */
function firstNonBlank(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value
  }
  return null
}

/** @param {unknown} value */
function isColor(value) {
  return typeof value === 'string' && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
}

/** @param {unknown} value */
function isAbsoluteHttpUrl(value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname === '/' &&
      !url.search &&
      !url.hash
    )
  } catch {
    return false
  }
}

/** @param {string} siteUrl */
function normaliseOrigin(siteUrl) {
  return new URL(siteUrl).origin
}

/** @param {unknown} value */
function normalisePath(value) {
  if (typeof value !== 'string' || value === '') return ''
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return value
  return value.startsWith('/') ? value : `/${value}`
}

/** @param {Record<string, any>} manifest @param {Record<string, any>} env */
function selectSlug(manifest, env) {
  return (
    firstNonBlank(env.BRANCH, env.PUBLIC_BRANCH, env.SANITY_STUDIO_BRANCH) ?? manifest.defaultBranch
  )
}

/**
 * Collect every required/format error for one entry. The caller throws the
 * single error directly, or aggregates several into FIELD_VALIDATION_FAILED.
 *
 * @param {Record<string, any>} entry
 * @param {Record<string, any>} _manifest
 * @returns {Array<{ code: string, field: string, message: string, context: Record<string, unknown> }>}
 */
function validateBranchEntry(entry, _manifest) {
  const errors = []
  const required = (field, message = `Missing required field '${field}'.`) =>
    errors.push({ code: ERROR_CODES.FIELD_REQUIRED, field, message, context: {} })
  const invalid = (field, message) =>
    errors.push({ code: ERROR_CODES.FIELD_INVALID, field, message, context: {} })

  const identity = entry?.identity ?? {}
  for (const field of ['slug', 'state', 'adjective', 'label', 'tagline', 'themeColor', 'siteUrl']) {
    if (isBlank(identity[field])) required(`identity.${field}`)
  }
  if (!isBlank(identity.slug) && !SLUG_PATTERN.test(identity.slug)) {
    invalid('identity.slug', 'must match ^[a-z]{2,6}$')
  }
  if (!isBlank(identity.themeColor) && !isColor(identity.themeColor)) {
    invalid('identity.themeColor', 'must be a valid colour')
  }
  if (!isBlank(identity.siteUrl) && !isAbsoluteHttpUrl(identity.siteUrl)) {
    invalid('identity.siteUrl', 'must be an absolute http(s) URL')
  }
  if (
    identity.allowedOrigins !== undefined &&
    (!Array.isArray(identity.allowedOrigins) ||
      identity.allowedOrigins.some((origin) => !isAbsoluteHttpUrl(origin)))
  ) {
    invalid('identity.allowedOrigins', 'must be a list of valid canonical origins')
  }

  const sanity = entry?.sanity ?? {}
  for (const field of ['projectId', 'dataset', 'studioAppId']) {
    if (isBlank(sanity[field])) required(`sanity.${field}`)
  }

  if (entry?.theme == null) {
    required('theme')
  } else {
    if (isBlank(entry.theme.slug)) required('theme.slug')
    else if (entry.theme.slug !== identity.slug) {
      invalid('theme.slug', 'must equal identity.slug')
    }
    if (entry.theme.tokens == null) required('theme.tokens')
  }

  const assets = entry?.assets ?? {}
  for (const field of ['ogDefault', 'hero', 'favicon', 'pwaManifest']) {
    if (isBlank(assets[field])) required(`assets.${field}`)
  }

  const analytics = entry?.analytics ?? {}
  if (analytics.enabled !== undefined && typeof analytics.enabled !== 'boolean') {
    invalid('analytics.enabled', 'must be a boolean')
  }
  if (analytics.enabled !== false && isBlank(analytics.siteId)) required('analytics.siteId')

  const deploy = entry?.deploy ?? {}
  if (isBlank(deploy.workerName)) required('deploy.workerName')
  if (isBlank(deploy.wranglerConfig)) required('deploy.wranglerConfig')
  if (deploy.kvNamespaces == null) {
    required('deploy.kvNamespaces')
  } else if (Array.isArray(deploy.kvNamespaces)) {
    for (const ns of deploy.kvNamespaces) {
      if (isBlank(ns?.binding)) required('deploy.kvNamespaces[].binding')
      if (isBlank(ns?.id)) required('deploy.kvNamespaces[].id')
    }
  } else {
    invalid('deploy.kvNamespaces', 'must be a list')
  }

  return errors
}

/**
 * Apply the only environment overrides the spec permits. Theme, assets and
 * presentation are never overridden — the manifest is authoritative.
 *
 * @param {Record<string, any>} entry
 * @param {Record<string, any>} env
 */
function applyOverrides(entry, env) {
  const resolved = structuredClone(entry)

  resolved.identity.siteUrl =
    firstNonBlank(env.SITE_URL, env.PUBLIC_SITE_URL, entry.identity.siteUrl) ??
    entry.identity.siteUrl
  const origin = new URL(resolved.identity.siteUrl).origin
  const allowed = entry.identity.allowedOrigins ?? [new URL(entry.identity.siteUrl).origin]
  assert(
    isAbsoluteHttpUrl(resolved.identity.siteUrl) &&
      new URL(resolved.identity.siteUrl).pathname === '/' &&
      !new URL(resolved.identity.siteUrl).search &&
      !new URL(resolved.identity.siteUrl).hash &&
      allowed.includes(origin),
    ERROR_CODES.FIELD_INVALID,
    'identity.siteUrl',
    'Site URL override is not an allowed canonical branch origin.',
    { slug: entry.identity.slug }
  )
  resolved.identity.siteUrl = origin

  resolved.sanity.projectId =
    firstNonBlank(
      env.PUBLIC_SANITY_PROJECT_ID,
      env.SANITY_STUDIO_PROJECT_ID,
      entry.sanity.projectId
    ) ?? entry.sanity.projectId
  resolved.sanity.dataset =
    firstNonBlank(env.PUBLIC_SANITY_DATASET, env.SANITY_STUDIO_DATASET, entry.sanity.dataset) ??
    entry.sanity.dataset
  resolved.sanity.studioAppId =
    firstNonBlank(env.SANITY_STUDIO_APP_ID, entry.sanity.studioAppId) ?? entry.sanity.studioAppId

  if (env.PUBLIC_ANALYTICS_SITE_ID && entry.analytics.enabled === false) {
    resolved.analytics.enabled = true
  }
  resolved.analytics.siteId =
    firstNonBlank(env.PUBLIC_ANALYTICS_SITE_ID, entry.analytics.siteId) ?? undefined

  resolved.deploy.workerName =
    firstNonBlank(env.WORKER_NAME, entry.deploy.workerName) ?? entry.deploy.workerName

  return resolved
}

/**
 * Compare the (already overridden) branch against every other branch in the
 * manifest. Runs after overrides, so an override cannot smuggle in another
 * Branch's identity.
 *
 * @param {Record<string, any>} manifest
 * @param {Record<string, any>} resolved
 */
function assertCrossBranchIsolation(manifest, resolved) {
  const me = resolved.identity.slug

  for (const [otherSlug, other] of Object.entries(manifest.branches)) {
    if (otherSlug === me) continue

    const sameProject = resolved.sanity.projectId === other.sanity.projectId
    const sameDataset = resolved.sanity.dataset === other.sanity.dataset

    assert(
      !(sameProject && sameDataset),
      ERROR_CODES.SANITY_BINDING_COLLISION,
      `branches.${me}.sanity`,
      `Branch '${me}' resolves to the same Sanity project and dataset as '${otherSlug}'.`,
      { me, otherSlug, projectId: resolved.sanity.projectId, dataset: resolved.sanity.dataset }
    )

    // Consent is a property of the pair: the migration path has the sharing
    // Branch (qld) declare allowSharedProject while the project owner (vic,
    // which the task's binding leaves without the flag) still resolves cleanly.
    const sharedProjectAllowed =
      resolved.sanity.allowSharedProject === true || other.sanity.allowSharedProject === true
    assert(
      !(sameProject && !sharedProjectAllowed),
      ERROR_CODES.SANITY_PROJECT_SHARED,
      `branches.${me}.sanity.allowSharedProject`,
      `Branch '${me}' shares project '${resolved.sanity.projectId}' with '${otherSlug}' without declaring allowSharedProject.`,
      { me, otherSlug, projectId: resolved.sanity.projectId }
    )

    assert(
      resolved.sanity.studioAppId !== other.sanity.studioAppId,
      ERROR_CODES.STUDIO_APP_COLLISION,
      `branches.${me}.sanity.studioAppId`,
      `Branch '${me}' uses the same Sanity Studio app as '${otherSlug}'.`,
      { me, otherSlug, studioAppId: resolved.sanity.studioAppId }
    )

    assert(
      resolved.analytics.enabled === false ||
        other.analytics.enabled === false ||
        resolved.analytics.siteId !== other.analytics.siteId,
      ERROR_CODES.ANALYTICS_COLLISION,
      `branches.${me}.analytics.siteId`,
      `Branch '${me}' shares an analytics site ID with '${otherSlug}'.`,
      { me, otherSlug, siteId: resolved.analytics.siteId }
    )

    assert(
      resolved.deploy.workerName !== other.deploy.workerName,
      ERROR_CODES.WORKER_NAME_COLLISION,
      `branches.${me}.deploy.workerName`,
      `Branch '${me}' would deploy over Worker '${resolved.deploy.workerName}' owned by '${otherSlug}'.`,
      { me, otherSlug, workerName: resolved.deploy.workerName }
    )

    const otherIds = new Set((other.deploy.kvNamespaces ?? []).map((ns) => ns?.id))
    for (const ns of resolved.deploy.kvNamespaces ?? []) {
      assert(
        !otherIds.has(ns?.id),
        ERROR_CODES.KV_NAMESPACE_COLLISION,
        `branches.${me}.deploy.kvNamespaces`,
        `Branch '${me}' shares KV namespace '${ns?.id}' with '${otherSlug}'.`,
        { me, otherSlug, kvId: ns?.id }
      )
    }
  }
}

/** @param {Record<string, any>} assets @param {string} origin */
/** @param {{ enabled?: boolean, siteId?: string, plausibleScriptUrl?: string }} analytics */
function resolveAnalytics(analytics) {
  const enabled = analytics.enabled !== false
  if (!enabled) return { enabled: false }
  const siteId = analytics.siteId
  return {
    enabled: true,
    siteId,
    scriptUrl: `https://analytics.fusionparty.org.au/js/${siteId}.js`,
    initPath: '/plausible-init.js',
  }
}

/** @param {Record<string, any>|null|undefined} presentation */
function resolvePresentation(presentation) {
  const p = presentation ?? {}
  return {
    navigation: structuredClone(p.navigation ?? NEUTRAL.navigation),
    contact: { ...(p.contact ?? NEUTRAL.contact) },
    social: structuredClone(p.social ?? NEUTRAL.social),
    seo: { ...(p.seo ?? NEUTRAL.seo) },
    ctas: structuredClone(p.ctas ?? NEUTRAL.ctas),
  }
}

/** @param {any} value */
function deepFreeze(value) {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const key of Object.keys(value)) deepFreeze(value[key])
  }
  return value
}

/**
 * Resolve one Branch from the manifest and environment.
 *
 * @param {Record<string, any>} manifest
 * @param {Record<string, any>} [env]
 * @returns {import('./contract.mjs').ResolvedBranch}
 */
export function resolveBranch(manifest, env = {}) {
  env ??= {}

  validateManifestShape(manifest)

  const slug = selectSlug(manifest, env)
  assertSlug(slug)

  assert(
    Object.hasOwn(manifest.branches, slug),
    ERROR_CODES.BRANCH_UNKNOWN,
    `branches.${slug}`,
    `Unknown Branch '${slug}'. Register it in the branch manifest before building or deploying.`,
    { slug, known: Object.keys(manifest.branches) }
  )

  const entry = manifest.branches[slug]

  const errors = validateBranchEntry(entry, manifest)
  if (errors.length === 1) {
    const error = errors[0]
    throw new BranchConfigError(error.code, error.field, error.message, error.context)
  }
  if (errors.length > 1) {
    throw new BranchConfigError(
      ERROR_CODES.FIELD_VALIDATION_FAILED,
      `branches.${slug}`,
      `Branch '${slug}' is incomplete or invalid: ${errors.length} problem(s).`,
      { slug, errors }
    )
  }

  const resolvedEntry = applyOverrides(entry, env)
  assertCrossBranchIsolation(manifest, resolvedEntry)

  const canonicalOrigin = normaliseOrigin(resolvedEntry.identity.siteUrl)
  const resolvedAssets = validateAndResolveAssets({
    identity: resolvedEntry.identity,
    canonicalOrigin,
    assets: resolvedEntry.assets,
    branchSlugs: Object.keys(manifest.branches),
  })
  const runtime = resolvedEntry.runtime
  const manifestPresentation = resolvedEntry.presentation
  if (manifestPresentation) {
    const nav = Array.isArray(manifestPresentation.navigation)
      ? manifestPresentation.navigation
      : (manifestPresentation.navigation?.items ?? [])
    for (const item of nav)
      assert(
        isSafeHref(item?.href),
        ERROR_CODES.PRESENTATION_INVALID,
        'presentation.navigation.href',
        `Branch '${slug}' has an unsafe navigation URL.`,
        { slug }
      )
    const ctas = Array.isArray(manifestPresentation.ctas)
      ? manifestPresentation.ctas
      : Object.values(manifestPresentation.ctas ?? {})
    for (const cta of ctas)
      assert(
        isSafeHref(cta?.href),
        ERROR_CODES.PRESENTATION_INVALID,
        'presentation.ctas.href',
        `Branch '${slug}' has an unsafe CTA URL.`,
        { slug }
      )
    for (const account of manifestPresentation.social ?? [])
      assert(
        isSafeHref(account?.url) && account.url.startsWith('https://'),
        ERROR_CODES.PRESENTATION_INVALID,
        'presentation.social.url',
        `Branch '${slug}' has an unsafe social URL.`,
        { slug }
      )
  }
  if (runtime) {
    for (const account of runtime.socialAccounts ?? []) {
      assert(
        typeof account?.platform === 'string' &&
          account.platform.trim() !== '' &&
          isSafeHref(account?.url) &&
          account.url.startsWith('https://'),
        ERROR_CODES.PRESENTATION_INVALID,
        'runtime.socialAccounts',
        `Branch '${slug}' has an invalid social account.`,
        { slug }
      )
    }
    for (const item of runtime.navigation?.fallback ?? [])
      assert(
        isSafeHref(item.href),
        ERROR_CODES.PRESENTATION_INVALID,
        'presentation.navigation.href',
        `Branch '${slug}' has an unsafe navigation URL.`,
        { slug }
      )
    for (const href of Object.values(runtime.cta ?? {}))
      assert(
        isSafeHref(href),
        ERROR_CODES.PRESENTATION_INVALID,
        'presentation.cta.href',
        `Branch '${slug}' has an unsafe CTA URL.`,
        { slug }
      )
    for (const item of runtime.navigation?.cta ? [runtime.navigation.cta] : [])
      assert(
        isSafeHref(item.href),
        ERROR_CODES.PRESENTATION_INVALID,
        'presentation.navigation.cta.href',
        `Branch '${slug}' has an unsafe CTA URL.`,
        { slug }
      )
  }

  const descriptor = {
    identity: { ...resolvedEntry.identity },
    sanity: { ...resolvedEntry.sanity },
    theme: {
      slug: resolvedEntry.theme.slug,
      selector: `:root[data-theme='${resolvedEntry.theme.slug}']`,
      tokens: { ...resolvedEntry.theme.tokens },
      contract: structuredClone(manifest.tokenContract),
    },
    assets: {
      raw: { ...resolvedEntry.assets },
      resolved: resolvedAssets,
    },
    analytics: {
      raw: { ...resolvedEntry.analytics },
      resolved: resolveAnalytics(resolvedEntry.analytics),
    },
    deploy: {
      ...resolvedEntry.deploy,
      kvNamespaces: (resolvedEntry.deploy.kvNamespaces ?? []).map((ns) => ({ ...ns })),
    },
    presentation: resolvePresentation(
      runtime
        ? {
            navigation: { items: runtime.navigation?.fallback ?? [] },
            contact: runtime.contact,
            social: [],
            seo: runtime.seo,
            ctas: [...(runtime.navigation?.cta ? [runtime.navigation.cta] : [])],
          }
        : resolvedEntry.presentation
    ),
    ...(runtime
      ? {
          runtime: {
            ...structuredClone(runtime),
            assets: resolvedAssets,
            analytics: {
              plausibleScriptUrl: resolveAnalytics(resolvedEntry.analytics).scriptUrl,
            },
          },
        }
      : {}),
    jurisdiction: `${resolvedEntry.identity.state}, Australia`,
    description: `${resolvedEntry.identity.label} — ${resolvedEntry.identity.tagline}. Explore our policies, research and practical plans for housing, transport, integrity and civil liberties.`,
    canonicalOrigin,
    serviceWorkerCache: `fusion-${resolvedEntry.identity.slug}-${resolvedEntry.deploy.cacheVersion || '1'}`,
  }

  return deepFreeze(descriptor)
}
