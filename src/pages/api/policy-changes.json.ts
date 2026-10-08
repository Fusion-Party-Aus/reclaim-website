import { DEPLOYMENT } from '../../lib/deployment'
import type { APIRoute } from 'astro'
import { getPolicies } from '../../lib/sanity'

export const prerender = false

const base = DEPLOYMENT.siteUrl

export const GET: APIRoute = async () => {
  const policies = await getPolicies()

  const publications = policies
    .filter((policy) => policy.slug?.current && policy.publishedAt)
    .map((policy) => ({
      event_type: 'published',
      event_at: policy.publishedAt,
      title: policy.title,
      canonical_url: `${base}/policies/${policy.slug.current}`,
      pillar: policy.pillar || null,
      category: policy.category || null,
    }))
    .sort((a, b) => new Date(b.event_at || 0).getTime() - new Date(a.event_at || 0).getTime())

  const substantiveChanges = policies
    .filter((policy) => policy.slug?.current && policy.substantiveUpdatedAt && policy.changeSummary)
    .map((policy) => ({
      event_type: 'substantive_update',
      event_at: policy.substantiveUpdatedAt,
      title: policy.title,
      canonical_url: `${base}/policies/${policy.slug.current}`,
      summary: policy.changeSummary,
      pillar: policy.pillar || null,
      category: policy.category || null,
    }))
    .sort((a, b) => new Date(b.event_at || 0).getTime() - new Date(a.event_at || 0).getTime())

  const latestEventAt =
    [...publications, ...substantiveChanges]
      .map((event) => event.event_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null

  return new Response(
    JSON.stringify(
      {
        schema_version: 2,
        change_log_semantics: {
          substantive_update:
            'Policy substance changed and an editor supplied a public change note.',
          published: 'The policy was first published publicly.',
          excluded:
            'Routine CMS revisions, formatting changes, metadata edits and republication do not appear as substantive policy changes.',
        },
        latest_event_at: latestEventAt,
        policy_count: policies.length,
        latest_substantive_changes: substantiveChanges.slice(0, 20),
        latest_publications: publications.slice(0, 20),
        canonical_policy_feed: `${base}/api/policies.json`,
      },
      null,
      2
    ),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=120, s-maxage=300',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
