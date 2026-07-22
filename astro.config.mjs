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
    sitemap({
      filter: (page) =>
        !['/403/', '/404/', '/500/', '/503/', '/slides/', '/coming-soon/', '/no-results/', '/offline/', '/letterhead/', '/design-system/', '/login/']
          .some((path) => page.endsWith(path)),
    }),
    aiReadiness({
      site: 'https://vic.fusionparty.org.au',
      organization: {
        name: 'Fusion Party Victoria',
        url: 'https://vic.fusionparty.org.au',
        logo: 'https://vic.fusionparty.org.au/logo.png',
        description: 'Fusion Party Victoria — a grassroots political movement fighting to reclaim Victoria from a broken two-party system. We champion personal liberty, social justice, environmental responsibility, and evidence-based policy.',
        sameAs: [
          'https://www.facebook.com/FusionPartyAus',
          'https://twitter.com/FusionPartyAus',
          'https://www.instagram.com/fusionpartyaus',
          'https://www.tiktok.com/@fusionpartyaus',
          'https://www.youtube.com/c/fusionpartyaus',
          'https://mastodon.au/@FusionPartyAus',
        ],
        founder: {
          name: 'Fusion Party Australia',
          jobTitle: 'Founding Movement',
          sameAs: ['https://fusionparty.org.au'],
        },
      },
      webSite: {
        description: 'Fusion Party Victoria - Taking back what they stole. Learn about our policies, candidates, and how to get involved in the movement to reclaim Victoria.',
      },
      robotsTxt: {
        policy: 'training-opt-out',
      },
      agentsMd: {
        description: 'Fusion Party Victoria is a grassroots political movement fighting to reclaim Victoria from a broken two-party system. We champion personal liberty, social justice, environmental responsibility, and evidence-based policy.',
        audience: 'Voters, journalists, political analysts, AI agents, and anyone researching the Victorian political landscape or Fusion Party policies.',
        contact: 'contact@fusionparty.org.au',
        links: [
          { title: 'Policy', url: 'https://vic.fusionparty.org.au/policies', description: 'Full policy platform and detailed policy pages' },
          { title: 'Candidates', url: 'https://vic.fusionparty.org.au/electorates', description: 'Meet our executive team and candidates' },
          { title: 'Take Action', url: 'https://vic.fusionparty.org.au/get-involved', description: 'Volunteer, donate, or join the movement' },
          { title: 'Governance', url: 'https://vic.fusionparty.org.au/code-of-conduct', description: 'Our code of conduct and governance documents' },
          { title: 'FAQ', url: 'https://vic.fusionparty.org.au/faq', description: 'Frequently asked questions about Fusion Party Victoria' },
          { title: 'Blog', url: 'https://vic.fusionparty.org.au/blog', description: 'News, analysis, and updates from the campaign' },
        ],
      },
    }),
    react(),
    sanity({
      projectId: 'qwl3f8jb',
      dataset: 'production',
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
