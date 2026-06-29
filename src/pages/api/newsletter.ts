import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { subscribeToNewsletter } from '../../../nationbuilder/nationbuilder.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request }) => {
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

  // getSecret() is adapter-portable: process.env locally (Node adapter),
  // real Cloudflare Worker bindings in production (Cloudflare adapter).
  // Plain process.env would silently be empty once deployed — Cloudflare
  // Workers don't auto-populate it from bindings.
  const env = {
    NATIONBUILDER_SLUG: getSecret('NATIONBUILDER_SLUG'),
    NATIONBUILDER_API_TOKEN: getSecret('NATIONBUILDER_API_TOKEN'),
  }

  if (!env.NATIONBUILDER_SLUG || !env.NATIONBUILDER_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'Newsletter signup is not configured' }), {
      status: 500,
    })
  }

  const result = await subscribeToNewsletter(env, email)
  if (!result.ok) {
    return new Response(JSON.stringify({ error: 'Could not subscribe', detail: result }), {
      status: 502,
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
