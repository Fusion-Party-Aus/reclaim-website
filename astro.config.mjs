import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import { agentsSummary } from '@nuasite/agent-summary'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import sanity from '@sanity/astro'

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
    sanity({
      projectId: 'qwl3f8jb',
      dataset: 'production',
      useCdn: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: { enabled: false },
  }),
  output: 'server',
})
