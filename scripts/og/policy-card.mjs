/**
 * Renders one branded 1200x630 OG card per policy, using that policy's own
 * title/summary, using the active Site's resolved theme.
 *
 * Runs as a plain Node script (see generate-og-images.mjs) rather than as an
 * Astro route: @resvg/resvg-js ships a native binary that Vite/Rollup can't
 * bundle for the Cloudflare Worker target, so this has to stay outside
 * Astro's build graph entirely.
 */
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { COLORS } from './lib.mjs'

const WIDTH = 1200
const HEIGHT = 630

/** Rough headline size so long policy titles still fit within the 630px canvas. */
function headlineSize(title) {
  if (title.length <= 24) return 76
  if (title.length <= 40) return 60
  if (title.length <= 60) return 48
  if (title.length <= 80) return 40
  return 34
}

function buildTree({
  title,
  subline,
  tag,
  theme = {
    background: COLORS.deepPurple,
    surface: COLORS.surfaceRaised,
    foreground: COLORS.white,
    muted: 'rgba(255, 255, 255, 0.72)',
    primary: COLORS.brandPurple,
    onPrimary: COLORS.white,
    accent: COLORS.teal,
    line: 'rgba(255, 255, 255, 0.25)',
  },
  branchLabel = 'VICTORIA',
}) {
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
        backgroundColor: theme.background,
        borderBottomWidth: '8px',
        borderBottomStyle: 'solid',
        borderBottomColor: theme.primary,
        padding: '70px 72px 56px 76px',
        position: 'relative',
        fontFamily: 'Barlow',
      },
      children: [
        // One decisive site-color bar anchors the shared graphic system.
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '12px',
              backgroundColor: theme.accent,
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
                    color: theme.foreground,
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
              fontFamily: 'Barlow Condensed',
              fontWeight: 900,
              color: theme.foreground,
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
              backgroundColor: theme.accent,
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
                  color: theme.muted,
                  fontSize: '26px',
                  lineHeight: 1.4,
                  maxWidth: '820px',
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
                  style: { display: 'flex', alignItems: 'center', gap: '18px' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '44px',
                          height: '44px',
                          backgroundColor: theme.primary,
                          color: theme.onPrimary,
                          fontFamily: 'Barlow Condensed',
                          fontWeight: 900,
                          fontSize: '28px',
                        },
                        children: 'F',
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
                          color: theme.foreground,
                          fontSize: '24px',
                        },
                        children: [
                          { type: 'span', props: { children: 'FUSION' } },
                          {
                            type: 'span',
                            props: {
                              style: {
                                color: theme.muted,
                                fontWeight: 700,
                                marginLeft: '0.4em',
                              },
                              children: branchLabel,
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
                    color: theme.foreground,
                    fontSize: '15px',
                    letterSpacing: '0.08em',
                    padding: '7px 14px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: theme.line,
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

/**
 * @param {object} spec
 * @param {string} spec.title
 * @param {string} [spec.subline]
 * @param {string} spec.tag
 * @param {object} spec.theme
 * @param {Array<{name: string, data: Buffer, weight: number, style: 'normal'}>} fonts
 */
export async function renderPolicyCardPng(spec, fonts) {
  const svg = await satori(buildTree(spec), { width: WIDTH, height: HEIGHT, fonts })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
  return resvg.render().asPng()
}
