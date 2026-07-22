/* global process, console */
/* eslint-disable no-console */
/**
 * Corrects a factual error in "Build the Melton Line" and reworks the policy so its
 * concrete ask is track quadruplication between Melton and Sunshine.
 *
 * The previous hook claimed the Melton line runs "diesel through an electrified zone."
 * That's wrong: Melton's own track has never been electrified (unlike the neighbouring
 * Sunbury line), and it's shared with V/Line's diesel regional Ballarat services — that
 * sharing, not proximity to an electrified zone, is what caps speed and frequency.
 *
 * The fix specified is quadruplication (adding two dedicated tracks) between Melton and
 * Sunshine, separating Melton's own service from V/Line's Ballarat trains and making
 * electrification of the dedicated Melton track possible. The existing bus/BRT content
 * (Route 454, Route 140, Melton–Broadmeadows BRT) is retained as a secondary,
 * already-funded accountability item rather than the policy's primary ask.
 *
 * Run: node scripts/migration/rework-melton-line-quadruplication.js
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
  summary:
    "Quadruplicate the rail corridor between Melton and Sunshine to give Melton its own dedicated, electrified metro line — instead of sharing track with V/Line's diesel regional services to Ballarat — to match the pace of growth in Melbourne's outer west.",

  hook: "Melton has over 200,000 residents. Their peak-hour service still runs diesel — Melton's own track has never been electrified, unlike the neighbouring Sunbury line, and it's shared with V/Line's regional Ballarat services, capping both speed and frequency.",

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
        "Separated from the shared corridor, Melton's own track can finally be electrified and run frequent metro trains, rather than diesel V/Line stock standing in for a suburban service.",
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
    "Track quadruplication between Melton and Sunshine — adding two dedicated tracks alongside the existing shared corridor — is the direct fix: it removes the need for Melton's metro service to share track, and delays, with V/Line's diesel regional trains to Ballarat, and is the necessary precondition for electrifying a dedicated Melton line rather than continuing to run diesel stock through an unelectrified corridor. " +
    "Melton is one of Melbourne's fastest-growing local government areas, with the Rockbank-Mt Cottrell growth area inside it identified by VAGO's June 2026 Bus Plan audit as having no high-quality public transport within 800 metres and less than a quarter of residents able to reach even an ordinary bus stop within 400 metres. The existing Melton line extends only to Melton station, and the town centre of Melton is currently easier to reach by public transport from Caroline Springs than from within Melton itself. Infrastructure Victoria's August 2025 strategy, Fast, Frequent, Fair, named a Melton-to-Broadmeadows bus rapid transit corridor as one of six statewide BRT priorities for the early 2030s — a separate, complementary project to quadruplication, not a substitute for it. The April 2026 \"Bus Bonanza\" confirmed near-$100 million for Route 454 frequency doubling and a new Woodgrove connection, but Route 140, funded in the previous year's budget to connect Mount Atkinson estate to the rail network, did not carry its first passenger until 28 June 2026, over a year after it was first funded.",

  systemInteraction:
    "The existing Melton line is operated by Metro Trains Melbourne under the MR4 franchise (expiring November 2027) over track shared with V/Line's Ballarat regional services, which run under a separate V/Line franchise arrangement. Quadruplicating the corridor between Melton and Sunshine requires new track, platform work at affected stations, coordinated planning across both the Metro and V/Line franchise arrangements, and approvals under the Major Transport Projects Facilitation Act 2009. The Melton-to-Broadmeadows BRT corridor is a separate Infrastructure Victoria recommendation worth pursuing on its own timeline, but it is not the same project as quadruplicating and electrifying the Melton line itself, and should not be substituted for it. The Transit Development District mechanism, declaring the Melton BRT corridor terminus a TDD, remains VWHF's tool for anchoring residential and commercial development to that separate transit endpoint.",

  economicLogic:
    "Quadruplication is capital-intensive but structurally solves the shared-track constraint permanently, rather than requiring repeated bus-service top-ups to compensate for a corridor that was never designed to carry current demand. VAGO's 2013 growth-area transport audit identified a roughly $197 million per year recurrent funding gap for bus services in Melbourne's growth areas, within a broader infrastructure and service backlog north of $10 billion — a gap that keeps recurring precisely because the underlying rail constraint is never fixed. RMIT University's 2024 research found that across Melbourne, apartment numbers grew 88% between 2004 and 2022 while public transport services within walking distance grew just 5%. For the separate Melton-to-Broadmeadows BRT corridor, the Transit Capital Fund's surcharge revenue and VWHF's station-precinct development income at the corridor's termini are the intended funding sources, not general government borrowing.",

  riskAndFailureModes:
    "Quadruplication carries its own risks: land acquisition through already-built-up sections of the Melton-Sunshine corridor, and service disruption to both Metro and V/Line services during construction staging. The sequencing risk is the most concrete: the standard failure mode of parking reduction and transit policy is treating both as simultaneous. The Woodgrove transition case study is explicit that dedicated bus infrastructure must reach Woodgrove's door before a single car park space comes out of the surface lot. Route 454's enhanced service, once verifiably running at the promised frequency, is the trigger date for applying the cumulative car park surcharge to Woodgrove's 2,400 surface spaces, not the announcement date. Route 140's example (funded in 2025, first passenger in June 2026) is the honest benchmark for how long \"funded\" takes to become \"running,\" and Melton residents are entitled to expect roughly that lead time before any associated land-use changes are applied. Nine-car trains funded under the $650 million Melton Line Upgrade address peak overcrowding but not the 40-minute peak headway created by V/Line's skip-stop pattern — capacity works should not be mistaken for, or substituted for, the frequency fix quadruplication delivers.",

  evidenceAndPrecedent:
    "Melbourne's own Dandenong corridor quadruplication (Caulfield to Dandenong, delivered as part of level-crossing removals and Metro Tunnel preparation) is the direct local precedent for separating metro and regional V/Line services on a shared corridor, and demonstrates the approach is neither novel nor untested in this network. VAGO's June 2026 Bus Plan audit put Melton at 9-12% of its population within reach of high-quality public transport of any kind. Cardinia sits below 1%, Casey at 9-12%, Hume and Whittlesea at 21-24%. Inside Melton, the Rockbank-Mt Cottrell area, one of five outer metropolitan communities with a population over 30,000, has no high-quality public transport within 800 metres at all. The Bus Bonanza's $100 million for Melton South, Route 454, and Route 140 is the state's own confirmation that this gap is real and has been under-resourced for years.",

  implementationOutline:
    "Sequence 1: Commission and fund a business case for quadruplicating the Melton-to-Sunshine corridor, specifying platform, signalling and land requirements for the two additional dedicated tracks. Sequence 2: Electrify the newly separated Melton track once quadruplication removes the shared-track constraint, delivering a genuine metro service rather than diesel V/Line stock standing in for one. Sequence 3: Use PAEC to force the department to publish confirmed delivery timelines for the already-funded bus uplifts in the interim — Route 454's frequency doubling and Woodgrove direct connection, and the Route 140/140a Mount Atkinson service — so residents aren't waiting on quadruplication alone for improvement. Sequence 4: Revisit the separate Melton-to-Broadmeadows BRT corridor as a later-stage priority once the core rail fix is funded, rather than allowing it to substitute for quadruplication in public messaging.",

  seoDescription:
    "Melton's 200,000+ residents share track with diesel V/Line services to Ballarat. Fusion Party Victoria will quadruplicate the Melton-Sunshine corridor and electrify a dedicated Melton line.",
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
  console.log(`✅ Reworked ${docId} around Melton–Sunshine quadruplication.`)
}

run()
