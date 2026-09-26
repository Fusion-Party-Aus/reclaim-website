/* global process, console */
/**
 * Downstream policy sync from state-budget PR #30.
 *
 * Preview: node scripts/migration/sync-omnibus-homes-rail.js
 * Apply:   SANITY_WRITE_TOKEN=... node scripts/migration/sync-omnibus-homes-rail.js --apply
 *
 * No writes without --apply. Review the omnibus, current CMS revisions and party
 * adoption status first. This script changes existing published documents.
 */
import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'qwl3f8jb'
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const apply = process.argv.includes('--apply')
if (apply && !process.env.SANITY_WRITE_TOKEN) {
  throw new Error('SANITY_WRITE_TOKEN required for --apply; never commit a token')
}
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-11-13',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const source =
  'https://github.com/finneh4249/state-budget/pull/30'
const edits = [
  {
    slug: 'build-housing-at-stations',
    set: {
      summary:
        'Build and retain public and mixed-income housing around major transport hubs, while making modest infill housing broadly legal and preplanning greater mixed-use capacity around new and upgraded rail stations.',
      cost:
        'Capital, land, infrastructure and financing costs to be independently modelled',
      funding:
        'VWHF asset income, budgeted public investment and lawful value capture; debt and subsidies disclosed',
      designRationale:
        'The VWHF can build and retain housing on strategic sites, but station precincts alone cannot meet all housing needs. The proposed Homes and Stations Code would legalise duplexes, terraces, townhouses, small apartments and shop-top housing under predictable statewide rules, with greater capacity around high-capacity transport. It draws selectively on Japanese permissive zoning while adapting to Victorian hazards, accessibility, infrastructure and law.',
      systemInteraction:
        'Victoria would amend the Victorian Planning Provisions and relevant planning schemes under the Planning and Environment Act. Councils would retain strategic input and administration within clear state standards. New or substantially upgraded rail would trigger a mapped station planning envelope alongside capacity and contributions planning. VWHF public development and private construction would both use the added rights. Local deliberation should shape rules and investments upstream, not become a parcel-by-parcel veto on compliant housing.',
      economicLogic:
        'Legalising more feasible housing types across established suburbs can increase the range of sites and suppliers able to respond to demand. Concentrating greater capacity at stations can increase access to jobs and customers, support ridership and make infrastructure more productive. Public land ownership and lawful value capture can retain some publicly created uplift for housing and local services. None of these effects guarantees a positive fiscal return at every site.',
      riskAndFailureModes:
        'Blanket percentage obligations and density bonuses may make some projects unviable or shift costs to renters and buyers. Bond financing is a liability, not a zero-cost source of housing. Upzoning without water, power, schools, accessible transport or open space can overload services. Strong safety, fire, accessibility, flood, heat, noise and genuine environmental standards remain. Model inclusionary requirements by site and market, publish infrastructure schedules and review measured completions and displacement.',
      evidenceAndPrecedent:
        'Japan combines nationally standardised land-use categories with permissive mixed uses and comparatively rules-based approvals. Its experience supports testing predictable baseline rights and transport-linked intensity, but does not establish a Victorian housing target or a universal inclusionary percentage. See the evidence and source links in the Homes and Stations Code chapter: ' +
        source,
      implementationOutline:
        'Draft statutory rights, exclusions and station envelopes; map infrastructure and hazards; consult councils and affected communities on rules and investment; obtain legal and residual-land-value review; stage the VWHF pipeline and independent evaluation. Publish site-level costs and liabilities before claiming net-zero general-government cost.',
    },
  },
  {
    slug: 'claw-back-franchise-profits',
    set: {
      summary:
        'Audit rail, tram and bus franchise costs before renewals and test public operation against regulated alternatives on service quality, full-life cost, workforce outcomes and the public value retained from stations and land.',
      cost: 'Audit and transition options to be costed; no booked annual saving',
      funding:
        'Existing scrutiny budgets for audit; any operating or capital transition needs an independently costed business case',
      hook:
        'Victoria pays for the network. It should know what each operating model delivers before signing the next contract.',
      villain:
        'A short-term operating franchise can reward contractual compliance while leaving government with infrastructure risk and limited incentives to improve station districts. Replacing a private franchise with public operation may solve some transaction problems, but ownership alone does not establish a fixed efficiency saving. The contracts and alternatives must be independently compared.',
      designRationale:
        'Japan shows that competition between enduring networks with station and property interests is different from competition for a temporary contract to run the same public railway. Its private operators, JR companies and municipal systems coexist under common safety and payment arrangements, while rural services and fragmented fares reveal limits. Victoria should retain a credible public operator option without selecting every mode and corridor before appraisal.',
      systemInteraction:
        'Keep public control of the network plan, infrastructure, fares, safety, accessibility and service floors. At lawful contract breakpoints compare integrated public operation, tightly regulated operators and, for suitable separable new corridors, long-horizon transport-and-development entities. Require one interoperable payment layer, coordinated passenger information, simple transfers, through-ticketing and automatic disruption alternatives. The myki successor may support clearing if its procurement terms allow it.',
      economicLogic:
        'An operator with durable station and property income may gain from improving destinations and ridership, but may also capture publicly created uplift. A public operator can retain revenue and reduce contractual transaction costs, but brings management and capital responsibilities. Compare full-life fiscal and passenger results, including retained land value, rather than assuming a fixed margin disappears into savings.',
      riskAndFailureModes:
        'Fragmentation can burden passengers, complicate fares and delay interchange. A monopoly corridor has little direct passenger choice; duplicate tracks are rarely justified simply to simulate competition. Private concessions can entrench land monopolies; public operators can also underperform. Set nondiscriminatory interchange, open data and fare-clearing obligations; protect workers; independently cost transition, liabilities and regional cross-subsidy.',
      evidenceAndPrecedent:
        'Japan’s 1987 JNR restructuring, private railway/property groups, through-running and mutually accepted IC cards show multiple possible institutional designs, not a universal case for privatisation. See the Japanese railway options study and its primary sources: ' +
        source,
      implementationOutline:
        'Commission a mode-by-mode contract and whole-life options audit before expiry; publish passenger, workforce, access, capital, fiscal and land-value comparisons; choose and legislate the model on evidence. Separately design national reciprocal card and account acceptance, suitable normally open gate pilots, and station assistance standards with staff on site at major stations and accessible remote human support where appropriate.',
    },
  },
]

const query = '*[_type == "policy" && slug.current == $slug][0]{_id,_rev,title,slug}'
for (const { slug, set } of edits) {
  const doc = await client.fetch(query, { slug })
  if (!doc) throw new Error('Policy missing: ' + slug)
  console.log(JSON.stringify({ id: doc._id, rev: doc._rev, title: doc.title, set }, null, 2))
  if (apply) {
    await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit()
    console.log('Updated ' + slug)
  }
}
if (!apply) console.log('Preview only. No CMS documents were changed.')
