/* global process, console */
/* eslint-disable no-console */
/**
 * Two precedent corrections found during fact-checking:
 *
 * 1. "Build the Melton Line" evidenceAndPrecedent cited a "Dandenong corridor
 *    quadruplication (Caulfield to Dandenong)" as delivered precedent for metro/V-Line
 *    track separation. This never happened: a 2006 triplication proposal for that
 *    corridor was scaled back, and the corridor was rebuilt in the 2010s retaining its
 *    double-track layout. The real, delivered precedent is East Pakenham station
 *    (opened June 2024), which extended dedicated metro track by 2km specifically to
 *    stop V/Line Gippsland trains queuing behind Metro trains turning back.
 *
 * 2. "Finish the Network" evidenceAndPrecedent described Singapore's City Hall/Raffles
 *    Place interchange as each station handling "one direction" of NSL/EWL transfer.
 *    Verified detail: each station's two-level platform actually pairs two of the four
 *    possible line-direction combinations, and the two stations together cover all four
 *    combinations. Tightened to avoid the oversimplified "one direction each" framing.
 *
 * Run: node scripts/migration/fix-precedent-errors.js
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
  const oldMeltonClaim =
    "Melbourne's own Dandenong corridor quadruplication (Caulfield to Dandenong, delivered as part of level-crossing removals and Metro Tunnel preparation) is the direct local precedent for separating metro and regional V/Line services on a shared corridor, and demonstrates the approach is neither novel nor untested in this network."
  const newMeltonClaim =
    "East Pakenham station, opened in June 2024, extended dedicated metropolitan track by two kilometres specifically to stop V/Line Gippsland services queuing behind Metro trains turning back at the end of the line. It's a smaller-scale precedent than quadruplicating the entire Melton-Sunshine corridor, but it confirms Victoria has already built exactly this kind of metro/V-Line track separation, and recently."

  if (meltonDoc.evidenceAndPrecedent.includes(oldMeltonClaim)) {
    await client
      .patch(meltonId)
      .set({
        evidenceAndPrecedent: meltonDoc.evidenceAndPrecedent.replace(oldMeltonClaim, newMeltonClaim),
      })
      .commit()
    console.log(`✅ Corrected precedent claim on ${meltonId}`)
  } else {
    console.log(`⚠️  Old claim not found verbatim on ${meltonId} — check manually`)
  }

  // 2. Finish the Network
  const finishId = 'policy-finish-the-network'
  const finishDoc = await client.getDocument(finishId)
  const oldSingaporeClaim =
    "Singapore's City Hall and Raffles Place interchange — where City Hall provides a cross-platform transfer between the North-South and East-West lines in one direction and Raffles Place provides it in the other — is a well-established precedent for minimising transfer friction between two intersecting metro lines without requiring a single mega-interchange station to handle every transfer direction."
  const newSingaporeClaim =
    "Singapore's City Hall and Raffles Place interchange, where the two adjacent stations between them make every North-South/East-West line transfer a same-platform walk rather than a stairs-and-corridor trip, is a well-established precedent for minimising transfer friction between two intersecting metro lines without requiring a single mega-interchange station to handle every transfer direction."

  if (finishDoc.evidenceAndPrecedent.includes(oldSingaporeClaim)) {
    await client
      .patch(finishId)
      .set({
        evidenceAndPrecedent: finishDoc.evidenceAndPrecedent.replace(oldSingaporeClaim, newSingaporeClaim),
      })
      .commit()
    console.log(`✅ Corrected Singapore interchange claim on ${finishId}`)
  } else {
    console.log(`⚠️  Old claim not found verbatim on ${finishId} — check manually`)
  }
}

run()
