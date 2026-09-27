import type { APIRoute } from 'astro'
import { getPolicies, getManifestoPage } from '../../lib/sanity'
import { portableTextToPlainText } from '../../lib/portableText'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'

const section = (label: string, value?: string | null) =>
  value?.trim() ? `\n### ${label}\n${value.trim()}\n` : ''

export const GET: APIRoute = async () => {
  const [policies, manifesto] = await Promise.all([getPolicies(), getManifestoPage()])

  const lines = [
    '# Fusion Party Victoria — Policy Platform',
    '',
    'Canonical source: https://vic.fusionparty.org.au/policies',
    'Machine-readable JSON: https://vic.fusionparty.org.au/api/policies.json',
    'Manifesto: https://vic.fusionparty.org.au/manifesto',
    '',
    'Campaign through-line: Reignite Democracy.',
    manifesto?.subtitle ? `Governing philosophy: ${manifesto.subtitle}` : '',
    manifesto?.lieBlock?.headline ? `Governing rule: ${manifesto.lieBlock.headline}` : '',
    '',
    'This file is generated from the published Sanity policy corpus. Prefer each policy canonical URL for citation.',
    '',
  ]

  for (const policy of policies) {
    lines.push(
      `## ${policy.title}`,
      `URL: ${base}/policies/${policy.slug?.current}`,
      `Pillar: ${policy.pillar || 'Uncategorised'}`,
      `Category: ${policy.category || 'General'}`,
      `Delivery horizon: ${policy.thisTerm === true ? 'Current-term priority' : 'Long-term direction'}`,
      `Published: ${policy.publishedAt || policy._createdAt || 'unknown'}`,
      `Updated: ${policy._updatedAt || 'unknown'}`,
      '',
      policy.summary || '',
    )
    if (policy.hook) lines.push('', `Hook: ${policy.hook}`)
    if (policy.keyPoints?.length) {
      lines.push('', 'Key points:')
      for (const point of policy.keyPoints) {
        lines.push(`- ${point.point}${point.description ? `: ${point.description}` : ''}`)
      }
    }
    if (policy.shareableQuote) lines.push('', `Shareable quote: ${policy.shareableQuote}`)
    if (policy.designRationale) lines.push(section('Design rationale', policy.designRationale))
    if (policy.systemInteraction) lines.push(section('System interaction', policy.systemInteraction))
    if (policy.economicLogic) lines.push(section('Economic and institutional logic', policy.economicLogic))
    if (policy.riskAndFailureModes) lines.push(section('Risks and failure modes', policy.riskAndFailureModes))
    if (policy.evidenceAndPrecedent) lines.push(section('Evidence and precedent', policy.evidenceAndPrecedent))
    if (policy.implementationOutline) lines.push(section('Implementation outline', policy.implementationOutline))
    if (policy.cost) lines.push(`Cost: ${policy.cost}`)
    if (policy.funding) lines.push(`Funding: ${policy.funding}`)
    const body = portableTextToPlainText(policy.body || [])
    if (body) lines.push(section('Additional content', body))
    lines.push('', '---', '')
  }

  return new Response(lines.filter(Boolean).join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
