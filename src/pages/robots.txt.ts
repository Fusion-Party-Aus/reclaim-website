import type { APIRoute } from 'astro'
import { discoveryConfig } from '../lib/site-discovery'
export const prerender = false
export const GET: APIRoute = ({ locals }) => {
  const config = discoveryConfig(locals.siteContext.deployment)
  const rules = [
    'User-agent: *\nAllow: /',
    'User-agent: OAI-SearchBot\nAllow: /',
    ...['GPTBot', 'Google-Extended', 'CCBot', 'ClaudeBot', 'anthropic-ai', 'Applebot-Extended'].map(
      (agent) => `User-agent: ${agent}\nDisallow: /`
    ),
  ]
  return new Response(
    [
      'Content-Signal: search=yes, ai-train=no, ai-input=yes',
      ...rules,
      ...config.robotsTxt.additionalLines,
      `Sitemap: ${config.robotsTxt.sitemap}`,
      '',
    ].join('\n\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
