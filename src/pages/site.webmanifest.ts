import type { APIRoute } from 'astro'
import { DEPLOYMENT } from '../lib/deployment'

export const prerender = true
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: `${DEPLOYMENT.label} — ${DEPLOYMENT.tagline}`,
      short_name: DEPLOYMENT.label,
      description: DEPLOYMENT.description,
      start_url: '/',
      display: 'standalone',
      background_color: DEPLOYMENT.slug === 'qld' ? '#FFF7EC' : '#000000',
      theme_color: DEPLOYMENT.themeColor,
      icons: [192, 512].map((size) => ({
        src: `/icons/android-chrome-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any maskable',
      })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } }
  )
