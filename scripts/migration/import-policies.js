import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN
})

// Helper to create portable text blocks
function createBlock (text, style = 'normal') {
  return {
    _type: 'block',
    style,
    children: [{ _type: 'span', text, marks: [] }]
  }
}

function createBoldBlock (text, style = 'normal') {
  return {
    _type: 'block',
    style,
    children: [{ _type: 'span', text, marks: ['strong'] }]
  }
}

// All your hardcoded policies structured for Sanity
const policies = [
  {
    title: 'Housing: End The Scam',
    slug: 'housing',
    icon: '🏠',
    summary: 'Build 50,000 public homes over 4 years. Buy one floor of every tower for public housing. End negative gearing on investment properties. Cap rent increases to CPI.',
    keyPoints: [
      '50,000 public homes over 4 years (12,500/year)',
      'Buy one floor of every new tower over 10 stories for public housing',
      '15% inclusionary zoning in all new developments',
      'Ban no-grounds evictions',
      'Cap rent increases at CPI + 2% maximum',
      'Rental Commissioner with real enforcement powers',
      'Portable rental bonds'
    ],
    cost: '$25 billion borrowed',
    funding: 'Rental return at 25% market rent ($625M/year) + Land tax on $1M+ properties. Real net cost: ~$100M/year',
    body: [
      createBlock('The Problem', 'h2'),
      createBlock('You\'re paying 60% of your income in rent while property investors claim $3.2 billion/year in tax breaks. 54,000 Victorian families wait for public housing. The government promises 80,000 homes over ten years - barely enough to keep up with demand growth.'),

      createBlock('Our Solution', 'h2'),
      createBoldBlock('Build 50,000 new public homes over 4 years (12,500/year)', 'h3'),
      createBlock('Not "affordable housing" where affordable means 80% of market rent. Actual public housing at 25% of household income.'),
      createBlock('Mix of apartments, townhouses, and houses'),
      createBlock('Located within 800m of public transport and services'),
      createBlock('7+ star energy rating (lower bills for tenants)'),
      createBlock('Priority: families, essential workers, people fleeing violence'),

      createBoldBlock('Buy One Floor Per Tower', 'h3'),
      createBlock('Every new residential tower over 10 stories must sell one floor to the state at cost price for public housing. This creates mixed-income developments.'),

      createBoldBlock('15% Inclusionary Zoning', 'h3'),
      createBlock('All new developments over 10 dwellings must include 15% affordable/public housing or pay an equivalent contribution. No exemptions. No appeals.'),

      createBoldBlock('Ban No-Grounds Evictions', 'h3'),
      createBlock('If you\'re paying rent on time, you have security. Landlords can still evict for lease violations or if they\'re selling/moving in, but not "just because."'),

      createBoldBlock('Cap Rent Increases', 'h3'),
      createBlock('Rent can only increase by CPI + 2% maximum, once per year. Landlords can still make money. They just can\'t gouge.'),

      createBlock('How We Pay For It', 'h2'),
      createBlock('50,000 homes at $500k = $25 billion borrowed'),
      createBlock('Rental return at 25% market rent: $625 million/year'),
      createBlock('Bond interest at 4%: $1 billion/year'),
      createBoldBlock('Real net cost: ~$100 million/year'),
      createBoldBlock('Return on investment: 4% direct, 8% with externalities'),
      createBlock('This isn\'t spending. It\'s investing in assets that generate returns while housing people.'),

      createBlock('First 100 Days', 'h2'),
      createBlock('Establish Victorian Public Housing Authority. Begin procurement for first 5,000 homes. Introduce rental protection legislation.')
    ]
  },
  {
    title: 'Workers\' Rights: Stop The Theft',
    slug: 'workers-rights',
    icon: '⚖️',
    summary: 'Criminalise wage theft with jail time for directors. Triple the Wage Inspectorate budget. Fix the gig economy with presumption of employment. Portable long service leave.',
    keyPoints: [
      'Make deliberate wage theft a criminal offence with jail time',
      'Triple Wage Inspectorate budget to $60M/year',
      'Reverse burden of proof - employers must prove they paid correctly',
      'Presume all gig workers are employees unless proven otherwise',
      'Minimum pay rates equivalent to award wages',
      'Portable long service leave across gig economy',
      'Victorian Gig Economy Ombudsman with enforcement powers'
    ],
    cost: '$60M/year for Wage Inspectorate, $20M/year for Gig Economy Ombudsman',
    funding: 'Recovered wage theft ($200M+/year) more than covers enforcement costs',
    body: [
      createBlock('Criminalise Wage Theft', 'h2'),
      createBoldBlock('The Problem', 'h3'),
      createBlock('Victorian workers lose $1.35 billion/year to wage theft. Current penalties cost less than just paying people properly.'),

      createBoldBlock('Our Solution', 'h3'),
      createBlock('Make deliberate wage theft a criminal offence with jail time for directors'),
      createBlock('Triple the Wage Inspectorate budget to $60 million/year'),
      createBlock('Reverse the burden of proof - employers must prove they paid correctly'),
      createBlock('Personal liability for directors'),

      createBlock('Fix The Gig Economy', 'h2'),
      createBoldBlock('The Problem', 'h3'),
      createBlock('30% of Victorian workers are casual/gig. Platforms classify you as "contractor" to avoid minimum wage, super, leave.'),

      createBoldBlock('Our Solution', 'h3'),
      createBlock('Presume all gig workers are employees unless platform proves otherwise'),
      createBlock('Minimum pay rates equivalent to award wages'),
      createBlock('Portable long service leave across gig economy'),
      createBlock('Mandatory workers compensation coverage'),
      createBlock('Victorian Gig Economy Ombudsman with enforcement powers'),

      createBlock('Universal Basic Income', 'h2'),
      createBlock('Federal Policy - We\'ll Pressure Canberra'),
      createBlock('UBI at Henderson Poverty Line (~$30,000/year). No mutual obligations. No poverty trap. Foundation for freedom.'),
      createBlock('We\'ll run pilot programs in Victoria, publish evidence, and pressure federal government relentlessly.')
    ]
  },
  {
    title: 'Transport: Fix The Failures',
    slug: 'transport',
    icon: '🚂',
    summary: 'Melton Line by 2029. Fix Clyde/Pakenham congestion. Electrify Sunbury. 20-minute frequency on all lines. Free trams in CBD. High-speed rail to Geelong and Ballarat.',
    keyPoints: [
      'Electrify and duplicate Melton Line within 4 years',
      'Build second track for Clyde/Officer/Pakenham',
      'Electrify to Sunbury with 20-min frequency',
      'Quadruple parking at Wyndham Vale/Tarneit stations',
      'Free trams in all CBD zones',
      '20-minute minimum frequency on all lines, all day',
      '$10/day integrated fare cap',
      'High-speed rail: Melbourne-Geelong-Ballarat (Stage 1)'
    ],
    cost: 'Melton $2B, Pakenham $1.5B, Sunbury $800M, Wyndham $350M, High-speed rail $10B over 6 years',
    funding: 'Infrastructure waste savings ($2B/year) + federal partnership (50%) + value capture (25%) + bonds (25%)',
    body: [
      createBlock('The Problem', 'h2'),
      createBlock('Melton Line promised since 2009 - $750 million wasted in interest. 30,000 homes approved in Clyde with one overwhelmed train line. You\'re losing two hours a day to their failures.'),

      createBlock('Our Solution', 'h2'),
      createBlock('Targeted fixes for growth corridors:', 'h3'),

      createBoldBlock('Melton Line'),
      createBlock('Electrify and duplicate within 4 years'),
      createBlock('Triple frequency to match metro lines'),
      createBlock('Cost: ~$2 billion'),

      createBoldBlock('Clyde/Officer/Pakenham'),
      createBlock('Build the second track now'),
      createBlock('Express services during peak'),
      createBlock('Cost: ~$1.5 billion'),

      createBoldBlock('Wyndham Vale/Tarneit'),
      createBlock('Quadruple parking at stations'),
      createBlock('15-minute bus frequencies'),
      createBlock('Cost: ~$300 million parking + $50M/year buses'),

      createBoldBlock('Sunbury'),
      createBlock('Electrify to Sunbury (currently ends at Watergardens)'),
      createBlock('20-minute frequency all day'),
      createBlock('Cost: ~$800 million'),

      createBlock('Overall System', 'h2'),
      createBlock('Free trams in all CBD zones'),
      createBlock('20-minute minimum frequency on all lines, all day'),
      createBlock('Integrated fares: $10/day cap'),

      createBlock('High-Speed Rail', 'h2'),
      createBoldBlock('Stage 1: Melbourne-Geelong-Ballarat (200km/h)', 'h3'),
      createBlock('45 minutes Melbourne-Geelong'),
      createBlock('60 minutes Melbourne-Ballarat'),
      createBlock('Opens up 200,000+ affordable homes'),
      createBlock('Cost: ~$10 billion over 6 years'),
      createBlock('50% federal, 25% value capture, 25% bonds')
    ]
  },
  {
    title: 'Healthcare: End The Two-Tier Scam',
    slug: 'healthcare',
    icon: '🏥',
    summary: 'Increase public hospital funding by 30% over 4 years. Build 4 new public hospitals in growth corridors. End private hospital tax exemptions. Triple elective surgery capacity.',
    keyPoints: [
      'Increase public hospital funding by 30% over 4 years ($3B/year by year 4)',
      'Build 4 new public hospitals: Clyde, Melton, Wyndham, North Melbourne',
      'End private hospital tax exemptions unless they treat public patients',
      'Triple elective surgery capacity',
      'Fix ambulance ramping with nurse-led streaming',
      'Push federal government for dental and mental health in Medicare'
    ],
    cost: '$3B/year increased funding + $8B capital over 6 years for hospitals',
    funding: 'End private hospital tax exemptions (+$400M/year) + infrastructure waste savings + bonds for capital',
    body: [
      createBlock('The Problem', 'h2'),
      createBlock('You wait six months for surgery. $1.5 billion in tax revenue subsidises private hospitals through exemptions. They poach staff and let wealthy people jump the queue.'),

      createBlock('Our Solution', 'h2'),
      createBlock('Increase public hospital funding by 30% over 4 years ($3B/year by year 4)'),
      createBlock('Build 4 new public hospitals in growth corridors: Clyde, Melton, Wyndham, North Melbourne (~$8B over 6 years)'),
      createBlock('End private hospital tax exemptions unless they treat public patients at public rates (+$400M/year)'),
      createBlock('Triple elective surgery capacity'),
      createBlock('Fix ambulance ramping with nurse-led streaming'),

      createBlock('Federal Fight', 'h2'),
      createBlock('We can\'t expand Medicare to dental/mental health alone - that\'s federal. But we\'ll pressure federal MPs relentlessly and build the public case.'),

      createBlock('First 100 Days', 'h2'),
      createBlock('Inject $750 million immediately to public hospitals. Begin procurement for Clyde and Melton hospitals. End private hospital tax exemptions.')
    ]
  },
  {
    title: 'Climate: 100% Renewable Energy That Pays For Itself',
    slug: 'climate',
    icon: '🌍',
    summary: '100% renewable electricity by 2030. Build 2GW state-owned renewable energy. End all fossil fuel subsidies. Fast-track renewable energy zones. EV fast chargers every 5km on highways.',
    keyPoints: [
      '100% renewable electricity by 2030 (not 2035)',
      'End all fossil fuel subsidies',
      'Build 2GW state-owned renewable energy (solar/wind/battery)',
      'Fast-track renewable energy zones',
      'Abolish stamp duty on EVs under $60k',
      'EV fast chargers: one every 5km on highways',
      'Green Jobs Transition Authority for Latrobe Valley workers'
    ],
    cost: '$3 billion capital for 2GW renewable + battery',
    funding: 'Revenue from energy sales ($400M/year) pays back bonds in 11 years, then pure profit forever',
    body: [
      createBlock('The Problem', 'h2'),
      createBlock('Victoria still generates 30% from coal. Government subsidises fossil fuels while you pay high energy bills. Major parties take fossil fuel donations.'),

      createBlock('Our Solution', 'h2'),
      createBlock('100% renewable electricity by 2030 (not 2035)'),
      createBlock('End all fossil fuel subsidies'),
      createBlock('Build 2GW state-owned renewable energy (solar/wind/battery)'),
      createBlock('Fast-track renewable energy zones'),
      createBlock('Abolish stamp duty on EVs under $60k, increase on petrol cars over $60k'),
      createBlock('EV fast chargers: One every 5km on highways'),
      createBlock('Green Jobs Transition Authority for Latrobe Valley workers'),

      createBlock('State-Owned Renewables Are Smart Investment', 'h2'),
      createBlock('2GW renewable + battery: $3 billion capital'),
      createBlock('Revenue from energy sales: $400 million/year'),
      createBlock('Bond interest: $120 million/year'),
      createBoldBlock('Net return: $280 million/year'),
      createBoldBlock('Pays itself off in 11 years, then pure profit'),
      createBlock('This is buying assets that generate revenue while cutting emissions.')
    ]
  },
  {
    title: 'Infrastructure: Stop The Waste',
    slug: 'infrastructure',
    icon: '🏗️',
    summary: 'Give Infrastructure Victoria binding authority on all projects over $100M. No development approvals without infrastructure certification. Transparent 30-year pipeline. Reduce overruns from 30% to 10%.',
    keyPoints: [
      'Give Infrastructure Victoria binding authority on all projects over $100M',
      'No development approvals over 1,000 dwellings without IV certification',
      'Transparent 30-year infrastructure pipeline with quarterly updates',
      'Community consultation with teeth',
      'Reduce cost overruns from 30% to 10%',
      'Cancel marginal projects'
    ],
    cost: 'Zero - this saves money',
    funding: 'Savings: Reduce overruns ($1.5B/year) + cancel marginal projects ($500M/year) = $2B/year to redirect',
    body: [
      createBlock('The Problem', 'h2'),
      createBlock('West Gate Tunnel: $5.5B → $15B ($9.5B wasted)'),
      createBlock('Melton Line: 16 years delayed ($750M wasted)'),
      createBlock('Auditor-General: 30% average cost overruns'),

      createBlock('Our Solution', 'h2'),
      createBlock('Give Infrastructure Victoria binding authority on all projects over $100M'),
      createBlock('No development approvals over 1,000 dwellings without IV certification that infrastructure will be built within 2 years'),
      createBlock('Transparent 30-year pipeline with quarterly updates'),
      createBlock('Community consultation with teeth'),

      createBlock('Savings', 'h2'),
      createBlock('Reduce overruns from 30% to 10%: $1.5 billion/year'),
      createBlock('Cancel marginal projects: $500 million/year'),
      createBoldBlock('Total: $2 billion/year to redirect to housing, hospitals, transport')
    ]
  },
  {
    title: 'Fiscal Responsibility: Smart Investment Beats Dumb Waste',
    slug: 'fiscal-responsibility',
    icon: '💰',
    summary: 'Stop $2.8B/year in infrastructure waste. Grow revenue by $2B/year through land value tax and closing tax gaps. Smart investment in assets that generate returns.',
    keyPoints: [
      'Cut infrastructure overruns from 30% to 10%: $1.5B/year saved',
      'Cancel marginal projects: $500M/year saved',
      'Procurement reform: $400M/year saved',
      'Cut consultancy waste: $400M/year saved',
      'Land Value Tax: +$800M/year revenue',
      'End hospital tax exemptions: +$400M/year',
      'Close tax gap: +$500M/year',
      'All investments must generate 4%+ returns or clear social benefits'
    ],
    cost: 'Net reduction in waste and debt growth',
    funding: 'Stop waste ($2.8B/year) + grow revenue ($2B/year) = $4.8B/year for priorities',
    body: [
      createBlock('The Attack', 'h2'),
      createBlock('"Fusion will blow out debt!"'),
      createBoldBlock('The Truth: Victoria\'s debt is already $177B and climbing because they waste money on an industrial scale.'),

      createBlock('Our Three-Point Plan', 'h2'),

      createBoldBlock('1. Stop Waste ($2.8B/year)', 'h3'),
      createBlock('Cut overruns 30%→10%: $1.5B/year'),
      createBlock('Cancel marginal projects: $500M/year'),
      createBlock('Procurement reform: $400M/year'),
      createBlock('Cut consultancy waste: $400M/year'),

      createBoldBlock('2. Grow Revenue ($2B/year)', 'h3'),
      createBlock('Land Value Tax: +$800M/year'),
      createBlock('End hospital exemptions: +$400M/year'),
      createBlock('Close tax gap: +$500M/year'),
      createBlock('Value capture: +$300M/year'),

      createBoldBlock('3. Smart Investment', 'h3'),
      createBlock('Public housing: 4-8% returns'),
      createBlock('Renewables: $280M/year net'),
      createBlock('Transport: enables growth'),
      createBlock('All via IV cost-benefit analysis'),

      createBlock('The Results', 'h2'),
      createBlock('2030 Debt: Labor $250B (32% GSP) → Fusion $210B (25% GSP)'),
      createBlock('Public Housing: Labor 80k over 10yr → Fusion 50k over 4yr'),
      createBlock('Melton Line: Labor "Planned" → Fusion Built by 2029'),
      createBlock('Annual Waste: Labor $2.8B+ → Fusion <$1B'),

      createBlock('Full costings at fusionparty.org.au/costings')
    ]
  }
]

async function importPolicies () {
  console.log('🚀 Starting policy import to Sanity...\n')
  console.log(`Importing ${policies.length} policies\n`)

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    console.error('\nTo get a write token:')
    console.error('1. Go to https://www.sanity.io/manage')
    console.error('2. Select your project (fusion)')
    console.error('3. Go to API → Tokens')
    console.error('4. Create a new token with Editor permissions')
    console.error('5. Run: SANITY_WRITE_TOKEN=your_token_here npm run import:policies\n')
    process.exit(1)
  }

  for (const policy of policies) {
    try {
      const document = {
        _type: 'policy',
        title: policy.title,
        slug: { _type: 'slug', current: policy.slug },
        icon: policy.icon,
        summary: policy.summary,
        keyPoints: policy.keyPoints,
        cost: policy.cost,
        funding: policy.funding,
        body: policy.body,
        publishedAt: new Date().toISOString()
      }

      const result = await client.create(document)
      console.log(`✅ Created: ${policy.title}`)
      console.log(`   ID: ${result._id}`)
      console.log(`   Key points: ${policy.keyPoints.length}`)
      console.log(`   Body blocks: ${policy.body.length}\n`)
    } catch (error) {
      console.error(`❌ Error creating ${policy.title}:`, error.message)
    }
  }

  console.log('✨ Import complete!')
  console.log('\nNext steps:')
  console.log('1. Visit http://localhost:3333 to view your policies')
  console.log('2. Edit and refine content as needed')
  console.log('3. Update policies.astro to fetch from Sanity\n')
}

importPolicies()
