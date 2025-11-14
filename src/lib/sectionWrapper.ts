/**
 * Post-process rendered HTML to wrap h2 sections in brutal boxes
 */
export function wrapSectionsInBoxes(html: string): string {
  // Split content by h2 tags, preserving attributes including IDs
  const h2Regex = /<h2([^>]*)>(.*?)<\/h2>/gi
  const parts: string[] = []
  const matches: Array<{ attrs: string; content: string }> = []

  let lastIndex = 0
  let match

  while ((match = h2Regex.exec(html)) !== null) {
    // Add content before this h2
    parts.push(html.substring(lastIndex, match.index))

    // Store h2 attributes and content
    matches.push({
      attrs: match[1],
      content: match[2],
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining content
  parts.push(html.substring(lastIndex))

  let result = ''

  // First part is content before any h2 (if any)
  if (parts[0].trim()) {
    result += parts[0]
  }

  // Process each h2 section
  for (let i = 0; i < matches.length; i++) {
    const h2Match = matches[i]
    const sectionContent = parts[i + 1] || ''

    // Find the next h2 to know where this section ends
    const nextH2Index = sectionContent.search(/<h2[^>]*>/i)
    let thisSection = sectionContent

    if (nextH2Index !== -1) {
      thisSection = sectionContent.substring(0, nextH2Index)
    }

    // Wrap in brutal box, preserving the ID attribute
    result += `
      <div class="brutal-section mb-8">
        <h2 class="brutal-section-header"${h2Match.attrs}>${h2Match.content}</h2>
        <div class="brutal-section-content">
          ${thisSection}
        </div>
      </div>
    `
  }

  return result
}
