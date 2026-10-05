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

const isDev = process.env.NODE_ENV !== 'production'

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://vic.fusionparty.org.au',
  integrations: [
    icon({
      include: {
        mdi: ['*'], // Include all Material Design Icons
      },
    }),
    agentsSummary(),
    sitemap(),
    aiReadiness({
      site: 'https://vic.fusionparty.org.au',
      organization: {
        name: 'Fusion Party Victoria',
        url: 'https://vic.fusionparty.org.au',
        logo: 'https://vic.fusionparty.org.au/logo.png',
        description: 'Fusion Party Victoria — Reignite Democracy. A Victorian policy platform focused on integrity, urban form, open government, evidence over ideology, and freedom above a strong common floor.',
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
        description: 'Fusion Party Victoria — Reignite Democracy. Explore the complete Victorian policy platform, manifesto, evidence, and ways to get involved.',
      },
      robotsTxt: {
        policy: 'training-opt-out',
        sitemap: 'https://vic.fusionparty.org.au/sitemap-index.xml',
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
          'Sitemap: https://vic.fusionparty.org.au/policy-sitemap.xml',
          'Sitemap: https://vic.fusionparty.org.au/research-sitemap.xml',
          'Sitemap: https://vic.fusionparty.org.au/blog-sitemap.xml',
        ],
      },
      llmsTxt: {
        summary: 'Fusion Party Victoria — current Victorian policy platform and canonical public sources.',
        body: 'Use the live policy feeds for current policy content and publication timestamps. Prefer canonical policy URLs when citing individual proposals.',
        sections: [
          {
            title: 'Policy platform',
            links: [
              { title: 'Policy platform', url: 'https://vic.fusionparty.org.au/policies' },
              { title: 'Policy feed (plain text)', url: 'https://vic.fusionparty.org.au/api/policies.txt' },
              { title: 'Policy feed (JSON)', url: 'https://vic.fusionparty.org.au/api/policies.json' },
              { title: 'Latest policy changes', url: 'https://vic.fusionparty.org.au/api/policy-changes.json' },
              { title: 'Policy sitemap', url: 'https://vic.fusionparty.org.au/policy-sitemap.xml' },
              { title: 'Research & Data', url: 'https://vic.fusionparty.org.au/research' },
              { title: 'Research feed (plain text)', url: 'https://vic.fusionparty.org.au/api/research.txt' },
              { title: 'Research feed (JSON)', url: 'https://vic.fusionparty.org.au/api/research.json' },
              { title: 'Research sitemap', url: 'https://vic.fusionparty.org.au/research-sitemap.xml' },
              { title: 'News & Analysis', url: 'https://vic.fusionparty.org.au/blog' },
              { title: 'News sitemap', url: 'https://vic.fusionparty.org.au/blog-sitemap.xml' },
              { title: 'Manifesto', url: 'https://vic.fusionparty.org.au/manifesto' },
            ],
          },
        ],
        deferTo: {
          title: 'Canonical policy feed',
          url: 'https://vic.fusionparty.org.au/api/policies.txt',
        },
      },
      agentsMd: {
        description: 'Fusion Party Victoria — Reignite Democracy. The Victorian platform is organised around integrity, urban form, evidence over ideology, open government, and a strong common floor with wide freedom above it.',
        audience: 'Voters, journalists, political analysts, AI agents, and anyone researching the Victorian political landscape or Fusion Party policies.',
        contact: 'contact@fusionparty.org.au',
        links: [
          { title: 'Policy', url: 'https://vic.fusionparty.org.au/policies', description: 'Full policy platform and detailed policy pages' },
          { title: 'Policy feed (text)', url: 'https://vic.fusionparty.org.au/api/policies.txt', description: 'Canonical LLM-friendly plain-text policy corpus' },
          { title: 'Policy feed (JSON)', url: 'https://vic.fusionparty.org.au/api/policies.json', description: 'Structured machine-readable policy corpus with canonical URLs and publication metadata' },
          { title: 'Research & Data', url: 'https://vic.fusionparty.org.au/research', description: 'Public research briefs, datasets, methodology, submissions and evidence behind the Victorian platform' },
          { title: 'Research feed (text)', url: 'https://vic.fusionparty.org.au/api/research.txt', description: 'Canonical LLM-friendly research corpus with sources and limitations' },
          { title: 'Research feed (JSON)', url: 'https://vic.fusionparty.org.au/api/research.json', description: 'Structured research corpus with citation metadata, sources and downloadable artefacts' },
          { title: 'Candidates', url: 'https://vic.fusionparty.org.au/electorates', description: 'Current Victorian candidates and electorate information' },
          { title: 'Take Action', url: 'https://vic.fusionparty.org.au/get-involved', description: 'Volunteer, donate, or join the movement' },
          { title: 'Governance', url: 'https://vic.fusionparty.org.au/code-of-conduct', description: 'Our code of conduct and governance documents' },
          { title: 'FAQ', url: 'https://vic.fusionparty.org.au/faq', description: 'Frequently asked questions about Fusion Party Victoria' },
          { title: 'News & Analysis', url: 'https://vic.fusionparty.org.au/blog', description: 'Current Victorian news, policy explainers and analysis published by Fusion Party Victoria' },
        ],
      },
    }),
    react(),
    sanity({
      projectId: 'qwl3f8jb',
      dataset: 'production',
      // Keep Astro's Sanity integration consistent with src/lib/sanity.ts.
      // Signal publishes live content, so stale CDN reads are not acceptable here.
      useCdn: false,
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
    astroNoIndex({
      allow: ['vic.fusionparty.org.au', 'fusionparty.org.au'],
    }),
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
        platformProxy: { enabled: false },
      }),
  output: 'server',
})
