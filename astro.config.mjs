// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import { agentsSummary } from '@nuasite/agent-summary'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), agentsSummary(),],

  vite: {
    plugins: [tailwindcss()]
  }
});