import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import branchManifest from '../../config/branches.mjs'
import {
  buildThemeIndex,
  validateThemeCss,
  validateTokenContract,
} from '../../config/branch/theme.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const themeDirectory = resolve(root, 'src/styles/themes')
const indexPath = resolve(themeDirectory, 'index.css')
const cssBySlug = {}

for (const slug of Object.keys(branchManifest.branches)) {
  try {
    cssBySlug[slug] = await readFile(resolve(themeDirectory, `${slug}.css`), 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT')
      throw new Error(`Manifest branch '${slug}' has no theme file: src/styles/themes/${slug}.css`)
    throw error
  }
}

validateTokenContract(branchManifest)
validateThemeCss(branchManifest, cssBySlug)
const generated = buildThemeIndex(branchManifest)
const check = process.argv.includes('--check')

if (check) {
  const current = await readFile(indexPath, 'utf8')
  if (current !== generated) {
    throw new Error(
      'src/styles/themes/index.css is stale; run node scripts/branch/generate-theme-index.mjs'
    )
  }
} else {
  await writeFile(indexPath, generated)
}

for (const match of generated.matchAll(/@import ['"](.+?)['"];?/g)) {
  await readFile(resolve(themeDirectory, match[1]), 'utf8')
}
