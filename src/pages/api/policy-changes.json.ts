import type { APIRoute } from 'astro'
import { getPolicies } from '../../lib/sanity'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'

export const GET: APIRoute = async () => {
  const policies = await getPolicies()
  const sorted = policies
    .filter((policy) => policy.slug?.current)
    .map((policy) => ({
      title: policy.title,
      canonical_url: `${base}/policies/${policy.slug.current}`,
      published_at: policy.publishedAt || policy._createdAt || null,
      updated_at: policy._updatedAt || null,
      pillar: policy.pillar || null,
      category: policy.category || null,
    }))
    .sort((a, b) => new Date(b.updated_at || b.published_at || 0).getTime() - new Date(a.updated_at || a.published_at || 0).getTime())

  const platformUpdatedAt = sorted[0]?.updated_at || sorted[0]?.published_at || null

  return new Response(JSON.stringify({
    schema_version: 1,
    platform_updated_at: platformUpdatedAt,
    policy_count: sorted.length,
    latest_changes: sorted.slice(0, 20),
    canonical_policy_feed: `${base}/api/policies.json`,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=120, s-maxage=300',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
