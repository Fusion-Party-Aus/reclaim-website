import { resolveSite } from '../../config/sites.mjs'

/** Resolve a real content Site for tests that exercise CMS or integration contracts. */
export function resolveContentSite(requestUrl: string | URL) {
  const site = resolveSite(requestUrl)
  if (site.kind !== 'content') throw new Error('Expected content Site fixture')
  return site
}
