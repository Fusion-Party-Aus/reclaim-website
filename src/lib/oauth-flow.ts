export interface OAuthStateRecord {
  state: string
  siteId: string
  session: string
  expiresAt: number
}
export interface OAuthStateStore {
  issue(record: OAuthStateRecord): Promise<boolean>
  /** Must atomically validate all expected fields and delete before returning true. */
  consume(
    state: string,
    expected: { siteId: string; session: string; now: number }
  ): Promise<boolean>
}
export interface OAuthConfig {
  siteId: string
  canonicalOrigin: string
  slug?: string
  clientId?: string
  clientSecret?: string
  store?: OAuthStateStore
}
export interface OAuthTokens {
  access_token: string
  refresh_token: string
  expires_in?: number
}
export const OAUTH_TTL_SECONDS = 600
export const OAUTH_COOKIE = '__Host-fusion-oauth-session'

function validate(config: OAuthConfig): asserts config is OAuthConfig & {
  slug: string
  clientId: string
  clientSecret: string
  store: OAuthStateStore
} {
  if (!config.store) throw new Error('OAuth atomic state store is not configured')
  if (!config.slug || !/^[a-z0-9-]+$/.test(config.slug) || !config.clientId || !config.clientSecret)
    throw new Error('OAuth credentials are not configured')
  const origin = new URL(config.canonicalOrigin)
  if (origin.protocol !== 'https:' || origin.origin !== config.canonicalOrigin)
    throw new Error('Invalid OAuth canonical origin')
}
function randomValue() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (value) =>
    value.toString(16).padStart(2, '0')
  ).join('')
}
export async function beginOAuth(config: OAuthConfig, now = Date.now()) {
  validate(config)
  const state = randomValue()
  const session = randomValue()
  if (
    !(await config.store.issue({
      state,
      siteId: config.siteId,
      session,
      expiresAt: now + OAUTH_TTL_SECONDS * 1000,
    }))
  )
    throw new Error('OAuth state could not be created')
  const authorize = new URL(`https://${config.slug}.nationbuilder.com/oauth/authorize`)
  authorize.searchParams.set('response_type', 'code')
  authorize.searchParams.set('client_id', config.clientId)
  authorize.searchParams.set(
    'redirect_uri',
    `${config.canonicalOrigin}/api/oauth/nationbuilder/callback`
  )
  authorize.searchParams.set('state', state)
  return { state, session, authorizeUrl: authorize.href }
}
export class InvalidOAuthStateError extends Error {}
export async function completeOAuth(
  config: OAuthConfig,
  input: { state?: string; session?: string; code?: string },
  options: {
    now?: number
    exchange: (body: Record<string, string>) => Promise<OAuthTokens>
    save: (tokens: OAuthTokens) => Promise<void>
  }
) {
  validate(config)
  if (
    !input.state ||
    !input.session ||
    !input.code ||
    !/^[a-f0-9]{64}$/.test(input.state) ||
    !/^[a-f0-9]{64}$/.test(input.session)
  )
    throw new InvalidOAuthStateError('Invalid OAuth state')
  if (
    !(await config.store.consume(input.state, {
      siteId: config.siteId,
      session: input.session,
      now: options.now ?? Date.now(),
    }))
  )
    throw new InvalidOAuthStateError('Invalid OAuth state')
  const tokens = await options.exchange({
    grant_type: 'authorization_code',
    code: input.code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: `${config.canonicalOrigin}/api/oauth/nationbuilder/callback`,
  })
  if (!tokens.access_token || !tokens.refresh_token) throw new Error('Invalid OAuth token response')
  await options.save(tokens)
}

export interface AtomicStateBinding {
  fetch(request: Request): Promise<Response>
}
/** Requires an audited transactional backend; an eventually consistent KV binding is incompatible. */
export function atomicStateService(binding: unknown): OAuthStateStore | undefined {
  if (!binding || typeof (binding as AtomicStateBinding).fetch !== 'function') return undefined
  const service = binding as AtomicStateBinding
  async function send(path: string, body: unknown) {
    const response = await service.fetch(
      new Request(`https://oauth-state.internal/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    )
    if (response.status === 409) return false
    if (response.status !== (path === 'issue' ? 201 : 200))
      throw new Error('Atomic OAuth state service unavailable')
    return true
  }
  return {
    issue: (record) => send('issue', record),
    consume: (state, expected) => send('consume', { state, ...expected }),
  }
}
