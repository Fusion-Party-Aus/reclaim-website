import type { Site } from '../../config/sites.mjs'
import { atomicStateService } from './oauth-flow'

export function previewSettings(
  site: Site,
  secret: (name: string) => string | undefined,
  bindings: Record<string, unknown>
) {
  const config: Record<string, { token: string; signing: string; store: string }> = {
    vic: {
      token: 'SANITY_API_READ_TOKEN',
      signing: 'VIC_PREVIEW_SESSION_SECRET',
      store: 'VIC_PREVIEW_STATE_STORE',
    },
    qld: {
      token: 'QLD_SANITY_API_READ_TOKEN',
      signing: 'QLD_PREVIEW_SESSION_SECRET',
      store: 'QLD_PREVIEW_STATE_STORE',
    },
  }
  const entry = config[site.siteId]
  return {
    token: entry ? secret(entry.token) : undefined,
    signingKey: entry ? secret(entry.signing) : undefined,
    store: atomicStateService(entry ? bindings[entry.store] : undefined),
  }
}
