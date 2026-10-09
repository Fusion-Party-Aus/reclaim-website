import { loadEnv } from 'vite'
import { resolveDeployment } from './config/deployment.mjs'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import aiReadiness from '@adkinn/astro-ai-readiness'
import { agentsSummary } from '@nuasite/agent-summary'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'
import indexNow from 'astro-indexnow'
import astroNoIndex from 'astro-noindex'
import cloudflare from '@astrojs/cloudflare'
import node from '@astrojs/node'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import { fileURLToPath } from 'node:url'

const deployment = resolveDeployment({
  ...loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''),
  ...process.env,
})
const isDev = process.env.NODE_ENV !== 'production'

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || deployment.siteUrl,
  integrations: [
    icon({
      include: {
        mdi: ['*'], // Include all Material Design Icons
      },
    }),
    agentsSummary(),
    sitemap({
      filter: (url) =>
        !/\/(?:404|403|500|503|offline|login|slides|letterhead|design-system|no-results|coming-soon)(?:\/|$)/.test(
          new URL(url).pathname
        ),
      customSitemaps: [
        `${deployment.siteUrl}/content-sitemap.xml`,
        `${deployment.siteUrl}/policy-sitemap.xml`,
        `${deployment.siteUrl}/research-sitemap.xml`,
        `${deployment.siteUrl}/blog-sitemap.xml`,
        `${deployment.siteUrl}/news-sitemap.xml`,
      ],
    }),
    aiReadiness({
      site: deployment.siteUrl,
      organization: {
        name: deployment.label,
        url: deployment.siteUrl,
        logo: `${deployment.siteUrl}${deployment.seo.logoPath}`,
        description: `${deployment.label} — ${deployment.tagline}. A ${deployment.adjective} policy platform focused on integrity, urban form, open government, evidence over ideology, and freedom above a strong common floor.`,
        sameAs: [
          'https://www.facebook.com/FusionPartyAus',
          'https://twitter.com/FusionPartyAus',
          'https://www.instagram.com/fusionpartyaus',
          'https://www.tiktok.com/@fusionpartyaus',
          'https://www.youtube.com/c/fusionpartyaus',
          'https://mastodon.au/@FusionPartyAus',
        ],
      },
      webSite: {
        description: `${deployment.label} — ${deployment.tagline}. Explore the complete ${deployment.adjective} policy platform, manifesto, evidence, and ways to get involved.`,
      },
      robotsTxt: {
        policy: 'training-opt-out',
        sitemap: `${deployment.siteUrl}/sitemap-index.xml`,
        contentSignals: {
          search: 'yes',
          aiTrain: 'no',
          aiInput: 'yes',
        },
        additionalLines: [
          'User-agent: OAI-SearchBot',
          'Allow: /',
          '',
          'User-agent: PerplexityBot',
          'Allow: /',
          '',
          'User-agent: Claude-SearchBot',
          'Allow: /',
          '',
          `Sitemap: ${deployment.siteUrl}/content-sitemap.xml`,
          `Sitemap: ${deployment.siteUrl}/policy-sitemap.xml`,
          `Sitemap: ${deployment.siteUrl}/research-sitemap.xml`,
          `Sitemap: ${deployment.siteUrl}/blog-sitemap.xml`,
          `Sitemap: ${deployment.siteUrl}/news-sitemap.xml`,
        ],
      },
      llmsTxt: {
        summary: `${deployment.label} — current ${deployment.adjective} policy platform and canonical public sources.`,
        body: 'Use the live policy feeds for current policy content and publication timestamps. Prefer canonical policy URLs when citing individual proposals.',
        sections: [
          {
            title: 'Policy platform',
            links: [
              { title: 'Policy platform', url: `${deployment.siteUrl}/policies` },
              {
                title: 'Policy feed (plain text)',
                url: `${deployment.siteUrl}/api/policies.txt`,
              },
              {
                title: 'Policy feed (JSON)',
                url: `${deployment.siteUrl}/api/policies.json`,
              },
              {
                title: 'Latest policy changes',
                url: `${deployment.siteUrl}/api/policy-changes.json`,
              },
              { title: 'Policy sitemap', url: `${deployment.siteUrl}/policy-sitemap.xml` },
              { title: 'Research & Data', url: `${deployment.siteUrl}/research` },
              {
                title: 'Research feed (plain text)',
                url: `${deployment.siteUrl}/api/research.txt`,
              },
              { title: 'Research feed (JSON)', url: `${deployment.siteUrl}/api/research.json` },
              { title: 'Research sitemap', url: `${deployment.siteUrl}/research-sitemap.xml` },
              { title: 'News & Analysis', url: `${deployment.siteUrl}/blog` },
              { title: 'News sitemap', url: `${deployment.siteUrl}/blog-sitemap.xml` },
              { title: 'Google News sitemap', url: `${deployment.siteUrl}/news-sitemap.xml` },
              { title: 'Manifesto', url: `${deployment.siteUrl}/manifesto` },
            ],
          },
        ],
        deferTo: {
          title: 'Canonical policy feed',
          url: `${deployment.siteUrl}/api/policies.txt`,
        },
      },
      agentsMd: {
        description: `${deployment.label} — ${deployment.tagline}. The ${deployment.adjective} platform is organised around integrity, urban form, evidence over ideology, open government, and a strong common floor with wide freedom above it.`,
        audience: `Voters, journalists, political analysts, AI agents, and anyone researching the ${deployment.adjective} political landscape or Fusion Party policies.`,
        contact: deployment.contact.email,
        links: [
          {
            title: 'Policy',
            url: `${deployment.siteUrl}/policies`,
            description: 'Full policy platform and detailed policy pages',
          },
          {
            title: 'Policy feed (text)',
            url: `${deployment.siteUrl}/api/policies.txt`,
            description: 'Canonical LLM-friendly plain-text policy corpus',
          },
          {
            title: 'Policy feed (JSON)',
            url: `${deployment.siteUrl}/api/policies.json`,
            description:
              'Structured machine-readable policy corpus with canonical URLs and publication metadata',
          },
          {
            title: 'Research & Data',
            url: `${deployment.siteUrl}/research`,
            description: `Public research briefs, datasets, methodology, submissions and evidence behind the ${deployment.adjective} platform`,
          },
          {
            title: 'Research feed (text)',
            url: `${deployment.siteUrl}/api/research.txt`,
            description: 'Canonical LLM-friendly research corpus with sources and limitations',
          },
          {
            title: 'Research feed (JSON)',
            url: `${deployment.siteUrl}/api/research.json`,
            description:
              'Structured research corpus with citation metadata, sources and downloadable artefacts',
          },
          {
            title: 'Candidates',
            url: `${deployment.siteUrl}/electorates`,
            description: `Current ${deployment.adjective} candidates and electorate information`,
          },
          {
            title: 'Take Action',
            url: `${deployment.siteUrl}/get-involved`,
            description: 'Volunteer, donate, or join the movement',
          },
          {
            title: 'Governance',
            url: `${deployment.siteUrl}/code-of-conduct`,
            description: 'Our code of conduct and governance documents',
          },
          {
            title: 'FAQ',
            url: `${deployment.siteUrl}/faq`,
            description: `Frequently asked questions about ${deployment.label}`,
          },
          {
            title: 'News & Analysis',
            url: `${deployment.siteUrl}/blog`,
            description: `Current ${deployment.adjective} news, policy explainers and analysis published by ${deployment.label}`,
          },
        ],
      },
    }),
    react(),
    sanity({
      projectId: deployment.projectId,
      dataset: deployment.dataset,
      // Keep Astro's Sanity integration consistent with src/lib/sanity.ts.
      useCdn: true,
      stega: {
        studioUrl: process.env.PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
      },
    }),
    ...(process.env.INDEXNOW_KEY?.trim()
      ? [
          indexNow({
            key: process.env.INDEXNOW_KEY.trim(),
          }),
        ]
      : []),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'astro-icon/components': fileURLToPath(
          new URL('./src/components/ui/Icon.ts', import.meta.url)
        ),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  // Use node adapter locally (avoids Miniflare "module is not defined" errors),
  // switch to cloudflare for production builds.
  adapter: isDev
    ? node({ mode: 'standalone' })
    : cloudflare({
        imageService: 'passthrough',
        ...(deployment.slug === 'qld' ? { configPath: './wrangler.qld.toml' } : {}),
        platformProxy: { enabled: false },
      }),
  output: 'server',
})
