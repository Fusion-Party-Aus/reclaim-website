import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { storeTokens } from '../../../../../nationbuilder/oauth.js'
import { resolveSiteIntegrations, runtimeBindings } from '../../../../lib/site-integrations'
import {
  completeOAuth,
  InvalidOAuthStateError,
  OAUTH_COOKIE,
  type OAuthTokens,
} from '../../../../lib/oauth-flow'

export const GET: APIRoute = async ({ url, locals, cookies }) => {
  const { site } = locals.siteContext
  const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }
  if (url.origin !== site.canonicalOrigin)
    return new Response('OAuth callback requires the configured canonical origin', {
      status: 400,
      headers,
    })
  const session = cookies.get(OAUTH_COOKIE)?.value
  cookies.delete(OAUTH_COOKIE, { path: '/' })
  if (url.searchParams.has('error'))
    return new Response('OAuth authorization was not completed', { status: 400, headers })
  try {
    const { oauth, nationbuilder } = resolveSiteIntegrations(
      site,
      getSecret,
      await runtimeBindings(locals)
    )
    if (
      !oauth.store ||
      !oauth.slug ||
      !oauth.clientId ||
      !oauth.clientSecret ||
      !nationbuilder.NATIONBUILDER_TOKENS
    )
      return new Response(
        'OAuth Site credentials, token storage and atomic state service are required',
        { status: 503, headers }
      )
    await completeOAuth(
      oauth,
      {
        state: url.searchParams.get('state') ?? undefined,
        session,
        code: url.searchParams.get('code') ?? undefined,
      },
      {
        exchange: async (body) => {
          const response = await fetch(`https://${oauth.slug}.nationbuilder.com/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          if (!response.ok) throw new Error('OAuth token exchange failed')
          return (await response.json()) as OAuthTokens
        },
        save: (tokens) => storeTokens(nationbuilder, tokens),
      }
    )
    return new Response('OAuth complete. Tokens stored for this Site.', {
      status: 200,
      headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    return new Response(
      error instanceof InvalidOAuthStateError
        ? 'Invalid or expired OAuth state'
        : 'OAuth could not be completed',
      { status: error instanceof InvalidOAuthStateError ? 400 : 502, headers }
    )
  }
}
