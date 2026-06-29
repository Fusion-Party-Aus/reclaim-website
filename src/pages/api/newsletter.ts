import type { APIRoute } from 'astro'
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

  if (!process.env.NATIONBUILDER_SLUG || !process.env.NATIONBUILDER_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'Newsletter signup is not configured' }), {
      status: 500,
    })
  }

  const result = await subscribeToNewsletter(process.env, email)
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
