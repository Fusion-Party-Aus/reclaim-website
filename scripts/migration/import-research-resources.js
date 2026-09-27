/**
 * Seeds public Research & Data resources from the Victorian policy omnibus.
 *
 * These are concise public briefs, not copies of the whitepaper. They preserve
 * evidence trails, caveats and open design questions while linking readers to
 * the relevant public policy pages.
 *
 * Run after the researchResource schema is deployed:
 *   SANITY_WRITE_TOKEN=... npm run import:research
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN,
})

const block = (key, text, style = 'normal') => ({
  _key: key,
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: key + 's', _type: 'span', text, marks: [] }],
})

const source = (key, title, publisher, url, note) => ({
  _key: key,
  _type: 'researchSource',
  title,
  publisher,
  url,
  ...(note ? { note } : {}),
})

const resources = [
  {
    _id: 'research-open-government-by-default',
    _type: 'researchResource',
    title: 'Open Government by Default: From FOI Requests to Proactive Publication',
    slug: { _type: 'slug', current: 'open-government-by-default' },
    resourceType: 'briefing',
    abstract: 'A research brief on shifting Victorian transparency from request-driven disclosure toward proactive publication, faster ministerial diary disclosure, more legible contracts and reusable public data.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-27T14:30:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia',
    license: 'CC-BY-4.0',
    tags: ['open government', 'FOI', 'integrity', 'transparency', 'ministerial diaries'],
    featured: true,
    body: [
      block('ogb1', 'What this brief tests', 'h2'),
      block('ogb2', 'Victoria already has Freedom of Information law, ministerial diary disclosure, registers of interests and proactive-release guidance. The policy question is whether information that can lawfully be public should routinely be published before somebody has to know what to ask for and file a formal request.'),
      block('ogb3', 'The proposed model treats FOI as a legal backstop rather than the normal publishing strategy. It also treats representative accessibility as part of transparency: people should be able to see what decision-makers are doing, how to reach them and how major decisions were made.'),
      block('ogb4', 'Research direction', 'h2'),
      block('ogb5', 'Priority work includes proactive-release schedules, structured ministerial diary data, contract publication rules, public decision records for major reversals, machine-readable datasets and constituency-access standards. Privacy, active investigations, security, Cabinet confidentiality and genuinely sensitive commercial information remain legitimate limits where the law requires them.'),
    ],
    methodology: [
      block('ogm1', 'This brief synthesises the current Victorian disclosure baseline and tests which parts can be shifted from case-by-case access toward routine publication. It separates the principle of proactive release from the legal design work still needed for exemptions, publication intervals and enforcement.'),
    ],
    limitations: [
      block('ogl1', 'The brief does not assume every government document should be public. Specific statutory drafting must reconcile privacy, security, Cabinet confidentiality, law-enforcement sensitivity and commercial confidentiality. The exact ministerial diary publication interval and contract thresholds remain open implementation questions.'),
    ],
    sources: [
      source('ogs1','Proactive release of information','Office of the Victorian Information Commissioner','https://ovic.vic.gov.au/freedom-of-information/resources-for-agencies/practice-notes/proactive-release-of-information/','Current guidance on proactive and informal release.'),
      source('ogs2','Section 16 FOI Guidelines','Office of the Victorian Information Commissioner','https://ovic.vic.gov.au/freedom-of-information/foi-guidelines/section-16/','Victorian FOI framework and access principles.'),
      source('ogs3','Ministerial diary disclosures','Victorian Government','https://www.vic.gov.au/ministerial-diary-disclosures','Current public ministerial diary disclosure arrangements.'),
      source('ogs4','Ministerial Code of Conduct','Victorian Government','https://www.vic.gov.au/ministerial-code-of-conduct','Current ministerial conduct and disclosure framework.'),
      source('ogs5','Ministerial register of interests','Victorian Government','https://www.vic.gov.au/ministerial-register-interests','Current interests disclosure baseline.'),
    ],
    relatedPolicies: [{ _type: 'reference', _ref: 'policy-open-government-by-default' }],
  },
  {
    _id: 'research-whistleblower-protection-victoria',
    _type: 'researchResource',
    title: 'Whistleblower Protection in Victoria: Where the Current Framework Can Be Stronger',
    slug: { _type: 'slug', current: 'whistleblower-protection-victoria' },
    resourceType: 'briefing',
    abstract: 'A research brief on Victoria’s public-interest disclosure framework, reprisal risk, independent advice, no-wrong-door referrals and remedies for people who report serious wrongdoing.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-27T14:05:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia',
    license: 'CC-BY-4.0',
    tags: ['whistleblowers', 'public interest disclosures', 'IBAC', 'integrity', 'reprisal'],
    featured: true,
    body: [
      block('wb1','Research question','h2'),
      block('wb2','Victoria already protects qualifying public-interest disclosures. The research question is whether those protections are practical enough when a worker faces retaliation, uncertainty about the correct reporting body or career damage after speaking up.'),
      block('wb3','The working model focuses on faster independent reprisal response, confidential advice before disclosure, no-wrong-door referrals, positive duties to manage reprisal risk, meaningful remedies and coverage that reflects outsourced public services.'),
      block('wb4','Important distinction','h2'),
      block('wb5','Protection for whistleblowers is not immunity for knowingly false allegations or a shield from responsibility for the discloser’s own misconduct. Allegation is not finding; investigation is not guilt. The integrity system must protect both disclosure and procedural fairness.'),
    ],
    methodology: [
      block('wm1','The brief starts from Victoria’s existing statutory and institutional framework, identifies practical failure points that can deter or punish disclosure, and treats proposed reforms as legal-design questions requiring section-by-section review before legislation.'),
    ],
    limitations: [
      block('wl1','Burden-shifting, interim protective measures, contractor coverage and remedies require detailed testing against employment, administrative and human-rights law. This brief states a reform direction, not final statutory language.'),
    ],
    sources: [
      source('ws1','Public Interest Disclosures Act 2012 (Vic)','Victorian Legislation','https://www.legislation.vic.gov.au/in-force/acts/public-interest-disclosures-act-2012/026','Current statutory framework.'),
      source('ws2','Public interest disclosure','Victorian Government','https://www.vic.gov.au/dpc-public-interest-disclosures','Current examples of improper conduct, detrimental action and disclosure pathways.'),
      source('ws3','Protections and support when making a public interest disclosure','Integrity Oversight Victoria','https://www.integrityoversight.vic.gov.au/public-interest-disclosures-guidelines/5-support-and-protection-making-pid','Current protection and support guidance.'),
      source('ws4','Independent Broad-based Anti-corruption Commission','IBAC','https://www.ibac.vic.gov.au/','Institutional integrity context.'),
    ],
    relatedPolicies: [{ _type: 'reference', _ref: 'policy-whistleblower-protection' }],
  },
  {
    _id: 'research-prevention-first-public-safety',
    _type: 'researchResource',
    title: 'Prevention First: What the Evidence Can and Cannot Tell Us About Public Safety',
    slug: { _type: 'slug', current: 'prevention-first-public-safety' },
    resourceType: 'briefing',
    abstract: 'A public-safety research brief separating evidence-supported prevention, diversion and place-based interventions from claims the evidence does not justify.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-27T13:21:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia',
    license: 'CC-BY-4.0',
    tags: ['crime prevention', 'public safety', 'diversion', 'youth justice', 'evaluation'],
    body: [
      block('pf1','The premise','h2'),
      block('pf2','Public safety policy should reduce victimisation, not merely increase the amount of punishment applied after harm occurs. That makes prevention, early intervention, targeted policing, safer public places and diversion legitimate areas for investment—but only where outcomes are measured.'),
      block('pf3','The approach is deliberately not “prevention at any cost”. Serious violence, victim protection, courts and coercive powers remain necessary. The research task is to identify which upstream interventions reduce harm without creating broader civil-liberties costs or shifting problems elsewhere.'),
      block('pf4','Evidence discipline','h2'),
      block('pf5','A prevention program should not be called successful merely because it sounds evidence-based. Evaluation needs a plausible counterfactual, clear outcome measures, transparent failure criteria and willingness to stop or redesign programs that do not work.'),
    ],
    methodology: [
      block('pm1','The underlying omnibus work compares systematic-review evidence, Victorian program evaluations and public-health approaches. It gives more weight to demonstrated outcomes than program intent, and distinguishes low-risk diversion and place-based problem solving from indiscriminate enforcement.'),
    ],
    limitations: [
      block('pl1','Crime outcomes are context-sensitive. Findings from one population or jurisdiction should not be converted directly into a Victorian effect-size promise. Urban design, policing, youth support and diversion can interact, making attribution difficult without careful evaluation.'),
    ],
    sources: [
      source('ps1','Youth violence','World Health Organization','https://www.who.int/news-room/fact-sheets/detail/youth-violence','Public-health framework for youth-violence prevention.'),
      source('ps2','Police-led diversion of low-risk youth','Campbell Collaboration','https://www.campbellcollaboration.org/review/police-led-diversion-of-low-risk-youth/','Systematic-review evidence on diversion.'),
      source('ps3','Hot spots policing','Campbell Collaboration','https://www.campbellcollaboration.org/review/hot-spots-policing-of-small-geographic-areas-effects-on-crime/','Systematic-review evidence on geographically focused policing.'),
    ],
    relatedPolicies: [
      { _type: 'reference', _ref: 'policy-prevention-first-public-safety' },
      { _type: 'reference', _ref: 'policy-youth-diversion-early-intervention' },
      { _type: 'reference', _ref: 'policy-problem-oriented-policing' },
    ],
  },
  {
    _id: 'research-police-integrity-accountability',
    _type: 'researchResource',
    title: 'Police Integrity and Independent Accountability in Victoria',
    slug: { _type: 'slug', current: 'police-integrity-accountability-victoria' },
    resourceType: 'briefing',
    abstract: 'A research brief on independent police-misconduct oversight, use-of-power transparency, body-worn camera governance, internal reporting and procedural fairness.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-27T13:45:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia',
    license: 'CC-BY-4.0',
    tags: ['police accountability', 'IBAC', 'misconduct', 'civil liberties', 'integrity'],
    body: [
      block('pi1','Why accountability belongs inside public safety','h2'),
      block('pi2','Police exercise powers that ordinary institutions do not: detention, search, arrest and force. A public-safety system therefore needs both operational capability and a credible mechanism for investigating misuse of that capability.'),
      block('pi3','The working direction is independent investigation of serious misconduct, transparent aggregate use-of-power data, whistleblower protection, procedural justice and body-worn-camera rules designed for accountability rather than indiscriminate surveillance.'),
    ],
    methodology: [
      block('pim1','The omnibus treats police effectiveness and police accountability as complements rather than opposites. The research compares Victoria’s complaint and integrity architecture with recent parliamentary and integrity-body review work, then identifies reforms that can strengthen independence without discarding due process for police employees.'),
    ],
    limitations: [
      block('pil1','Institutional design depends on the final distribution of powers between Victoria Police, IBAC and other oversight bodies. Detailed reform should be updated against any legislative changes made after the research date.'),
    ],
    sources: [
      source('pis1','Complaints about Victoria Police','Independent Broad-based Anti-corruption Commission','https://www.ibac.vic.gov.au/reporting-corruption/reporting-police-misconduct','Current complaint and oversight pathway.'),
      source('pis2','Integrity and Oversight Committee','Parliament of Victoria','https://www.parliament.vic.gov.au/get-involved/committees/integrity-and-oversight-committee/','Parliamentary oversight and inquiry context.'),
    ],
    relatedPolicies: [{ _type: 'reference', _ref: 'policy-police-integrity-independent-accountability' }],
  },
  {
    _id: 'research-neighbourhood-police-posts',
    _type: 'researchResource',
    title: 'Neighbourhood Police Posts: Adapting Kōban-Style Local Presence to Victoria',
    slug: { _type: 'slug', current: 'neighbourhood-police-posts-koban-victoria' },
    resourceType: 'briefing',
    abstract: 'A comparative research brief on small neighbourhood police posts, foot and bicycle patrols, remote assistance and the safeguards needed to adapt kōban-style local presence to Victoria.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-27T12:55:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia',
    license: 'CC-BY-4.0',
    tags: ['koban', 'community policing', 'stations', 'public safety', 'Japan'],
    body: [
      block('kp1','Transfer the function, not the institution wholesale','h2'),
      block('kp2','Japan’s kōban system demonstrates a model of small, visible local police bases used for public contact, directions, reporting, patrol coordination and first response. The Victorian proposal is not to copy Japanese policing law or culture; it is to test whether a compact neighbourhood presence can improve accessibility and response in selected activity centres and stations.'),
      block('kp3','A Victorian trial would need independent oversight, clear escalation to full stations, privacy rules, no indiscriminate stop regime, no default facial recognition and transparent evaluation against displacement, trust and safety outcomes.'),
    ],
    methodology: [
      block('km1','The comparative method separates physical/service design from the broader Japanese policing system. Candidate functions are screened against Victorian law, workforce arrangements, existing neighbourhood policing and civil-liberties standards.'),
    ],
    limitations: [
      block('kl1','A visible police post does not itself establish a crime-reduction effect. Trial evaluation must distinguish improved public access and perceived safety from actual changes in victimisation, reporting and displacement.'),
    ],
    sources: [
      source('ks1','Koban (Police Box)','Tokyo Metropolitan Police Department','https://www.keishicho.metro.tokyo.lg.jp/multilingual/english/about_us/activity/koban.html','Primary description of kōban functions.'),
      source('ks2','Community Safety / police box system','National Police Agency of Japan','https://www.npa.go.jp/english/','National institutional context.'),
    ],
    relatedPolicies: [{ _type: 'reference', _ref: 'policy-neighbourhood-police-posts' }],
  },
  {
    _id: 'research-complete-neighbourhoods',
    _type: 'researchResource',
    title: 'Complete Neighbourhoods: What Flexible Land-Use Systems Can Teach Victorian Growth Areas',
    slug: { _type: 'slug', current: 'complete-neighbourhoods-land-use-research' },
    resourceType: 'briefing',
    abstract: 'A comparative planning brief on cumulative land-use permissions, distributed daily needs, public-transport sequencing and the risks of building single-use dormitory suburbs.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-27T13:20:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia',
    license: 'CC-BY-4.0',
    tags: ['planning', 'mixed use', 'growth areas', 'Japan', 'Singapore', 'public transport'],
    featured: true,
    body: [
      block('cn1','The planning problem','h2'),
      block('cn2','Large residential catchments can be approved before useful local commerce and frequent public transport exist. That locks daily life into long car trips and makes later retrofits expensive. The alternative tested here is a more permissive mixed-use baseline combined with measurable access and transport-delivery tests.'),
      block('cn3','Japanese cumulative zoning is useful because even relatively residential zones can allow neighbourhood-serving functions while genuinely incompatible uses remain separated. Singapore’s town-planning model provides a different lesson: daily needs can be distributed through a hierarchy of centres rather than concentrated into one distant retail destination.'),
    ],
    methodology: [
      block('cnm1','The research compares transferable planning mechanisms rather than claiming Victoria should reproduce Japanese or Singaporean institutions. It asks which permissions, access tests and sequencing requirements could fit the Victorian Planning Provisions and Precinct Structure Plan process.'),
    ],
    limitations: [
      block('cnl1','Neither Japanese housing outcomes nor Singaporean town design establish a direct causal estimate for Melbourne. Detailed thresholds for retail scale, noise, freight, parking/loading, walking distance and transport funding require Victorian modelling and statutory design.'),
    ],
    sources: [
      source('cns1','Brick by Brick: Building Better Housing Policies','OECD','https://www.oecd.org/en/publications/brick-by-brick_b453b043-en/full-report/component-10.html','Comparative discussion of restrictive land-use regulation and flexible Japanese zoning.'),
      source('cns2','The Governance of Land Use in OECD Countries','OECD','https://www.oecd.org/en/publications/the-governance-of-land-use-in-oecd-countries_9789264268609-en.html','Comparative land-use governance and Japanese cumulative zoning.'),
      source('cns3','Plan and Design Towns','Singapore Housing & Development Board','https://www.hdb.gov.sg/about-us/our-role/plan-and-design-towns','Town planning, connectivity and distributed facilities.'),
      source('cns4','Neighbourhood Centres','Singapore Housing & Development Board','https://www.hdb.gov.sg/managing-my-home/living-in-my-community/exploring-my-neighbourhood/neighbourhood-centres','Daily-needs functions in neighbourhood centres.'),
      source('cns5','Public transport on roads','Victorian Government','https://www.planning.vic.gov.au/guides-and-resources/guides/urban-design-guidelines-for-victoria/movement-network/public-transport-on-roads','Victorian urban-design baseline for public transport access and surveillance.'),
    ],
    relatedPolicies: [{ _type: 'reference', _ref: 'policy-complete-neighbourhoods' }],
  },
  {
    _id: 'research-homes-stations-zoning',
    _type: 'researchResource',
    title: 'Homes and Stations: Japanese Use Zones and the Limits of the Comparison',
    slug: { _type: 'slug', current: 'homes-stations-japanese-zoning-research' },
    resourceType: 'report',
    abstract: 'A comparative planning report on Japan’s cumulative use zones, Victorian planning capacity and what can—and cannot—be inferred about housing supply, approvals and station-area development.',
    authors: [{ _key: 'a1', _type: 'researchAuthor', name: 'Fusion Party Victoria', role: 'Policy research' }],
    publishedAt: '2026-09-26T12:00:00Z',
    version: '1.0',
    geographicCoverage: 'Victoria, Australia; comparative evidence from Japan',
    license: 'CC-BY-4.0',
    tags: ['housing', 'zoning', 'Japan', 'stations', 'planning reform', 'infill'],
    featured: true,
    body: [
      block('hs1','What Japan actually demonstrates','h2'),
      block('hs2','Japan’s land-use system uses a national menu of use-zone categories with local designation and additional form controls. Housing and many neighbourhood-serving uses can coexist across more categories than a rigid single-use model would allow. Heavier or hazardous uses remain restricted, and floor-area, building coverage, road width, setbacks, shadow rules and development-permit requirements continue to matter.'),
      block('hs3','The transferable lesson is clearer default permission for compatible uses, not the claim that Japan has no planning rules or discretionary decisions.'),
      block('hs4','What the comparison does not prove','h2'),
      block('hs5','Tokyo’s construction rate or price history cannot be converted into a numerical forecast for Melbourne. Infrastructure, demographics, redevelopment cycles, site sizes, finance and rail networks differ. The relevant Victorian test is whether broader predictable permissions increase actual completions without unacceptable displacement, infrastructure or environmental costs.'),
    ],
    methodology: [
      block('hsm1','The underlying omnibus chapter compares primary Japanese land-use guidance, OECD comparative work and the current Victorian planning framework. It distinguishes use permission from building-form controls and treats implementation outcomes—approvals, commencements, completions, rents, infrastructure and displacement—as the measures that matter after reform.'),
    ],
    limitations: [
      block('hsl1','The research does not justify a universal station radius, a fixed rent effect, or the claim that every Japanese municipality has identical parking, minimum-site or objection rules. Victorian inclusionary requirements, infrastructure contributions and station-capacity envelopes require separate legal and feasibility testing.'),
    ],
    sources: [
      source('hss1','Urban land-use planning system in Japan','Ministry of Land, Infrastructure, Transport and Tourism (Japan)','https://www.mlit.go.jp/common/001050453.pdf','Primary English-language overview of Japanese land-use zones and controls.'),
      source('hss2','Current use-zone descriptions','Kinki Regional Development Bureau, MLIT','https://www.kkr.mlit.go.jp/kensei/town/tosi/03yototiiki.html','Current description of Japan’s 13 use-zone categories.'),
      source('hss3','Development permit system','Ministry of Land, Infrastructure, Transport and Tourism (Japan)','https://www.mlit.go.jp/toshi/city_plan/toshi_city_plan_fr_000046.html','Development-permit context beyond use zoning.'),
      source('hss4','OECD Economic Surveys: New Zealand 2019 — housing comparison','OECD','https://www.oecd.org/en/publications/oecd-economic-surveys-new-zealand-2019_b0b94dbd-en/full-report/component-7.html','Comparative discussion of Japanese housing supply and land-use regulation.'),
      source('hss5','Guide to Victoria’s planning system','Victorian Government','https://www.planning.vic.gov.au/guides-and-resources/guides/guide-to-victorias-planning-system/planning-schemes','Victorian planning-system baseline.'),
      source('hss6','Townhouse and Low-Rise Code','Victorian Government','https://www.planning.vic.gov.au/guides-and-resources/guides/all-guides/residential-development/townhouse-and-low-rise-code','Current Victorian low-rise planning baseline.'),
    ],
    relatedPolicies: [
      { _type: 'reference', _ref: 'policy-homes-and-stations-code' },
      { _type: 'reference', _ref: 'policy-build-housing-at-stations' },
    ],
  },
]

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN is required')
  }

  for (const resource of resources) {
    const result = await client.createOrReplace(resource)
    console.log(`Seeded ${result._id}: ${result.title}`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
