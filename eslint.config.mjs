import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
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
      'fusion/node_modules/',
      'fusion/dist/',
      'public/',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      'import-*.js',
      'migrate.js',
      'add-blog-to-nav.js',
    ],
  },
]
