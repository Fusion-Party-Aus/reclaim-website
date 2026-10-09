import type { APIRoute } from 'astro'
import { DEPLOYMENT } from '../lib/deployment'

export const prerender = true
export const GET: APIRoute = () => {
  const backgroundColor = DEPLOYMENT.themeTokens['surface-base']
  if (typeof backgroundColor !== 'string' || !backgroundColor.trim()) {
    throw new Error(`Branch '${DEPLOYMENT.slug}' has no valid surface-base theme token.`)
  }

  return new Response(
    JSON.stringify({
      name: `${DEPLOYMENT.label} — ${DEPLOYMENT.tagline}`,
      short_name: DEPLOYMENT.label,
      description: DEPLOYMENT.description,
      start_url: '/',
      display: 'standalone',
      background_color: backgroundColor,
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
}
