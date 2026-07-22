/* global process, console */
/* eslint-disable no-console */
/**
 * Adds a new transport policy: redundancy in network design. Singapore runs three
 * separate lines (East-West, Thomson-East Coast, Downtown) through its highest-
 * patronage eastern approach into the CBD specifically so no single line failure
 * strands that corridor. Victoria's regional rail network has the opposite design:
 * on 8 July 2026, a single Telstra network fault took down every V/Line train in the
 * state at once, because train communications depend on one telco with no backup.
 * The same redundancy logic applies to bus corridors at much lower cost: where routes
 * already overlap, staggering them (the mechanism in Stagger the Timetables) turns
 * that overlap into a coordinated high-frequency spine.
 *
 * Run: node scripts/migration/add-network-redundancy-policy.js
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

const slug = 'no-single-points-of-failure'
const docId = `policy-${slug}`

const doc = {
  _id: docId,
  _type: 'policy',
  pillar: 'RECLAIM OUR INFRASTRUCTURE',
  category: 'Build the Network',
  title: 'No Single Points of Failure',
  slug: { _type: 'slug', current: slug },
  icon: 'mdi:routes',
  thisTerm: false,
  summary:
    "Melbourne's rail network has no redundancy: when a single Telstra network fault halted every V/Line train in the state on 8 July 2026, there was no backup for passengers to fall back on. Singapore runs three separate lines through its busiest corridor for exactly this reason. Legislate a redundancy standard for new transit investment, and apply the same principle to bus corridors by pairing route staggering with built-in route overlap.",
  keyPoints: [
    {
      _key: `kp-${slug}-0`,
      _type: 'keyPoint',
      point: 'No backup when V/Line goes down',
      description:
        'On 8 July 2026, a single Telstra network fault halted every V/Line train in Victoria at once. One point of failure in one telco\'s network stopped the entire regional rail system, because no part of it has an independent fallback.',
    },
    {
      _key: `kp-${slug}-1`,
      _type: 'keyPoint',
      point: "Singapore builds redundancy into its busiest corridor",
      description:
        "The East-West Line, Thomson-East Coast Line and Downtown Line all run through Singapore's highest-patronage eastern approach into the CBD. If one line fails, the others still carry passengers.",
    },
    {
      _key: `kp-${slug}-2`,
      _type: 'keyPoint',
      point: 'Redundant bus routes let you stagger for free',
      description:
        'Where two or more bus routes already cover the same corridor, staggering them (see Stagger the Timetables) turns overlapping coverage into a high-frequency spine, without needing any single route to independently run turn-up-and-go frequency.',
    },
    {
      _key: `kp-${slug}-3`,
      _type: 'keyPoint',
      point: 'A planning standard, not a blank cheque',
      description:
        'This mandates that new transit investment be assessed for single points of failure. It directs where the redundancy principle applies rather than committing to a specific, costed build.',
    },
  ],
  hook: "On 8 July 2026, one Telstra network fault took down every V/Line train in the state at once. Victoria's rail network has no backup route, because nobody designed one in.",
  villain:
    "Victoria's transport planners have never had to answer for building single points of failure into the network, because the risk stays invisible until a fault actually takes the whole system down. On 8 July 2026, a Telstra network fault did exactly that: every V/Line service in Victoria stopped at once, because train communications depend on one telco's network with no independent fallback. Singapore doesn't have this problem on its busiest corridor. The East-West Line, Thomson-East Coast Line and Downtown Line all run through the same high-patronage eastern approach into the CBD, so a fault on one line still leaves two others running. Victoria has never applied that logic to its own network, rail or bus.",
  proofStat: {
    number: '0',
    label:
      'V/Line trains running statewide during the 8 July 2026 Telstra network outage, because the entire regional rail network shares one point of failure',
    source: 'Telstra outage reporting, 8 July 2026',
  },
  shareableQuote:
    "One phone company had a bad morning and every V/Line train in the state stopped. That's not bad luck. That's a network with no backup.",
  seoDescription:
    'A single Telstra fault halted every V/Line train in Victoria on 8 July 2026. Fusion Party Victoria will mandate redundancy in transit planning, rail and bus, so no single fault can strand the whole network.',
  designRationale:
    "Redundancy is standard practice in mature, high-patronage transit networks, because a single line or single dependency failing shouldn't strand an entire corridor. Singapore runs three separate lines, the East-West Line, Thomson-East Coast Line and Downtown Line, through its highest-patronage eastern approach into the CBD for exactly this reason: relief and fallback capacity if any one line has a problem. Victoria's regional rail network has the opposite design. V/Line's entire signalling and communications system depends on a single telco's mobile network, and the 8 July 2026 outage proved that a fault at that single point can halt every train in the state simultaneously. The same principle applies to bus corridors at much lower cost: where two or more routes already cover overlapping ground, that overlap is redundancy that can be actively used, not wasted. Staggering redundant routes, the mechanism specified in Stagger the Timetables, converts route overlap into a de facto high-frequency spine, without requiring any single route to be funded at turn-up-and-go frequency on its own.",
  systemInteraction:
    "V/Line's signalling and train communications currently depend on commercial telco infrastructure with no independent backup, the exact dependency that failed on 8 July 2026. A redundancy standard would require DTP to assess and disclose single points of failure (telco dependency, single-corridor rail alignments, single-operator bus contracts) for major existing and future transit investment. Applying route redundancy to bus corridors interacts directly with the timetable-staggering mechanism in Stagger the Timetables: DTP's existing timetable-setting process would need to treat overlapping routes as a frequency asset to be coordinated, not scheduled independently.",
  economicLogic:
    "Redundancy has an upfront cost, parallel infrastructure, backup communications systems, but an avoided cost that's easy to underweight until a failure makes it concrete. The 8 July 2026 outage stranded passengers statewide for the duration of the fault, at a cost to commuters and the state's reliability reputation that a backup communications path would have avoided. On buses, the economics are better than on rail: redundant routes are frequently already funded and running, so the only additional cost is the scheduling coordination Stagger the Timetables already specifies, not new capital.",
  riskAndFailureModes:
    "The main risk is treating this as a one-off response to the July outage rather than a standing planning standard. Without a legislated requirement to assess single points of failure, the same dependency, or an equivalent one, can simply be rebuilt into the network's next generation of infrastructure. On the bus side, coordinating staggered, redundant routes requires the same ongoing DTP compliance discipline as Stagger the Timetables, and carries the same risk of being treated as a one-off audit rather than a standing check.",
  evidenceAndPrecedent:
    "The 8 July 2026 Telstra network outage halted every V/Line service in Victoria simultaneously, a documented, dated, statewide failure directly attributable to a single point of failure in train communications infrastructure. Singapore's Thomson-East Coast Line was explicitly built to relieve and provide redundancy for the East-West and North-South Lines on the country's busiest travel corridor, and is being extended to interchange with the Downtown Line, giving that corridor three independent lines. This is an operating, delivered example of the redundancy principle this policy asks Victoria to adopt, not a hypothetical.",
  implementationOutline:
    "Sequence 1: Legislate a requirement for DTP to assess and publicly disclose single points of failure (telco dependency, single-corridor alignments, single-operator contracts) in current transit infrastructure, starting with the V/Line train communications dependency exposed by the July 2026 outage. Sequence 2: Require new major transit investment business cases to include a redundancy assessment before funding approval. Sequence 3: Direct DTP to identify existing bus corridors with overlapping, redundant routes and apply the Stagger the Timetables mechanism to convert that overlap into coordinated high-frequency spines. Sequence 4: Commission a business case for backup train communications infrastructure independent of a single telco provider.",
  cost: 'Standard and disclosure requirement is $0; backup communications infrastructure and any new parallel rail corridors require separate, future costing.',
  funding:
    "The disclosure and planning standard requires no funding to legislate. Backup communications infrastructure would be a Transit Capital Fund priority once DTP's disclosure identifies the specific single points of failure and their remediation cost.",
  publishedAt: new Date().toISOString(),
}

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  const existing = await client.getDocument(docId)
  if (existing) {
    await client.patch(docId).set(doc).commit()
    console.log(`✏️  Patched: ${docId}`)
  } else {
    await client.create(doc)
    console.log(`✅ Created: ${docId}`)
  }
}

run()
