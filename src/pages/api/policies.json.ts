import type { APIRoute } from 'astro'
import { getPolicies, getManifestoPage } from '../../lib/sanity'
import { portableTextToPlainText } from '../../lib/portableText'

export const prerender = false

const canonicalBase = 'https://vic.fusionparty.org.au'

export const GET: APIRoute = async () => {
  const [policies, manifesto] = await Promise.all([getPolicies(), getManifestoPage()])
  const generatedAt = new Date().toISOString()

  const payload = {
    schema_version: 1,
    generated_at: generatedAt,
    organization: {
      name: 'Fusion Party Victoria',
      jurisdiction: 'Victoria, Australia',
      canonical_url: canonicalBase,
      policy_platform_url: `${canonicalBase}/policies`,
      manifesto_url: `${canonicalBase}/manifesto`,
      tagline: 'Reignite Democracy',
    },
    governing_philosophy: {
      title: manifesto?.title || null,
      summary: manifesto?.subtitle || null,
      governing_rule: manifesto?.lieBlock?.headline || null,
      method: manifesto?.oneSeat?.body || null,
    },
    policies: policies.map((policy) => ({
      id: policy._id,
      title: policy.title,
      slug: policy.slug?.current,
      canonical_url: `${canonicalBase}/policies/${policy.slug?.current}`,
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
      updated_at: policy._updatedAt || null,
    })),
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
