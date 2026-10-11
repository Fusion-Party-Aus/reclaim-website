import { landingSiteRegistry } from '../../config/site-landings.mjs'
import { createLandingResponse } from '../lib/site-landing'

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url)
    const site = Object.values(landingSiteRegistry).find((entry) =>
      entry.hostnames.includes(url.hostname.toLowerCase())
    )
    if (!site)
      return new Response('Site not found', {
        status: 404,
        headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
      })
    return createLandingResponse(site, url, request.method)
  },
}
