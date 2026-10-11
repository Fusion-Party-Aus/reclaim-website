import { landingSiteRegistry } from './site-landings.mjs'
export { landingSiteRegistry } from './site-landings.mjs'
import { resolveDeployment } from './deployment.mjs'

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}

function site(siteId, canonicalOrigin, dataset) {
  const deployment = resolveDeployment({ PUBLIC_BRANCH: siteId, PUBLIC_SANITY_DATASET: dataset })
  return {
    kind: 'content',
    siteId,
    branchId: siteId,
    canonicalOrigin,
    hostnames: [new URL(canonicalOrigin).hostname],
    cms: { projectId: 'qwl3f8jb', dataset },
    deployment: { ...deployment, siteUrl: canonicalOrigin, projectId: 'qwl3f8jb', dataset },
  }
}

export class UnknownSiteHostError extends Error {
  constructor(hostname) {
    super(`Unknown site hostname: ${hostname}`)
    this.name = 'UnknownSiteHostError'
  }
}

export function validateSiteRegistry(registry) {
  if (
    !registry ||
    typeof registry !== 'object' ||
    Array.isArray(registry) ||
    !Object.keys(registry).length
  )
    throw new Error('Site registry must contain sites')
  const hosts = new Set()
  const presentationKeys = Object.keys(resolveDeployment({ PUBLIC_BRANCH: 'vic' }))
  for (const [key, entry] of Object.entries(registry)) {
    if (key !== entry?.siteId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key))
      throw new Error(`Invalid site id: ${key}`)
    const allowed = [
      'kind',
      'siteId',
      'branchId',
      'canonicalOrigin',
      'hostnames',
      'cms',
      'deployment',
    ]
    if (
      Object.keys(entry).some((field) => !allowed.includes(field)) ||
      Object.keys(entry.cms ?? {}).some((field) => !['projectId', 'dataset'].includes(field))
    )
      throw new Error(`Unknown runtime configuration field for ${key}`)
    if (Object.keys(entry.deployment ?? {}).some((field) => !presentationKeys.includes(field)))
      throw new Error(`Unknown presentation configuration field for ${key}`)
    const origin = new URL(entry.canonicalOrigin)
    if (
      origin.protocol !== 'https:' ||
      origin.origin !== entry.canonicalOrigin ||
      origin.username ||
      origin.password
    )
      throw new Error(`Invalid canonical origin for ${key}`)
    if (
      !Array.isArray(entry.hostnames) ||
      !entry.hostnames.length ||
      !entry.hostnames.includes(origin.hostname)
    )
      throw new Error(`Missing canonical hostname for ${key}`)
    for (const host of entry.hostnames) {
      if (
        typeof host !== 'string' ||
        !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(host) ||
        hosts.has(host)
      )
        throw new Error(`Invalid or duplicate hostname: ${host}`)
      hosts.add(host)
    }
    if (
      typeof entry.cms?.projectId !== 'string' ||
      !/^[a-z0-9]+$/.test(entry.cms.projectId) ||
      typeof entry.cms?.dataset !== 'string' ||
      !/^[a-z0-9][a-z0-9_-]*$/.test(entry.cms.dataset)
    )
      throw new Error(`Invalid CMS configuration for ${key}`)
    if (
      entry.branchId !== undefined &&
      (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.branchId) ||
        entry.deployment?.slug !== entry.branchId)
    )
      throw new Error(`Inconsistent branch identity for ${key}`)
    if (
      !entry.deployment ||
      entry.deployment.siteUrl !== entry.canonicalOrigin ||
      entry.deployment.projectId !== entry.cms.projectId ||
      entry.deployment.dataset !== entry.cms.dataset
    )
      throw new Error(`Inconsistent presentation configuration for ${key}`)
  }
  return registry
}

export const siteRegistry = deepFreeze(
  validateSiteRegistry({
    vic: site('vic', 'https://vic.fusionparty.org.au', 'production'),
    qld: site('qld', 'https://qld.fusionparty.org.au', 'qld'),
  })
)


export function resolveSite(requestUrl, options = {}) {
  const mode = options.mode ?? 'production'
  if (!['production', 'development', 'preview'].includes(mode))
    throw new Error(`Invalid site runtime mode: ${mode}`)
  const url = new URL(requestUrl)
  const registry = { ...siteRegistry, ...landingSiteRegistry }
  if (mode !== 'production') {
    if (!options.siteId || !Object.hasOwn(registry, options.siteId))
      throw new Error('An explicit registered SITE_ID is required for development or preview')
    return registry[options.siteId]
  }
  const host = url.hostname.toLowerCase()
  const resolved = Object.values(registry).find((entry) => entry.hostnames.includes(host))
  if (!resolved) throw new UnknownSiteHostError(host)
  return resolved
}
