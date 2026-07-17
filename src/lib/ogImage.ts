/**
 * Renders branded 1200x630 OG images at build time for content that doesn't
 * have (or shouldn't use) a hand-designed static image — e.g. one per policy.
 *
 * Styled to the Reclaim design system (dark-first, spectrum accents, Barlow
 * Condensed display type — see "Fusion Brand Guide.dc.html").
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
    name: 'Barlow Condensed',
    data: fontFile('@fontsource/barlow-condensed/files/barlow-condensed-latin-900-normal.woff'),
    weight: 900 as const,
    style: 'normal' as const,
  },
  {
    name: 'Barlow',
    data: fontFile('@fontsource/barlow/files/barlow-latin-600-normal.woff'),
    weight: 600 as const,
    style: 'normal' as const,
  },
  {
    name: 'Space Mono',
    data: fontFile('@fontsource/space-mono/files/space-mono-latin-700-normal.woff'),
    weight: 700 as const,
    style: 'normal' as const,
  },
])

const logoMarkDataUri = (() => {
  const png = readFileSync(path.join(process.cwd(), 'src/assets/brand/logo-rings-mono-white.png'))
  return `data:image/png;base64,${png.toString('base64')}`
})()

export const COLORS = {
  deepPurple: '#1a0029',
  surfaceRaised: '#2e004d',
  white: '#ffffff',
  magenta: '#d428d4',
  violet: '#7b3fe4',
  blue: '#4a7aeb',
  cyan: '#0bb8d4',
  teal: '#00ddb8',
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
  accent: string
}

function buildTree({
  eyebrow,
  title,
  subline,
  tag = 'VIC.FUSIONPARTY.ORG.AU',
  accent,
}: OgCardSpec) {
  const watermarkLetter = title.trim().charAt(0).toUpperCase()

  return {
    type: 'div',
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(160deg, ${COLORS.deepPurple} 0%, ${COLORS.surfaceRaised} 100%)`,
        borderBottomWidth: '8px',
        borderBottomStyle: 'solid',
        borderBottomColor: COLORS.teal,
        padding: '70px 72px 56px 76px',
        position: 'relative',
        fontFamily: 'Barlow',
      },
      children: [
        // Triple colour stripe — the Reclaim system's signature top edge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '8px',
              backgroundColor: COLORS.magenta,
            },
            children: [],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: '8px',
              left: 0,
              width: '100%',
              height: '5px',
              backgroundColor: COLORS.teal,
            },
            children: [],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: '13px',
              left: 0,
              width: '100%',
              height: '3px',
              backgroundColor: COLORS.blue,
            },
            children: [],
          },
        },
        // Ghosted structural watermark — first letter of the title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              inset: 0,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '2%',
              overflow: 'hidden',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Barlow Condensed',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '520px',
                    lineHeight: 1,
                    color: COLORS.white,
                    opacity: 0.045,
                  },
                  children: watermarkLetter,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignSelf: 'flex-start',
              backgroundColor: `${accent}1F`,
              color: accent,
              fontFamily: 'Space Mono',
              fontSize: '18px',
              letterSpacing: '0.16em',
              padding: '9px 18px 9px 16px',
              borderLeftWidth: '3px',
              borderLeftStyle: 'solid',
              borderLeftColor: accent,
              marginBottom: '34px',
            },
            children: eyebrow,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Barlow Condensed',
              fontWeight: 900,
              color: COLORS.white,
              fontSize: `${headlineSize(title)}px`,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              maxWidth: '980px',
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '84px',
              height: '6px',
              backgroundColor: COLORS.teal,
              marginTop: '28px',
              marginBottom: subline ? '24px' : 0,
            },
            children: [],
          },
        },
        subline
          ? {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontFamily: 'Barlow',
                  fontWeight: 600,
                  color: COLORS.white,
                  fontSize: '26px',
                  lineHeight: 1.4,
                  maxWidth: '820px',
                  opacity: 0.8,
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
                  style: { display: 'flex', alignItems: 'center', gap: '68px' },
                  children: [
                    {
                      type: 'img',
                      props: {
                        src: logoMarkDataUri,
                        width: 46,
                        height: 46,
                        style: { display: 'flex', opacity: 0.9 },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'Barlow Condensed',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: COLORS.white,
                          fontSize: '24px',
                        },
                        children: [
                          { type: 'span', props: { children: 'FUSION' } },
                          {
                            type: 'span',
                            props: {
                              style: {
                                color: 'rgba(255,255,255,0.5)',
                                fontWeight: 700,
                                marginLeft: '0.4em',
                              },
                              children: 'VICTORIA',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Space Mono',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '15px',
                    letterSpacing: '0.08em',
                    padding: '7px 14px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255,255,255,0.25)',
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
