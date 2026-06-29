import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sanityClient from '@sanity/client'

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

const projectId = 'qwl3f8jb'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_WRITE_TOKEN environment variables.')
  process.exit(1)
}

const client = sanityClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-11-13'
})

function block (text, style = 'normal') {
  return {
    _type: 'block',
    style,
    children: [
      {
        _type: 'span',
        text
      }
    ]
  }
}

async function run () {
  // ── Raze existing FAQs ──
  console.log('🚀 Razing existing FAQs from Sanity...')
  try {
    const query = '*[_type == "faq"] { _id, question }'
    const existingFaqs = await client.fetch(query)
    if (existingFaqs.length > 0) {
      console.log(`📋 Found ${existingFaqs.length} FAQs to delete.`)
      const transaction = client.transaction()
      existingFaqs.forEach(faq => {
        console.log(`🗑️  Queueing deletion for: "${faq.question}" (${faq._id})`)
        transaction.delete(faq._id)
      })
      await transaction.commit()
      console.log('✨ Existing FAQs deleted successfully!')
    } else {
      console.log('ℹ️  No existing FAQs found to delete.')
    }
  } catch (err) {
    console.error('❌ Failed to delete existing FAQs:', err.message)
    process.exit(1)
  }

  // ── Define new FAQs ──
  const faqs = [
    {
      category: 'general',
      question: 'Why is your abbreviation "Reignite Democracy"?',
      slug: 'why-is-your-abbreviation-reignite-democracy',
      order: 1,
      answer: [
        block("Two common words that describe exactly what we're trying to do. Democracy in Victoria is being quietly hollowed out through 42-year contracts signed without public scrutiny. We're here to fix that."),
        block("If someone else used those words badly, that's their problem, not a reason for us to avoid them.")
      ]
    },
    {
      category: 'general',
      question: 'Where does your money come from?',
      slug: 'where-does-your-money-come-from',
      order: 2,
      answer: [
        block("Members and small donors. No corporations. No developers. No industry groups. That's not a slogan, it's a structural commitment — we don't have the mechanisms to take corporate money even if we wanted to.")
      ]
    },
    {
      category: 'debt',
      question: "What's Victoria's actual debt situation?",
      slug: 'whats-victorias-actual-debt-situation',
      order: 1,
      answer: [
        block("$199.3 billion and rising. The debt itself isn't the scandal. The scandal is that the assets that debt paid for — stations, toll roads, land, commercial precincts — are generating income for private operators, not Victorians. We're the only party asking who's collecting the rent.")
      ]
    },
    {
      category: 'policy',
      question: 'Are your policies formally costed?',
      slug: 'are-your-policies-formally-costed',
      order: 1,
      answer: [
        block("No. We're a minor party running on member donations, not a government with treasury access. What we have is public research, cited sources, and workings you can actually check. We'd rather show you honest estimates than hide behind numbers nobody can verify. The major parties have formal costings and still blow the budget. Make of that what you will.")
      ]
    },
    {
      category: 'electoral',
      question: 'Can one upper house member actually do anything?',
      slug: 'can-one-upper-house-member-actually-do-anything',
      order: 1,
      answer: [
        block("Yes. From day one, a Fusion MP can force contract figures onto the public record via PAEC without a single vote. When Labor needs crossbench support, we extract concessions: pension smoothing, franchise audits, the car park surcharge bill. One seat with a clear agenda beats ten seats with no plan.")
      ]
    },
    {
      category: 'electoral',
      question: 'Are you a preference harvesting shell?',
      slug: 'are-you-a-preference-harvesting-shell',
      order: 2,
      answer: [
        block("No. Shell parties have no policy, no members, and no candidates who live in the electorate. We have 900+ verified members, published policies where we've done the maths, and candidates who actually live in the communities they're running in. Check our policies. Check the shells. They don't have any.")
      ]
    },
    {
      category: 'electoral',
      question: 'Why are you using the GVT system if you want to abolish it?',
      slug: 'why-are-you-using-the-gvt-system-if-you-want-to-abolish-it',
      order: 3,
      answer: [
        block("Because it exists until it doesn't. Our first vote if elected will be to abolish it. Until then, refusing to use it just hands the advantage to parties with no such principles. We're playing the game to end the game.")
      ]
    }
  ]

  console.log(`\n📋 Importing ${faqs.length} new FAQs to Sanity...`)
  for (const faq of faqs) {
    const doc = {
      _type: 'faq',
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      slug: {
        _type: 'slug',
        current: faq.slug
      }
    }

    try {
      const created = await client.create(doc)
      console.log('✅ Created FAQ:', created._id, '-', faq.question)
    } catch (err) {
      console.error('❌ Error creating FAQ:', faq.question, err.message)
      process.exit(1)
    }
  }

  console.log('✨ FAQ import complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
