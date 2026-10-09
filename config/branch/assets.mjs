/**
 * Branch-agnostic framework — Asset, analytics and service-worker-cache resolver.
 *
 * Derives branch-owned asset URLs, a branch-scoped analytics script URL and a
 * branch-scoped service-worker cache namespace from a resolved branch descriptor.
 *
 * Fail-closed: a missing required asset or enabled analytics site id throws, and an asset
 * that is not namespaced to the branch throws rather than silently reusing another
 * branch's file. See docs/sparc/branch-agnostic/algorithm_specification.md §4 and
 * architecture_blueprint.md §3.2.
 */

import { ERROR_CODES, BranchConfigError } from './contract.mjs'

/** Assets every branch must supply (spec §4.1). */
const REQUIRED_ASSET_FIELDS = Object.freeze(['ogDefault', 'hero', 'favicon', 'pwaManifest'])

/** Every asset field, required or optional, subject to the ownership check. */
const ALL_ASSET_FIELDS = Object.freeze([...REQUIRED_ASSET_FIELDS, 'logo', 'ogTemplate'])

/** @param {unknown} value */
function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '')
}

/** @param {unknown} value */
function asString(value) {
  return typeof value === 'string' ? value : ''
}

function canonicalAsset(value, origin, slug) {
  if (typeof value !== 'string' || !value.trim() || /[\\\u0000-\u001f\u007f]/.test(value))
    return null
  const raw = value.trim()
  if (raw.startsWith('//') || /%2f|%5c|%2e/i.test(raw)) return null
  if (
    raw
      .replace(/^https?:\/\/[^/]+/i, '')
      .split(/[?#]/, 1)[0]
      .split('/')
      .some((part) => part === '..' || part === '.')
  )
    return null
  let url
  if (/^[a-z][a-z\d+.-]*:/i.test(raw)) {
    try {
      url = new URL(raw)
    } catch {
      return null
    }
    if (
      url.protocol !== 'https:' ||
      url.origin !== origin ||
      url.username ||
      url.password ||
      url.port
    )
      return null
  } else {
    if (!raw.startsWith('/') || raw.startsWith('///')) return null
    url = new URL(raw, origin)
  }
  if (
    url.origin !== origin ||
    url.pathname.split('/').some((part) => part === '..' || part === '.')
  )
    return null
  const path = url.pathname.toLowerCase()
  const foreign = slug === 'vic' ? /(?:^|\/)qld(?:\/|[-.])/ : /(?:^|\/)vic(?:\/|[-.])/
  if (foreign.test(path)) return null
  return `${url.pathname}${url.search}${url.hash}`
}

/**
 * A branch owns an asset when the asset path is namespaced to the branch: a path
 * segment or filename token equals the branch slug (`/vic/hero.png`,
 * `/og/qld-default.png`). Assets owned by another branch — or not namespaced at
 * all — are rejected by `resolveAssets`.
 *
 * @param {unknown} assetPath
 * @param {string} slug
 */
export function isBranchOwned(assetPath, slug) {
  if (isBlank(assetPath) || isBlank(slug)) return false
  const value = String(assetPath).toLowerCase()
  return (
    !(/(?:^|\/)qld(?:\/|[-.])/.test(value) && slug !== 'qld') &&
    !(/(?:^|\/)vic(?:\/|[-.])/.test(value) && slug !== 'vic')
  )
}

/** Ensure a root-relative path; leave absolute URLs untouched. @param {string} value */
function normalisePath(value) {
  const path = asString(value).trim()
  if (/^https?:\/\//i.test(path)) return path
  return '/' + path.replace(/^\/+/, '')
}

/** Join an absolute path onto the branch origin; leave absolute URLs untouched. */
function absolutise(origin, value) {
  const path = asString(value).trim()
  if (/^https?:\/\//i.test(path)) return path
  return asString(origin).replace(/\/+$/, '') + normalisePath(path)
}

/**
 * Validate and absolutise a branch's raw asset set.
 *
 * @param {{
 *   identity: { slug: string },
 *   canonicalOrigin: string,
 *   assets?: Partial<Record<string, string>>,
 * }} resolved
 * @returns {{
 *   ogDefault: string, hero: string, favicon: string,
 *   pwaManifest: string, logo: string | null, ogTemplate: string | null,
 * }}
 */
export function resolveAssets(resolved) {
  const slug = resolved?.identity?.slug ?? ''
  const origin = resolved?.canonicalOrigin ?? ''
  const assets = resolved?.assets ?? {}

  for (const field of REQUIRED_ASSET_FIELDS) {
    if (isBlank(assets[field])) {
      throw new BranchConfigError(
        ERROR_CODES.ASSET_MISSING,
        `assets.${field}`,
        `Branch '${slug}' has no ${field} asset.`,
        { slug }
      )
    }
  }

  const canonical = {}
  for (const field of ALL_ASSET_FIELDS) {
    if (
      !isBlank(assets[field]) &&
      !(canonical[field] = canonicalAsset(assets[field], origin, slug))
    ) {
      throw new BranchConfigError(
        ERROR_CODES.ASSET_LEAKAGE,
        `assets.${field}`,
        `Branch '${slug}' asset '${assets[field]}' is not namespaced to the branch.`,
        { slug, path: assets[field] }
      )
    }
  }

  return {
    ogDefault: origin + canonical.ogDefault,
    hero: origin + canonical.hero,
    favicon: canonical.favicon,
    pwaManifest: canonical.pwaManifest,
    logo: isBlank(assets.logo) ? null : origin + canonical.logo,
    ogTemplate: isBlank(assets.ogTemplate) ? null : canonical.ogTemplate,
  }
}

/**
 * Derive the per-branch analytics descriptor. The script URL is derived from the
 * branch site id and is never a shared hardcoded literal.
 *
 * @param {{ identity: { slug: string }, analytics?: { enabled?: boolean, siteId?: string } }} resolved
 * @returns {{ enabled: boolean, siteId?: string, scriptUrl?: string, initPath?: string }}
 */
export function resolveAnalytics(resolved) {
  const slug = resolved?.identity?.slug ?? ''
  if (resolved?.analytics?.enabled === false) return { enabled: false }
  const siteId = resolved?.analytics?.siteId

  if (isBlank(siteId)) {
    throw new BranchConfigError(
      ERROR_CODES.ANALYTICS_SITE_ID_MISSING,
      'analytics.siteId',
      `Branch '${slug}' has no analytics site ID; traffic must not pool with another branch.`,
      { slug }
    )
  }

  const id = asString(siteId).trim()
  return {
    enabled: true,
    siteId: id,
    scriptUrl: `https://analytics.fusionparty.org.au/js/${id}.js`,
    initPath: '/plausible-init.js',
  }
}

/**
 * Derive the branch-scoped service-worker cache namespace.
 *
 * @param {{ identity: { slug: string }, deploy?: { cacheVersion?: string } }} resolved
 * @returns {string}
 */
export function resolveServiceWorkerCache(resolved) {
  const slug = asString(resolved?.identity?.slug).trim()
  const version = isBlank(resolved?.deploy?.cacheVersion)
    ? '1'
    : asString(resolved.deploy.cacheVersion).trim()
  return `fusion-${slug}-${version}`
}
