/**
 * Renders branded 1200x630 OG images at build time for content that doesn't
 * have (or shouldn't use) a hand-designed static image — e.g. one per policy.
 *
 * Uses satori (HTML/CSS-ish layout -> SVG) + resvg (SVG -> PNG) rather than a
 * headless browser, since this runs as part of `astro build`.
 */
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const WIDTH = 1200
const HEIGHT = 630

// Resolved from the project root rather than import.meta.url, since this
// module runs inside Astro/Vite's build pipeline where the latter isn't
// guaranteed to point at a location node_modules is reachable from.
function fontFile(pkgRelativePath: string) {
  return readFileSync(path.join(process.cwd(), 'node_modules', pkgRelativePath))
}

const fontsPromise = Promise.resolve([
  {
    name: 'Anton',
    data: fontFile('@fontsource/anton/files/anton-latin-400-normal.woff'),
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'Archivo Black',
    data: fontFile('@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff'),
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'Space Grotesk',
    data: fontFile('@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'),
    weight: 700 as const,
    style: 'normal' as const,
  },
])

export const COLORS = {
  black: '#010102',
  white: '#ffffff',
  magenta: '#c926f2',
  mint: '#5effd8',
  yellow: '#ffed00',
  lavender: '#9a94e7',
}

/** Rough headline size so long policy titles still fit within the 630px canvas. */
function headlineSize(title: string) {
  if (title.length <= 24) return 76
  if (title.length <= 40) return 60
  if (title.length <= 60) return 48
  if (title.length <= 80) return 40
  return 34
}

export interface OgCardSpec {
  eyebrow: string
  title: string
  subline?: string
  tag?: string
  primary: string
  secondary: string
}

function buildTree({
  eyebrow,
  title,
  subline,
  tag = 'VIC.FUSIONPARTY.ORG.AU',
  primary,
  secondary,
}: OgCardSpec) {
  return {
    type: 'div',
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.black,
        borderWidth: '7px',
        borderStyle: 'solid',
        borderColor: COLORS.black,
        borderLeftWidth: '16px',
        borderLeftColor: primary,
        borderRightWidth: '16px',
        borderRightColor: secondary,
        borderBottomWidth: '10px',
        borderBottomColor: primary,
        padding: '66px 72px 50px 76px',
        position: 'relative',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: '-40px',
              right: '-60px',
              width: '220px',
              height: '220px',
              border: `8px solid ${secondary}`,
              opacity: 0.4,
              transform: 'rotate(20deg)',
            },
            children: [],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignSelf: 'flex-start',
              backgroundColor: primary,
              color: COLORS.black,
              fontFamily: 'Archivo Black',
              fontSize: '20px',
              letterSpacing: '0.04em',
              padding: '10px 20px',
              border: `4px solid ${COLORS.black}`,
              boxShadow: `6px 6px 0 0 ${COLORS.black}`,
              transform: 'rotate(-1.2deg)',
              marginBottom: '38px',
            },
            children: eyebrow,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Anton',
              color: COLORS.white,
              fontSize: `${headlineSize(title)}px`,
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              maxWidth: '980px',
            },
            children: title,
          },
        },
        subline
          ? {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontFamily: 'Space Grotesk',
                  color: COLORS.white,
                  fontSize: '26px',
                  marginTop: '26px',
                  maxWidth: '820px',
                  opacity: 0.9,
                },
                children: subline,
              },
            }
          : null,
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              left: '76px',
              right: '72px',
              bottom: '40px',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Archivo Black',
                    color: COLORS.white,
                    fontSize: '22px',
                  },
                  children: 'FUSION VICTORIA',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Space Grotesk',
                    color: COLORS.black,
                    backgroundColor: COLORS.white,
                    fontSize: '16px',
                    padding: '8px 14px',
                    border: `3px solid ${COLORS.black}`,
                  },
                  children: tag,
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  }
}

export async function renderOgImagePng(spec: OgCardSpec): Promise<Buffer> {
  const fonts = await fontsPromise
  const svg = await satori(buildTree(spec) as never, { width: WIDTH, height: HEIGHT, fonts })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
  return resvg.render().asPng()
}
