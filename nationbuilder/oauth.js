// NationBuilder OAuth2 token management.
//
// Stores access + refresh tokens in a Cloudflare KV namespace
// (NATIONBUILDER_TOKENS binding). Falls back to the selected Site's
// NATIONBUILDER_API_TOKEN if KV is unavailable or no OAuth tokens exist.
//
// Refresh flow: access tokens expire after 24 hours; refresh tokens are
// long-lived. On first access after expiry, a refresh call is made, the
// rotated tokens are written back to a Site/provider-specific KV key.
// No shared module token cache is used.

function tokenKey(env) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(env.SITE_ID ?? '') ||
    !/^[a-z0-9-]+$/.test(env.NATIONBUILDER_SLUG ?? '')
  ) {
    throw new Error('Explicit Site and provider identity required')
  }
  return `site:${env.SITE_ID}:nationbuilder:${env.NATIONBUILDER_SLUG}:tokens`
}

function isExpired(expiresAt) {
  return Date.now() >= expiresAt - 5 * 60 * 1000 // 5-minute buffer
}

async function readKV(env) {
  if (!env.NATIONBUILDER_TOKENS) return null
  try {
    const raw = await env.NATIONBUILDER_TOKENS.get(tokenKey(env))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function writeKV(env, tokens) {
  if (!env.NATIONBUILDER_TOKENS) throw new Error('Site token storage is not configured')
  // TTL: 1 year (refresh tokens are long-lived; KV entry is effectively permanent)
  await env.NATIONBUILDER_TOKENS.put(tokenKey(env), JSON.stringify(tokens), {
    expirationTtl: 60 * 60 * 24 * 365,
  })
}

async function doRefresh(env, refreshToken) {
  const res = await fetch(`https://${env.NATIONBUILDER_SLUG}.nationbuilder.com/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: env.NATIONBUILDER_CLIENT_ID,
      client_secret: env.NATIONBUILDER_CLIENT_SECRET,
    }),
  })
  if (!res.ok) {
    throw new Error(`NationBuilder token refresh failed: ${res.status}`)
  }
  const data = await res.json()
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? refreshToken,
    expires_at: Date.now() + (data.expires_in ?? 86400) * 1000,
  }
}

// Returns the current valid access token, refreshing if needed.
// env must include: NATIONBUILDER_SLUG, NATIONBUILDER_CLIENT_ID,
// NATIONBUILDER_CLIENT_SECRET, NATIONBUILDER_TOKENS (KV binding),
// and NATIONBUILDER_API_TOKEN (fallback).
export async function getAccessToken(env) {
  tokenKey(env)

  const stored = await readKV(env)

  if (!stored) {
    // No OAuth tokens yet — fall back to static API token (local dev or pre-OAuth)
    return env.NATIONBUILDER_API_TOKEN ?? null
  }

  if (!isExpired(stored.expires_at)) {
    return stored.access_token
  }

  const refreshed = await doRefresh(env, stored.refresh_token)
  await writeKV(env, refreshed)
  return refreshed.access_token
}

// Called by the OAuth callback handler after the initial code exchange.
export async function storeTokens(env, { access_token, refresh_token, expires_in = 86400 }) {
  const tokens = {
    access_token,
    refresh_token,
    expires_at: Date.now() + (expires_in ?? 86400) * 1000,
  }
  await writeKV(env, tokens)
}
