import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { resolveSiteIntegrations, runtimeBindings } from '../../lib/site-integrations'
import { subscribeToNewsletter } from '../../../nationbuilder/nationbuilder.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: any
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const email = typeof payload?.email === 'string' ? payload.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'A valid email is required' }), { status: 422 })
  }

  let env
  try {
    env = resolveSiteIntegrations(
      locals.siteContext.site,
      getSecret,
      await runtimeBindings(locals)
    ).nationbuilder
  } catch {
    return new Response(JSON.stringify({ error: 'Newsletter signup is not configured' }), {
      status: 503,
    })
  }
  if (
    !env.NATIONBUILDER_SLUG ||
    !(
      env.NATIONBUILDER_API_TOKEN ||
      (env.NATIONBUILDER_TOKENS && env.NATIONBUILDER_CLIENT_ID && env.NATIONBUILDER_CLIENT_SECRET)
    )
  ) {
    return new Response(
      JSON.stringify({ error: 'Newsletter signup is not configured for this Site' }),
      { status: 503 }
    )
  }

  const result = await subscribeToNewsletter(env, email)
  if (!result.ok) {
    return new Response(JSON.stringify({ error: 'Could not subscribe' }), {
      status: 502,
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
