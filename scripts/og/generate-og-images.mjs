#!/usr/bin/env node
/**
 * Generates the site's OpenGraph images (1200x630), styled to the Reclaim
 * design system (dark-first, spectrum accents, Barlow Condensed display type
 * — see "Fusion Brand Guide.dc.html").
 *
 * Two passes:
 *  1. Static section images (Playwright) — home page and section index
 *     pages, everywhere a Sanity-hosted photo isn't a better fit and content
 *     isn't individually templated.
 *  2. One card per policy (satori + @resvg/resvg-js, see policy-card.mjs),
 *     built from that policy's own title/summary. This runs as a plain
 *     Node script rather than an Astro route/endpoint because
 *     @resvg/resvg-js ships a native binary that Vite/Rollup can't bundle
 *     for the Cloudflare Worker target — see the git history on this file
 *     for the build failure that motivated moving it here.
 *
 * Blog posts, electorate candidates, and bio pages use their own uploaded
 * image instead (see src/layouts/BaseLayout.astro).
 *
 * Runs automatically before `npm run build` (see the `prebuild` script in
 * package.json) so every deploy picks up current policy content. Not wired
 * into `npm run dev` — that would add several seconds to every dev server
 * restart for images nobody's looking at locally. Run it manually with
 * `npm run generate:og` (or `node scripts/og/generate-og-images.mjs`) if you
 * want to preview OG images during local development.
 */
import { chromium } from 'playwright'
import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { renderPolicyCardPng, PILLAR_ACCENT, DEFAULT_ACCENT } from './policy-card.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const outDir = path.join(root, 'public/og')
const policiesOutDir = path.join(outDir, 'policies')
mkdirSync(policiesOutDir, { recursive: true })

const WIDTH = 1200
const HEIGHT = 630

// ---------------------------------------------------------------------------
// Fonts — inlined as base64 so rendering never depends on network access.
// ---------------------------------------------------------------------------
function fontFile(pkg, file) {
  return readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file))
}

const fonts = {
  barlowCondensed900: fontFile(
    'barlow-condensed',
    'barlow-condensed-latin-900-normal.woff2'
  ).toString('base64'),
  barlow600: fontFile('barlow', 'barlow-latin-600-normal.woff2').toString('base64'),
  spaceMono700: fontFile('space-mono', 'space-mono-latin-700-normal.woff2').toString('base64'),
}

const fontFace = (family, weight, base64) => `
  @font-face {
    font-family: '${family}';
    src: url(data:font/woff2;base64,${base64}) format('woff2');
    font-weight: ${weight};
    font-style: normal;
  }
`

const FONT_CSS = [
  fontFace('Barlow Condensed', 900, fonts.barlowCondensed900),
  fontFace('Barlow', 600, fonts.barlow600),
  fontFace('Space Mono', 700, fonts.spaceMono700),
].join('\n')

const logoMarkBase64 = readFileSync(
  path.join(root, 'src/assets/brand/logo-rings-mono-white.png')
).toString('base64')

// ---------------------------------------------------------------------------
// Brand tokens — the Reclaim spectrum (see "Fusion Brand Guide.dc.html")
// ---------------------------------------------------------------------------
const COLORS = {
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

/**
 * @param {object} spec
 * @param {string} spec.eyebrow - small uppercase tag above the headline
 * @param {string[]} spec.headline - plain headline lines, rendered white
 * @param {string} [spec.accentLine] - final headline line, rendered in the accent color
 * @param {string} [spec.subline] - smaller supporting line under the headline
 * @param {string} spec.accent - primary spectrum accent (badge, rule, accent line, top stripe)
 * @param {string} [spec.tag] - bottom-right corner tag, defaults to the domain
 */
function renderTemplate(spec) {
  const { eyebrow, headline, accentLine, subline, accent, tag = 'VIC.FUSIONPARTY.ORG.AU' } = spec

  const headlineLines = headline.map((line) => `<div class="line">${line}</div>`).join('\n')
  const watermarkLetter = (accentLine || headline[0] || '').trim().charAt(0)

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  ${FONT_CSS}

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: linear-gradient(160deg, ${COLORS.deepPurple} 0%, ${COLORS.surfaceRaised} 100%);
    overflow: hidden;
    position: relative;
    font-family: 'Barlow', sans-serif;
    border-bottom: 8px solid ${COLORS.teal};
  }

  /* Triple colour stripe — the Reclaim system's signature top edge */
  .stripe-magenta { position: absolute; top: 0; left: 0; width: 100%; height: 8px; background: ${COLORS.magenta}; }
  .stripe-teal { position: absolute; top: 8px; left: 0; width: 100%; height: 5px; background: ${COLORS.teal}; }
  .stripe-blue { position: absolute; top: 13px; left: 0; width: 100%; height: 3px; background: ${COLORS.blue}; }

  /* Ghosted structural watermark, matching the Hero component's initial-letter motif */
  .watermark {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 2%;
    pointer-events: none;
    overflow: hidden;
  }
  .watermark span {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 520px;
    line-height: 1;
    color: ${COLORS.white};
    opacity: 0.045;
  }

  .logo-mark {
    position: absolute;
    bottom: 44px;
    right: 72px;
    width: 46px;
    height: 46px;
    opacity: 0.9;
  }
  .logo-mark img { width: 100%; height: 100%; }

  .content {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 70px 72px 56px 76px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    background: color-mix(in srgb, ${accent} 12%, transparent);
    color: ${accent};
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 0.16em;
    padding: 9px 18px 9px 16px;
    border-left: 3px solid ${accent};
    margin-bottom: 34px;
  }

  .headline {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    color: ${COLORS.white};
    font-size: 90px;
    line-height: 0.96;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    max-width: 980px;
  }
  .headline .line { display: block; }
  .headline .accent-line { display: block; color: ${accent}; }

  .rule {
    width: 84px;
    height: 6px;
    background: ${COLORS.teal};
    margin-top: 28px;
    margin-bottom: 24px;
  }

  .subline {
    font-family: 'Barlow', sans-serif;
    font-weight: 600;
    color: ${COLORS.white};
    opacity: 0.8;
    font-size: 27px;
    line-height: 1.45;
    max-width: 780px;
  }

  .footer {
    position: absolute;
    left: 76px;
    right: 72px;
    bottom: 40px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 68px;
  }
  .brand-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    color: ${COLORS.white};
    font-size: 24px;
    letter-spacing: 0.01em;
    line-height: 1;
  }
  .brand-text span {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 700;
    margin-left: 0.4em;
  }

  .tag {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
    letter-spacing: 0.08em;
    padding: 7px 14px;
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
</style>
</head>
<body>
  <div class="stripe-magenta"></div>
  <div class="stripe-teal"></div>
  <div class="stripe-blue"></div>
  <div class="watermark"><span>${watermarkLetter}</span></div>

  <div class="content">
    <div class="eyebrow">${eyebrow}</div>
    <div class="headline">
      ${headlineLines}
      ${accentLine ? `<span class="accent-line">${accentLine}</span>` : ''}
    </div>
    <div class="rule"></div>
    ${subline ? `<div class="subline">${subline}</div>` : ''}
  </div>

  <div class="footer">
    <div class="brand">
      <div class="logo-mark"><img src="data:image/png;base64,${logoMarkBase64}" /></div>
      <div class="brand-text">FUSION<span>VICTORIA</span></div>
    </div>
    <div class="tag">${tag}</div>
  </div>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Image specs
// ---------------------------------------------------------------------------
const IMAGES = [
  {
    name: 'default',
    eyebrow: 'FUSION PARTY VICTORIA',
    headline: ['TAKING BACK'],
    accentLine: 'WHAT THEY STOLE',
    subline: 'A progressive, evidence-based movement to reclaim Victoria.',
    accent: COLORS.magenta,
  },
  {
    name: 'policies',
    eyebrow: 'OUR POLICIES',
    headline: ['REAL COSTINGS.'],
    accentLine: 'NO BULLSHIT.',
    subline: 'Evidence-based solutions to fix the systems that failed us.',
    accent: COLORS.teal,
  },
  {
    name: 'blog',
    eyebrow: 'FUSION VICTORIA / BLOG',
    headline: ['STORIES FROM'],
    accentLine: 'THE MOVEMENT',
    subline: 'Campaign updates and policy announcements.',
    accent: COLORS.violet,
  },
  {
    name: 'electorates',
    eyebrow: 'VIC ELECTORATES',
    headline: ['WHERE WE’RE'],
    accentLine: 'TAKING IT BACK',
    subline: 'Find your electorate. See the plan.',
    accent: COLORS.blue,
  },
  {
    name: 'faq',
    eyebrow: 'GOT QUESTIONS?',
    headline: ['NO SPIN. NO DODGE.'],
    accentLine: 'STRAIGHT TALK.',
    accent: COLORS.cyan,
  },
]

// satori needs woff (not woff2) font data, unlike the Playwright/CSS pass above.
const satoriFonts = [
  {
    name: 'Barlow Condensed',
    data: fontFile('barlow-condensed', 'barlow-condensed-latin-900-normal.woff'),
    weight: 900,
    style: 'normal',
  },
  {
    name: 'Barlow',
    data: fontFile('barlow', 'barlow-latin-600-normal.woff'),
    weight: 600,
    style: 'normal',
  },
  {
    name: 'Space Mono',
    data: fontFile('space-mono', 'space-mono-latin-700-normal.woff'),
    weight: 700,
    style: 'normal',
  },
]
const logoMarkDataUri = `data:image/png;base64,${logoMarkBase64}`

async function generateSectionImages() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  })
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  })

  for (const spec of IMAGES) {
    const html = renderTemplate(spec)
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const outPath = path.join(outDir, `${spec.name}.png`)
    await page.screenshot({ path: outPath })
    console.log(`Generated ${path.relative(root, outPath)}`)
  }

  await browser.close()
}

async function generatePolicyImages() {
  const client = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'qwl3f8jb',
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-01-29',
  })

  const policies = await client.fetch(
    `*[_type == "policy" && defined(slug.current)]{ title, summary, pillar, "slug": slug.current }`
  )

  for (const policy of policies) {
    const accent = PILLAR_ACCENT[policy.pillar] || DEFAULT_ACCENT
    const png = await renderPolicyCardPng(
      {
        eyebrow: policy.pillar || 'OUR POLICIES',
        title: policy.title,
        subline: policy.summary,
        accent,
        tag: 'VIC.FUSIONPARTY.ORG.AU',
        logoMarkDataUri,
      },
      satoriFonts
    )
    const outPath = path.join(policiesOutDir, `${policy.slug}.png`)
    writeFileSync(outPath, png)
    console.log(`Generated ${path.relative(root, outPath)}`)
  }
}

async function main() {
  await generateSectionImages()

  try {
    await generatePolicyImages()
  } catch (err) {
    console.warn(`Skipping per-policy OG images — couldn't reach Sanity: ${err.message}`)
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => {
    // @sanity/client's HTTP layer can emit a socket error a tick after a
    // failed request is already caught above (seen with unreachable/blocked
    // networks) — harmless, but left to fire it would crash the process as
    // an unhandled event. Exiting explicitly once generation is done (with
    // whatever exit code the run has earned) sidesteps that race entirely.
    process.exit(process.exitCode ?? 0)
  })
