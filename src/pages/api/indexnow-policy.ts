import { DEPLOYMENT } from '../../lib/deployment'
import type { APIRoute } from 'astro'

export const prerender = false

const base = DEPLOYMENT.siteUrl

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.SANITY_REINDEX_SECRET
  const indexNowKey = import.meta.env.INDEXNOW_KEY

  if (!webhookSecret || !indexNowKey) {
    return new Response(JSON.stringify({ error: 'reindexing is not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${webhookSecret}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const supportedTypes = new Set(['policy', 'researchResource', 'blogPost'])

  if (!supportedTypes.has(payload?._type)) {
    return new Response(JSON.stringify({ ignored: true, reason: 'unsupported document type' }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const slug = payload?.slug?.current
  const routes: Record<string, string[]> = {
    policy: [
      slug ? `${base}/policies/${encodeURIComponent(slug)}` : '',
      `${base}/policies`,
      `${base}/api/policies.json`,
      `${base}/api/policies.txt`,
      `${base}/api/policy-changes.json`,
      `${base}/policy-sitemap.xml`,
    ],
    researchResource: [
      slug ? `${base}/research/${encodeURIComponent(slug)}` : '',
      `${base}/research`,
      `${base}/api/research.json`,
      `${base}/api/research.txt`,
      `${base}/research-sitemap.xml`,
    ],
    blogPost: [
      slug ? `${base}/blog/${encodeURIComponent(slug)}` : '',
      `${base}/blog`,
      `${base}/rss.xml`,
      `${base}/blog-sitemap.xml`,
    ],
  }
  const urls = routes[payload._type].filter(Boolean)

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(DEPLOYMENT.siteUrl).hostname,
      key: indexNowKey,
      keyLocation: `${base}/${indexNowKey}.txt`,
      urlList: urls,
    }),
  })

  if (!response.ok && response.status !== 202) {
    const detail = await response.text().catch(() => '')
    return new Response(
      JSON.stringify({ error: 'IndexNow notification failed', status: response.status, detail }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  }

  return new Response(JSON.stringify({ notified: true, urls }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
