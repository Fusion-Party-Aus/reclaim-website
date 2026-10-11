import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { resolveSiteIntegrations, runtimeBindings } from '../../../../lib/site-integrations'
import { beginOAuth, OAUTH_COOKIE, OAUTH_TTL_SECONDS } from '../../../../lib/oauth-flow'

export const GET: APIRoute = async ({ url, locals, cookies, redirect }) => {
  const { site } = locals.siteContext
  // Only the OAuth entrypoint canonicalizes an approved alias; ordinary pages stay in place.
  if (url.origin !== site.canonicalOrigin)
    return redirect(`${site.canonicalOrigin}/api/oauth/nationbuilder/start`, 302)
  try {
    const { oauth, nationbuilder } = resolveSiteIntegrations(
      site,
      getSecret,
      await runtimeBindings(locals)
    )
    if (!nationbuilder.NATIONBUILDER_TOKENS)
      return new Response('OAuth Site token storage is not configured', {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      })
    const start = await beginOAuth(oauth)
    cookies.set(OAUTH_COOKIE, start.session, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: OAUTH_TTL_SECONDS,
    })
    return new Response(null, {
      status: 302,
      headers: {
        Location: start.authorizeUrl,
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
      },
    })
  } catch {
    return new Response('OAuth is not configured or its atomic state service is unavailable', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
