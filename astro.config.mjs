import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { agentsSummary } from '@nuasite/agent-summary'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import sanity from '@sanity/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
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

  adapter: cloudflare(),
  output: 'static',
})
