import type { APIRoute } from 'astro'
import { getPolicies } from '../../../lib/sanity'
import { renderOgImagePng, COLORS } from '../../../lib/ogImage'
import type { Policy } from '../../../types/sanity'

const PILLAR_ACCENT: Record<string, string> = {
  'RECLAIM OUR ECONOMY': COLORS.magenta,
  'RECLAIM OUR INFRASTRUCTURE': COLORS.blue,
  'RECLAIM OUR DEMOCRACY': COLORS.teal,
}
const DEFAULT_ACCENT = COLORS.magenta

export async function getStaticPaths() {
  const policies = await getPolicies()

  return policies
    .filter((policy) => policy.slug?.current)
    .map((policy) => ({
      params: { slug: policy.slug.current },
      props: { policy },
    }))
}

export const GET: APIRoute = async ({ props }) => {
  const { policy } = props as { policy: Policy }
  const accent = PILLAR_ACCENT[policy.pillar || ''] || DEFAULT_ACCENT

  const png = await renderOgImagePng({
    eyebrow: policy.pillar || 'OUR POLICIES',
    title: policy.title,
    subline: policy.summary,
    accent,
  })

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
