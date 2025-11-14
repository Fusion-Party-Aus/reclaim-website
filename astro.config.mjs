// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'

import { agentsSummary } from '@nuasite/agent-summary'

import icon from 'astro-icon'

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
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
