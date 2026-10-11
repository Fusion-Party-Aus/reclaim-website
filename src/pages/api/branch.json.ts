import type { Deployment } from '../../../config/deployment.mjs'
import type { APIRoute } from 'astro'

export function buildBranchInfo(deployment: Deployment) {
  return {
    slug: deployment.slug,
    label: deployment.label,
    state: deployment.state,
    jurisdiction: deployment.jurisdiction,
    canonicalUrl: deployment.siteUrl,
    tagline: deployment.tagline,
    socialAccounts: deployment.socialAccounts,
    policyUrl: `${deployment.siteUrl}/policies`,
    policyApiUrl: `${deployment.siteUrl}/api/policies.json`,
  }
}

export const GET: APIRoute = ({ locals }) => {
  const DEPLOYMENT = locals.siteContext.deployment
  return new Response(JSON.stringify(buildBranchInfo(DEPLOYMENT)), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': DEPLOYMENT.siteUrl,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
