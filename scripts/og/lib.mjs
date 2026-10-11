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

// Fallback values are used only by legacy callers without resolved Site tokens.
export const COLORS = {
  deepPurple: '#0b0b0b',
  surfaceRaised: '#161616',
  brandPurple: '#003c71',
  white: '#ffffff',
  teal: '#3ce0c0',
}

function luminance(color) {
  const match = /^#([\da-f]{6})$/i.exec(color)
  if (!match) return 0
  const channels = [0, 2, 4].map((offset) => parseInt(match[1].slice(offset, offset + 2), 16) / 255)
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  )
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

/** Resolve the palette from the active Branch/Site design tokens. */
export function ogTheme(deployment) {
  const tokens = deployment.themeTokens ?? {}
  const background = tokens['surface-base'] ?? COLORS.deepPurple
  const isLight = luminance(background) > 0.5
  return {
    background,
    surface: tokens['surface-raised'] ?? COLORS.surfaceRaised,
    foreground: tokens.fg ?? COLORS.white,
    muted: tokens.muted ?? 'rgba(255, 255, 255, 0.72)',
    primary: tokens.primary ?? COLORS.brandPurple,
    onPrimary: tokens['on-primary'] ?? COLORS.white,
    accent: isLight ? (tokens.primary ?? COLORS.brandPurple) : (tokens.secondary ?? COLORS.teal),
    secondary: tokens.secondary ?? COLORS.teal,
    line: tokens.line ?? 'rgba(255, 255, 255, 0.25)',
    isLight,
  }
}
