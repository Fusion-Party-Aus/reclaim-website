import { resolveSite, siteRegistry } from '../../config/sites.mjs'

/** Content-contract fixtures retain the legacy QLD dataset for rollback coverage.
 * Public host-resolution tests must use resolveSite directly: QLD now serves a landing.
 */
export function resolveContentSite(requestUrl: string | URL) {
  const url = new URL(requestUrl)
  if (siteRegistry.qld.hostnames.includes(url.hostname.toLowerCase())) return siteRegistry.qld
  const site = resolveSite(url)
  if (site.kind !== 'content') throw new Error('Expected content Site fixture')
  return site
}
