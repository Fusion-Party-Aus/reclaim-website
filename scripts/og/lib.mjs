/**
 * Shared constants/helpers for the OG image generators. Deliberately has no
 * dependency on playwright, satori, or @sanity/client — those load
 * different, heavier things depending on which generator imports this.
 */
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const WIDTH = 1200
export const HEIGHT = 630

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const root = path.resolve(__dirname, '../..')
export const outDir = path.join(root, 'public/og')
export const policiesOutDir = path.join(outDir, 'policies')

export function fontFile(pkg, file) {
  return readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file))
}

export function ensureOutDirs() {
  mkdirSync(outDir, { recursive: true })
  mkdirSync(policiesOutDir, { recursive: true })
}

// Brand tokens — the Reclaim spectrum (see "Fusion Brand Guide.dc.html")
export const COLORS = {
  deepPurple: '#1a0029',
  surfaceRaised: '#2e004d',
  brandPurple: '#5c006b',
  white: '#ffffff',
  magenta: '#d428d4',
  violet: '#7b3fe4',
  blue: '#4a7aeb',
  cyan: '#0bb8d4',
  teal: '#00ddb8',
}

export const logoMarkBase64 = readFileSync(
  path.join(root, 'src/assets/brand/logo-rings-mono-white.png')
).toString('base64')
export const logoMarkDataUri = `data:image/png;base64,${logoMarkBase64}`
