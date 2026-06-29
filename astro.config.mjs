import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import { agentsSummary } from '@nuasite/agent-summary'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import node from '@astrojs/node'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import { fileURLToPath } from 'node:url'

const isDev = process.env.NODE_ENV !== 'production'

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      include: {
        mdi: ['*'], // Include all Material Design Icons
      },
    }),
    agentsSummary(),
    sitemap(),
    react(),
    sanity({
      projectId: 'qwl3f8jb',
      dataset: 'production',
      useCdn: true,
      stega: {
        studioUrl: process.env.PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
      },
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
