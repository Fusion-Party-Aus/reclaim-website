#!/usr/bin/env node
/**
 * Generates one OG card per policy (public/og/policies/<slug>.png), built
 * from that policy's own title/summary, via satori + @resvg/resvg-js (see
 * policy-card.mjs). No browser involved — this has to stay lighter and more
 * portable than generate-static-images.mjs, since it runs automatically
 * before every production build (see the `prebuild` script in package.json)
 * so deploys always reflect current Sanity content. If Sanity can't be
 * reached (offline dev, an outage) this logs a warning and exits
 * successfully rather than failing the build — a missing preview image is a
 * much lower-severity problem than a blocked deploy.
 *
 * Run directly with: node scripts/og/generate-policy-images.mjs
 */
import { createClient } from '@sanity/client'
import path from 'node:path'
import { renderPolicyCardPng, PILLAR_ACCENT, DEFAULT_ACCENT } from './policy-card.mjs'
import { root, policiesOutDir, fontFile, logoMarkDataUri, ensureOutDirs } from './lib.mjs'

ensureOutDirs()

// satori needs woff (not woff2) font data.
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

async function generatePolicyImages() {
  const { writeFileSync } = await import('node:fs')
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

generatePolicyImages()
  .catch((err) => {
    console.warn(`Skipping per-policy OG images — couldn't reach Sanity: ${err.message}`)
  })
  .finally(() => {
    // @sanity/client's HTTP layer can emit a socket error a tick after a
    // failed request is already caught above (seen with unreachable/blocked
    // networks) — harmless, but left to fire it would crash the process as
    // an unhandled event. Exiting explicitly once generation is done
    // sidesteps that race entirely.
    process.exit(0)
  })
