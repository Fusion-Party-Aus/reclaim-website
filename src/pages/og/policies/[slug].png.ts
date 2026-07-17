import type { APIRoute } from 'astro'
import { getPolicies } from '../../../lib/sanity'
import { renderOgImagePng, COLORS } from '../../../lib/ogImage'
import type { Policy } from '../../../types/sanity'

const PILLAR_COLORS: Record<string, { primary: string; secondary: string }> = {
  'RECLAIM OUR ECONOMY': { primary: COLORS.magenta, secondary: COLORS.yellow },
  'SOLVE THE HOUSING CRISIS': { primary: COLORS.mint, secondary: COLORS.magenta },
  'FIX THE TAX EXPLOITS': { primary: COLORS.yellow, secondary: COLORS.mint },
  'RECLAIM OUR FUTURE': { primary: COLORS.lavender, secondary: COLORS.mint },
}
const DEFAULT_PILLAR_COLORS = { primary: COLORS.magenta, secondary: COLORS.mint }

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
  const { primary, secondary } = PILLAR_COLORS[policy.pillar || ''] || DEFAULT_PILLAR_COLORS

  const png = await renderOgImagePng({
    eyebrow: policy.pillar || 'OUR POLICIES',
    title: policy.title,
    subline: policy.summary,
    primary,
    secondary,
  })

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
