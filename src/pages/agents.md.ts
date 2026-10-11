import type { APIRoute } from 'astro'
import { discoveryConfig } from '../lib/site-discovery'
export const prerender = false
export const GET: APIRoute = ({ locals }) => {
  const config = discoveryConfig(locals.siteContext.deployment)
  return new Response(
    [
      `# ${config.organization.name}`,
      `> ${config.agentsMd.description}`,
      `## Audience`,
      config.agentsMd.audience,
      `## Public sources`,
      ...config.agentsMd.links.map((link) => `- [${link.title}](${link.url}): ${link.description}`),
      `## Contact`,
      config.agentsMd.contact,
      '',
    ].join('\n\n'),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } }
  )
}
