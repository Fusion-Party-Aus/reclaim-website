/* global process, console */
/* eslint-disable no-console */
/**
 * Two corrections:
 *
 * 1. "Build the Melton Line" keyPoint 4 was "Hold the bus uplifts to their timeline"
 *    (Route 454 / Route 140). Both are now delivered, so that ask is stale. Replaced
 *    with the live gap next door: Strathtulloh, Rockbank, Deanside and Fraser Rise have
 *    real population with no bus stop within 800m, and the same pattern repeats in
 *    growth areas across Melbourne's south-east and north.
 *
 * 2. "Fix Transit Deserts" already cites VAGO's LGA-level coverage stats (Melton 9-12%,
 *    Cardinia <1%, Casey 9-12%, Hume/Whittlesea 21-24%) but names no suburbs. Added the
 *    same suburb-level specificity to designRationale.
 *
 * Run: node scripts/migration/fix-melton-bus-gap-keypoint.js
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

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  // 1. Build the Melton Line
  const meltonId = 'policy-build-the-melton-line'
  const meltonDoc = await client.getDocument(meltonId)
  if (!meltonDoc) {
    console.error(`❌ Not found: ${meltonId}`)
    process.exit(1)
  }

  const updatedKeyPoints = meltonDoc.keyPoints.map((kp) =>
    kp._key === 'kp-build-the-melton-line-3'
      ? {
          ...kp,
          point: 'Close the 800m bus gap next door',
          description:
            "Route 454 and Route 140 are delivered — but Strathtulloh, Rockbank, Deanside and Fraser Rise, all a few kilometres from Melton station, still have real populations with no bus stop within 800 metres. The same coverage gap repeats across growth areas in Melbourne's south-east and north.",
        }
      : kp
  )

  await client.patch(meltonId).set({ keyPoints: updatedKeyPoints }).commit()
  console.log(`✅ Updated stale keyPoint on ${meltonId}`)

  // 2. Fix Transit Deserts
  const desertsId = 'policy-fix-transit-deserts'
  const desertsDoc = await client.getDocument(desertsId)
  if (!desertsDoc) {
    console.error(`❌ Not found: ${desertsId}`)
    process.exit(1)
  }

  const designRationaleAddition =
    ' Within Melton alone, Strathtulloh, Rockbank, Deanside and Fraser Rise are established, populated suburbs with no bus stop within 800 metres across large sections of their footprint — the same pattern repeats in Casey and Cardinia\'s newer estates in the south-east, and in Hume and Whittlesea\'s northern growth corridor.'

  if (!desertsDoc.designRationale.includes('Strathtulloh')) {
    await client
      .patch(desertsId)
      .set({ designRationale: desertsDoc.designRationale + designRationaleAddition })
      .commit()
    console.log(`✅ Added suburb-level specificity to ${desertsId}`)
  } else {
    console.log(`⚠️  ${desertsId} already has this detail — skipped`)
  }
}

run()
