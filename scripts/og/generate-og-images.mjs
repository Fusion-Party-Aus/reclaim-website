#!/usr/bin/env node
/**
 * Generates the site's static OpenGraph images (1200x630) with Playwright.
 *
 * These cover the home page, section index pages, and the four policy
 * pillars — everywhere a Sanity-hosted photo isn't a better fit (blog posts,
 * electorate candidates, and bio pages use their own uploaded image instead;
 * see src/layouts/BaseLayout.astro).
 *
 * Run with: node scripts/og/generate-og-images.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const outDir = path.join(root, 'public/og')
mkdirSync(outDir, { recursive: true })

const WIDTH = 1200
const HEIGHT = 630

// ---------------------------------------------------------------------------
// Fonts — inlined as base64 so rendering never depends on network access.
// ---------------------------------------------------------------------------
function fontFile(pkg, file) {
  return readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file))
}

const fonts = {
  anton: fontFile('anton', 'anton-latin-400-normal.woff2'),
  archivoBlack: fontFile('archivo-black', 'archivo-black-latin-400-normal.woff2'),
  spaceGrotesk700: fontFile('space-grotesk', 'space-grotesk-latin-700-normal.woff2'),
  inter800: fontFile('inter', 'inter-latin-800-normal.woff2'),
}

const fontFace = (family, weight, buf) => `
  @font-face {
    font-family: '${family}';
    src: url(data:font/woff2;base64,${buf.toString('base64')}) format('woff2');
    font-weight: ${weight};
    font-style: normal;
  }
`

const FONT_CSS = [
  fontFace('Anton', 400, fonts.anton),
  fontFace('Archivo Black', 400, fonts.archivoBlack),
  fontFace('Space Grotesk', 700, fonts.spaceGrotesk700),
  fontFace('Inter', 800, fonts.inter800),
].join('\n')

const logoMark = readFileSync(path.join(root, 'public/solo-mono-white.svg'), 'utf8')

// ---------------------------------------------------------------------------
// Brand tokens
// ---------------------------------------------------------------------------
const COLORS = {
  black: '#010102',
  white: '#ffffff',
  magenta: '#c926f2',
  mint: '#5effd8',
  yellow: '#ffed00',
  lavender: '#9a94e7',
}

/**
 * @param {object} spec
 * @param {string} spec.eyebrow - small uppercase tag above the headline
 * @param {string[]} spec.headline - headline, one array entry per line
 * @param {string} [spec.highlight] - final line rendered as a boxed callout instead of plain text
 * @param {string} [spec.subline] - smaller supporting line under the headline
 * @param {string} spec.primary - primary accent color (left border, eyebrow bg)
 * @param {string} spec.secondary - secondary accent color (right border, stripe)
 * @param {string} [spec.tag] - bottom-right corner tag, defaults to the domain
 */
function renderTemplate(spec) {
  const {
    eyebrow,
    headline,
    highlight,
    subline,
    primary,
    secondary,
    tag = 'VIC.FUSIONPARTY.ORG.AU',
  } = spec

  const headlineLines = headline.map((line) => `<div class="line">${line}</div>`).join('\n')

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
    background: ${COLORS.black};
    overflow: hidden;
    position: relative;
    font-family: 'Inter', sans-serif;
  }

  .frame {
    position: absolute;
    inset: 0;
    border: 7px solid ${COLORS.black};
    border-left: 16px solid ${primary};
    border-right: 16px solid ${secondary};
    box-shadow: inset 0 -10px 0 0 ${primary};
  }

  .stripe {
    position: absolute;
    opacity: 0.14;
  }
  .stripe-a {
    top: -60%;
    right: -12%;
    width: 46%;
    height: 220%;
    background: ${primary};
    transform: rotate(18deg);
  }
  .stripe-b {
    bottom: -60%;
    left: -14%;
    width: 40%;
    height: 220%;
    background: ${secondary};
    transform: rotate(-18deg);
  }

  .corner-ring {
    position: absolute;
    top: 0;
    right: 0;
    width: 260px;
    height: 260px;
    border: 8px solid ${secondary};
    opacity: 0.5;
    transform: translate(28%, -28%) rotate(20deg);
  }

  .logo-mark {
    position: absolute;
    bottom: -120px;
    right: -100px;
    width: 460px;
    height: 460px;
    opacity: 0.08;
  }
  .logo-mark svg { width: 100%; height: 100%; }

  .content {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 66px 72px 50px 76px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    align-self: flex-start;
    background: ${primary};
    color: ${COLORS.black};
    font-family: 'Archivo Black', sans-serif;
    font-size: 21px;
    letter-spacing: 0.08em;
    padding: 10px 20px;
    border: 4px solid ${COLORS.black};
    box-shadow: 6px 6px 0 0 ${COLORS.black};
    transform: rotate(-1.2deg);
    margin-bottom: 40px;
  }
  .eyebrow .dot {
    width: 12px;
    height: 12px;
    background: ${COLORS.black};
    border-radius: 50%;
  }

  .headline {
    font-family: 'Anton', sans-serif;
    color: ${COLORS.white};
    font-size: 92px;
    line-height: 0.94;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    max-width: 980px;
  }
  .headline .line {
    display: block;
  }

  .highlight {
    display: inline-block;
    background: ${secondary};
    color: ${COLORS.black};
    padding: 4px 18px 10px;
    margin-top: 6px;
    border: 5px solid ${COLORS.black};
    box-shadow: 8px 8px 0 0 ${COLORS.black};
    transform: rotate(-1deg);
  }

  .subline {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: ${COLORS.white};
    font-size: 30px;
    margin-top: 30px;
    max-width: 760px;
    opacity: 0.92;
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
    gap: 14px;
  }
  .brand-mark {
    width: 40px;
    height: 40px;
    opacity: 0.95;
  }
  .brand-mark svg { width: 100%; height: 100%; }
  .brand-text {
    font-family: 'Archivo Black', sans-serif;
    color: ${COLORS.white};
    font-size: 22px;
    letter-spacing: 0.02em;
    line-height: 1;
  }
  .brand-text span {
    display: block;
    color: ${primary};
    font-size: 13px;
    letter-spacing: 0.16em;
    margin-top: 6px;
  }

  .tag {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: ${COLORS.black};
    background: ${COLORS.white};
    font-size: 16px;
    letter-spacing: 0.05em;
    padding: 8px 14px;
    border: 3px solid ${COLORS.black};
  }
</style>
</head>
<body>
  <div class="frame"></div>
  <div class="stripe stripe-a"></div>
  <div class="stripe stripe-b"></div>
  <div class="corner-ring"></div>
  <div class="logo-mark">${logoMark}</div>

  <div class="content">
    <div class="eyebrow"><span class="dot"></span>${eyebrow}</div>
    <div class="headline">
      ${headlineLines}
      ${highlight ? `<span class="highlight">${highlight}</span>` : ''}
    </div>
    ${subline ? `<div class="subline">${subline}</div>` : ''}
  </div>

  <div class="footer">
    <div class="brand">
      <div class="brand-mark">${logoMark}</div>
      <div class="brand-text">FUSION VICTORIA<span>RECLAIM OUR FUTURE</span></div>
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
    eyebrow: 'FUSION VICTORIA',
    headline: ['TAKING', 'BACK WHAT'],
    highlight: 'THEY STOLE',
    primary: COLORS.magenta,
    secondary: COLORS.mint,
  },
  {
    name: 'policies',
    eyebrow: 'OUR POLICIES',
    headline: ['REAL COSTINGS.'],
    highlight: 'NO BULLSHIT.',
    subline: 'Evidence-based solutions to fix the systems that failed us.',
    primary: COLORS.mint,
    secondary: COLORS.yellow,
  },
  {
    name: 'policies-economy',
    eyebrow: 'POLICY PILLAR 01',
    headline: ['RECLAIM OUR'],
    highlight: 'ECONOMY',
    subline: 'Fix the systems. Fix the country.',
    primary: COLORS.magenta,
    secondary: COLORS.yellow,
  },
  {
    name: 'policies-housing',
    eyebrow: 'POLICY PILLAR 02',
    headline: ['SOLVE THE'],
    highlight: 'HOUSING CRISIS',
    subline: 'Housing is a right, not an investment.',
    primary: COLORS.mint,
    secondary: COLORS.magenta,
  },
  {
    name: 'policies-tax',
    eyebrow: 'POLICY PILLAR 03',
    headline: ['FIX THE'],
    highlight: 'TAX EXPLOITS',
    subline: 'Wealth should be earned, not extracted.',
    primary: COLORS.yellow,
    secondary: COLORS.mint,
  },
  {
    name: 'policies-future',
    eyebrow: 'POLICY PILLAR 04',
    headline: ['RECLAIM OUR'],
    highlight: 'FUTURE',
    subline: 'A democracy that answers to the public.',
    primary: COLORS.lavender,
    secondary: COLORS.mint,
  },
  {
    name: 'blog',
    eyebrow: 'FUSION VICTORIA / BLOG',
    headline: ['STORIES FROM'],
    highlight: 'THE MOVEMENT',
    subline: 'Campaign updates and policy announcements.',
    primary: COLORS.mint,
    secondary: COLORS.lavender,
  },
  {
    name: 'electorates',
    eyebrow: 'VIC ELECTORATES',
    headline: ['WHERE WE’RE'],
    highlight: 'TAKING IT BACK',
    subline: 'Find your electorate. See the plan.',
    primary: COLORS.yellow,
    secondary: COLORS.magenta,
  },
  {
    name: 'faq',
    eyebrow: 'GOT QUESTIONS?',
    headline: ['NO SPIN.', 'NO DODGE.'],
    highlight: 'STRAIGHT TALK.',
    primary: COLORS.lavender,
    secondary: COLORS.yellow,
  },
]

async function main() {
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

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
