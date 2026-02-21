/* global process, console */
/* eslint-disable no-console */
/**
 * Import policies from policy-baseline.md into Sanity
 *
 * Run with: SANITY_WRITE_TOKEN=<token> node scripts/migration/import-policies.js
 *
 * Each policy section in the baseline is imported as a Sanity `policy` document.
 * Existing documents with the same slug are patched (upserted) rather than duplicated.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN,
})

// ─── Helper: slugify ────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── Policy Data from policy-baseline.md ────────────────────────────────────
const policies = [
  // ══════════════════════════════════════════════════
  // PILLAR 1: RECLAIM OUR ECONOMY
  // ══════════════════════════════════════════════════

  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: "Deliver UBI / Citizen's Dividend for All Australians",
    icon: 'mdi:hand-coin',
    summary:
      'Every Australian will receive a Citizens Dividend set at the Henderson Poverty Line, paid automatically and unconditionally, replacing existing baseline welfare payments.',
    keyPoints: [
      { point: 'Reliable income foundation', description: 'Supports stability through job changes, illness, and economic transition.' },
      { point: 'Personal autonomy and dignity', description: 'Income support without surveillance, compliance, or conditionality.' },
      { point: 'Administrative simplicity', description: 'Consolidates fragmented welfare programs into a single universal payment.' },
      { point: 'Broader economic participation', description: "Universal access to a baseline level of Australia's prosperity." },
      { point: 'Adapts to AI-driven labour change', description: 'Separates basic economic security from full-time employment.' },
    ],
    designRationale:
      'A Universal Basic Income was selected over expanded conditional welfare and negative income tax models because it establishes a clear, permanent income floor without eligibility churn, behavioural conditions, or ongoing recalibration. Conditional and targeted systems were assessed as structurally complex, exclusion-prone, and poorly suited to labour-market volatility.',
    systemInteraction:
      'The Citizens Dividend replaces baseline income-support payments that provide subsistence-level income, while leaving supplementary and needs-based supports intact. Payments related to disability, caring responsibilities, housing assistance, or additional costs remain layered above the baseline. Interaction with the tax system occurs through ordinary income taxation rather than withdrawal rules.',
    economicLogic:
      'The policy alters incentive structures by separating basic income security from continuous employment. This reduces effective marginal tax rates created by benefit withdrawal, increases flexibility around part-time work, retraining, caregiving, and entrepreneurship, and improves worker bargaining position without relying on compliance enforcement.',
    riskAndFailureModes:
      'Key risks include fiscal miscalibration if the baseline level is poorly set, political pressure to reintroduce conditionality that erodes universality, inflationary pressure if introduced without complementary supply-side reforms, and partial implementation that preserves complexity while losing coherence.',
    evidenceAndPrecedent:
      'Relevant evidence includes international income-floor pilots, negative income tax experiments, Australian basic-income modelling, and long-standing universal payment frameworks such as pensions and family benefits. Results consistently show strong poverty-reduction effects and administrative simplification.',
    implementationOutline:
      'Implementation is sequenced around legislative consolidation of baseline payments, integration with existing tax and reporting systems, and a managed transition period to prevent duplication or income gaps. Dependencies include accurate income data flows, agency coordination, and clear separation between baseline and supplementary supports.',
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Guarantee Fair Wages for All Workers',
    icon: 'mdi:scale-balance',
    summary: 'Reform industrial relations to ensure fair wages and safe working conditions. Support unions and the award system, with democratic secret ballots to give workers real negotiating power without employer intimidation.',
    keyPoints: [
      { point: 'Support for unions', description: 'Protect the right of workers to organise.' },
      { point: 'Award system strengthened', description: 'Maintain and enforce award wages.' },
      { point: 'Secret ballots', description: 'Democratic workplace voting free from employer intimidation.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Deliver Free Childcare for Families',
    icon: 'mdi:baby-carriage',
    summary: "Provide free or affordable childcare on a sliding scale based on income, removing financial barriers so parents can work without sacrificing their children's care and development.",
    keyPoints: [
      { point: 'Free childcare', description: 'No cost for low-income families.' },
      { point: 'Sliding scale', description: 'Affordable for all income levels.' },
      { point: 'Workforce participation', description: 'Removes barriers for parents to re-enter the workforce.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Bring Dental and Mental Health Into Medicare',
    icon: 'mdi:tooth',
    summary: 'Expand universal healthcare to include dental and mental health services. Treat them as essential healthcare, not luxury services only the wealthy can afford.',
    keyPoints: [
      { point: 'Universal dental care', description: 'Dental healthcare covered under Medicare for all Australians.' },
      { point: 'Mental health parity', description: 'Mental health services treated as essential, not optional.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Fix Aged Care With Dignity',
    icon: 'mdi:heart-pulse',
    summary: 'Improve aged care standards and increase funding so every older Australian receives quality care with dignity—free from neglect and abuse.',
    keyPoints: [
      { point: 'Higher standards', description: 'Mandatory quality benchmarks for all aged care providers.' },
      { point: 'Increased funding', description: 'Direct funding to frontline care workers.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Cut Welfare Red Tape',
    icon: 'mdi:scissors-cutting',
    summary: 'End Mutual Obligations and remove unnecessary red tape and tax traps in the welfare system. Streamline support through Universal Basic Income and end the punishing complexity that traps people in poverty.',
    keyPoints: [
      { point: 'End Mutual Obligations', description: 'Remove punitive compliance requirements.' },
      { point: 'Simplify welfare', description: 'Consolidate into UBI to reduce bureaucracy.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'End Forced Indue Cards',
    icon: 'mdi:credit-card-off',
    summary: "Stop forcing welfare recipients to use the Indue Card—make it optional only. Respect people's autonomy and dignity instead of treating them like children.",
    keyPoints: [
      { point: 'Optional only', description: 'Indue Card becomes opt-in, not mandatory.' },
      { point: 'Restored autonomy', description: 'Welfare recipients treated with dignity.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Reform the NDIS',
    icon: 'mdi:wheelchair-accessibility',
    summary: 'Remove profit-taking middlemen from the NDIS and strengthen disability support services so funding goes to people who need it, not corporate profits.',
    keyPoints: [
      { point: 'Remove middlemen', description: 'Eliminate profiteering from disability funding.' },
      { point: 'Direct support', description: 'More funding reaches people with disability directly.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Fund Prevention, Not Just Treatment',
    icon: 'mdi:shield-check',
    summary: 'Make our health system cheaper and more effective by investing in prevention: mental health support, addiction services, and early-intervention programs that reduce long-term costs and save lives.',
    keyPoints: [
      { point: 'Prevention investment', description: 'Early intervention reduces long-term healthcare costs.' },
      { point: 'Addiction services', description: 'Evidence-based harm reduction and treatment.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Deliver Free Vaccines for All',
    icon: 'mdi:needle',
    summary: 'Make vaccines free and accessible to everyone, with requirements only for caring professions where vulnerable people depend on protection.',
    keyPoints: [
      { point: 'Universal access', description: 'Free vaccines regardless of income or insurance status.' },
      { point: 'Targeted requirements', description: 'Mandatory only for roles caring for vulnerable people.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Guarantee Quality Education for Every Child',
    icon: 'mdi:school',
    summary: 'Fund teachers and schools properly so they can deliver high-quality education for students of all backgrounds and abilities. Every Australian child deserves a great education regardless of postcode or disability.',
    keyPoints: [
      { point: 'Gonski funding', description: 'Full implementation of needs-based funding.' },
      { point: 'Equitable access', description: 'Quality education regardless of postcode or disability.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Defend Free Speech',
    icon: 'mdi:forum',
    summary: 'Protect the freedom to criticise government and discuss the big issues in society. Maintain accountability for harmful speech; free expression is essential to democracy, but it does not mean freedom from consequences.',
    keyPoints: [
      { point: 'Protected criticism', description: 'Freedom to criticise government protected.' },
      { point: 'Accountability maintained', description: 'Harmful speech still carries consequences.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Legalise Voluntary Assisted Dying With Dignity',
    icon: 'mdi:heart',
    summary: 'Support voluntary assisted dying for terminally ill Australians, giving people control over their final days rather than forcing unnecessary suffering.',
    keyPoints: [
      { point: 'Personal choice', description: 'Terminally ill Australians can choose their end-of-life care.' },
      { point: 'Safeguards in place', description: 'Robust oversight and eligibility criteria.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Lower the Voting Age to 16',
    icon: 'mdi:vote',
    summary: 'Introduce an optional voting age of 16 (with compulsory voting remaining at 18) and provide electoral education in high school so young Australians can participate in shaping their future.',
    keyPoints: [
      { point: 'Optional at 16', description: 'Young people can vote if they choose to.' },
      { point: 'Electoral education', description: 'Civics and voting taught in high school.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Introduce an Australian Bill of Rights',
    icon: 'mdi:file-document-check',
    summary: 'Create a Bill of Rights to protect fundamental freedoms in law, ensuring governments cannot erode basic rights without scrutiny.',
    keyPoints: [
      { point: 'Constitutional protection', description: 'Fundamental rights enshrined in law.' },
      { point: 'Checks on government power', description: 'Rights cannot be eroded without public scrutiny.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Recognise First Nations in the Constitution',
    icon: 'mdi:earth',
    summary: 'Move forward as one united country. Recognise First Nations peoples in the Constitution and implement the Uluru Statement from the Heart in full.',
    keyPoints: [
      { point: 'Constitutional recognition', description: 'First Nations peoples formally recognised.' },
      { point: 'Uluru Statement', description: 'Full implementation of the Uluru Statement from the Heart.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Restore the Fair Go',
    title: 'Guarantee Equal Rights for LGBTIQA+ Partnerships',
    icon: 'mdi:equal',
    summary: 'Protect LGBTIQA+ rights and ensure equal legal standing for all partnerships and families. End discrimination in adoption, healthcare, and legal recognition.',
    keyPoints: [
      { point: 'Equal legal standing', description: 'All partnerships treated equally under law.' },
      { point: 'End discrimination', description: 'No discrimination in adoption, healthcare, or legal recognition.' },
    ],
  },

  // ══════════════════════════════════════════════════
  // PILLAR 2: SOLVE THE HOUSING CRISIS
  // ══════════════════════════════════════════════════

  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Restructure the Housing Market',
    icon: 'mdi:home-city',
    summary: 'Treat housing as a fundamental right, not an investment vehicle for the wealthy. Restructure the housing market so most people own only one home and end policies that reward speculation.',
    keyPoints: [
      { point: 'Housing as a right', description: 'Policy framework treats shelter as essential, not speculative.' },
      { point: 'One-home ownership norm', description: 'Policy incentives encourage primary residence ownership.' },
    ],
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'End Negative Gearing Exploits',
    icon: 'mdi:home-minus',
    summary: 'Limit negative gearing to just one investment property per person or couple. Close loopholes that let investors claim losses on multiple rental properties while pushing home ownership out of reach.',
    keyPoints: [
      { point: 'One property limit', description: 'Negative gearing capped at one investment property.' },
      { point: 'Close loopholes', description: 'End tax advantages for multi-property investors.' },
    ],
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Supply Public Housing at Scale',
    icon: 'mdi:domain',
    summary: 'Deliver public and affordable housing at the scale the crisis demands. Purchase one floor in every new residential tower for public housing, integrating residents into city centres with access to jobs, transport, and services.',
    keyPoints: [
      { point: 'Tens of thousands of homes', description: 'Public housing at scale, not token gestures.' },
      { point: 'Mixed-community integration', description: 'Distributed across city centres near jobs and transport.' },
      { point: 'Efficient delivery', description: '1-2% public housing stock increase via tower floor purchases.' },
    ],
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Stop Exploitation by Landlords',
    icon: 'mdi:home-account',
    summary: 'Regulate rental markets to protect tenants from unsafe conditions and no-grounds evictions. Raise and index rent assistance to 50% of actual rent paid.',
    keyPoints: [
      { point: 'No-grounds eviction ban', description: 'Tenants protected from arbitrary evictions.' },
      { point: 'Indexed rent assistance', description: 'Assistance set at 50% of actual rent paid.' },
    ],
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Scrap Capital Gains Concessions for Investors',
    icon: 'mdi:percent',
    summary: 'Remove the 50% capital gains tax discount on investment properties. Replace it with a land value tax that makes hoarding empty properties expensive.',
    keyPoints: [
      { point: 'Remove CGT discount', description: 'End the 50% discount on investment property profits.' },
      { point: 'Land value tax', description: 'Discourage speculative land banking with an annual land tax.' },
    ],
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Build High-Speed Rail: Melbourne to Brisbane',
    icon: 'mdi:train',
    summary: 'Deliver high-speed rail with strategic regional stops to create new affordable residential options and vibrant economic corridors connecting people to jobs and easing pressure on capital cities.',
    keyPoints: [
      { point: 'Melbourne to Brisbane corridor', description: 'High-speed rail with regional stops.' },
      { point: 'Affordable regional living', description: 'New housing options opened up along the corridor.' },
      { point: 'Economic development', description: 'Regional economic corridors created along the route.' },
    ],
  },
  {
    pillar: 'SOLVE THE HOUSING CRISIS',
    category: 'Make Housing a Right, Not an Investment',
    title: 'Implement a Land Value Tax',
    icon: 'mdi:map-marker-multiple',
    summary: 'Shift the tax burden away from work and productivity toward land value, ensuring unearned windfalls are returned to the public and speculative behaviour is discouraged.',
    keyPoints: [
      { point: 'Tax land, not labour', description: 'Shifts tax burden from income to land value.' },
      { point: 'Reduce speculation', description: "Makes holding idle land expensive, freeing it for Australia's housing needs." },
    ],
  },

  // ══════════════════════════════════════════════════
  // PILLAR 3: FIX THE TAX EXPLOITS
  // ══════════════════════════════════════════════════

  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Make the Wealthy Pay Their Fair Share',
    title: 'Make the Wealthy Pay Their Fair Share',
    icon: 'mdi:scale-unbalanced',
    summary: 'Close tax loopholes used by the ultra-wealthy and large corporations, ensuring that everyone pays their fair share of tax to fund public services.',
    keyPoints: [
      { point: 'Close loopholes', description: 'Eliminate shelters and avoidance schemes.' },
      { point: 'Corporate minimum tax', description: 'Ensure profitable companies pay tax.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Make the Wealthy Pay Their Fair Share',
    title: 'End Fossil Fuel Subsidies',
    icon: 'mdi:fuel',
    summary: 'Remove billions in annual fossil fuel subsidies and redirect that money into clean energy, public services, and climate adaptation.',
    keyPoints: [
      { point: 'Remove direct subsidies', description: 'Ends direct government payments to fossil fuel companies.' },
      { point: 'Redirect savings', description: 'Funds redirected to clean energy transition.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Make the Wealthy Pay Their Fair Share',
    title: 'Price Carbon Pollution',
    icon: 'mdi:molecule-co2',
    summary: 'Implement an effective carbon price that reflects the true cost of pollution, drives clean investment, and returns dividends to households.',
    keyPoints: [
      { point: 'Effective carbon price', description: 'Reflects true cost of pollution.' },
      { point: 'Household dividends', description: 'Revenue returned to Australian households.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Democracy and Accountability',
    title: 'Build a Federal ICAC with Teeth',
    icon: 'mdi:gavel',
    summary: 'Establish a federal anti-corruption commission with real powers to investigate and prosecute political corruption at every level of government.',
    keyPoints: [
      { point: 'Real powers', description: 'Full investigative and prosecutorial authority.' },
      { point: 'Independent', description: 'Free from government interference.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Democracy and Accountability',
    title: 'Expose Political Donations',
    icon: 'mdi:eye',
    summary: 'Require real-time disclosure of all political donations above a minimal threshold, ending the culture of dark money in Australian politics.',
    keyPoints: [
      { point: 'Real-time disclosure', description: 'All donations above threshold disclosed.' },
      { point: 'End dark money', description: 'No hidden political influence from donors.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Economy and Business',
    title: 'Build Up Small Business',
    icon: 'mdi:store',
    summary: 'Support small businesses with reduced payroll tax, simpler compliance, and access to affordable finance — while cracking down on large corporations that exploit market power.',
    keyPoints: [
      { point: 'Lower payroll tax', description: 'Reduced burden on small business employers.' },
      { point: 'Simpler compliance', description: 'Less red tape for small operators.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Media and Technology',
    title: 'Break Up Media Monopolies',
    icon: 'mdi:television-play',
    summary: 'Enforce media diversity laws and break up concentrated ownership to ensure Australians have access to a genuine plurality of voices and perspectives.',
    keyPoints: [
      { point: 'Enforce diversity laws', description: 'No single entity dominates the media landscape.' },
      { point: 'Support independent media', description: 'Fund community and independent outlets.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Media and Technology',
    title: 'Take Back Your Privacy from Big Tech',
    icon: 'mdi:shield-lock',
    summary: 'Give Australians real rights over their personal data, regulate surveillance advertising, and require data minimisation from technology platforms.',
    keyPoints: [
      { point: 'Data rights', description: 'Australians own their personal data.' },
      { point: 'Regulate surveillance advertising', description: 'Restrict invasive behavioural tracking.' },
    ],
  },
  {
    pillar: 'FIX THE TAX EXPLOITS',
    category: 'Media and Technology',
    title: 'Guarantee Net Neutrality',
    icon: 'mdi:web',
    summary: 'Enshrine net neutrality in Australian law to ensure all internet traffic is treated equally, regardless of source or destination.',
    keyPoints: [
      { point: 'Equal internet access', description: 'No throttling or favouritism by ISPs.' },
      { point: 'Legal protection', description: 'Net neutrality enshrined in legislation.' },
    ],
  },

  // ══════════════════════════════════════════════════
  // PILLAR 4: RECLAIM OUR FUTURE
  // ══════════════════════════════════════════════════

  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Rebuild Our Communities',
    title: 'Restore ABC and SBS Funding',
    icon: 'mdi:television',
    summary: 'Restore full, independent funding to the ABC and SBS to protect public broadcasting and ensure all Australians have access to quality, independent news and content.',
    keyPoints: [
      { point: 'Full funding restored', description: 'ABC and SBS budgets reinstated.' },
      { point: 'Editorial independence', description: 'Protected from political interference.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Rebuild Our Communities',
    title: 'Keep Essential Services Public',
    icon: 'mdi:water-pump',
    summary: 'Oppose privatisation of essential services including water, power, and public transport. Return privatised assets to public ownership where it delivers better outcomes.',
    keyPoints: [
      { point: 'No new privatisations', description: 'Essential services stay in public hands.' },
      { point: 'Return assets', description: 'Privatised services returned where beneficial.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Rebuild Our Communities',
    title: 'Legalise Cannabis',
    icon: 'mdi:leaf',
    summary: 'Legalise and regulate cannabis for adult personal use, redirecting enforcement resources to serious crime and eliminating the criminal market.',
    keyPoints: [
      { point: 'Adult personal use', description: 'Legal for adults with appropriate regulation.' },
      { point: 'Criminal market eliminated', description: 'Regulated market replaces black market.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Rebuild Our Communities',
    title: 'Strengthen Animal Welfare Laws',
    icon: 'mdi:dog',
    summary: 'Enact strong, nationally consistent animal welfare laws with real enforcement powers, protecting animals from cruelty and exploitation across all industries.',
    keyPoints: [
      { point: 'National standards', description: 'Consistent laws across all states and territories.' },
      { point: 'Real enforcement', description: 'Penalties with teeth for animal cruelty.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Update Our Schools',
    title: 'Deliver Gonski Reforms Now',
    icon: 'mdi:school',
    summary: 'Fully implement needs-based school funding as recommended by the Gonski Review, ending the advantage-based funding model that entrenches inequality.',
    keyPoints: [
      { point: 'Needs-based funding', description: 'Schools funded based on student needs, not advantage.' },
      { point: 'End inequality', description: 'Close the gap between wealthy and disadvantaged schools.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Update Our Schools',
    title: 'Teach Critical Thinking in Every Classroom',
    icon: 'mdi:brain',
    summary: 'Mandate critical thinking, media literacy, and logic as core curriculum components across all schools, equipping students to navigate a complex information environment.',
    keyPoints: [
      { point: 'Core curriculum', description: 'Critical thinking taught at every level.' },
      { point: 'Media literacy', description: 'Students equipped to identify misinformation.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Update Our Schools',
    title: 'Teach Democracy in High School',
    icon: 'mdi:bank',
    summary: 'Make civics and democracy education a mandatory part of the high school curriculum, ensuring every Australian understands how their government works and how to participate in it.',
    keyPoints: [
      { point: 'Mandatory civics', description: 'Democracy education in every high school.' },
      { point: 'Engaged citizens', description: 'Young Australians equipped to participate.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Transform Our Industries',
    title: 'Create Hundreds of Thousands of Green Jobs',
    icon: 'mdi:solar-panel',
    summary: 'Invest in the clean economy transition to create hundreds of thousands of good jobs in renewables, manufacturing, and environmental restoration.',
    keyPoints: [
      { point: 'Renewable energy jobs', description: 'Hundreds of thousands of jobs in clean energy.' },
      { point: 'Just transition', description: 'Support for workers in transitioning industries.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Transform Our Industries',
    title: 'Declare a Climate Emergency Now',
    icon: 'mdi:fire-alert',
    summary: 'Formally declare a climate emergency and reshape policy across all portfolios to deliver rapid emissions reduction and climate adaptation at the scale the science demands.',
    keyPoints: [
      { point: 'Formal declaration', description: 'Climate emergency formally declared.' },
      { point: 'Cross-portfolio action', description: 'Climate lens applied to all government decisions.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Transform Our Industries',
    title: 'Build 800% Renewable Energy Capacity',
    icon: 'mdi:lightning-bolt',
    summary: 'Scale Australian renewable energy to 800% of current electricity demand, enabling export of clean energy and powering a fully electrified economy.',
    keyPoints: [
      { point: '800% capacity target', description: 'Far beyond domestic needs — enabled for export.' },
      { point: 'Fully electrified economy', description: 'Transport, industry, and homes all electric.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Transform Our Industries',
    title: 'Build Green Hydrogen for Heavy Transport',
    icon: 'mdi:hydrogen-station',
    summary: 'Invest in green hydrogen production to decarbonise heavy industry and long-haul transport, capturing export opportunities and creating new industries.',
    keyPoints: [
      { point: 'Heavy industry fuel', description: 'Green hydrogen for shipping, aviation, and industry.' },
      { point: 'Export opportunity', description: 'Australia positioned as a major clean hydrogen exporter.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Repair Our Environment',
    title: 'End Native Logging Now',
    icon: 'mdi:forest',
    summary: 'Immediately end native forest logging, protect remaining old-growth, and transition forestry workers to alternative employment in conservation and sustainable timber.',
    keyPoints: [
      { point: 'Immediate ban', description: 'Native forest logging ended immediately.' },
      { point: 'Just transition', description: 'Forestry workers supported into new roles.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Repair Our Environment',
    title: 'Restore Wetlands and Ocean Ecosystems',
    icon: 'mdi:waves',
    summary: 'Fund large-scale restoration of Australian wetlands, reef systems, and ocean ecosystems to restore biodiversity, protect fisheries, and build climate resilience.',
    keyPoints: [
      { point: 'Wetland restoration', description: 'Large-scale wetland rehabilitation funded.' },
      { point: 'Ocean protection', description: 'Reef and marine ecosystem restoration programs.' },
    ],
  },
  {
    pillar: 'RECLAIM OUR FUTURE',
    category: 'Repair Our Environment',
    title: 'Promote Regenerative Agriculture',
    icon: 'mdi:sprout',
    summary: 'Support farmers to transition to regenerative and precision agriculture practices that build soil health, increase yields, and reduce emissions.',
    keyPoints: [
      { point: 'Soil carbon', description: 'Enriching soil carbon for climate and productivity gains.' },
      { point: 'Farmer support', description: 'Funding and resources for the transition.' },
    ],
  },
]

// ─── Import logic ───────────────────────────────────────────────────────────

async function importPolicies() {
  console.log('🚀 Starting import of policies from policy-baseline.md to Sanity...\n')
  console.log(`📋 Total policies to import: ${policies.length}\n`)

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    console.error('\nRun: SANITY_WRITE_TOKEN=<token> node scripts/migration/import-policies.js')
    process.exit(1)
  }

  let created = 0
  let patched = 0
  let failed = 0

  for (const policy of policies) {
    const slug = slugify(policy.title)
    const docId = `policy-${slug}`

    const doc = {
      _id: docId,
      _type: 'policy',
      pillar: policy.pillar,
      category: policy.category,
      title: policy.title,
      slug: { _type: 'slug', current: slug },
      icon: policy.icon || 'mdi:file-document',
      summary: policy.summary,
      keyPoints: (policy.keyPoints || []).map((kp, i) => ({
        _key: `kp-${slug}-${i}`,
        _type: 'keyPoint',
        point: kp.point,
        description: kp.description || '',
      })),
      ...(policy.designRationale     ? { designRationale: policy.designRationale }         : {}),
      ...(policy.systemInteraction   ? { systemInteraction: policy.systemInteraction }       : {}),
      ...(policy.economicLogic       ? { economicLogic: policy.economicLogic }               : {}),
      ...(policy.riskAndFailureModes ? { riskAndFailureModes: policy.riskAndFailureModes }   : {}),
      ...(policy.evidenceAndPrecedent? { evidenceAndPrecedent: policy.evidenceAndPrecedent } : {}),
      ...(policy.implementationOutline?{ implementationOutline: policy.implementationOutline}: {}),
    }

    try {
      const existing = await client.getDocument(docId)
      if (existing) {
        await client.patch(docId).set(doc).commit()
        console.log(`✏️  Patched:  ${policy.pillar} → ${policy.title}`)
        patched++
      } else {
        await client.create(doc)
        console.log(`✅ Created: ${policy.pillar} → ${policy.title}`)
        created++
      }
    } catch (error) {
      console.error(`❌ Error:   ${policy.title}`)
      console.error(`   ${error.message}`)
      failed++
    }
  }

  console.log('\n─────────────────────────────────────────────')
  console.log('✨ Import complete!')
  console.log(`   ✅ Created: ${created}`)
  console.log(`   ✏️  Patched:  ${patched}`)
  if (failed > 0) console.log(`   ❌ Failed:  ${failed}`)
  console.log('\nVisit Sanity Studio to review: npm run dev:sanity\n')
}

importPolicies()
