/**
 * Script to migrate Manifesto to Sanity CMS
 * Run with: SANITY_WRITE_TOKEN=your_token npm run import:manifesto
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN
})

const manifestoPage = {
  _type: 'page',
  title: 'Reclaim Victoria\'s Future',
  slug: { _type: 'slug', current: 'manifesto' },
  subtitle: 'They stole your future. We\'re taking it back.',
  metaDescription: 'Real solutions for working Victorians. No corporate donations. Evidence-based policy. Read our full manifesto.',
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: '1. THEY RIGGED THE GAME' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'You work harder than your parents ever did. You\'re more educated. More productive. More skilled.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'And you have less to show for it.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'This isn\'t an accident. It\'s theft.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'While you\'re one medical emergency away from financial ruin, property investors claimed $3.2 billion in tax breaks last year. While you\'re paying 60% of your income in rent, they\'re writing off losses on their third investment property against your taxes.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'While you wait six months for elective surgery, $1.5 billion in tax revenue subsidises private hospitals through exemptions. While you spend two hours a day in traffic, the government approved 30,000 new homes in Clyde without building the rail capacity to support them.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'The major parties did this. Both of them.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'The System Works Perfectly - Just Not For You' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        { _type: 'span', marks: ['strong'], text: 'West Gate Tunnel: ' },
        { _type: 'span', text: 'Budgeted at $5.5 billion. Now tracking toward $15 billion. That\'s $9.5 billion in cost overruns - enough to build 38,000 public homes.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Melton Line: ' },
        { _type: 'span', text: 'Promised electrification since 2009. 16 years of "coming soon." Every year of delay costs $50 million in interest. That\'s $750 million wasted because they wouldn\'t build it when it was cheaper.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Victorian Auditor-General findings: ' },
        { _type: 'span', text: 'Systematic cost overruns averaging 30% on major projects. Not incompetence. Design.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Wage theft: ' },
        { _type: 'span', text: 'Victorian workers lose $1.35 billion per year. Current penalties are cheaper than just paying people properly.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'This isn\'t a bug. It\'s a feature.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'The game is rigged by those with the power to rig it, maintained by those who profit from it, and paid for by you.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'We\'re Here to Break It' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'We\'re Fusion. We\'re not asking the establishment nicely to share. We\'re not negotiating for scraps.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'We\'re here to reclaim what was stolen.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Your economic security. Your time. Your future. Your kids\' future.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'And we\'re going to do it by being the only adults in the room: with evidence, with costings, with competence, and with a plan that actually works.' }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: '2. OUR VALUES: FREEDOM, PROGRESS, AND FAIRNESS' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Before we tell you what we\'ll do, you need to know who we are and what we stand for.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Fusion isn\'t left or right in the old sense. We\'re ' },
        { _type: 'span', marks: ['strong'], text: 'socially progressive' },
        { _type: 'span', text: ' and ' },
        { _type: 'span', marks: ['strong'], text: 'economically pragmatic' },
        { _type: 'span', text: '. We believe in ' },
        { _type: 'span', marks: ['strong'], text: 'personal liberty' },
        { _type: 'span', text: ' and ' },
        { _type: 'span', marks: ['strong'], text: 'collective security' },
        { _type: 'span', text: '.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Personal Liberty' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'You should be free to live your life, make your own choices, and pursue your own goals, as long as you\'re not harming others.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Maximum net freedom means everyone has real choices, not just the wealthy.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Advancement' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'We\'re progressives. We believe in using evidence, technology, and smart policy to make life better for everyone.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Safety' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Everyone deserves security: from violence, from exploitation, from deprivation. Safety isn\'t just physical. It\'s economic.' }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: '3. RECLAIM OUR ECONOMY' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Build 50,000 Public Homes Over 4 Years' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'While you\'re paying 60% of your income in rent, property investors are claiming $3.2 billion per year in tax breaks through negative gearing. That\'s your money, subsidising their wealth accumulation.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Our Solution:' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Build 50,000 new public homes over 4 years (12,500/year)' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Buy one floor of every new residential tower over 10 stories for public housing' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Ban no-grounds evictions' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Cap rent increases at CPI + 2% maximum' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Universal Basic Income' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Right now, if you lose your job, Centrelink treats you like a criminal. Mutual obligations. Job agencies that take their cut but don\'t help. Payments below the poverty line.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Universal Basic Income set at the Henderson Poverty Line (~$30,000/year).' },
        { _type: 'span', text: ' Every Victorian citizen gets enough to live with dignity. No mutual obligations. No poverty trap.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Criminalise Wage Theft' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Victorian workers lose $1.35 billion per year to wage theft. Make deliberate wage theft a criminal offence with jail time for directors of repeat offenders.' }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: '4. RECLAIM OUR FUTURE' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Stop the Infrastructure Waste' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'West Gate Tunnel: $5.5 billion → $15 billion. Metro Tunnel: $11 billion → $13 billion+. Melton Line: Promised since 2009, still waiting.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Give Infrastructure Victoria binding authority' },
        { _type: 'span', text: ' on all projects over $100 million. Reduce cost overruns from 30% to 10%. Savings: ~$1.5 billion/year.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Fix Public Transport in Growth Areas' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Melton Line: ' },
        { _type: 'span', text: 'Electrify and duplicate within 4 years. Triple frequency to match metro lines.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Clyde/Officer: ' },
        { _type: 'span', text: 'Build the second track now. Express services during peak.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'System-wide: ' },
        { _type: 'span', text: 'Free trams in CBD. 20-minute minimum frequency on all lines, all day.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Public Hospitals: End the Two-Tier Scam' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'You wait six months for surgery while $1.5 billion subsidises private hospitals.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Increase public hospital funding by 30% over 4 years' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Build 4 new public hospitals in growth corridors' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'End private hospital tax exemptions' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Climate Action: 100% Renewable by 2030' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'End all fossil fuel subsidies' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Build 2GW of state-owned renewable energy' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'EV fast chargers every 5km on highways' }]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'HOW WE PAY FOR IT' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Victoria\'s debt is already $177 billion because they waste money on an industrial scale. We\'ll reduce debt-to-GSP while improving services.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Stop the Waste: $2.8 billion/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Reduce cost overruns from 30% to 10%: $1.5B/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Cancel marginal projects: $500M/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'End mates-rates contracts: $400M/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Cut consultancy waste: $400M/year' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Grow Revenue: $2 billion/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Land Value Tax (replace payroll tax): +$800M/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'End private hospital tax exemptions: +$400M/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Close the tax gap: +$500M/year' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Value capture on infrastructure: +$300M/year' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Invest Smart' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Public housing generates 4% direct returns through rent' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'State renewables generate $280M/year net after interest' }]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Every borrowed dollar passes Infrastructure Victoria cost-benefit analysis' }]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'WHAT YOU CAN DO' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Vote Fusion' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Check if we\'re running in your electorate. Put us first on your ballot.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Volunteer' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Door knocking. Phone banking. Organizing. Even a few hours matters. We\'ll train you.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Spread the Word' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Share this manifesto with one person who\'s tired of the major parties. Tell them there\'s an alternative.' }
      ]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Donate' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'We don\'t take corporate money. Every dollar comes from people who believe in this movement. Even $5 helps.' }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'THE HONEST TRUTH' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'We won\'t form government in 2026. We know that.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'But every vote we win sends a message that Victorians are done with corporate-funded major parties. Every seat we contest forces them to explain why they won\'t adopt our policies.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'We don\'t care who implements these policies. If Labor builds 50,000 public homes, criminalises wage theft, and gives Infrastructure Victoria binding authority - ' },
        { _type: 'span', marks: ['strong'], text: 'that\'s a win.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'We\'re not here to protect intellectual property. We\'re here to fix Victoria.' }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'RECLAIM WHAT\'S YOURS' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'They rigged the game. They stole your economic security. They wasted your time and money. They sold your future to their donors.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'We\'re taking it back.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Not by asking nicely. Not by negotiating for scraps. But by being the only adults in the room: with evidence, costings, competence, and a plan that works.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'The future belongs to those who reclaim it.' }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', marks: ['strong'], text: 'Let\'s get to work.' }
      ]
    }
  ]
}

async function importManifesto () {
  console.log('Starting manifesto import...\n')

  try {
    console.log(`Importing: ${manifestoPage.title}`)

    // Check if page already exists
    const existing = await client.fetch(
      '*[_type == "page" && slug.current == $slug][0]',
      { slug: manifestoPage.slug.current }
    )

    if (existing) {
      console.log(`  ⚠️  Manifesto already exists (ID: ${existing._id}). Updating...`)
      const result = await client
        .patch(existing._id)
        .set({ body: manifestoPage.body, subtitle: manifestoPage.subtitle })
        .commit()
      console.log(`  ✅ Updated: ${result._id}`)
    } else {
      const result = await client.create(manifestoPage)
      console.log(`  ✅ Created: ${result._id}`)
    }
  } catch (error) {
    console.error('  ❌ Error importing manifesto:', error.message)
  }

  console.log('\n✨ Manifesto import complete!')
}

importManifesto().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
