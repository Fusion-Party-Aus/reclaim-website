/**
 * ground-truth-pass.js
 *
 * Fact-checking and correction pass against the Policy Library Reference.
 * Patches only fields with verifiable errors. Does not rewrite accurate content.
 *
 * Errors corrected:
 *
 * 1. policy-abolish-preference-deals
 *    - hook claims "A candidate won a Victorian upper house seat with 0.04% of the primary vote"
 *      The library identifies this precedent as Ricky Muir, federal Senate, 2013, with 0.51% of
 *      the primary vote -- not a Victorian upper house example, and not 0.04%.
 *      The evidenceAndPrecedent field already correctly describes it as "federal Senate" with
 *      "0.51%", so hook and proofStat are in direct contradiction with evidenceAndPrecedent.
 *    - proofStat.number is "0.04%" -- figure not in library; only 0.51% (Muir, federal) appears.
 *    - proofStat.label frames the Muir precedent as a Victorian upper house example.
 *    Fix: correct hook and proofStat to use the library's figure (0.51%) and the correct
 *    context (federal Senate precedent as an illustration of what Victorian rules permit).
 *
 * 2. policy-claw-back-franchise-profits
 *    - proofStat.label says "Annual franchise payments to Metro Trains and Yarra Trams" (both)
 *    - proofStat.number says "$1B+"
 *    - Library: MTM ~$900M/year, Yarra Trams ~$755.6M/year, combined ~$1.66B/year.
 *      The library explicitly warns against conflating MTM's $900M alone with the broader
 *      total. "$1B+" for both combined is wrong -- the combined figure is $1.66B/year.
 *    Fix: update proofStat to reflect the actual combined figure from the library.
 *
 * 3. policy-build-housing-at-stations
 *    - hook says "The state spent $11 billion building five underground Metro Tunnel stations"
 *    - Library: announced at ~$11B in 2016; by September 2024 the government's own figures
 *      put the total at $13.48B. The $11B is the original announcement, not the actual cost.
 *    Fix: update hook to use the correct library figure of $13.48B.
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envContent = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf-8')
envContent.split('\n').forEach(line => {
  const eq = line.indexOf('=')
  if (eq > 0) {
    const k = line.slice(0, eq).trim()
    const v = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (k && !process.env[k]) process.env[k] = v
  }
})

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN
})

const patches = [
  // -------------------------------------------------------------------
  // 1. policy-abolish-preference-deals
  //    hook: wrong chamber (Victorian upper house vs federal Senate) and
  //    wrong figure (0.04% vs the library's 0.51% for Muir).
  //    proofStat: wrong number (0.04%) and wrong chamber in label.
  //
  //    The policy's evidenceAndPrecedent already correctly names Muir's
  //    0.51% federal result as an illustrative precedent. The hook and
  //    proofStat need to match that framing rather than contradict it.
  // -------------------------------------------------------------------
  {
    id: 'policy-abolish-preference-deals',
    patch: {
      set: {
        hook: 'A federal Senate candidate won his seat in 2013 with 0.51% of the primary vote, riding a preference chain negotiated entirely in back rooms. Victorian upper house rules are built on the same mechanism. We are using it to get in. Then we are legislating it out of existence.',
        proofStat: {
          number: '0.51%',
          label: 'Primary vote that won a federal Senate seat via preference harvesting in 2013 -- the same mechanism Victorian upper house rules still permit',
          source: 'Australian Electoral Commission 2013 federal election results; Victorian Electoral Commission rules comparison'
        }
      }
    }
  },

  // -------------------------------------------------------------------
  // 2. policy-claw-back-franchise-profits
  //    proofStat.number "$1B+" for "Metro Trains and Yarra Trams" combined
  //    understates the actual combined figure of ~$1.66B/year from the library.
  //    MTM alone is ~$900M/year; Yarra Journey Makers is ~$755.6M/year.
  //    The library explicitly flags the risk of conflating MTM's $900M
  //    with the broader saving target.
  // -------------------------------------------------------------------
  {
    id: 'policy-claw-back-franchise-profits',
    patch: {
      set: {
        'proofStat.number': '$1.66B/yr',
        'proofStat.label': 'Combined annual franchise payments to Metro Trains Melbourne and Yarra Trams -- the payment base from which any efficiency saving is drawn',
        'proofStat.source': 'MR4 contract (~$6.3B over 7 years); Yarra Journey Makers contract ($6.8B over 9 years); Department of Transport annual reports'
      }
    }
  },

  // -------------------------------------------------------------------
  // 3. policy-build-housing-at-stations
  //    hook cites "$11 billion" as what the state spent on Metro Tunnel.
  //    The library records $11B as the 2016 announced figure; by September
  //    2024 the government's own figures put the total at $13.48B.
  //    The hook should use the actual confirmed cost, not the original pitch.
  // -------------------------------------------------------------------
  {
    id: 'policy-build-housing-at-stations',
    patch: {
      set: {
        hook: 'The state spent $13.48 billion building five underground Metro Tunnel stations -- then left the precincts above them for private developers to capture.'
      }
    }
  }
]

let patchedCount = 0

for (const { id, patch } of patches) {
  console.log(`\nPatching ${id}...`)

  // Verify document exists before patching
  const doc = await client.getDocument(id)
  if (!doc) {
    console.error(`  ERROR: document ${id} not found -- skipping`)
    continue
  }

  try {
    await client.patch(id).set(patch.set).commit()
    console.log(`  OK`)
    patchedCount++
  } catch (err) {
    console.error(`  ERROR: ${err.message}`)
  }
}

console.log(`\nDone. ${patchedCount}/${patches.length} documents patched.`)
