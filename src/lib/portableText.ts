export interface PortableTextBlock {
  _type: string
  style?: string
  listItem?: string
  level?: number
  children?: Array<{ _type: string; text: string; marks?: string[] }>
}

/**
 * Render a child span with marks (bold, italic, etc.)
 */
function renderSpan(child: { _type: string; text: string; marks?: string[] }): string {
  let text = child.text || ''
  const marks = child.marks || []

  // Apply marks in order
  if (marks.includes('strong')) {
    text = `<strong>${text}</strong>`
  }
  if (marks.includes('em')) {
    text = `<em>${text}</em>`
  }
  if (marks.includes('code')) {
    text = `<code>${text}</code>`
  }

  return text
}

/**
 * Render Portable Text → HTML with support for marks and lists
 */
export function renderPortableText(blocks: PortableTextBlock[] | undefined | null): string {
  if (blocks == null || !Array.isArray(blocks)) return ''

  let html = ''
  let inList = false
  let currentListType: string | null = null

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    if (block._type !== 'block' || block.children == null) continue

    // Render children with marks
    const text = block.children.map(renderSpan).join('')

    // Handle list items
    if (block.listItem) {
      const listType = block.listItem === 'bullet' ? 'ul' : 'ol'

      // Start a new list if needed
      if (!inList || currentListType !== listType) {
        if (inList) {
          html += `</${currentListType}>`
        }
        html += `<${listType}>`
        inList = true
        currentListType = listType
      }

      html += `<li>${text}</li>`

      // Check if next block is not a list item, close the list
      const nextBlock = blocks[i + 1]
      if (!nextBlock || !nextBlock.listItem) {
        html += `</${currentListType}>`
        inList = false
        currentListType = null
      }
    } else {
      // Close any open list
      if (inList) {
        html += `</${currentListType}>`
        inList = false
        currentListType = null
      }

      // Handle regular blocks
      const headingId =
        block.style && ['h2', 'h3', 'h4'].includes(block.style)
          ? text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          : ''

      switch (block.style) {
        case 'h2':
          html += `<h2 id="${headingId}">${text}</h2>`
          break
        case 'h3':
          html += `<h3 id="${headingId}">${text}</h3>`
          break
        case 'h4':
          html += `<h4 id="${headingId}">${text}</h4>`
          break
        case 'blockquote':
          html += `<blockquote>${text}</blockquote>`
          break
        default:
          html += `<p>${text}</p>`
      }
    }
  }

  // Close any remaining list
  if (inList && currentListType) {
    html += `</${currentListType}>`
  }

  return html
}

/**
 * Render Portable Text blocks with special treatment for H2 sections commonly
 * used in policies like "The Problem", "Our Solution", "Savings".
 *
 * We look for h2 blocks and wrap the content that follows in styled sections
 * until the next h2.
 */
export function renderPolicyPortableText(blocks: PortableTextBlock[] | undefined | null): string {
  if (blocks == null || !Array.isArray(blocks)) return ''

  const sections: string[] = []
  let currentSectionBlocks: PortableTextBlock[] = []
  let currentTitle: string | null = null

  const flushSection = () => {
    if (currentSectionBlocks.length === 0) return

    const title = (currentTitle || '').trim()
    const innerHtml = renderPortableText(
      // drop the first block if it's the title itself
      currentSectionBlocks[0]?.style === 'h2' ? currentSectionBlocks.slice(1) : currentSectionBlocks
    )

    if (!innerHtml) {
      currentSectionBlocks = []
      currentTitle = null
      return
    }

    const baseClasses = 'border-4 border-black p-6 mb-8'
    let wrapperClass = ''

    if (/^the problem/i.test(title)) {
      wrapperClass = `bg-white ${baseClasses}`
    } else if (/^our solution/i.test(title)) {
      wrapperClass = `bg-white ${baseClasses}`
    } else if (/^savings?/i.test(title)) {
      wrapperClass = `bg-yellow ${baseClasses}`
    } else {
      // generic section
      wrapperClass = `bg-white ${baseClasses}`
    }

    sections.push(
      `<section class="${wrapperClass}">
         <h2 class="text-3xl font-black text-magenta mb-4 uppercase tracking-tight">${title}</h2>
         ${innerHtml}
       </section>`
    )

    currentSectionBlocks = []
    currentTitle = null
  }

  for (const block of blocks) {
    if (block._type === 'block' && block.style === 'h2') {
      // If we already have a section, flush it before starting a new one
      flushSection()

      const titleText = (block.children || []).map((c) => c.text).join('')
      currentTitle = titleText
      currentSectionBlocks = [block]
    } else if (currentSectionBlocks.length > 0) {
      currentSectionBlocks.push(block)
    } else {
      // Content before the first h2: just render normally
      sections.push(renderPortableText([block]))
    }
  }

  // Flush any remaining section
  flushSection()

  return sections.join('')
}
