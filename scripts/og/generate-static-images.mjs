#!/usr/bin/env node
/**
 * Generates the site's 5 static OpenGraph images (1200x630) — home/default
 * and section index pages — once per registered Site, using its resolved
 * design tokens and canonical hostname.
 *
 * These are stable, hand-authored brand assets that don't depend on Sanity
 * content, so unlike the per-policy generator (generate-policy-images.mjs)
 * this is NOT run automatically before a build — a Chromium launch is a
 * meaningfully heavier and more environment-sensitive dependency than the
 * satori/@resvg/resvg-js pipeline, and there's nothing here that goes stale
 * between manual runs. Regenerate manually after changing the template or
 * copy, and commit the results:
 *   node scripts/og/generate-static-images.mjs
 */
import { chromium } from 'playwright'
import { WIDTH, HEIGHT, root, outDir, fontFile, ogTheme } from './lib.mjs'
import { siteRegistry } from '../../config/sites.mjs'
import path from 'node:path'
import { mkdirSync } from 'node:fs'

// ---------------------------------------------------------------------------
// Fonts — inlined as base64 so rendering never depends on network access.
// ---------------------------------------------------------------------------
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

/**
 * @param {object} spec
 * @param {string[]} spec.headline - plain headline lines, rendered in the Site foreground
 * @param {string} [spec.accentLine] - final headline line, rendered in the accent color
 * @param {string} [spec.subline] - smaller supporting line under the headline
 * @param {string} [spec.tag] - bottom-right corner tag, defaults to the domain
 */
function renderTemplate(spec, site) {
  const theme = ogTheme(site.deployment)
  const {
    headline,
    accentLine,
    subline,
    tag = new URL(site.canonicalOrigin).hostname.toUpperCase(),
  } = spec

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
    background: ${theme.background};
    overflow: hidden;
    position: relative;
    font-family: 'Barlow', sans-serif;
    border-bottom: 8px solid ${theme.primary};
  }

  .stripe-primary {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 12px;
    background: ${theme.accent};
  }

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
    color: ${theme.foreground};
    opacity: 0.055;
  }

  .monogram {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    background: ${theme.primary};
    color: ${theme.onPrimary};
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 30px;
    font-weight: 900;
  }

  .content {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 70px 72px 56px 76px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .headline {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    color: ${theme.foreground};
    font-size: 90px;
    line-height: 0.96;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    max-width: 980px;
  }
  .headline .line { display: block; }
  .headline .accent-line {
    display: block;
    color: ${theme.accent};
  }

  .rule {
    width: 84px;
    height: 6px;
    background: ${theme.secondary};
    margin-top: 28px;
    margin-bottom: 24px;
  }

  .subline {
    font-family: 'Barlow', sans-serif;
    font-weight: 600;
    color: ${theme.muted};
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
    gap: 18px;
  }
  .brand-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    color: ${theme.foreground};
    font-size: 24px;
    letter-spacing: 0.01em;
    line-height: 1;
  }
  .brand-text span {
    color: ${theme.muted};
    font-weight: 700;
    margin-left: 0.4em;
  }

  .tag {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    color: ${theme.foreground};
    font-size: 15px;
    letter-spacing: 0.08em;
    padding: 7px 14px;
    border: 1px solid ${theme.line};
  }
</style>
</head>
<body>
  <div class="stripe-primary"></div>
  <div class="watermark"><span>${watermarkLetter}</span></div>

  <div class="content">
    <div class="headline">
      ${headlineLines}
      ${accentLine ? `<span class="accent-line">${accentLine}</span>` : ''}
    </div>
    <div class="rule"></div>
    ${subline ? `<div class="subline">${subline}</div>` : ''}
  </div>

  <div class="footer">
    <div class="brand">
      <div class="monogram">F</div>
      <div class="brand-text">
        FUSION<span>${site.deployment.state.toUpperCase()}</span>
      </div>
    </div>
    <div class="tag">${tag}</div>
  </div>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Shared copy; the Site supplies the palette, identity and canonical host.
// ---------------------------------------------------------------------------
function imagesFor(site) {
  const state = site.deployment.state
  return [
    {
      name: 'default',
      headline: ['REASON. RIGHTS.'],
      accentLine: 'RESULTS.',
      subline: site.deployment.tagline,
    },
    {
      name: 'policies',
      headline: ['POLICY'],
      accentLine: 'IN PRACTICE',
      subline: `Evidence, detail and priorities for ${state}.`,
    },
    {
      name: 'blog',
      headline: ['LATEST'],
      accentLine: 'UPDATES',
      subline: `${site.deployment.label} news and policy updates.`,
    },
    {
      name: 'electorates',
      headline: ['YOUR'],
      accentLine: 'ELECTORATE',
      subline: 'Local representation, policy and community priorities.',
    },
    {
      name: 'faq',
      headline: ['CLEAR ANSWERS'],
      accentLine: 'ABOUT FUSION',
    },
  ]
}

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  })
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  })

  for (const site of Object.values(siteRegistry)) {
    const siteOutDir = path.join(outDir, site.siteId)
    mkdirSync(siteOutDir, { recursive: true })
    for (const spec of imagesFor(site)) {
      const html = renderTemplate(spec, site)
      await page.setContent(html, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      const outPath = path.join(siteOutDir, `${spec.name}.png`)
      await page.screenshot({ path: outPath })
      console.log(`Generated ${path.relative(root, outPath)}`)
    }
  }

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
