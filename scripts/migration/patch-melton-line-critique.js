/* global process, console */
/* eslint-disable no-console */
/**
 * Appends the $650m Melton Line Upgrade sequencing critique to the existing
 * "Build the Melton Line" policy, per the detail-agent note in docs/policy/NEW_POLICY.md:
 * nine-car trains solve capacity, not the 40-minute peak frequency problem caused by
 * V/Line's skip-stop pattern — frequency should increase before more carriages are added
 * to an infrequent service.
 *
 * Run: node scripts/migration/patch-melton-line-critique.js
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

const villainAddition =
  " The government's marquee response — a $650 million Melton Line Upgrade to lengthen platforms for nine-car V/Line trains — solves capacity, not the actual constraint. Peak frequency on the corridor is capped at every 40 minutes by V/Line's skip-stop pattern between Melton and the city. A longer train moves more people per service; it does nothing to make services run more often."

const designRationaleAddition =
  " Frequency, not capacity, is the binding constraint on this corridor: nine-car trains funded under the $650 million Melton Line Upgrade address peak overcrowding but not the 40-minute peak headway created by V/Line's skip-stop pattern. Sequencing matters — increasing frequency first makes every carriage added afterward serve more passengers per hour; adding carriages to an infrequent service first just means more people crammed onto the same rare train. A dedicated, electrified Melton line resolves the sequencing problem structurally rather than requiring it be re-argued each budget cycle."

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

  if (existing.villain.includes('$650 million')) {
    console.log('⚠️  Critique already present — skipping to avoid duplicating the append.')
    return
  }

  await client
    .patch(docId)
    .set({
      villain: existing.villain + villainAddition,
      designRationale: existing.designRationale + designRationaleAddition,
    })
    .commit()

  console.log(`✅ Patched ${docId} with the Melton Line Upgrade sequencing critique.`)
}

run()
