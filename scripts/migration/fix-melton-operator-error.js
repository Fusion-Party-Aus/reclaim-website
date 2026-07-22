/* global process, console */
/* eslint-disable no-console */
/**
 * Corrects a factual error in "Build the Melton Line" systemInteraction: it claimed
 * the existing Melton line is "operated by Metro Trains Melbourne under the MR4
 * franchise." That's wrong and self-contradicts the rest of the policy — the Melton
 * line is operated entirely by V/Line (a regional diesel service), not Metro. Metro
 * Trains Melbourne runs only the electrified metropolitan network (plus the Stony
 * Point diesel exception, which leases V/Line stock but isn't a V/Line service).
 * Metro's own contract (extending to November 2027) is only relevant to what would
 * run the corridor once electrified, not to who runs it today.
 *
 * Run: node scripts/migration/fix-melton-operator-error.js
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim()
      const val = trimmed.substring(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key && !process.env[key]) process.env[key] = val
    }
  })
}

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN,
})

const docId = 'policy-build-the-melton-line'

const systemInteraction =
  "The existing Melton line is operated entirely by V/Line under its own state passenger rail contract — a regional diesel service, not a metropolitan one — sharing track with V/Line's own Ballarat regional services; no metro operator is involved today. Quadruplicating the corridor between Melton and Sunshine requires new track, platform work at affected stations, coordinated planning with V/Line, and approvals under the Major Transport Projects Facilitation Act 2009. Electrifying the separated Melton track would bring the corridor into Metro Trains Melbourne's network for the first time — Metro's own contract currently runs to November 2027 — letting HCMT, the fleet already operating on the Sunbury line, extend service to Melton without requiring a new rolling stock type or a separate maintenance regime. The Melton-to-Broadmeadows BRT corridor is a separate Infrastructure Victoria recommendation worth pursuing on its own timeline, but it is not the same project as quadruplicating and electrifying the Melton line itself, and should not be substituted for it. The Transit Development District mechanism, declaring the Melton BRT corridor terminus a TDD, remains VWHF's tool for anchoring residential and commercial development to that separate transit endpoint."

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  const existing = await client.getDocument(docId)
  if (!existing) {
    console.error(`❌ Not found: ${docId}`)
    process.exit(1)
  }

  await client.patch(docId).set({ systemInteraction }).commit()
  console.log(`✅ Corrected operator error on ${docId}`)
}

run()
