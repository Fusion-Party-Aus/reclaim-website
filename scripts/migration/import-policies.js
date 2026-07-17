/* global process, console */
/* eslint-disable no-console */
/**
 * Import the new 21 policies into Sanity CMS.
 *
 * It loads the .env file if it exists, or relies on SANITY_WRITE_TOKEN in the environment.
 * Existing documents with the same slug are created or replaced.
 */

import { createClient } from '@sanity/client'
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
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return
    const eqIdx = trimmedLine.indexOf('=')
    if (eqIdx > 0) {
      const key = trimmedLine.substring(0, eqIdx).trim()
      const value = trimmedLine.substring(eqIdx + 1).trim()
      // Remove optional quotes around value
      const cleanValue = value.replace(/^['"]|['"]$/g, '')
      if (key && !process.env[key]) {
        process.env[key] = cleanValue
      }
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

// Helper: slugify
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Complete 21 policies definition conforming to the style rules
const policies = [
  // ─── PILLAR 1: RECLAIM OUR ECONOMY ──────────────────────────────────────────

  // Category: Stop the Bleeding
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Stop the Bleeding',
    title: 'Smooth the Pension Cliff',
    icon: 'mdi:ladder',
    summary: 'Transition the state pension and senior concession tapers into a smooth gradient to remove the punishing tax traps that penalise part-time work.',
    thisTerm: true,
    keyPoints: [
      { point: 'Improved work incentives', description: 'Seniors can undertake part-time work without facing immediate, steep benefit cuts.' },
      { point: 'Stable living standards', description: 'Gradual concession tapering provides consistent and predictable household budgets.' },
      { point: 'Workforce retention', description: 'Experienced staff remain active in the economy through phased transitions to retirement.' }
    ],
    designRationale: 'A smooth taper is selected over flat thresholds to prevent sharp drop-offs in disposable income. The design ensures that every dollar earned from work results in an increase in total income, removing the structural barrier that currently discourages seniors from taking on modest hours.',
    systemInteraction: 'This reform modifies the interaction between state-level senior concessions and federal pension rules, ensuring state-based rebates (energy, water, council rates) taper gradually in alignment with federal income tests rather than cutting off at rigid thresholds.',
    economicLogic: 'By smoothing the taper rate, we lower the effective marginal tax rate faced by pensioners entering the workforce, boosting aggregate labor supply and relieving pressure on sectors experiencing staff shortages.',
    riskAndFailureModes: 'Risks include increased administrative complexity in coordinating state concession systems with federal social security data, and potential under-communication leaving seniors unaware of the reformed taper rules.',
    evidenceAndPrecedent: 'Similar taper smoothing in international pension frameworks has demonstrated sustained increases in part-time labor participation among older workers without impacting the core pension budget.',
    implementationOutline: 'Sequence begins with state Treasury modeling of concession thresholds, followed by data-sharing agreements with Centrelink, and culminates in a public information campaign outlining the new gradient.'
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Stop the Bleeding',
    title: 'Audit the Fake Surplus',
    icon: 'mdi:calculator-variant',
    summary: 'Launch an independent forensic audit of the state balance sheet to expose hidden liabilities and off-book borrowing.',
    thisTerm: true,
    keyPoints: [
      { point: 'Forensic financial transparency', description: 'The public receives a complete and verified assessment of the state’s financial position.' },
      { point: 'Honest debt reporting', description: 'Off-book liabilities and public-private partnership debt are brought onto the balance sheet.' },
      { point: 'Prudent capital spending', description: 'Future infrastructure projects are evaluated against real, audited state capacity.' }
    ],
    designRationale: 'An independent forensic audit is chosen over standard departmental reviews to guarantee non-partisan credibility. Revealing off-balance-sheet commitments is necessary to restore long-term fiscal discipline.',
    systemInteraction: 'The audit will inspect all state government departments, treasury corporations, and public-private partnership contracts, consolidating hidden debt under a unified reporting framework.',
    economicLogic: 'Accurate reporting of state debt improves sovereign credit risk assessment and ensures public investments are built on real cash reserves rather than accounting maneuvers.',
    riskAndFailureModes: 'A primary risk is political resistance to exposing historical accounting choices and legal hurdles in accessing commercially sensitive public-private contracts.',
    evidenceAndPrecedent: 'Jurisdictions that have undertaken independent balance sheet consolidations have successfully identified structural waste and restored long-term budget stability.',
    implementationOutline: 'Establish an independent Audit Commission, issue subpoenas for all off-book financial arrangements, compile the consolidated report, and legislate new transparent reporting standards.'
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Stop the Bleeding',
    title: 'Claw Back Franchise Profits',
    icon: 'mdi:hand-coin',
    summary: 'Impose a windfall profits levy on privatised state monopoly franchises that fail to meet baseline service standards.',
    thisTerm: true,
    keyPoints: [
      { point: 'Taxpayer profit recovery', description: 'Excess corporate profits derived from public monopolies are clawed back if service levels fail.' },
      { point: 'Service quality enforcement', description: 'Operators face significant financial penalties for late, cancelled, or substandard services.' },
      { point: 'Bill relief funding', description: 'Clawed-back revenues are directly redistributed to consumers as utility and transit rebates.' }
    ],
    designRationale: 'A targeted windfall profit levy creates a direct financial incentive for private operators to prioritize service quality over shareholder returns, resolving the lack of accountability in monopolistic concessions.',
    systemInteraction: 'This levy integrates with existing regulator frameworks, triggering tax assessments when audited service delivery metrics fall below statutory minimums.',
    economicLogic: 'Aligning corporate profitability with contract compliance corrects the market failure of privatized monopolies, ensuring excess profits are returned when utility/transport quality degrades.',
    riskAndFailureModes: 'Risks include legal challenges from franchise operators under existing lease agreements and the potential for operators to reduce maintenance to offset the levy.',
    evidenceAndPrecedent: 'Similar service-linked taxation mechanisms in European rail and energy networks have successfully driven operators to meet performance standards.',
    implementationOutline: 'Legislate performance-linked tax thresholds, audit utility and transit performance metrics, calculate and levy the windfall tax, and distribute consumer rebates.'
  },

  // Category: Build Public Wealth
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Build Public Wealth',
    title: 'Tax the Land Windfalls',
    icon: 'mdi:map-legend',
    summary: 'Introduce a 75% betterment tax on land value increases generated by state rezoning decisions.',
    thisTerm: true,
    keyPoints: [
      { point: 'End speculative land hoarding', description: 'Speculators are prevented from holding rezoned land purely for risk-free capital gains.' },
      { point: 'Localized community funding', description: 'Rezoning windfalls directly finance new neighborhood schools, parks, and bus networks.' },
      { point: 'Stabilized property markets', description: 'Removing speculative rezoning gains reduces artificial inflation in housing development land.' }
    ],
    designRationale: 'A high marginal tax on rezoning windfalls returns community-created value to the public. Land value increases from rezoning are unearned by the owner and represent a public asset that should fund public services.',
    systemInteraction: 'The tax is triggered and calculated by the Valuer-General at the time of rezoning, payable upon property transfer or development application approval.',
    economicLogic: 'Taxing economic rent (unearned land value increases) does not distort development incentives, as it targets windfall gains rather than capital investment or improvement.',
    riskAndFailureModes: 'Potential risks include temporary land withholding by owners hoping for future tax reversals and disputes over baseline land valuations.',
    evidenceAndPrecedent: 'Betterment taxes have been successfully utilized in jurisdictions like the ACT and Singapore to fund high-quality public infrastructure without increasing public debt.',
    implementationOutline: 'Update Valuer-General assessment models, legislate the betterment tax framework, establish the local infrastructure fund, and apply the levy to all active rezonings.'
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Build Public Wealth',
    title: 'Build the Sovereign Fund',
    icon: 'mdi:bank',
    summary: 'Establish a Victorian Sovereign Wealth Fund powered by resource royalties and land value taxes to build long-term generational wealth.',
    thisTerm: false,
    keyPoints: [
      { point: 'Generational wealth reserve', description: 'A permanent capital fund generates investment returns to sustain future public services.' },
      { point: 'Resource royalty preservation', description: 'Non-renewable resource revenues are saved and invested rather than consumed as short-term cash.' },
      { point: 'Public revenue stabilization', description: 'Investment dividends protect the state budget from economic shocks and commodity cycles.' }
    ],
    designRationale: 'A sovereign wealth fund is established to ensure that the sale of non-renewable resources and state land value growth benefits all generations, converting finite assets into a permanent revenue stream.',
    systemInteraction: 'A fixed percentage of mining royalties, betterment taxes, and surplus land sales are statutory-bound to flow directly into the Fund, bypassing general treasury spending.',
    economicLogic: 'Saving resource rents mitigates Dutch disease, stabilizes the state balance sheet, and provides a compound-interest engine that offsets future cost pressures.',
    riskAndFailureModes: 'Risks include political raids to fund short-term deficits and poor investment management deviating from conservative growth profiles.',
    evidenceAndPrecedent: 'Norway’s Government Pension Fund Global and Alaska’s Permanent Fund demonstrate how sovereign wealth structures can secure generational prosperity.',
    implementationOutline: 'Legislate the Fund’s statutory independence, establish the investment board, direct targeted royalty streams, and implement strict anti-drawdown rules.'
  },
  {
    pillar: 'RECLAIM OUR ECONOMY',
    category: 'Build Public Wealth',
    title: 'Pay Every Victorian',
    icon: 'mdi:cash-multiple',
    summary: 'Distribute a Citizens Dividend to all Victorians financed by the returns of the Sovereign Wealth Fund.',
    thisTerm: false,
    keyPoints: [
      { point: 'Direct wealth sharing', description: 'Every resident receives a direct, equal dividend from the returns of state assets.' },
      { point: 'Unconditional basic security', description: 'A reliable cash payment establishes a permanent economic floor for all citizens.' },
      { point: 'Localized economic boost', description: 'Regular dividend distributions stimulate local commerce and small businesses.' }
    ],
    designRationale: 'Direct distribution of fund earnings builds public ownership of collective wealth. Paying dividends unconditionally ensures equity and bypasses bureaucratic welfare compliance traps.',
    systemInteraction: 'The dividend is paid directly to bank accounts linked with state identity verification, scaling dynamically based on the audited annual returns of the Sovereign Fund.',
    economicLogic: 'Distributing capital returns directly to individuals improves income distribution, supports demand side consumption, and reduces structural inequality without relying on distorting tax changes.',
    riskAndFailureModes: 'Risks include public expectation of payout guarantees during low-return years and potential inflation if not coordinated with broader macroeconomic controls.',
    evidenceAndPrecedent: 'The Alaska Permanent Fund Dividend has operated successfully since 1982, demonstrating sustained poverty reduction and high public support.',
    implementationOutline: 'Build the dividend payout engine, integrate with state identity services, establish the statutory distribution formula, and launch the initial annual payout.'
  },

  // ─── PILLAR 2: RECLAIM OUR INFRASTRUCTURE ───────────────────────────────────

  // Category: Read the Contracts
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Read the Contracts',
    title: 'Expose the Tunnel Deal',
    icon: 'mdi:tunnel',
    summary: 'Declassify and publish all secret toll road contracts and traffic volume guarantees in full.',
    thisTerm: true,
    keyPoints: [
      { point: 'End secret toll agreements', description: 'Citizens gain complete access to the contracts governing public toll roads.' },
      { point: 'Expose taxpayer liabilities', description: 'Secret state traffic volume guarantees and liability clauses are made public.' },
      { point: 'Enable contract renegotiation', description: 'Public visibility of contract terms empowers transparent campaigns for fairer arrangements.' }
    ],
    designRationale: 'Declassifying agreements is the only path to public oversight. Secret contracts prevent democratic review of state-backed monopoly profits and public liabilities.',
    systemInteraction: 'This policy overrides commercial-in-confidence clauses for major transport infrastructure contracts, placing them on a public state register.',
    economicLogic: 'Transparency improves market competition and prevents private entities from extracting monopoly rents via undisclosed state guarantees.',
    riskAndFailureModes: 'Key risks include legal action from toll operators claiming breach of contract and potential impacts on future private investment partnerships.',
    evidenceAndPrecedent: 'International infrastructure registers have demonstrated that public disclosure of contracts increases delivery efficiency and lowers lifecycle costs.',
    implementationOutline: 'Review state classification legislation, override secrecy clauses in existing agreements, publish contracts online, and establish mandatory disclosure rules for future projects.'
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Read the Contracts',
    title: 'Audit Southern Cross',
    icon: 'mdi:train-car',
    summary: 'Conduct a comprehensive operational and financial audit of the Southern Cross Station public-private partnership.',
    thisTerm: true,
    keyPoints: [
      { point: 'Improved station facilities', description: 'Passenger comfort, cleanliness, and safety issues are audited and corrected.' },
      { point: 'Operator accountability', description: 'Private contract holders are held strictly to their maintenance and service standards.' },
      { point: 'Value for money verification', description: 'Forensic audits ensure taxpayers are not subsidizing excess private margins.' }
    ],
    designRationale: 'A forensic audit is required to address the station’s visible decline. Decades of private management have isolated the public transport hub from direct public control.',
    systemInteraction: 'The audit will assess the station’s lease holder compliance, reviewing maintenance logs, air quality metrics (specifically diesel particulates), and security deployment.',
    economicLogic: 'Ensuring contract compliance prevents private operators from deferring maintenance costs onto the state, protecting public assets from long-term depreciation.',
    riskAndFailureModes: 'Risks include litigation over contract interpretations and limited access to historical operator accounts.',
    evidenceAndPrecedent: 'Public-private partnership audits in other jurisdictions have successfully identified under-delivery, forcing operators to reinvest in asset maintenance.',
    implementationOutline: 'Appoint the Auditor-General to lead the inquiry, execute access rights to station records, publish findings, and issue contract remediation orders.'
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Read the Contracts',
    title: "Unmask Transurban's Discount",
    icon: 'mdi:eye-off-outline',
    summary: 'Investigate the secret toll discounts and concessions granted to Transurban across the metropolitan road network.',
    thisTerm: true,
    keyPoints: [
      { point: 'Expose hidden concessions', description: 'Secret toll discounts, tax arrangements, and road-monopoly clauses are revealed.' },
      { point: 'Fair network pricing', description: 'Toll settings are structured for public transit efficiency rather than corporate profit.' },
      { point: 'Restored competitive bidding', description: 'Future transport corridor projects are opened to transparent, competitive tenders.' }
    ],
    designRationale: 'Unmasking concessions is necessary to reform urban transport economics. The dominant position of Transurban has locked the state into toll extensions without public scrutiny.',
    systemInteraction: 'This investigation coordinates data between the Department of Transport and Treasury, analyzing how toll concessions impact general congestion levy revenues.',
    economicLogic: 'Exposing hidden cross-subsidies corrects market distortions, ensuring toll road pricing reflects social cost rather than private monopoly profits.',
    riskAndFailureModes: 'Risks include legal challenges under international trade or investment frameworks and corporate withdrawal from infrastructure markets.',
    evidenceAndPrecedent: 'Anti-trust and utility regulatory reviews globally demonstrate that dismantling hidden concession agreements restores price fairness for commuters.',
    implementationOutline: 'Convene a parliamentary inquiry with document-compulsion powers, analyze Transurban contract linkages, publish the findings, and legislate toll pricing controls.'
  },

  // Category: Take Back the Land
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Take Back the Land',
    title: 'Charge the Car Parks',
    icon: 'mdi:car-parking',
    summary: 'Levy a commercial parking station tax in inner-urban areas to discourage peak-hour driving and fund public transit.',
    thisTerm: true,
    keyPoints: [
      { point: 'Reduced city congestion', description: 'Discouraging inner-city commuter driving frees up road space for transit and active transport.' },
      { point: 'Ring-fenced transit funding', description: 'Levy revenues directly finance outer-suburban bus service improvements.' },
      { point: 'Improved urban air quality', description: 'Lower vehicle numbers in the CBD reduce localized tailpipe and particulate emissions.' }
    ],
    designRationale: 'A parking levy is an effective tool to shift commuters toward public transport. Charging commercial spaces targets high-frequency congestion without taxing regional drivers passing through.',
    systemInteraction: 'The levy integrates with municipal property registers, applying a surcharge to non-residential commercial parking bays in designated high-density zones.',
    economicLogic: 'Pricing road-use demand at destination points internalizes congestion costs, encouraging efficient transit use and generating public revenue.',
    riskAndFailureModes: 'Risks include commercial parking operators passing costs to retail businesses and compliance issues with private corporate garage spaces.',
    evidenceAndPrecedent: 'The Melbourne Congestion Levy and Sydney’s Parking Space Levy have successfully reduced CBD traffic volumes and funded substantial transit expansions.',
    implementationOutline: 'Define the levy zones, audit commercial parking registers, legislate the surcharge rates, and direct revenues to the growth-area transit fund.'
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Take Back the Land',
    title: 'Build Housing at Stations',
    icon: 'mdi:home-group',
    summary: 'Mandate medium-density public housing developments directly above and adjacent to all major transport hubs.',
    thisTerm: true,
    keyPoints: [
      { point: 'Direct transit access', description: 'Residents live immediately adjacent to rapid transit networks, reducing car dependence.' },
      { point: 'Increased public housing supply', description: 'State-owned station land is utilized to build high-quality, affordable homes.' },
      { point: 'Vibrant local precincts', description: 'Transport hubs are transformed into active communities with local retail and services.' }
    ],
    designRationale: 'Using public land at station hubs solves both housing access and transit integration issues. It prevents urban sprawl and ensures social housing residents have direct access to jobs and services.',
    systemInteraction: 'Coordinated between the state housing authority and transport departments to zone and develop surplus air-rights and land adjacent to train stations.',
    economicLogic: 'Developing public land avoids high site-acquisition costs, maximizing the yield of public housing funds while supporting transit ridership and efficiency.',
    riskAndFailureModes: 'Risks include complex engineering requirements over active rail lines and local zoning opposition to medium-density builds.',
    evidenceAndPrecedent: 'Precision transit-oriented housing developments in Tokyo and Hong Kong demonstrate how station-linked communities support urban sustainability.',
    implementationOutline: 'Identify target stations, draft public development zoning rules, allocate state building funds, and launch construction of transit-integrated estates.'
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Take Back the Land',
    title: 'Take Back Public Assets',
    icon: 'mdi:handshake',
    summary: 'Terminate failing private infrastructure leases and bring essential utility and transport networks back into public ownership.',
    thisTerm: false,
    keyPoints: [
      { point: 'Public service focus', description: 'Essential utilities are operated to deliver reliable, low-cost services rather than corporate dividends.' },
      { point: 'Reinvested utility profits', description: 'Operating surpluses are directed into network upgrades and consumer bill relief.' },
      { point: 'Coordinated state planning', description: 'Essential infrastructure is planned cohesively to meet net-zero and community goals.' }
    ],
    designRationale: 'Privatisation of natural monopolies has led to high costs and poor accountability. Public ownership ensures vital services (water, power, transit) are run as public goods.',
    systemInteraction: 'Re-established public utilities absorb private assets upon lease expiry or through structured compensation buyouts, operating under independent public boards.',
    economicLogic: 'Eliminating the profit margin requirement and high executive bonuses in natural monopolies directly lowers the cost base of essential public services.',
    riskAndFailureModes: 'Risks include high upfront capital compensation costs and the need to maintain operational efficiency without private market market disciplines.',
    evidenceAndPrecedent: 'Re-municipalisation of energy grids in Germany and water networks in France has successfully lowered user costs and accelerated transition goals.',
    implementationOutline: 'Review all utility and transit leases, establish the public buy-back framework, create public operating entities, and transition services to public control.'
  },

  // Category: Build the Network
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Build the Melton Line',
    icon: 'mdi:train-variant',
    summary: 'Construct a dedicated high-capacity rail corridor to Melton to support the rapid growth of Melbourne’s outer west.',
    thisTerm: false,
    keyPoints: [
      { point: 'High-frequency western transit', description: 'Melton residents gain direct, fast, and electrified rail services into the CBD.' },
      { point: 'Support western growth', description: 'Rapid rail services support new housing developments and local employment hubs.' },
      { point: 'Reduced highway gridlock', description: 'Providing high-capacity transit relieves pressure on the Western Highway.' }
    ],
    designRationale: 'A dedicated, electrified rail line is necessary to replace the current diesel-run regional hybrid service. Melton’s rapid population growth demands high-capacity urban transit, not regional workarounds.',
    systemInteraction: 'This project separates Melton urban services from the regional Ballarat line, integrating Melton into the metropolitan train network.',
    economicLogic: 'Connecting outer-suburban labor markets to economic centers increases productivity and reduces household transportation costs.',
    riskAndFailureModes: 'Risks include significant capital cost escalations and construction disruptions along the existing corridor.',
    evidenceAndPrecedent: 'Electrification and duplication of outer lines (e.g., Mernda extension) have historically driven high ridership growth and supported local economic development.',
    implementationOutline: 'Finalize track engineering designs, secure construction tenders, construct dedicated passenger platforms, and deploy electrified rolling stock.'
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Fix Transit Deserts',
    icon: 'mdi:bus-multiple',
    summary: 'Introduce a grid of high-frequency, orbital bus lanes in outer suburbs currently lacking rail connections.',
    thisTerm: true,
    keyPoints: [
      { point: 'Direct suburban connections', description: 'Orbital express buses link adjacent outer suburbs without requiring travel through the CBD.' },
      { point: 'Minimal wait times', description: 'Ten-minute service frequencies ensure reliable and flexible transit planning.' },
      { point: 'Affordable transport options', description: 'Expanding priority bus routes connects isolated areas to regional work and education.' }
    ],
    designRationale: 'High-frequency buses with dedicated lanes are the fastest, most cost-effective way to fix transit isolation. Outer suburbs cannot wait decades for rail construction.',
    systemInteraction: 'New orbital express bus routes intersect with existing hub stations, acting as feeders to the wider metropolitan rail network.',
    economicLogic: 'Relatively low capital expenditure on bus priority infrastructure yields immediate transport access, reducing household car dependency and fuel costs.',
    riskAndFailureModes: 'Risks include traffic disruption during bus lane conversion and difficulty securing road space on congested arterial routes.',
    evidenceAndPrecedent: 'Rapid bus transit networks in Brisbane and Curitiba show that dedicated lanes can achieve train-like capacity at a fraction of the cost.',
    implementationOutline: 'Map outer-suburban transit gaps, zone priority bus lanes on key roads, purchase electric bus fleets, and launch high-frequency services.'
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Fund the Outer Suburbs',
    icon: 'mdi:cash-usd',
    summary: 'Reallocate 30% of the metropolitan major-project budget directly to local infrastructure in growth areas.',
    thisTerm: false,
    keyPoints: [
      { point: 'Equitable capital allocation', description: 'Outer-growth corridors receive funding proportionate to their population growth.' },
      { point: 'Upgraded community amenities', description: 'Local neighborhoods gain immediate funding for parks, libraries, and community hubs.' },
      { point: 'Resolved infrastructure backlogs', description: 'Arterial roads, drainage, and footpaths are upgraded alongside housing rollouts.' }
    ],
    designRationale: 'Reallocating mega-project funds addresses the chronic underfunding of outer suburbs. Megaprojects in inner city areas drain state capital while growth corridors lack basic services.',
    systemInteraction: 'Reallocates funds from low-yield tollway projects into a growth-areas municipal infrastructure grant program managed by local councils.',
    economicLogic: 'Investing in basic suburban infrastructure generates high local utility, reducing spatial inequality and enhancing community productivity.',
    riskAndFailureModes: 'Risks include delay or cancellation of inner-metropolitan projects and the capacity of local councils to execute larger capital programs.',
    evidenceAndPrecedent: 'Regional development funds that decentralize infrastructure spending consistently show higher social return on investment compared to central megaprojects.',
    implementationOutline: 'Audit the major project pipeline, legislate the 30% growth allocation rule, create local grant evaluation panels, and distribute project funds.'
  },

  // ─── PILLAR 3: RECLAIM OUR DEMOCRACY ────────────────────────────────────────

  // Category: Fix the Rorts
  {
    pillar: 'RECLAIM OUR DEMOCRACY',
    category: 'Fix the Rorts',
    title: 'Abolish Preference Deals',
    icon: 'mdi:vote',
    summary: 'Replace group voting tickets in upper house elections with direct voter-choice preference allocation.',
    thisTerm: true,
    keyPoints: [
      { point: 'Voter-controlled preferences', description: 'Voters decide exactly where their preferences go, not backroom political brokers.' },
      { point: 'End preference harvesting', description: 'Parties are prevented from using complex preference cascades to win seats with minimal votes.' },
      { point: 'True democratic representation', description: 'Elected upper house members accurately reflect the direct choices of the voters.' }
    ],
    designRationale: 'Abolishing group voting tickets is necessary to restore electoral integrity. Group voting allows micro-parties to trade preferences and win seats despite receiving less than 1% of the primary vote.',
    systemInteraction: 'Modifies the Electoral Act, replacing the "above the line" group ticket voting box with optional preferential voting instructions.',
    economicLogic: 'Ensuring representatives are elected democratically improves policy alignment with voter preferences and reduces rent-seeking by niche lobbyists.',
    riskAndFailureModes: 'Risks include an increase in informal votes if ballot paper design is confusing and a longer vote counting process.',
    evidenceAndPrecedent: 'The successful transition to optional preferential voting in Federal Senate and NSW Upper House elections has eliminated preference harvesting.',
    implementationOutline: 'Draft legislation to amend the state Electoral Act, design new clear ballot papers, launch voter education campaigns, and train polling staff.'
  },
  {
    pillar: 'RECLAIM OUR DEMOCRACY',
    category: 'Fix the Rorts',
    title: 'Ban Corporate Fundraisers',
    icon: 'mdi:bank-off',
    summary: 'Prohibit cash-for-access political fundraisers and corporate lobbying events.',
    thisTerm: true,
    keyPoints: [
      { point: 'Equal civic access', description: 'Access to lawmakers is determined by citizenship and public interest, not financial contribution.' },
      { point: 'Dismantled donor influence', description: 'Banning corporate entry fees prevents wealthy donors from buying policy outcomes.' },
      { point: 'Restored trust in parliament', description: 'Removing private cash from political access restores transparency to decision-making.' }
    ],
    designRationale: 'Access to lawmakers must not be a marketable commodity. Corporate fundraisers create systemic bias, giving paying interest groups private access denied to ordinary citizens.',
    systemInteraction: 'Enforced by the state electoral commission, creating strict penalties for parties, candidates, or entities hosting paid access events.',
    economicLogic: 'Reducing the role of campaign money decreases the power of special interest groups to secure tax breaks, subsidies, or regulatory exemptions.',
    riskAndFailureModes: 'Risks include political parties finding loopholes through private club memberships and a decrease in legitimate political fundraising.',
    evidenceAndPrecedent: 'Jurisdictions with strict bans on paid political access show higher levels of public trust and less distortion in public contracting.',
    implementationOutline: 'Define "paid access event" in legislation, introduce strict disclosure audits, establish penalty frameworks, and mandate public registers for all minister meetings.'
  },
  {
    pillar: 'RECLAIM OUR DEMOCRACY',
    category: 'Fix the Rorts',
    title: 'Count Your Volunteer Hours',
    icon: 'mdi:clock-check',
    summary: 'Enact legislation requiring political parties to publish all volunteer hours and campaign contributions in real time.',
    thisTerm: true,
    keyPoints: [
      { point: 'Transparent campaign support', description: 'The public can see the true scale of grassroots support compared to corporate backing.' },
      { point: 'Real-time logging', description: 'Parties are required to log volunteer hours, preventing shadow staffing by corporate interests.' },
      { point: 'Grassroots democracy visibility', description: 'Valuing civic participation by measuring volunteer hours alongside financial funding.' }
    ],
    designRationale: 'Campaign activity must be fully transparent to prevent evasion of donation limits. Requiring real-time tracking of labor hours prevents companies from offering undeclared in-kind staffing.',
    systemInteraction: 'Integrates with a centralized electoral commission portal where campaigns must log volunteer shifts and financial contributions within 48 hours.',
    economicLogic: 'Transparency in campaign inputs lowers the risk of hidden influence and level-plays the campaign field for grassroots organizations.',
    riskAndFailureModes: 'Risks include compliance burdens on small, volunteer-run campaigns and difficulty verifying individual logged hours.',
    evidenceAndPrecedent: 'Real-time disclosure models in international electoral frameworks have successfully exposed astroturfing and shadow campaign spending.',
    implementationOutline: 'Develop the electoral volunteer logging portal, train party treasurers, pass real-time disclosure laws, and establish compliance audit teams.'
  },

  // Category: Power to People
  {
    pillar: 'RECLAIM OUR DEMOCRACY',
    category: 'Power to People',
    title: 'Citizens in Every Room',
    icon: 'mdi:account-group',
    summary: 'Convene citizen assemblies selected by democratic sortition to review all major legislative proposals.',
    thisTerm: true,
    keyPoints: [
      { point: 'Deliberative policy review', description: 'Representative panels of everyday citizens thoroughly examine complex proposed laws.' },
      { point: 'Non-partisan consensus building', description: 'Assemblies focus on common-sense, evidence-based policy rather than party conflict.' },
      { point: 'Deepened democratic legitimacy', description: 'Giving ordinary citizens a formal, constitutional voice in the legislative process.' }
    ],
    designRationale: 'Sortition (random selection) ensures assemblies represent the actual demographics of Victoria, bypassing partisan bias. Everyday citizens are highly capable of evaluating policy when given time, resources, and expert evidence.',
    systemInteraction: 'Convened assemblies present recommendations to parliament, which must respond formally or hold a debate on the recommendations.',
    economicLogic: 'Policies reviewed by citizens are less susceptible to special-interest lobbying, leading to more rational public spending and long-term regulatory choices.',
    riskAndFailureModes: 'Risks include assembly capture by biased facilitators and potential public disengagement if recommendations are ignored by parliament.',
    evidenceAndPrecedent: 'Citizens Assemblies in Ireland and France have broken long-term legislative deadlocks on contentious issues with high public consensus.',
    implementationOutline: 'Establish the Citizens Assembly Agency, design the sortition selection algorithm, define trigger legislation rules, and fund assembly sessions.'
  },
  {
    pillar: 'RECLAIM OUR DEMOCRACY',
    category: 'Power to People',
    title: 'Communities Set Policy',
    icon: 'mdi:forum',
    summary: 'Devolve regional development and planning budgets to local community boards using participatory budgeting.',
    thisTerm: false,
    keyPoints: [
      { point: 'Direct citizen budget control', description: 'Residents vote directly on how municipal capital funds are spent in their communities.' },
      { point: 'Tailored local investments', description: 'Budgets are targeted to the specific, practical needs identified by local residents.' },
      { point: 'Strengthened civic engagement', description: 'Voters participate actively in community building, increasing trust in local structures.' }
    ],
    designRationale: 'Local communities understand their infrastructure gaps better than centralized departments. Participatory budgeting builds civic capacity and eliminates top-down planning errors.',
    systemInteraction: 'Community boards receive a statutory allocation of the state planning budget, administering local voting systems to select projects for delivery.',
    economicLogic: 'Direct local selection increases the efficiency of capital spending, ensuring projects match actual user demand rather than political targets.',
    riskAndFailureModes: 'Risks include low turnout in local budget voting and potential capture of boards by vocal special interest groups.',
    evidenceAndPrecedent: 'Participatory budgeting in Porto Alegre and Paris has demonstrated highly efficient capital allocation and high public satisfaction.',
    implementationOutline: 'Draft regional budget devolution legislation, set up digital voting portals, establish local community boards, and allocate pilot funds.'
  },
  {
    pillar: 'RECLAIM OUR DEMOCRACY',
    category: 'Power to People',
    title: 'Nothing Without the People',
    icon: 'mdi:account-voice',
    summary: 'Establish a constitutional right to citizen-initiated referendums for key constitutional and state changes.',
    thisTerm: false,
    keyPoints: [
      { point: 'Direct popular veto power', description: 'Citizens can place legislation passed by parliament directly to a public vote.' },
      { point: 'Public policy initiation', description: 'Voters can draft and vote on key reforms if a petition threshold is reached.' },
      { point: 'Strong check on government', description: 'Elected officials are held accountable to public consensus between election cycles.' }
    ],
    designRationale: 'A citizen-initiated veto is the ultimate check on legislative overreach. It ensures that major changes (e.g., selling public assets, changing voting rules) require the explicit consent of the public.',
    systemInteraction: 'Constitutes a legal mechanism where a petition signed by 5% of registered voters triggers a binding state referendum on the proposed question.',
    economicLogic: 'Ensuring key reforms require public votes acts as a barrier to rent-seeking and prevents government from enacting unpopular, donor-favoured laws.',
    riskAndFailureModes: 'Risks include corporate funding of petition campaigns to advance commercial interests and voter fatigue from frequent referendums.',
    evidenceAndPrecedent: 'Switzerland’s direct democracy system demonstrates how citizen-initiated referendums create highly stable, consensus-driven governance.',
    implementationOutline: 'Legislate petition verification standards, draft the referendum process rules, establish ballot design templates, and enshrine the right in the state constitution.'
  }
]

async function importPolicies() {
  console.log('🚀 Starting import of 21 new policies to Sanity...\n')

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
      thisTerm: policy.thisTerm,
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
        console.log(`✏️  Patched:  [${policy.thisTerm ? 'Term' : 'Vision'}] ${policy.pillar} → ${policy.title}`)
        patched++
      } else {
        await client.create(doc)
        console.log(`✅ Created: [${policy.thisTerm ? 'Term' : 'Vision'}] ${policy.pillar} → ${policy.title}`)
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
}

importPolicies()
