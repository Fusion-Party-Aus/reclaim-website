/* global process, console */
/* eslint-disable no-console */
/**
 * Corrects the "Build the Melton Line" proofStat. It previously claimed an
 * "80+ min" peak-hour journey time sourced to "PTV timetable data" — that figure
 * doesn't hold up. V/Line's own Ballarat line timetable puts the Melton–Southern
 * Cross run at roughly 32-44 minutes (average ~40). The 80+ minute figure only
 * appears in door-to-door commute estimates that bundle in driving to the station,
 * parking, and wait time — a different claim than "journey time... via a service
 * designed for regional travel." Corrected to the real, sourced number.
 *
 * Run: node scripts/migration/fix-melton-journey-time-stat.js
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

const proofStat = {
  number: '~40 min',
  label:
    'peak-hour V/Line journey time from Melton to Southern Cross — a diesel regional service standing in for a metro line, on a corridor Melbourne\'s fastest-growing outer suburb has outgrown',
  source: 'V/Line Ballarat line timetable',
}

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

  await client.patch(docId).set({ proofStat }).commit()
  console.log(`✅ Corrected proofStat on ${docId}`)
}

run()
