import type { APIRoute } from 'astro'
import { discoveryConfig } from '../lib/site-discovery'
export const prerender = false
export const GET: APIRoute = ({ locals }) => {
  const config = discoveryConfig(locals.siteContext.deployment)
  const lines = [
    `# ${config.organization.name}`,
    `> ${config.llmsTxt.summary}`,
    config.llmsTxt.body,
  ]
  for (const section of config.llmsTxt.sections) {
    lines.push(
      `## ${section.title}`,
      ...section.links.map((link) => `- [${link.title}](${link.url})`)
    )
  }
  lines.push(
    `## Canonical source`,
    `[${config.llmsTxt.deferTo.title}](${config.llmsTxt.deferTo.url})`,
    ''
  )
  return new Response(lines.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
