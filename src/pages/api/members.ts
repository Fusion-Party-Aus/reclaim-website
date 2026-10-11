import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { resolveSiteIntegrations, runtimeBindings } from '../../lib/site-integrations'

export const post: APIRoute = async ({ request, locals }) => {
  let integration
  try {
    integration = resolveSiteIntegrations(
      locals.siteContext.site,
      getSecret,
      await runtimeBindings(locals)
    ).membership
  } catch {
    return new Response(
      JSON.stringify({ error: 'Membership integration is not configured for this Site' }),
      { status: 503 }
    )
  }
  const API_URL = integration.url
  const API_KEY = integration.key
  if (!API_URL)
    return new Response(
      JSON.stringify({ error: 'Membership integration is not configured for this Site' }),
      { status: 503 }
    )

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  // Minimal validation
  if (
    !payload ||
    typeof payload !== 'object' ||
    !payload.first_name ||
    !payload.last_name ||
    !payload.email
  ) {
    return new Response(JSON.stringify({ error: 'first_name, last_name and email are required' }), {
      status: 422,
    })
  }

  try {
    const res = await fetch(new URL('/members', API_URL).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok)
      return new Response(JSON.stringify({ error: 'Membership provider rejected the request' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      })
    const text = await res.text()
    const contentType = res.headers.get('content-type') || ''

    // Mirror CRM response
    const headers = new Headers({ 'content-type': contentType, 'Cache-Control': 'no-store' })
    return new Response(text, { status: res.status, headers })
  } catch {
    return new Response(JSON.stringify({ error: 'Upstream request failed' }), {
      status: 502,
    })
  }
}

export const POST = post
