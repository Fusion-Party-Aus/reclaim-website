import { defineConfig } from 'vitest/config'
import { getViteConfig } from 'astro/config'
import { fileURLToPath } from 'url'

export default defineConfig(async (env) => {
  const userConfig = {
    resolve: {
      alias: {
        cookie: fileURLToPath(new URL('./src/test/cookie-shim.ts', import.meta.url)),
      },
    },
    ssr: {
      noExternal: [],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
      exclude: ['node_modules', 'dist', '.astro', 'studio'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.config.*',
          '**/*.d.ts',
          'dist/',
          '.astro/',
          'studio/',
          'import-*.js',
          'migrate.js',
        ],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 70,
          statements: 70,
        },
      },
    },
  }

  const getAstroConfig = getViteConfig(userConfig)
  return getAstroConfig(env)
})
