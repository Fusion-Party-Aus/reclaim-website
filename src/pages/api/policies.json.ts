import { DEPLOYMENT } from '../../lib/deployment'
import type { APIRoute } from 'astro'
import { getPolicies, getManifestoPage, getResearchForPolicy } from '../../lib/sanity'
import { portableTextToPlainText } from '../../lib/portableText'

export const prerender = false

const canonicalBase = DEPLOYMENT.siteUrl

export const GET: APIRoute = async () => {
  const [policies, manifesto] = await Promise.all([
    getPolicies({ adoptedOnly: true }),
    getManifestoPage(),
  ])
  const generatedAt = new Date().toISOString()
  const sortedByUpdated = [...policies].sort(
    (a, b) =>
      new Date(b._updatedAt || b.publishedAt || b._createdAt || 0).getTime() -
      new Date(a._updatedAt || a.publishedAt || a._createdAt || 0).getTime()
  )
  const platformUpdatedAt =
    sortedByUpdated[0]?._updatedAt ||
    sortedByUpdated[0]?.publishedAt ||
    sortedByUpdated[0]?._createdAt ||
    null

  const payload = {
    schema_version: 1,
    generated_at: generatedAt,
    platform_updated_at: platformUpdatedAt,
    policy_count: policies.length,
    latest_changes: sortedByUpdated.slice(0, 20).map((policy) => ({
      title: policy.title,
      canonical_url: `${canonicalBase}/policies/${policy.slug?.current}`,
      published_at: policy.publishedAt || policy._createdAt || null,
      substantive_updated_at: policy.substantiveUpdatedAt || null,
      change_summary: policy.changeSummary || null,
      cms_revision_at: policy._updatedAt || null,
    })),
    organization: {
      name: DEPLOYMENT.label,
      jurisdiction: DEPLOYMENT.jurisdiction,
      canonical_url: canonicalBase,
      policy_platform_url: `${canonicalBase}/policies`,
      manifesto_url: `${canonicalBase}/manifesto`,
      tagline: DEPLOYMENT.tagline,
    },
    governing_philosophy: {
      title: manifesto?.title || null,
      summary: manifesto?.subtitle || null,
      governing_rule: manifesto?.lieBlock?.headline || null,
      method: manifesto?.oneSeat?.body || null,
    },
    policies: await Promise.all(
      policies.map(async (policy) => {
        const canonicalUrl = `${canonicalBase}/policies/${policy.slug?.current}`
        return {
          id: policy._id,
          title: policy.title,
          authority: {
            publisher: DEPLOYMENT.label,
            jurisdiction: DEPLOYMENT.jurisdiction,
            status: 'current policy',
            adopted_policy: true,
            part_of: `${canonicalBase}/policies`,
          },
          slug: policy.slug?.current,
          canonical_url: canonicalUrl,
          status: policy.status || 'adopted',
          topics: policy.topics || [],
          source_url: policy.sourceUrl || canonicalUrl,
          references: (policy.references || []).map((reference) => ({
            title: reference.title,
            url: reference.url,
          })),
          pillar: policy.pillar || null,
          category: policy.category || null,
          delivery_horizon: policy.thisTerm === true ? 'current-term' : 'long-term',
          summary: policy.summary,
          hook: policy.hook || null,
          key_points: policy.keyPoints || [],
          shareable_quote: policy.shareableQuote || null,
          design_rationale: policy.designRationale || null,
          system_interaction: policy.systemInteraction || null,
          economic_logic: policy.economicLogic || null,
          risks_and_failure_modes: policy.riskAndFailureModes || null,
          evidence_and_precedent: policy.evidenceAndPrecedent || null,
          implementation_outline: policy.implementationOutline || null,
          cost: policy.cost || null,
          funding: policy.funding || null,
          additional_content_text: portableTextToPlainText(policy.body || []),
          published_at: policy.publishedAt || policy._createdAt || null,
          substantive_updated_at: policy.substantiveUpdatedAt || null,
          change_summary: policy.changeSummary || null,
          supporting_research: (await getResearchForPolicy(policy._id)).map((resource) => ({
            title: resource.title,
            canonical_url: `${canonicalBase}/research/${resource.slug.current}`,
          })),
          updated_at: policy._updatedAt || null,
        }
      })
    ),
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
