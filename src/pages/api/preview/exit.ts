import type { APIRoute } from 'astro'
import { PREVIEW_BROWSER_COOKIE, PREVIEW_SESSION_COOKIE } from '../../../lib/preview-auth'

export const POST: APIRoute = async ({ request, url, cookies }) => {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }
  if (request.headers.get('Origin') !== url.origin)
    return new Response('Invalid preview exit origin', { status: 403, headers })
  cookies.delete(PREVIEW_SESSION_COOKIE, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })
  cookies.delete(PREVIEW_BROWSER_COOKIE, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })
  return new Response(null, { status: 303, headers: { ...headers, Location: '/' } })
}
