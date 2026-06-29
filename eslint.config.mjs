import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginAstro from 'eslint-plugin-astro'
import globals from 'globals'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    // Cloudflare Worker / Node 18+ globals — this client runs in either
    // environment depending on caller, both expose fetch/URL/Response.
    files: ['nationbuilder/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.worker,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // Console warnings - we want to catch debug logs
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // General code quality
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    // Ignore patterns
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'studio/node_modules/',
      'studio/dist/',
      'public/',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      'scripts/migration/**',
    ],
  },
]
