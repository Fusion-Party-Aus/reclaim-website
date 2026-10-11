import type { APIRoute } from 'astro'
import { createServiceWorkerScript } from '../lib/service-worker-script'

export const prerender = false

export const GET: APIRoute = ({ locals }) =>
  new Response(createServiceWorkerScript(locals.siteContext.site.siteId), {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  })
