import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve('.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return
    const i = t.indexOf('=')
    if (i > 0) {
      const k = t.substring(0,i).trim()
      const v = t.substring(i+1).trim().replace(/^['"]|['"]$/g,'')
      if (k && !process.env[k]) process.env[k] = v
    }
  })
}

const client = createClient({
  projectId: 'qwl3f8jb', dataset: 'production', useCdn: false,
  apiVersion: '2024-11-13', token: process.env.SANITY_WRITE_TOKEN,
})

const id = 'policy-finish-the-network'
const doc = await client.getDocument(id)

const systemInteraction = doc.systemInteraction.replace(
  'City Loop reconfiguration is an operating pattern change requiring signalling and platform allocation work but not new tunnelling, using infrastructure that already exists.',
  'City Loop reconfiguration is primarily an operating pattern change requiring signalling and platform allocation work, but it also requires minor new tunnelling to physically connect sections of the loop that are not currently linked for through-running. Most of the infrastructure already exists; completing the loop does not.'
)

const implementationOutline = doc.implementationOutline.replace(
  'given it requires operational reconfiguration rather than new construction',
  'given it requires mostly operational reconfiguration plus minor connector tunnelling, not a new heavy rail corridor'
)

const economicLogic = doc.economicLogic.replace(
  'SRL West is the exception requiring new capital, but is scoped specifically to growth corridors with no existing rail alternative, rather than duplicating capacity on an already-served corridor, maximising the population gaining new access per dollar spent.',
  'SRL West requires the most new capital by far, a genuinely new heavy rail corridor, but is scoped specifically to growth corridors with no existing rail alternative, rather than duplicating capacity on an already-served corridor, maximising the population gaining new access per dollar spent. City Loop reconfiguration needs some new capital too, for the connector tunnelling that completes the loop, but at a fraction of SRL West\'s cost because it finishes existing infrastructure rather than building a new corridor from scratch.'
)

const riskAndFailureModes = doc.riskAndFailureModes.replace(
  'City Loop reconfiguration carries operational transition risk during the changeover period and requires careful platform/signalling sequencing;',
  'City Loop reconfiguration carries construction risk from the connector tunnelling itself, plus operational transition risk during the changeover period and careful platform/signalling sequencing;'
)

await client.patch(id).set({ systemInteraction, implementationOutline, economicLogic, riskAndFailureModes }).commit()
console.log('✅ Corrected City Loop tunnelling claims on', id)
