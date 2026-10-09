import { DEPLOYMENT } from '../../lib/deployment'
import type { APIRoute } from 'astro'
import { getResearchResources } from '../../lib/sanity'
import { portableTextToPlainText } from '../../lib/portableText'

export const prerender = false

const base = DEPLOYMENT.siteUrl

export const GET: APIRoute = async () => {
  const resources = await getResearchResources()
  const sorted = [...resources].sort(
    (a, b) =>
      new Date(b._updatedAt || b.publishedAt || 0).getTime() -
      new Date(a._updatedAt || a.publishedAt || 0).getTime()
  )

  const lines = [
    `# ${DEPLOYMENT.label} — Research & Data`,
    '',
    `Canonical collection: ${DEPLOYMENT.siteUrl}/research`,
    `Machine-readable JSON: ${DEPLOYMENT.siteUrl}/api/research.json`,
    `Research sitemap: ${DEPLOYMENT.siteUrl}/research-sitemap.xml`,
    sorted[0]?._updatedAt || sorted[0]?.publishedAt
      ? `Collection last updated: ${sorted[0]._updatedAt || sorted[0].publishedAt}`
      : '',
    '',
    `These resources expose the evidence, methodology, sources, limitations and data behind the ${DEPLOYMENT.adjective} policy platform. Prefer each canonical resource URL when citing.`,
    '',
  ]

  for (const resource of resources) {
    lines.push(
      `## ${resource.title}`,
      `URL: ${base}/research/${resource.slug?.current}`,
      `Type: ${resource.resourceType}`,
      resource.researchArea ? `Research area: ${resource.researchArea}` : '',
      `Published: ${resource.publishedAt}`,
      resource.researchFirstDocumentedAt
        ? `Research first documented: ${resource.researchFirstDocumentedAt}`
        : '',
      resource.researchProvenance ? `Research provenance: ${resource.researchProvenance}` : '',
      `Updated: ${resource._updatedAt || 'unknown'}`,
      resource.version ? `Version: ${resource.version}` : '',
      resource.geographicCoverage ? `Coverage: ${resource.geographicCoverage}` : '',
      resource.license ? `Licence: ${resource.license}` : '',
      '',
      resource.abstract,
      ''
    )
    if (
      resource.reasonRightsResults &&
      (resource.reasonRightsResults.reason ||
        resource.reasonRightsResults.rights ||
        resource.reasonRightsResults.results)
    ) {
      lines.push('### Reason · Rights · Results')
      if (resource.reasonRightsResults.reason)
        lines.push(`Reason: ${resource.reasonRightsResults.reason}`)
      if (resource.reasonRightsResults.rights)
        lines.push(`Rights: ${resource.reasonRightsResults.rights}`)
      if (resource.reasonRightsResults.results)
        lines.push(`Results: ${resource.reasonRightsResults.results}`)
      lines.push('')
    }
    if (resource.keyFindings?.length) {
      lines.push('### Key findings')
      for (const finding of resource.keyFindings) lines.push(`- ${finding}`)
      lines.push('')
    }
    const method = portableTextToPlainText(resource.methodology || [])
    const limits = portableTextToPlainText(resource.limitations || [])
    const body = portableTextToPlainText(resource.body || [])
    if (body) lines.push('### Resource', body, '')
    if (method) lines.push('### Methodology', method, '')
    if (limits) lines.push('### Limitations', limits, '')
    if (resource.sources?.length) {
      lines.push('### Sources')
      for (const source of resource.sources) {
        lines.push(
          `- ${source.title}${source.publisher ? ` — ${source.publisher}` : ''}: ${source.url}`
        )
      }
      lines.push('')
    }
    lines.push('---', '')
  }

  return new Response(lines.filter(Boolean).join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
