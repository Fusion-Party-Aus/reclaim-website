import type { Site } from '../../config/sites.mjs'
import { atomicStateService } from './oauth-flow'

type SecretReader = (name: string) => string | undefined
const SETTINGS: Record<
  string,
  { prefix: string; tokenBinding: string; legacyTokenBinding?: string; stateBinding: string }
> = {
  vic: {
    prefix: '',
    tokenBinding: 'VIC_NATIONBUILDER_TOKENS',
    legacyTokenBinding: 'NATIONBUILDER_TOKENS',
    stateBinding: 'VIC_OAUTH_STATE_STORE',
  },
  qld: {
    prefix: 'QLD_',
    tokenBinding: 'QLD_NATIONBUILDER_TOKENS',
    stateBinding: 'QLD_OAUTH_STATE_STORE',
  },
}
export function resolveSiteIntegrations(
  site: Site,
  secret: SecretReader,
  bindings: Record<string, unknown>
) {
  const mapping = SETTINGS[site.siteId]
  const read = (name: string) => (mapping ? secret(`${mapping.prefix}${name}`) : undefined)
  const tokenBinding = mapping
    ? (bindings[mapping.tokenBinding] ??
      (mapping.legacyTokenBinding ? bindings[mapping.legacyTokenBinding] : undefined))
    : undefined
  const nationbuilder = {
    SITE_ID: site.siteId,
    NATIONBUILDER_SLUG: read('NATIONBUILDER_SLUG'),
    NATIONBUILDER_API_TOKEN: read('NATIONBUILDER_API_TOKEN'),
    NATIONBUILDER_CLIENT_ID: read('NATIONBUILDER_CLIENT_ID'),
    NATIONBUILDER_CLIENT_SECRET: read('NATIONBUILDER_CLIENT_SECRET'),
    NATIONBUILDER_TOKENS: tokenBinding,
  }
  if (nationbuilder.NATIONBUILDER_SLUG && !/^[a-z0-9-]+$/.test(nationbuilder.NATIONBUILDER_SLUG))
    throw new Error('Invalid integration provider slug')
  const url = read('AEC_CRM_API_URL')
  if (url) {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password)
      throw new Error('Invalid membership integration URL')
  }
  return {
    nationbuilder,
    membership: { url, key: read('AEC_CRM_API_KEY') },
    oauth: {
      siteId: site.siteId,
      canonicalOrigin: site.canonicalOrigin,
      slug: nationbuilder.NATIONBUILDER_SLUG,
      clientId: nationbuilder.NATIONBUILDER_CLIENT_ID,
      clientSecret: nationbuilder.NATIONBUILDER_CLIENT_SECRET,
      store: atomicStateService(mapping ? bindings[mapping.stateBinding] : undefined),
    },
  }
}
export async function runtimeBindings(locals: unknown): Promise<Record<string, unknown>> {
  try {
    // Astro 6 removes locals.runtime.env; bindings are supplied by the Worker runtime.
    const { env } = await import('cloudflare:workers')
    return env as unknown as Record<string, unknown>
  } catch {
    // Node development and unit tests have no Cloudflare runtime module.
    try {
      return (locals as { runtime?: { env?: Record<string, unknown> } })?.runtime?.env ?? {}
    } catch {
      return {}
    }
  }
}
