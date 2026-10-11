import { defineMiddleware } from 'astro:middleware'
import { getSecret } from 'astro:env/server'
import { resolveSite, UnknownSiteHostError, type SiteRuntimeMode } from '../config/sites.mjs'
import { createSiteContext } from './lib/site-context'
import { authenticatedPreviewContent } from './lib/site-preview'
import { previewSettings } from './lib/preview-settings'
import { PREVIEW_BROWSER_COOKIE, PREVIEW_SESSION_COOKIE } from './lib/preview-auth'
import { runtimeBindings } from './lib/site-integrations'

const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
}

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const mode =
      import.meta.env.SITE_RUNTIME_MODE || (import.meta.env.DEV ? 'development' : 'production')
    const site = resolveSite(context.url, {
      mode: context.isPrerendered ? 'preview' : (mode as SiteRuntimeMode),
      siteId: import.meta.env.SITE_ID,
    })
    context.locals.siteContext = createSiteContext(site)
    context.locals.preview = false
    // Public feeds, integrations, static outputs and prerendering never use drafts.
    const htmlRoute =
      !context.url.pathname.startsWith('/api/') &&
      !/\.(?:xml|txt|json|js|webmanifest|png|jpe?g|svg|ico|webp|css|woff2?)$/i.test(
        context.url.pathname
      )
    const session = context.cookies.get(PREVIEW_SESSION_COOKIE)?.value
    const browser = context.cookies.get(PREVIEW_BROWSER_COOKIE)?.value
    if (!context.isPrerendered && htmlRoute && session && browser) {
      const settings = previewSettings(site, getSecret, await runtimeBindings(context.locals))
      const content = await authenticatedPreviewContent(site, session, browser, settings)
      if (content) {
        context.locals.siteContext = Object.freeze({ ...context.locals.siteContext, content })
        context.locals.preview = true
      }
    }
  } catch (error) {
    return new Response(
      error instanceof UnknownSiteHostError ? 'Site not found' : 'Site configuration error',
      {
        status: error instanceof UnknownSiteHostError ? 404 : 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      }
    )
  }
  if (!context.locals.preview) return next()
  try {
    const response = await next()
    const headers = new Headers(response.headers)
    for (const [name, value] of Object.entries(privateHeaders)) headers.set(name, value)
    headers.append('Vary', 'Cookie')
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch {
    return new Response('Preview could not be rendered', { status: 500, headers: privateHeaders })
  }
})
