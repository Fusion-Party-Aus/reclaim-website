import type { APIRoute } from 'astro'

const API_URL = process.env.AEC_CRM_API_URL || ''
const API_KEY = process.env.AEC_CRM_API_KEY || ''

export const post: APIRoute = async ({ request }) => {
  if (!API_URL) {
    return new Response(JSON.stringify({ error: 'AEC_CRM_API_URL is not configured' }), {
      status: 500,
    })
  }

  let payload: any
  try {
    payload = await request.json()
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  // Minimal validation
  if (!payload.first_name || !payload.last_name || !payload.email) {
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

    const text = await res.text()
    const contentType = res.headers.get('content-type') || ''

    // Mirror CRM response
    const headers = new Headers({ 'content-type': contentType })
    return new Response(text, { status: res.status, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Upstream request failed', detail: String(err) }), {
      status: 502,
    })
  }
}

export const POST = post
