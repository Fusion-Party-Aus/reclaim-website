import type { APIRoute } from 'astro'
import { DEPLOYMENT } from '../lib/deployment'
import { createServiceWorkerScript } from '../lib/service-worker-script'

export const prerender = true

export const GET: APIRoute = () =>
  new Response(createServiceWorkerScript(DEPLOYMENT.slug), {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  })
