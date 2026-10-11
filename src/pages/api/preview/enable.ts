import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import {
  authenticatePreview,
  PREVIEW_BROWSER_COOKIE,
  PREVIEW_SESSION_COOKIE,
  PREVIEW_LIFETIME_SECONDS,
} from '../../../lib/preview-auth'
import { previewSettings } from '../../../lib/preview-settings'
import { runtimeBindings } from '../../../lib/site-integrations'

export const GET: APIRoute = async ({ url, locals, cookies }) => {
  const headers = {
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'Referrer-Policy': 'no-referrer',
  }
  try {
    const { site } = locals.siteContext
    if (url.protocol !== 'https:')
      return new Response('Preview requires HTTPS', { status: 400, headers })
    const settings = previewSettings(site, getSecret, await runtimeBindings(locals))
    if (!settings.token || !settings.signingKey || !settings.store)
      return new Response(
        'Preview credentials and an atomic replay service are not configured for this Site',
        { status: 503, headers }
      )
    const result = await authenticatePreview(site, url, settings)
    const cookieOptions = {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none' as const,
      maxAge: PREVIEW_LIFETIME_SECONDS,
    }
    cookies.set(PREVIEW_SESSION_COOKIE, result.session, cookieOptions)
    cookies.set(PREVIEW_BROWSER_COOKIE, result.browser, cookieOptions)
    return new Response(null, { status: 303, headers: { ...headers, Location: result.returnPath } })
  } catch {
    return new Response('Preview authentication failed', { status: 401, headers })
  }
}
