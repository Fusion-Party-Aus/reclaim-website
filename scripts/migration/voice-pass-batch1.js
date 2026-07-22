/* global process, console */
/* eslint-disable no-console */
/**
 * Voice-rule cleanup pass for the 7 transport policies created/heavily edited today.
 * Removes em dashes (replaced with periods, commas, or colons depending on the
 * sentence), flattens "isn't X — it's Y" rhetorical constructions into direct
 * statements, trims hollow intensifiers (genuine/actual/real as filler), and fixes
 * the Ballarat–Bendigo distance (was 130km, actually ~97km direct / ~119km by road).
 *
 * Run: node scripts/migration/voice-pass-batch1.js
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

const patches = {
  'policy-build-the-melton-line': {
    hook: "Melton has over 200,000 residents. Their peak-hour service still runs diesel because Melton's own track has never been electrified, unlike the neighbouring Sunbury line, and it's shared with V/Line's regional Ballarat services, capping both frequency and capacity.",
    villain:
      "Melton is one of Victoria's fastest-growing communities. Its rail service was never built for urban commuting: diesel rolling stock sharing track with regional trains, and a peak frequency that tops out at every 40 minutes, gaps wide enough that many residents default to driving anyway. The state has known this for years. The infrastructure investment went elsewhere. The government's marquee response, a $650 million Melton Line Upgrade lengthening peak VLocity trains from six cars to nine, delivers a win on capacity: about 50% more room, by the government's own figures. But VLocity is a seated regional design, not built for standing-room crush capacity. A single 7-car HCMT, the electrified fleet already running next door on the Sunbury line, carries roughly three times what today's 6-car VLocity does. None of it touches frequency: peak services are still capped at every 40 minutes by V/Line's skip-stop pattern. Lengthening a diesel train solves less of the capacity problem than switching fleets would, and solves none of the frequency problem at all.",
    designRationale:
      "Frequency and rolling stock are the binding constraints on this corridor, not train length. The $650 million Melton Line Upgrade's nine-car VLocity trains deliver a 50% capacity gain over today's 6-car peak service, but VLocity is a seated regional design. A 7-car HCMT, the electrified fleet already running on the neighbouring Sunbury line, carries roughly three times the passengers of today's 6-car VLocity in a shorter train, because it's built for standing-room crush capacity rather than extra seats. Sequencing matters on both fronts: increasing frequency first makes every seat serve more passengers per hour, and switching to metro-standard rolling stock delivers more capacity per train than simply adding VLocity carriages. A dedicated, electrified Melton line running HCMT resolves both constraints structurally, using a fleet already proven on the network, rather than requiring either to be re-argued each budget cycle. Melton is one of Melbourne's fastest-growing local government areas. The Rockbank-Mt Cottrell growth area inside it was identified by VAGO's June 2026 Bus Plan audit as having no high-quality public transport within 800 metres, with less than a quarter of residents able to reach even an ordinary bus stop within 400 metres. The existing Melton line extends only to Melton station, and the town centre of Melton is currently easier to reach by public transport from Caroline Springs than from within Melton itself. Infrastructure Victoria's August 2025 strategy, Fast, Frequent, Fair, named a Melton-to-Broadmeadows bus rapid transit corridor as one of six statewide BRT priorities for the early 2030s. It's a separate, complementary project to quadruplication, not a substitute for it. The April 2026 \"Bus Bonanza\" confirmed near-$100 million for Route 454 frequency doubling and a new Woodgrove connection, but Route 140, funded in the previous year's budget to connect Mount Atkinson estate to the rail network, did not carry its first passenger until 28 June 2026, over a year after it was first funded.",
    economicLogic:
      "Quadruplication is capital-intensive but structurally solves the shared-track constraint permanently, rather than requiring repeated bus-service top-ups to compensate for a corridor that was never designed to carry current demand. VAGO's 2013 growth-area transport audit identified a roughly $197 million per year recurrent funding gap for bus services in Melbourne's growth areas, within a broader infrastructure and service backlog north of $10 billion. That gap keeps recurring because the underlying rail constraint is never fixed. RMIT University's 2024 research found that across Melbourne, apartment numbers grew 88% between 2004 and 2022 while public transport services within walking distance grew just 5%. For the separate Melton-to-Broadmeadows BRT corridor, the Transit Capital Fund's surcharge revenue and VWHF's station-precinct development income at the corridor's termini are the intended funding sources, not general government borrowing.",
    evidenceAndPrecedent:
      "East Pakenham station, opened in June 2024, extended dedicated metropolitan track by two kilometres specifically to stop V/Line Gippsland services queuing behind Metro trains turning back at the end of the line. It's a smaller-scale precedent than quadruplicating the entire Melton-Sunshine corridor, but it confirms Victoria has already built exactly this kind of metro/V-Line track separation, and recently. HCMT already operates on the neighbouring Sunbury line, the electrified corridor Melton's own line has never been connected to, so extending that same, already-proven fleet to an electrified Melton line requires no new rolling stock type, only the electrification and quadruplication works this policy specifies. VAGO's June 2026 Bus Plan audit put Melton at 9-12% of its population within reach of high-quality public transport of any kind. Cardinia sits below 1%, Casey at 9-12%, Hume and Whittlesea at 21-24%. Inside Melton, the Rockbank-Mt Cottrell area, one of five outer metropolitan communities with a population over 30,000, has no high-quality public transport within 800 metres at all. The Bus Bonanza's $100 million for Melton South, Route 454, and Route 140 is the state's own confirmation that this gap is real and has been under-resourced for years.",
    riskAndFailureModes:
      "Quadruplication carries its own risks: land acquisition through already-built-up sections of the Melton-Sunshine corridor, and service disruption to both Metro and V/Line services during construction staging. The sequencing risk is the most concrete: the standard failure mode of parking reduction and transit policy is treating both as simultaneous. The Woodgrove transition case study is explicit that dedicated bus infrastructure must reach Woodgrove's door before a single car park space comes out of the surface lot. Route 454's enhanced service, once verifiably running at the promised frequency, is the trigger date for applying the cumulative car park surcharge to Woodgrove's 2,400 surface spaces, not the announcement date. Route 140's example (funded in 2025, first passenger in June 2026) is the honest benchmark for how long \"funded\" takes to become \"running,\" and Melton residents are entitled to expect roughly that lead time before any associated land-use changes are applied. Nine-car VLocity trains funded under the $650 million Melton Line Upgrade deliver a 50% capacity gain but not the 40-minute peak headway created by V/Line's skip-stop pattern, and even on capacity terms fall well short of what electrified HCMT rolling stock would provide. The upgrade should not be mistaken for, or allowed to substitute for, the frequency and rolling-stock fix quadruplication and electrification deliver.",
    implementationOutline:
      "Sequence 1: Commission and fund a business case for quadruplicating the Melton-to-Sunshine corridor, specifying platform, signalling and land requirements for the two additional dedicated tracks. Sequence 2: Electrify the newly separated Melton track once quadruplication removes the shared-track constraint, delivering a genuine metro service rather than diesel V/Line stock standing in for one. Sequence 3: Use PAEC to force the department to publish confirmed delivery timelines for the already-funded bus uplifts in the interim: Route 454's frequency doubling and Woodgrove direct connection, and the Route 140/140a Mount Atkinson service. This means residents aren't waiting on quadruplication alone for improvement. Sequence 4: Revisit the separate Melton-to-Broadmeadows BRT corridor as a later-stage priority once the core rail fix is funded, rather than allowing it to substitute for quadruplication in public messaging.",
    systemInteraction:
      "The existing Melton line is operated entirely by V/Line under its own state passenger rail contract: a regional diesel service, not a metropolitan one, sharing track with V/Line's own Ballarat regional services. No metro operator is involved today. Quadruplicating the corridor between Melton and Sunshine requires new track, platform work at affected stations, coordinated planning with V/Line, and approvals under the Major Transport Projects Facilitation Act 2009. Electrifying the separated Melton track would bring the corridor into Metro Trains Melbourne's network for the first time (Metro's own contract currently runs to November 2027), letting HCMT, the fleet already operating on the Sunbury line, extend service to Melton without requiring a new rolling stock type or a separate maintenance regime. The Melton-to-Broadmeadows BRT corridor is a separate Infrastructure Victoria recommendation worth pursuing on its own timeline, but it is not the same project as quadruplicating and electrifying the Melton line itself, and should not be substituted for it. The Transit Development District mechanism, declaring the Melton BRT corridor terminus a TDD, remains VWHF's tool for anchoring residential and commercial development to that separate transit endpoint.",
    shareableQuote: "Melton is a suburb. It deserves a suburban train: electrified, frequent, and on its own dedicated track.",
    summary:
      "Quadruplicate the rail corridor between Melton and Sunshine to give Melton its own dedicated, electrified metro line, instead of sharing track with V/Line's diesel regional services to Ballarat, to match the pace of growth in Melbourne's outer west.",
    proofStat: {
      number: '1,380',
      label:
        "the capacity of a single 7-car HCMT, the electrified metro train already running on the neighbouring Sunbury line, versus roughly 430 seats on the 6-car VLocity Melton runs at peak today",
      source: 'HCMT technical specifications; V/Line VLocity capacity data',
    },
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
          "Separated from the shared corridor, Melton's own track can finally be electrified and run HCMT, the same high-capacity metro train already operating on the neighbouring Sunbury line, carrying roughly three times the passengers of today's 6-car VLocity, rather than diesel stock built for seated regional trips.",
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
        point: 'Close the 800m bus gap next door',
        description:
          "Route 454 and Route 140 are delivered, but Strathtulloh, Rockbank, Deanside and Fraser Rise, all a few kilometres from Melton station, still have populations with no bus stop within 800 metres. The same coverage gap repeats across growth areas in Melbourne's south-east and north.",
      },
    ],
  },

  'policy-fix-the-order-not-just-the-fare': {
    cost: '$0. A prioritisation stance, not new spending.',
    designRationale:
      "This is a sequencing stance, not a rejection of free fares as an eventual goal. The three-step hierarchy (coverage, then frequency and reliability, then fare) reflects which constraint actually stops people using public transport today. Legislating fare policy ahead of the other two risks locking in a popular but premature commitment that does not move ridership, because people without a usable service or a reliable connection do not benefit from a lower price.",
    economicLogic:
      "Patronage economics improve as coverage and reliability improve: more usable, more reliable services generate more fare revenue and more political room to reduce fares sustainably. Cutting fares first, before patronage has grown, means the same revenue shortfall has to be met from general revenue instead of being offset by increased ridership, making the fare cut harder to sustain long-term.",
    funding:
      'No funding required. This is a formal staging position, not a spending commitment, adopted ahead of any fare legislation being introduced.',
    villain:
      "Free-fares-first policy is popular because fare is the easiest variable to change: announce it, legislate it, done. But VAGO's own audits show the network's binding constraints are coverage (barely one in ten Melton residents within reach of high-quality transit) and reliability (fewer than three-quarters of priority connections land within a usable window). Fixing the fare first spends political capital on the part of the system that was never actually broken.",
    summary:
      "Fusion agrees with the destination of free public transport but disagrees on sequencing. Coverage first, then frequency and reliability, then fare. Fare falls naturally once patronage economics improve; spending political capital on free fares first targets the cheapest variable to change, not the one that is actually broken.",
    proofStat: {
      number: '68-73%',
      label:
        'of priority bus-to-train connections that fall within a workable 5-10 minute window, the reliability gap free fares do not fix',
      source: 'VAGO',
    },
    keyPoints: [
      {
        _key: 'kp-fix-the-order-not-just-the-fare-0',
        _type: 'keyPoint',
        point: 'Coverage is the first constraint',
        description:
          "VAGO found only 9-12% of Melton's population within reach of high-quality public transport. A fare cut does nothing for someone with no service to board.",
      },
      {
        _key: 'kp-fix-the-order-not-just-the-fare-1',
        _type: 'keyPoint',
        point: 'Frequency and reliability come second',
        description:
          'VAGO also found only 68-73% of priority bus-to-train connections fall within a workable 5-10 minute window. A free fare on an unreliable connection does not fix the connection.',
      },
      {
        _key: 'kp-fix-the-order-not-just-the-fare-2',
        _type: 'keyPoint',
        point: 'Fare is the easy variable, not the broken one',
        description:
          'Free-fares-first policy spends political capital on the cheapest thing to change, leaving the actual constraints, coverage and reliability, untouched.',
      },
    ],
  },

  'policy-guarantee-the-one-kilometre-standard': {
    hook: 'Right now nobody has to tell you whether your town has a transit link within reach. DTP has no legislated obligation to check, let alone publish it.',
    designRationale:
      "The standard is deliberately narrow: coverage, not frequency. An hourly service that exists beats no service at all, and separating the coverage guarantee from the frequency argument means the standard can be legislated immediately without first resolving the harder, more expensive question of how often each link should run. Genuinely rural areas are explicitly excluded because a uniform coverage standard applied without exception would either bankrupt regional budgets or be diluted into meaninglessness.",
    economicLogic:
      "Legislating the standard costs nothing; it is a floor on future service planning, not a service commitment itself. Compliance spend (new stops, new routes, new links) follows through existing Transit Capital Fund mechanisms already funding other network gaps, sequenced against the annual compliance map rather than committed all at once.",
    funding:
      'The standard requires no funding to legislate. Closing gaps it identifies draws on the same Transit Capital Fund revenue (car park and land-banking surcharges) already funding other network-coverage fixes in this platform.',
    systemInteraction:
      'DTP already collects the location data needed to assess coverage, the same data underlying the Transport Score tool. This proposal converts that existing data capability into a legislated, published, annual obligation rather than a discretionary reporting choice.',
    riskAndFailureModes:
      'The standard could be legislated and then never enforced if no penalty or public accountability mechanism is attached. The annual compliance map exists specifically to prevent this by making non-compliance visible and politically costly every year, not just at the point of legislation.',
    summary:
      "No resident anywhere in Victoria should be more than 1km from a usable transit link, even if it only runs hourly, except in genuinely rural areas where this isn't feasible. Legislate the coverage standard and require DTP to publish an annual compliance map.",
    keyPoints: [
      {
        _key: 'kp-guarantee-the-one-kilometre-standard-0',
        _type: 'keyPoint',
        point: 'A floor, not a frequency promise',
        description:
          'The standard guarantees a stop exists within reach (a bus, or where relevant a rail line), not that it runs often. Coverage first, frequency is fixed separately.',
      },
      {
        _key: 'kp-guarantee-the-one-kilometre-standard-1',
        _type: 'keyPoint',
        point: 'Every town centre gets a link',
        description:
          'Anywhere there is a town centre, the standard requires a bus serving it and a connection to the next town.',
      },
      {
        _key: 'kp-guarantee-the-one-kilometre-standard-2',
        _type: 'keyPoint',
        point: 'Public, annual accountability',
        description:
          'DTP publishes a compliance map every year, a natural companion to the existing Transport Score tool, so gaps cannot stay hidden.',
      },
    ],
  },

  'policy-stagger-the-timetables': {
    cost: '$0. A scheduling fix, not a service increase.',
    hook: 'DTP is running two buses on the same corridor at the same time and calling it two services. Melton commuters get the frequency of one.',
    designRationale:
      "A mandated audit is chosen over a service-by-service fix because the Melton case is very unlikely to be the only instance. Wherever two routes share a corridor for even part of their length, unstaggered timetables silently halve the effective frequency residents experience. It costs nothing to correct once identified, but nobody is currently checking for it.",
    evidenceAndPrecedent:
      "Pulse or clockface scheduling, deliberately staggering services that share a corridor so combined frequency is even rather than bunched, is standard practice in mature transit networks internationally. Melton's 457/459 pairing is a documented case where this basic principle was not applied despite both routes being run by DTP-contracted operators on published timetables.",
    funding: "No new funding required. Corrected through DTP's existing timetable-setting process at no additional operating cost.",
    riskAndFailureModes:
      "The main risk is that DTP treats the audit as a one-off exercise rather than an ongoing check. Timetables change regularly, and a new clash can be introduced at the next reschedule just as easily as an old one is fixed. The audit and correction process should be a standing compliance check, not a single pass.",
    proofStat: {
      number: '4:04pm',
      label:
        "the time both Melton's 457 and 459 buses leave the station, together, every 40 minutes, on their shared Woodgrove stretch",
      source: 'Public Transport Victoria timetables',
    },
    keyPoints: [
      {
        _key: 'kp-stagger-the-timetables-0',
        _type: 'keyPoint',
        point: 'Doubles effective frequency for free',
        description:
          'Staggering two routes that already run the same corridor turns two simultaneous 40-minute services into one effective 20-minute corridor, no new buses required.',
      },
      {
        _key: 'kp-stagger-the-timetables-1',
        _type: 'keyPoint',
        point: 'Statewide, not just Melton',
        description:
          "Melton's 457 and 459 are the clearest example, but DTP has never audited how many other shared corridors have the same clash.",
      },
      {
        _key: 'kp-stagger-the-timetables-2',
        _type: 'keyPoint',
        point: 'Zero cost, ministerial fix',
        description:
          'This is a scheduling correction, not a service increase, deliverable by ministerial direction without a budget line.',
      },
    ],
  },

  'policy-connect-the-regions': {
    cost: 'TBD. Needs a scoping study.',
    hook: "Want to get from Ballarat to Bendigo, two of Victoria's biggest regional cities about 100km apart, without a car? The only way DTP has built is via Melbourne.",
    designRationale:
      "A scoping study is the deliverable this term rather than a funded build, because the specific cost and alignment of direct regional-to-regional services isn't known. DTP has never studied it, because the network was never designed around that question. Naming a study rather than a project avoids overpromising on figures that don't exist yet, while still forcing the question onto the public record.",
    riskAndFailureModes:
      "The primary risk is that a scoping study is commissioned and then shelved without a funding pathway. That's the same failure mode already seen with Infrastructure Victoria's City Loop recommendation. A firm reporting deadline and public release requirement should be attached to the study commission to reduce this risk.",
    seoDescription:
      "Ballarat to Bendigo is about 100km direct, but Victoria's V/Line network only connects them via Melbourne. Fusion Party Victoria will commission a direct regional cross-connectivity study.",
    summary:
      "Victoria's regional network is built entirely hub-and-spoke through Melbourne. A Ballarat resident travelling to Bendigo has to route via the city despite the two being roughly 100km apart directly. Commission a direct regional cross-connectivity study for major regional-to-regional pairs currently requiring a Melbourne detour.",
    villain:
      "Victoria's regional transport network was designed around one destination: Melbourne. Every V/Line line and coach route radiates from the capital. Two regional centres sitting roughly 100km apart, Ballarat and Bendigo, have no direct service at all. A resident is forced to detour through the city they were trying to avoid, and DTP has never scoped what fixing that would cost.",
    proofStat: {
      number: '~100km',
      label: 'the direct distance between Ballarat and Bendigo, which has no direct public transport link',
      source: 'Policy analysis, Fusion Party Victoria',
    },
    keyPoints: [
      {
        _key: 'kp-connect-the-regions-0',
        _type: 'keyPoint',
        point: "Regional Victoria isn't a Melbourne feeder",
        description:
          'Every V/Line and coach route is designed around getting people to and from Melbourne, not between regional centres.',
      },
      {
        _key: 'kp-connect-the-regions-1',
        _type: 'keyPoint',
        point: 'Ballarat to Bendigo, the test case',
        description:
          "Two of Victoria's largest regional cities, roughly 100km apart directly, have no direct public transport connection at all.",
      },
      {
        _key: 'kp-connect-the-regions-2',
        _type: 'keyPoint',
        point: 'A scoping study, not a blank cheque',
        description:
          "This is a commitment to find out what direct regional links would cost and where they'd have the most impact, not a pre-committed spend.",
      },
    ],
  },

  'policy-end-flexiride-s-fake-flexibility': {
    cost: 'Minimal. A service standard, not new infrastructure.',
    economicLogic:
      "This is a service standard applied to already-funded contracts, not a new spending commitment. The fix is to what these services are contractually required to deliver, not how much is spent delivering them.",
    funding: 'No new funding required. Standards are applied to existing, already-funded on-demand service contracts at renewal.',
    hook: "A FlexiRide booking near Woodgrove needed three hours' notice for a fifteen-minute ride, and still dropped the passenger 800 metres short of their front door.",
    villain:
      "FlexiRide is marketed as flexible, responsive transport. In practice, one Melton booking required three hours' advance notice for a ride of just fifteen minutes, and still dropped the passenger 800 metres short of its destination, on a trip that would otherwise have been a 7.3km, roughly 100-minute walk. Waiting three hours for a ride that doesn't even reach the door isn't flexibility. It's a zone-to-zone shuttle wearing an on-demand label.",
    proofStat: {
      number: '800m',
      label:
        'how far short of the destination FlexiRide\'s zone-based drop-off left a passenger, after a 3-hour booking wait for a 15-minute ride',
      source: 'Rider account, Woodgrove FlexiRide service',
    },
    keyPoints: [
      {
        _key: 'kp-end-flexiride-s-fake-flexibility-0',
        _type: 'keyPoint',
        point: 'Three hours for a fifteen-minute ride',
        description:
          'A Woodgrove-area FlexiRide booking required three hours\' notice for a fifteen-minute ride, and still dropped the passenger 800m short of their destination, on a trip that would otherwise be a 7.3km, roughly 100-minute walk.',
      },
      {
        _key: 'kp-end-flexiride-s-fake-flexibility-1',
        _type: 'keyPoint',
        point: 'Door-to-door, not zone-to-zone',
        description:
          'On-demand services that drop passengers short of their actual destination shift the last leg of the trip back onto the passenger, defeating the point of booking a ride.',
      },
      {
        _key: 'kp-end-flexiride-s-fake-flexibility-2',
        _type: 'keyPoint',
        point: 'A service standard, not new infrastructure',
        description: 'This legislates minimums for an existing service model, no new vehicles or routes required.',
      },
    ],
  },

  'policy-finish-the-network': {
    cost: 'Requires a parliamentary majority and a funded construction commitment across all four items. Not deliverable from a single crossbench seat.',
    designRationale:
      "Each of these four items solves a distinct, identifiable gap rather than duplicating existing commitments. Melton and Wyndham Vale electrification is already government policy without funding; this closes the funding gap rather than re-announcing the project. Wallan electrification is preventative, addressing a growth corridor before it reaches the crisis point Melton is currently at. The City Loop reconfiguration adopts Infrastructure Victoria's own Recommendation 60 rather than proposing a novel scheme, reducing design risk to near zero since the assessment work has already been done by the state's own advisory body. Its benefit compounds further if paired with cross-platform interchange design at Caulfield and Malvern, the physical junction between the Frankston line and the Dandenong/Pakenham corridor now served by Metro Tunnel trains. Modelled on Singapore's City Hall and Raffles Place interchange, where each station provides a same-platform transfer for one direction-pair of the intersecting lines, this removes the stairs-and-corridor transfer that would otherwise erode any frequency gain delivered by through-running. SRL West is deliberately specified as a new alignment through Keilor Village, Taylors Lakes, Fraser Rise, Deanside, Caroline Springs, Derrimut, Truganina, Williams Landing and Seabrook rather than an upgrade to the existing Sunshine–Werribee rail corridor, because the existing corridor already has a railway line on it. A second investment in the same corridor does nothing for the growth suburbs that currently have no rail access within a reasonable distance at all.",
    keyPoints: [
      {
        _key: 'kp-finish-the-network-0',
        _type: 'keyPoint',
        point: 'Electrify Melton and Wyndham Vale',
        description:
          'Both promised since the 2018 Western Rail Plan alongside 12 peak electric services and 20-minute off-peak frequency by 2026. $152.7m has funded planning only. No construction budget exists for either line.',
      },
      {
        _key: 'kp-finish-the-network-1',
        _type: 'keyPoint',
        point: 'Electrify Wallan',
        description:
          'The Seymour line corridor is heading toward the exact problem Melton had a decade ago: a growing outer population served by diesel regional trains standing in for a metro service.',
      },
      {
        _key: 'kp-finish-the-network-2',
        _type: 'keyPoint',
        point: 'Reconfigure the City Loop for through-running',
        description:
          "Craigieburn to Frankston. Upfield (extending to Wallan) to Glen Waverley. This is Infrastructure Victoria's own Recommendation 60, not a fringe idea, already assessed as high-benefit and sitting unimplemented. Paired with cross-platform interchanges at Caulfield and Malvern, one in each direction, so passengers switch between the Frankston line and Metro Tunnel services by walking across the platform rather than changing levels: the same design Singapore uses between City Hall and Raffles Place.",
      },
      {
        _key: 'kp-finish-the-network-3',
        _type: 'keyPoint',
        point: 'Build a real SRL West',
        description:
          'Not an upgrade to the existing Sunshine–Werribee corridor. A new alignment through the suburbs the network does not reach: Airport to Watergardens via Keilor Village and Taylors Lakes; Watergardens to Ravenhall via Fraser Rise, Deanside and Caroline Springs proper; Ravenhall to Point Cook via Derrimut, Truganina, Williams Landing and Seabrook.',
      },
    ],
  },
}

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  for (const [docId, patch] of Object.entries(patches)) {
    try {
      await client.patch(docId).set(patch).commit()
      console.log(`✅ Voice pass applied: ${docId}`)
    } catch (err) {
      console.error(`❌ ${docId}: ${err.message}`)
    }
  }
}

run()
