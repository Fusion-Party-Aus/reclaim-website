import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Sanity client with write token
const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN // You'll need to get this from sanity.io/manage
})

// Helper to convert MDX array format to simple array
function convertArrayFields (data) {
  if (!data) return data

  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item.point) {
        return item.point
      }
      if (typeof item === 'object' && item.detail) {
        return item.detail
      }
      return item
    })
  }

  return data
}

// Helper to convert markdown to portable text blocks
function markdownToPortableText (markdown) {
  if (!markdown) return []

  const blocks = []
  const lines = markdown.split('\n')
  let currentBlock = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      currentBlock = null
      continue
    }

    // Headers
    if (trimmed.startsWith('## ')) {
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmed.substring(3) }]
      })
      currentBlock = null
    } else if (trimmed.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: trimmed.substring(4) }]
      })
      currentBlock = null
    } else if (trimmed.startsWith('#### ')) {
      blocks.push({
        _type: 'block',
        style: 'h4',
        children: [{ _type: 'span', text: trimmed.substring(5) }]
      })
      currentBlock = null
    }
    // List items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold for now
      blocks.push({
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text }]
      })
      currentBlock = null
    }
    // Regular paragraphs
    else {
      const text = trimmed.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold for now
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text }]
      })
      currentBlock = null
    }
  }

  return blocks
}

// Migrate policies
async function migratePolicies () {
  const policiesDir = path.join(__dirname, 'content', 'policies')

  if (!fs.existsSync(policiesDir)) {
    console.log('No policies directory found')
    return
  }

  const files = fs.readdirSync(policiesDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

  console.log(`\n📋 Migrating ${files.length} policies...`)

  for (const file of files) {
    const filePath = path.join(policiesDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const slug = file.replace(/\.(md|mdx)$/, '')

    const document = {
      _type: 'policy',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      icon: data.icon || '',
      summary: data.summary || '',
      keyPoints: convertArrayFields(data.keyPoints),
      cost: data.cost || '',
      funding: data.funding || '',
      body: markdownToPortableText(content),
      publishedAt: new Date().toISOString()
    }

    try {
      const result = await client.create(document)
      console.log(`✅ Created policy: ${data.title} (${result._id})`)
    } catch (error) {
      console.error(`❌ Error creating policy ${data.title}:`, error.message)
    }
  }
}

// Migrate electorates
async function migrateElectorates () {
  const electoratesDir = path.join(__dirname, 'content', 'electorates')

  if (!fs.existsSync(electoratesDir)) {
    console.log('No electorates directory found')
    return
  }

  const files = fs.readdirSync(electoratesDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

  console.log(`\n🗳️  Migrating ${files.length} electorates...`)

  for (const file of files) {
    const filePath = path.join(electoratesDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const slug = file.replace(/\.(md|mdx)$/, '')

    // Convert commitments structure
    const commitments = data.commitments?.map(commitment => ({
      _type: 'object',
      icon: commitment.icon || '',
      title: commitment.title || '',
      highlight: commitment.highlight || '',
      details: convertArrayFields(commitment.details) || []
    })) || []

    const document = {
      _type: 'electorate',
      name: data.name,
      slug: { _type: 'slug', current: slug },
      subtitle: data.subtitle || '',
      candidateName: data.candidateName || '',
      candidateBio: data.candidateBio || '',
      commitments,
      body: markdownToPortableText(content)
    }

    // Note: candidateImage would need to be uploaded separately to Sanity's asset system
    if (data.candidateImage) {
      console.log(`⚠️  Note: You'll need to manually upload the candidate image for ${data.name}: ${data.candidateImage}`)
    }

    try {
      const result = await client.create(document)
      console.log(`✅ Created electorate: ${data.name} (${result._id})`)
    } catch (error) {
      console.error(`❌ Error creating electorate ${data.name}:`, error.message)
    }
  }
}

// Migrate pages
async function migratePages () {
  const pagesDir = path.join(__dirname, 'content', 'pages')

  if (!fs.existsSync(pagesDir)) {
    console.log('No pages directory found')
    return
  }

  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

  if (files.length === 0) {
    console.log('\n📄 No pages to migrate')
    return
  }

  console.log(`\n📄 Migrating ${files.length} pages...`)

  for (const file of files) {
    const filePath = path.join(pagesDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const slug = file.replace(/\.(md|mdx)$/, '')

    const document = {
      _type: 'page',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      subtitle: data.subtitle || '',
      metaDescription: data.description || data.metaDescription || '',
      body: markdownToPortableText(content)
    }

    try {
      const result = await client.create(document)
      console.log(`✅ Created page: ${data.title} (${result._id})`)
    } catch (error) {
      console.error(`❌ Error creating page ${data.title}:`, error.message)
    }
  }
}

// Main migration function
async function migrate () {
  console.log('🚀 Starting Sanity migration...\n')
  console.log('Project ID: qwl3f8jb')
  console.log('Dataset: production\n')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    console.error('\nTo get a write token:')
    console.error('1. Go to https://www.sanity.io/manage')
    console.error('2. Select your project')
    console.error('3. Go to API → Tokens')
    console.error('4. Create a new token with Editor or Admin permissions')
    console.error('5. Run: SANITY_WRITE_TOKEN=your_token_here node migrate.js\n')
    process.exit(1)
  }

  try {
    await migratePolicies()
    await migrateElectorates()
    await migratePages()

    console.log('\n✨ Migration complete!')
    console.log('\nNext steps:')
    console.log('1. Visit http://localhost:3333 to view your migrated content')
    console.log('2. Manually upload any images referenced in the content')
    console.log('3. Review and edit content as needed')
    console.log('4. Update your Astro pages to use Sanity content\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()
