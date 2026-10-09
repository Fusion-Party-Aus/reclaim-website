import type { APIRoute } from 'astro'
import { DEPLOYMENT } from '../lib/deployment'
import { branchManifest } from '../../config/branches.mjs'

export const prerender = true
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: `${DEPLOYMENT.label} — ${DEPLOYMENT.tagline}`,
      short_name: DEPLOYMENT.label,
      description: DEPLOYMENT.description,
      start_url: '/',
      display: 'standalone',
      background_color: branchManifest.branches[DEPLOYMENT.slug].theme.tokens['surface-base'],
      theme_color: DEPLOYMENT.themeColor,
      orientation: 'portrait-primary',
      categories: ['politics', 'news', 'government'],
      icons: [192, 512].map((size) => ({
        src: `/icons/android-chrome-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any maskable',
      })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } }
  )
