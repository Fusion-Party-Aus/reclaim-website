import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { storeTokens } from '../../../../nationbuilder/oauth.js'

// NationBuilder redirects here after the admin grants consent.
// Exchanges the authorization code for access + refresh tokens and stores
// them in the NATIONBUILDER_TOKENS KV namespace.
export const GET: APIRoute = async ({ url, locals }) => {
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error || !code) {
    return new Response(`OAuth error: ${error ?? 'no authorization code returned'}`, {
      status: 400,
    })
  }

  const slug = getSecret('NATIONBUILDER_SLUG') ?? ''
  const clientId = getSecret('NATIONBUILDER_CLIENT_ID') ?? ''
  const clientSecret = getSecret('NATIONBUILDER_CLIENT_SECRET') ?? ''
  const redirectUri = new URL('/api/oauth/nationbuilder/callback', url).toString()

  if (!slug || !clientId || !clientSecret) {
    return new Response('OAuth credentials not configured', { status: 500 })
  }

  const res = await fetch(`https://${slug}.nationbuilder.com/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    return new Response(`Token exchange failed: ${res.status} ${body}`, { status: 502 })
  }

  const data = (await res.json()) as {
    access_token: string
    refresh_token: string
    expires_in?: number
  }

  // KV namespace comes from the Cloudflare runtime env (not accessible via getSecret).
  // Locally this will be undefined — run the OAuth dance in production (or use wrangler dev).
  const cfEnv = (locals as { runtime?: { env?: Record<string, unknown> } })?.runtime?.env ?? {}

  await storeTokens(
    {
      NATIONBUILDER_SLUG: slug,
      NATIONBUILDER_CLIENT_ID: clientId,
      NATIONBUILDER_CLIENT_SECRET: clientSecret,
      NATIONBUILDER_TOKENS: cfEnv.NATIONBUILDER_TOKENS,
    },
    data
  )

  return new Response(
    `<html><body style="font-family:monospace;padding:2rem;background:#1A0029;color:#fff">
      <p style="color:#00DDB8;font-size:1.2rem">✓ OAuth complete</p>
      <p>Tokens stored in KV. NationBuilder API calls will now use OAuth access tokens.</p>
      <p style="opacity:.6;font-size:.8rem">You can close this tab.</p>
    </body></html>`,
    { status: 200, headers: { 'content-type': 'text/html' } }
  )
}
