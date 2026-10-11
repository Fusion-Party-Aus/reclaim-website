import type { APIRoute } from 'astro'
export const prerender = false

/** IndexNow verifies a key on the resolved Site's own canonical host. */
export const GET: APIRoute = ({ params }) => {
  const key = import.meta.env.INDEXNOW_KEY?.trim()
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key) || params.indexnowKey !== key)
    return new Response('Not found', { status: 404 })
  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
