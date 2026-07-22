/* global process, console */
/* eslint-disable no-console */
/**
 * Corrects the capacity/journey-time framing on "Build the Melton Line" after review:
 *
 * - The ~40 min peak V/Line journey time is genuinely fine (faster than driving) and
 *   isn't a real problem, so it shouldn't be the policy's headline proof stat. Dropped
 *   the "journey times... make car ownership a necessity" line from villain for the
 *   same reason.
 * - The real capacity story: Melton runs 6-car VLocity at peak today. The $650m Melton
 *   Line Upgrade lengthens that to 9-car VLocity, an officially-confirmed 50% capacity
 *   gain (bigbuild.vic.gov.au) — a real improvement, not nothing.
 * - But VLocity is a seated regional design. HCMT (High Capacity Metro Train) already
 *   runs on the neighbouring, electrified Sunbury line: a single 7-car HCMT carries
 *   1,380 passengers (Victorian rail sourcing) vs roughly 430 seats on today's 6-car
 *   VLocity (2 x 3-car sets at ~214-222 seats each) — about triple the capacity, in a
 *   shorter train, because HCMT is built for standing-room crush capacity rather than
 *   extra seats. Electrifying Melton means running an already-proven fleet (no new
 *   rolling stock type needed), not just a hypothetical upgrade.
 * - Frequency (40-min peak headway, V/Line's skip-stop pattern) remains uncorrected by
 *   either the 9-car upgrade or electrification alone — quadruplication is what fixes
 *   that.
 *
 * Run: node scripts/migration/fix-melton-capacity-claims.js
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

const patch = {
  hook: "Melton has over 200,000 residents. Their peak-hour service still runs diesel — Melton's own track has never been electrified, unlike the neighbouring Sunbury line, and it's shared with V/Line's regional Ballarat services, capping both frequency and capacity.",

  proofStat: {
    number: '1,380',
    label:
      "the capacity of a single 7-car HCMT — the electrified metro train already running on the neighbouring Sunbury line — versus roughly 430 seats on the 6-car VLocity Melton runs at peak today",
    source: 'HCMT technical specifications; V/Line VLocity capacity data',
  },

  villain:
    "Melton is one of Victoria's fastest-growing communities. Its rail service was never built for urban commuting: diesel rolling stock sharing track with regional trains, and a peak frequency that tops out at every 40 minutes — gaps wide enough that many residents default to driving anyway. The state has known this for years. The infrastructure investment went elsewhere. The government's marquee response — a $650 million Melton Line Upgrade lengthening peak VLocity trains from six cars to nine — delivers a genuine win on capacity: about 50% more room, by the government's own figures. But VLocity is a seated regional design, not built for standing-room crush capacity. A single 7-car HCMT, the electrified fleet already running next door on the Sunbury line, carries roughly three times what today's 6-car VLocity does. And none of it touches frequency: peak services are still capped at every 40 minutes by V/Line's skip-stop pattern. Lengthening a diesel train solves less of the capacity problem than switching fleets would, and solves none of the frequency problem at all.",

  keyPoints: [
    {
      _key: 'kp-build-the-melton-line-0',
      _type: 'keyPoint',
      point: 'Quadruplicate Melton to Sunshine',
      description:
        "Add two dedicated tracks between Melton and Sunshine so Melton's own metro service is no longer forced to share track, and share delays, with V/Line's regional Ballarat trains.",
    },
    {
      _key: 'kp-build-the-melton-line-1',
      _type: 'keyPoint',
      point: 'Electrify the dedicated line',
      description:
        "Separated from the shared corridor, Melton's own track can finally be electrified and run HCMT — the same high-capacity metro train already operating on the neighbouring Sunbury line — carrying roughly three times the passengers of today's 6-car VLocity, rather than diesel stock built for seated regional trips.",
    },
    {
      _key: 'kp-build-the-melton-line-2',
      _type: 'keyPoint',
      point: 'Reduced highway gridlock',
      description: 'Providing high-capacity transit relieves pressure on the Western Highway.',
    },
    {
      _key: 'kp-build-the-melton-line-3',
      _type: 'keyPoint',
      point: 'Hold the bus uplifts to their timeline',
      description:
        "Route 454's frequency doubling and Woodgrove connection, and the Route 140 service to Mount Atkinson, are already funded — a Fusion MP's role from one seat is making sure they're delivered on schedule, not just announced.",
    },
  ],

  designRationale:
    "Frequency and rolling stock, not train length, are the binding constraints on this corridor. The $650 million Melton Line Upgrade's nine-car VLocity trains deliver a real 50% capacity gain over today's 6-car peak service, but VLocity is a seated regional design; a 7-car HCMT — the electrified fleet already running on the neighbouring Sunbury line — carries roughly three times the passengers of today's 6-car VLocity in a shorter train, because it's built for standing-room crush capacity rather than extra seats. Sequencing matters on both fronts: increasing frequency first makes every seat serve more passengers per hour, and switching to metro-standard rolling stock delivers more capacity per train than simply adding VLocity carriages. A dedicated, electrified Melton line running HCMT resolves both constraints structurally, using a fleet already proven on the network, rather than requiring either to be re-argued each budget cycle. " +
    "Melton is one of Melbourne's fastest-growing local government areas, with the Rockbank-Mt Cottrell growth area inside it identified by VAGO's June 2026 Bus Plan audit as having no high-quality public transport within 800 metres and less than a quarter of residents able to reach even an ordinary bus stop within 400 metres. The existing Melton line extends only to Melton station, and the town centre of Melton is currently easier to reach by public transport from Caroline Springs than from within Melton itself. Infrastructure Victoria's August 2025 strategy, Fast, Frequent, Fair, named a Melton-to-Broadmeadows bus rapid transit corridor as one of six statewide BRT priorities for the early 2030s — a separate, complementary project to quadruplication, not a substitute for it. The April 2026 \"Bus Bonanza\" confirmed near-$100 million for Route 454 frequency doubling and a new Woodgrove connection, but Route 140, funded in the previous year's budget to connect Mount Atkinson estate to the rail network, did not carry its first passenger until 28 June 2026, over a year after it was first funded.",

  systemInteraction:
    "The existing Melton line is operated by Metro Trains Melbourne under the MR4 franchise (expiring November 2027) over track shared with V/Line's Ballarat regional services, which run under a separate V/Line franchise arrangement. Quadruplicating the corridor between Melton and Sunshine requires new track, platform work at affected stations, coordinated planning across both the Metro and V/Line franchise arrangements, and approvals under the Major Transport Projects Facilitation Act 2009. Electrifying the separated Melton track would let HCMT — the fleet already operating on the Sunbury line and maintained through the same Metro Trains network — extend service to Melton without requiring a new rolling stock type or a separate maintenance regime. The Melton-to-Broadmeadows BRT corridor is a separate Infrastructure Victoria recommendation worth pursuing on its own timeline, but it is not the same project as quadruplicating and electrifying the Melton line itself, and should not be substituted for it. The Transit Development District mechanism, declaring the Melton BRT corridor terminus a TDD, remains VWHF's tool for anchoring residential and commercial development to that separate transit endpoint.",

  riskAndFailureModes:
    "Quadruplication carries its own risks: land acquisition through already-built-up sections of the Melton-Sunshine corridor, and service disruption to both Metro and V/Line services during construction staging. The sequencing risk is the most concrete: the standard failure mode of parking reduction and transit policy is treating both as simultaneous. The Woodgrove transition case study is explicit that dedicated bus infrastructure must reach Woodgrove's door before a single car park space comes out of the surface lot. Route 454's enhanced service, once verifiably running at the promised frequency, is the trigger date for applying the cumulative car park surcharge to Woodgrove's 2,400 surface spaces, not the announcement date. Route 140's example (funded in 2025, first passenger in June 2026) is the honest benchmark for how long \"funded\" takes to become \"running,\" and Melton residents are entitled to expect roughly that lead time before any associated land-use changes are applied. Nine-car VLocity trains funded under the $650 million Melton Line Upgrade deliver a genuine 50% capacity gain but not the 40-minute peak headway created by V/Line's skip-stop pattern, and even on capacity terms fall well short of what electrified HCMT rolling stock would provide — the upgrade should not be mistaken for, or allowed to substitute for, the frequency and rolling-stock fix quadruplication and electrification deliver.",

  evidenceAndPrecedent:
    "Melbourne's own Dandenong corridor quadruplication (Caulfield to Dandenong, delivered as part of level-crossing removals and Metro Tunnel preparation) is the direct local precedent for separating metro and regional V/Line services on a shared corridor, and demonstrates the approach is neither novel nor untested in this network. HCMT already operates on the neighbouring Sunbury line — the electrified corridor Melton's own line has never been connected to — so extending that same, already-proven fleet to an electrified Melton line requires no new rolling stock type, only the electrification and quadruplication works this policy specifies. VAGO's June 2026 Bus Plan audit put Melton at 9-12% of its population within reach of high-quality public transport of any kind. Cardinia sits below 1%, Casey at 9-12%, Hume and Whittlesea at 21-24%. Inside Melton, the Rockbank-Mt Cottrell area, one of five outer metropolitan communities with a population over 30,000, has no high-quality public transport within 800 metres at all. The Bus Bonanza's $100 million for Melton South, Route 454, and Route 140 is the state's own confirmation that this gap is real and has been under-resourced for years.",
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

  await client.patch(docId).set(patch).commit()
  console.log(`✅ Corrected capacity/journey-time framing on ${docId}`)
}

run()
