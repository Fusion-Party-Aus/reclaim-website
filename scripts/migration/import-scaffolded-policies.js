/* eslint-disable */
import { createClient } from '@sanity/client'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env file manually
const envPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim()
    }
  })
}

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
    markDefs: [],
    children: [{ _type: 'span', text, marks: [] }]
  }
}

// Helper to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const policies = [
  // RECLAIM OUR ECONOMY
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Deliver UBI / Citizen’s Dividend for All Australians',
    icon: 'mdi:bank-transfer',
    summary: 'Give every Australian a Universal Basic Income set at the Henderson Poverty Line to provide economic security and dignity while simplifying the welfare system.',
    body: [
      createBlock('Give every Australian a Universal Basic Income set at the Henderson Poverty Line to provide economic security and dignity while simplifying the welfare system. This ensures everyone shares in our nation’s wealth, no one falls through the cracks, and Australia is prepared for a future shaped by AI-driven workplaces.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Guarantee Fair Wages for All Workers',
    icon: 'mdi:account-hard-hat',
    summary: 'Reform industrial relations to ensure fair wages and safe working conditions. Support unions and the award system.',
    body: [
      createBlock('Reform industrial relations to ensure fair wages and safe working conditions. Support unions and the award system, with democratic secret ballots to give workers real negotiating power without employer intimidation.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Deliver Free Childcare for Families',
    icon: 'mdi:baby-carriage',
    summary: 'Provide free or affordable childcare on a sliding scale based on income, removing financial barriers.',
    body: [
      createBlock('Provide free or affordable childcare on a sliding scale based on income, removing financial barriers so parents can work without sacrificing their children’s care and development.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Bring Dental and Mental Health Into Medicare',
    icon: 'mdi:tooth',
    summary: 'Expand universal healthcare to include dental and mental health services.',
    body: [
      createBlock('Expand universal healthcare to include dental and mental health services. Treat them as essential healthcare, not luxury services only the wealthy can afford.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Fix Aged Care With Dignity',
    icon: 'mdi:human-cane',
    summary: 'Improve aged care standards and increase funding so every older Australian receives quality care with dignity.',
    body: [
      createBlock('Improve aged care standards and increase funding so every older Australian receives quality care with dignity—free from neglect and abuse.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Cut Welfare Red Tape',
    icon: 'mdi:content-cut',
    summary: 'End Mutual Obligations and remove unnecessary red tape and tax traps in the welfare system.',
    body: [
      createBlock('End Mutual Obligations and remove unnecessary red tape and tax traps in the welfare system. Streamline support through Universal Basic Income and end the punishing complexity that traps people in poverty.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'End Forced Indue Cards',
    icon: 'mdi:card-account-details-outline',
    summary: 'Stop forcing welfare recipients to use the Indue Card—make it optional only.',
    body: [
      createBlock('Stop forcing welfare recipients to use the Indue Card—make it optional only. Respect people’s autonomy and dignity instead of treating them like children.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Reform the NDIS',
    icon: 'mdi:wheelchair-accessibility',
    summary: 'Remove profit-taking middlemen from the NDIS and strengthen disability support services.',
    body: [
      createBlock('Remove profit-taking middlemen from the NDIS and strengthen disability support services so funding goes to people who need it, not corporate profits.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Fund Prevention, Not Just Treatment',
    icon: 'mdi:hospital-box',
    summary: 'Make our health system cheaper and more effective by investing in prevention.',
    body: [
      createBlock('Make our health system cheaper and more effective by investing in prevention: mental health support, addiction services, and early-intervention programs that reduce long-term costs and save lives.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Deliver Free Vaccines for All',
    icon: 'mdi:needle',
    summary: 'Make vaccines free and accessible to everyone, with requirements only for caring professions.',
    body: [
      createBlock('Make vaccines free and accessible to everyone, with requirements only for caring professions where vulnerable people depend on protection. Public health should not depend on your bank balance—and prevention costs far less than treatment.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Guarantee Quality Education for Every Child',
    icon: 'mdi:school',
    summary: 'Fund teachers and schools properly so they can deliver high-quality education for students of all backgrounds.',
    body: [
      createBlock('Fund teachers and schools properly so they can deliver high-quality education for students of all backgrounds and abilities. Every Australian child deserves a great education regardless of postcode or disability.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Defend Free Speech',
    icon: 'mdi:bullhorn',
    summary: 'Protect the freedom to criticise government and discuss the big issues in society.',
    body: [
      createBlock('Protect the freedom to criticise government and discuss the big issues in society. Maintain accountability for harmful speech; free expression is essential to democracy, but it does not mean freedom from consequences.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Legalise Voluntary Assisted Dying With Dignity',
    icon: 'mdi:hand-heart',
    summary: 'Support voluntary assisted dying for terminally ill Australians.',
    body: [
      createBlock('Support voluntary assisted dying for terminally ill Australians, giving people control over their final days rather than forcing unnecessary suffering.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Lower the Voting Age to 16',
    icon: 'mdi:vote',
    summary: 'Introduce an optional voting age of 16 and provide electoral education in high school.',
    body: [
      createBlock('Introduce an optional voting age of 16 (with compulsory voting remaining at 18) and provide electoral education in high school so young Australians can participate in shaping their future.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Introduce an Australian Bill of Rights',
    icon: 'mdi:scale-balance',
    summary: 'Create a Bill of Rights to protect fundamental freedoms in law.',
    body: [
      createBlock('Create a Bill of Rights to protect fundamental freedoms in law, ensuring governments cannot erode basic rights without scrutiny.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Recognise First Nations in the Constitution',
    icon: 'mdi:flag',
    summary: 'Recognise First Nations peoples in the Constitution and implement the Uluru Statement from the Heart in full.',
    body: [
      createBlock('Move forward as one united country. Recognise First Nations peoples in the Constitution and implement the Uluru Statement from the Heart in full.')
    ]
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Guarantee Equal Rights for LGBTIQA+ Partnerships',
    icon: 'mdi:rainbow',
    summary: 'Protect LGBTIQA+ rights and ensure equal legal standing for all partnerships and families.',
    body: [
      createBlock('Protect LGBTIQA+ rights and ensure equal legal standing for all partnerships and families. End discrimination in adoption, healthcare, and legal recognition.')
    ]
  },

  // SOLVE THE HOUSING CRISIS
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Restructure the Housing Market',
    icon: 'mdi:home-city',
    summary: 'Treat housing as a fundamental right, not an investment vehicle for the wealthy.',
    body: [
      createBlock('Treat housing as a fundamental right, not an investment vehicle for the wealthy. Restructure the housing market so most people own only one home (the one they live in) and end policies that reward speculation while families struggle to afford housing.')
    ]
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'End Negative Gearing Exploits',
    icon: 'mdi:home-analytics',
    summary: 'Limit negative gearing to just one investment property per person or couple.',
    body: [
      createBlock('Limit negative gearing to just one investment property per person or couple, stopping wealthy investors from building property empires on tax breaks. Close loopholes that let investors claim losses on multiple rental properties while pushing home ownership out of reach for ordinary Australians.')
    ]
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Supply Public Housing at Scale',
    icon: 'mdi:office-building',
    summary: 'Deliver public and affordable housing at the scale the crisis demands—tens of thousands of homes.',
    body: [
      createBlock('Deliver public and affordable housing at the scale the crisis demands—tens of thousands of homes, not token gestures.'),
      createBlock('Purchase one floor in every residential tower for public housing, integrating residents into city centres with access to jobs, transport, and services. This approach builds mixed communities, reduces isolation, and solves maintenance and security issues automatically through existing building services. It\'s an efficient way to increase public housing stock by 1-2% while ensuring people aren\'t isolated in housing ghettos far from opportunity.')
    ]
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Stop Exploitation by Landlords',
    icon: 'mdi:shield-home',
    summary: 'Regulate rental markets to protect tenants from unsafe conditions and no-grounds evictions.',
    body: [
      createBlock('Regulate rental markets to protect tenants from unsafe conditions and no-grounds evictions. Raise and index rent assistance to 50% of actual rent paid so people are not trapped in poverty while landlords profit.')
    ]
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Scrap Capital Gains Concessions for Investors',
    icon: 'mdi:chart-timeline-variant-shimmer',
    summary: 'Remove the 50% capital gains tax discount on investment properties.',
    body: [
      createBlock('Remove the 50% capital gains tax discount on investment properties. This tax break rewards property speculators and encourages treating homes as get-rich-quick schemes instead of places for people to live. Replace it with a land value tax that makes hoarding empty properties expensive.')
    ]
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Build High-Speed Rail: Melbourne to Brisbane',
    icon: 'mdi:train-variant',
    summary: 'Deliver high-speed rail with strategic regional stops to create new affordable residential options.',
    body: [
      createBlock('Deliver high-speed rail with strategic regional stops to create new affordable residential options and vibrant economic corridors. Fast rail opens up regional areas, connects people to jobs, eases pressure on capital cities, and gives families real choices about where to live.')
    ]
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Implement a Land Value Tax',
    icon: 'mdi:land-fields',
    summary: 'Shift the tax burden away from work and productivity toward land value.',
    body: [
      createBlock('Shift the tax burden away from work and productivity toward land value, ensuring unearned windfalls are returned to the public and speculative behaviour is discouraged.')
    ]
  },

  // FIX THE TAX EXPLOITS (Bulleted list in source, converting to individual items)
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Fix the Tax Exploits',
    title: 'Make the Wealthy Pay Their Fair Share',
    icon: 'mdi:scale-balance',
    summary: 'Make the wealthy pay their fair share.',
    body: [createBlock('Make the wealthy pay their fair share.')]
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Fix the Tax Exploits',
    title: 'End Fossil Fuel Subsidies',
    icon: 'mdi:barrel',
    summary: 'End fossil fuel subsidies.',
    body: [createBlock('End fossil fuel subsidies.')]
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Fix the Tax Exploits',
    title: 'Price Carbon Pollution',
    icon: 'mdi:molecule-co2',
    summary: 'Price carbon pollution.',
    body: [createBlock('Price carbon pollution.')]
  },
  // ... adding remaining Tax Exploits items ...
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Close Tax Loopholes', icon: 'mdi:lock-alert', summary: 'Close tax loopholes.', body: [createBlock('Close tax loopholes.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Build a Federal ICAC with Teeth', icon: 'mdi:gavel', summary: 'Build a federal ICAC with teeth.', body: [createBlock('Build a federal ICAC with teeth.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Expose Political Donations', icon: 'mdi:cash-search', summary: 'Expose political donations.', body: [createBlock('Expose political donations.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Build Up Small Business', icon: 'mdi:store', summary: 'Build up small business.', body: [createBlock('Build up small business.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Break Up Media Monopolies', icon: 'mdi:newspaper-variant-multiple', summary: 'Break up media monopolies.', body: [createBlock('Break up media monopolies.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'End Payroll Tax', icon: 'mdi:account-cash', summary: 'End payroll tax.', body: [createBlock('End payroll tax.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Take Back Your Privacy from Big Tech', icon: 'mdi:incognito', summary: 'Take back your privacy from Big Tech.', body: [createBlock('Take back your privacy from Big Tech.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Guarantee Net Neutrality', icon: 'mdi:web', summary: 'Guarantee net neutrality.', body: [createBlock('Guarantee net neutrality.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Reform Copyright for Creators', icon: 'mdi:copyright', summary: 'Reform copyright for creators.', body: [createBlock('Reform copyright for creators.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Build a Green Hydrogen Industry', icon: 'mdi:molecule', summary: 'Build a green hydrogen industry.', body: [createBlock('Build a green hydrogen industry.')] },
  { pillar: 'FIX THE TAX EXPLOITS', category: 'Fix the Tax Exploits', title: 'Build a Circular Economy', icon: 'mdi:recycle', summary: 'Build a circular economy.', body: [createBlock('Build a circular economy.')] },

  // RECLAIM OUR FUTURE
  // Rebuild Our Communities
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Restore ABC and SBS Funding', icon: 'mdi:television-classic', summary: 'Restore ABC and SBS funding.', body: [createBlock('Restore ABC and SBS funding.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Keep Essential Services Public', icon: 'mdi:water', summary: 'Keep essential services public.', body: [createBlock('Keep essential services public.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Legalise Cannabis', icon: 'mdi:cannabis', summary: 'Legalise cannabis.', body: [createBlock('Legalise cannabis.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Launch a Royal Commission into Media', icon: 'mdi:scale-balance', summary: 'Launch a Royal Commission into media.', body: [createBlock('Launch a Royal Commission into media.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Hold Media Accountable for Misinformation', icon: 'mdi:alert-decagram', summary: 'Hold media accountable for misinformation.', body: [createBlock('Hold media accountable for misinformation.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Build High-Speed Rail Connecting Regions', icon: 'mdi:train-fast', summary: 'Build high-speed rail connecting regions.', body: [createBlock('Build high-speed rail connecting regions.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Make Electric Vehicles Affordable for Families', icon: 'mdi:car-electric', summary: 'Make electric vehicles affordable for families.', body: [createBlock('Make electric vehicles affordable for families.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Roll Out EV Chargers Everywhere', icon: 'mdi:ev-station', summary: 'Roll out EV chargers everywhere.', body: [createBlock('Roll out EV chargers everywhere.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Take Back Privatised Assets', icon: 'mdi:handshake', summary: 'Take back privatised assets.', body: [createBlock('Take back privatised assets.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Teach Ethics in Schools', icon: 'mdi:school', summary: 'Teach ethics in schools.', body: [createBlock('Teach ethics in schools.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Separate Church and State', icon: 'mdi:church', summary: 'Separate church and state.', body: [createBlock('Separate church and state.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Rebuild Our Communities', title: 'Strengthen Animal Welfare Laws', icon: 'mdi:paw', summary: 'Strengthen animal welfare laws.', body: [createBlock('Strengthen animal welfare laws.')] },

  // Update Our Schools
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Deliver Gonski Reforms Now', icon: 'mdi:school-outline', summary: 'Deliver Gonski reforms now.', body: [createBlock('Deliver Gonski reforms now.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Fund Education Properly', icon: 'mdi:currency-usd', summary: 'Fund education properly.', body: [createBlock('Fund education properly.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Teach Critical Thinking in Every Classroom', icon: 'mdi:brain', summary: 'Teach critical thinking in every classroom.', body: [createBlock('Teach critical thinking in every classroom.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Teach Democracy in High School', icon: 'mdi:vote-outline', summary: 'Teach democracy in high school.', body: [createBlock('Teach democracy in high school.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Provide Skills Training for Changing Industries', icon: 'mdi:tools', summary: 'Provide skills training for changing industries.', body: [createBlock('Provide skills training for changing industries.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Keep HECS/HELP Accessible', icon: 'mdi:book-education', summary: 'Keep HECS/HELP accessible.', body: [createBlock('Keep HECS/HELP accessible.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Cut University Bureaucracy', icon: 'mdi:scissors-cutting', summary: 'Cut university bureaucracy.', body: [createBlock('Cut university bureaucracy.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Update Our Schools', title: 'Give Researchers Funding Security', icon: 'mdi:flask', summary: 'Give researchers funding security.', body: [createBlock('Give researchers funding security.')] },

  // Transform Our Industries
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Create Hundreds of Thousands of Green Jobs', icon: 'mdi:leaf', summary: 'Create hundreds of thousands of green jobs.', body: [createBlock('Create hundreds of thousands of green jobs.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Declare a Climate Emergency Now', icon: 'mdi:alarm-light', summary: 'Declare a climate emergency now.', body: [createBlock('Declare a climate emergency now.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Build 800% Renewable Energy Capacity', icon: 'mdi:solar-power', summary: 'Build 800% renewable energy capacity.', body: [createBlock('Build 800% renewable energy capacity.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Reach Negative Emissions Within 10 Years', icon: 'mdi:chart-line-variant', summary: 'Reach negative emissions within 10 years.', body: [createBlock('Reach negative emissions within 10 years.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Cut Rogue Emissions from Mining', icon: 'mdi:pickaxe', summary: 'Cut rogue emissions from mining.', body: [createBlock('Cut rogue emissions from mining.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Build Green Hydrogen for Heavy Transport', icon: 'mdi:truck', summary: 'Build green hydrogen for heavy transport.', body: [createBlock('Build green hydrogen for heavy transport.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Modernise Agriculture with Precision Fermentation', icon: 'mdi:sprout', summary: 'Modernise agriculture with precision fermentation.', body: [createBlock('Modernise agriculture with precision fermentation.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Build Closed-Loop Manufacturing', icon: 'mdi:recycle-variant', summary: 'Build closed-loop manufacturing.', body: [createBlock('Build closed-loop manufacturing.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Transform Our Industries', title: 'Invest in Fusion Energy Research', icon: 'mdi:atom', summary: 'Invest in fusion energy research.', body: [createBlock('Invest in fusion energy research.')] },

  // Repair Our Environment
  { pillar: 'RECLAIM OUR FUTURE', category: 'Repair Our Environment', title: 'Enrich Soil Carbon', icon: 'mdi:flower', summary: 'Enrich soil carbon.', body: [createBlock('Enrich soil carbon.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Repair Our Environment', title: 'Regenerate Degraded Farmland', icon: 'mdi:tractor', summary: 'Regenerate degraded farmland.', body: [createBlock('Regenerate degraded farmland.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Repair Our Environment', title: 'End Native Logging Now', icon: 'mdi:tree', summary: 'End native logging now.', body: [createBlock('End native logging now.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Repair Our Environment', title: 'Restore Wetlands and Ocean Ecosystems', icon: 'mdi:wave', summary: 'Restore wetlands and ocean ecosystems.', body: [createBlock('Restore wetlands and ocean ecosystems.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Repair Our Environment', title: 'Promote Regenerative Agriculture', icon: 'mdi:cow', summary: 'Promote regenerative agriculture.', body: [createBlock('Promote regenerative agriculture.')] },
  { pillar: 'RECLAIM OUR FUTURE', category: 'Repair Our Environment', title: 'Invest in Immediate Cooling Research', icon: 'mdi:thermometer-minus', summary: 'Invest in immediate cooling research.', body: [createBlock('Invest in immediate cooling research.')] },
]


async function importScaffoldPolicies () {
  console.log('🚀 Starting scaffold policy import to Sanity...\n')
  console.log(`Importing ${policies.length} policies\n`)

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    process.exit(1)
  }

  for (const policy of policies) {
    try {
      const slug = generateSlug(policy.title)

      const document = {
        _type: 'policy',
        pillar: policy.pillar,
        category: policy.category,
        title: policy.title,
        slug: { _type: 'slug', current: slug },
        icon: policy.icon,
        summary: policy.summary,
        body: policy.body,
        publishedAt: new Date().toISOString()
      }

      // Check if exists first to avoid duplicates or overwrite
      // For now, we'll just create or replace based on slug if we can, but create() makes a new one.
      // let's use createOrReplace based on a deterministic ID if possible, or just create.
      // To keep it simple and safe for a scaffold, I'll use create() but logging.
      // Actually, createOrReplace with an ID derived from the slug is better to prevent duplicates on re-runs.

      const id = `policy-${slug}`
      const result = await client.createOrReplace({ ...document, _id: id })

      console.log(`✅ Imported: ${policy.title} (${result._id})`)
    } catch (error) {
      console.error(`❌ Error creating ${policy.title}:`, error.message)
    }
  }

  console.log('\n✨ Import complete!')
}

importScaffoldPolicies()
