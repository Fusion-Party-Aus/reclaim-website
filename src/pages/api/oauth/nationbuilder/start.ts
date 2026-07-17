import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'

// Redirect the admin to NationBuilder's OAuth consent screen.
// Visit /api/oauth/nationbuilder/start in a browser while logged in as admin
// to kick off the initial token grant.
export const GET: APIRoute = async ({ redirect, url }) => {
  const slug = getSecret('NATIONBUILDER_SLUG') ?? ''
  const clientId = getSecret('NATIONBUILDER_CLIENT_ID') ?? ''

  if (!slug || !clientId) {
    return new Response('NATIONBUILDER_SLUG and NATIONBUILDER_CLIENT_ID must be set', {
      status: 500,
    })
  }

  const redirectUri = new URL('/api/oauth/nationbuilder/callback', url).toString()

  const authUrl = new URL(`https://${slug}.nationbuilder.com/oauth/authorize`)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)

  return redirect(authUrl.toString(), 302)
}
