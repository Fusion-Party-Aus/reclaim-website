import type { APIRoute } from 'astro'
import { getResearchResources } from '../../lib/sanity'
import { portableTextToPlainText } from '../../lib/portableText'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'

export const GET: APIRoute = async () => {
  const resources = await getResearchResources()
  const sorted = [...resources].sort(
    (a, b) => new Date(b._updatedAt || b.publishedAt || 0).getTime() - new Date(a._updatedAt || a.publishedAt || 0).getTime()
  )

  const payload = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    collection_updated_at: sorted[0]?._updatedAt || sorted[0]?.publishedAt || null,
    canonical_collection_url: `${base}/research`,
    organization: {
      name: 'Fusion Party Victoria',
      jurisdiction: 'Victoria, Australia',
      canonical_url: base,
    },
    resources: resources.map((resource) => ({
      id: resource._id,
      title: resource.title,
      slug: resource.slug?.current,
      canonical_url: `${base}/research/${resource.slug?.current}`,
      resource_type: resource.resourceType,
      authority: {
        publisher: 'Fusion Party Victoria',
        jurisdiction: 'Victoria, Australia',
        status: 'research/evidence',
        adopted_policy: false,
        collection: `${base}/research`,
      },
      research_area: resource.researchArea || null,
      abstract: resource.abstract,
      authors: resource.authors || [],
      published_at: resource.publishedAt,
      research_first_documented_at: resource.researchFirstDocumentedAt || null,
      research_provenance: resource.researchProvenance || null,
      updated_at: resource._updatedAt || null,
      version: resource.version || null,
      geographic_coverage: resource.geographicCoverage || null,
      license: resource.license || null,
      doi: resource.doi || null,
      topics: resource.tags || [],
      key_findings: resource.keyFindings || [],
      reason_rights_results: resource.reasonRightsResults || null,
      methodology_text: portableTextToPlainText(resource.methodology || []),
      limitations_text: portableTextToPlainText(resource.limitations || []),
      body_text: portableTextToPlainText(resource.body || []),
      sources: resource.sources || [],
      downloads: resource.downloads || [],
      external_project_url: resource.externalProjectUrl || null,
      repository_url: resource.repositoryUrl || null,
      related_research: resource.relatedResearch?.map((related) => ({
        title: related.title,
        canonical_url: `${base}/research/${related.slug.current}`,
      })) || [],
      related_policies: resource.relatedPolicies?.map((policy) => ({
        title: policy.title,
        canonical_url: `${base}/policies/${policy.slug.current}`,
      })) || [],
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
