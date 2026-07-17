import { describe, it, expect } from 'vitest'
import { renderPortableText, renderPolicyPortableText } from './portableText'
import type { PortableTextBlock } from './portableText'

describe('Portable Text Rendering', () => {
  describe('renderPortableText', () => {
    it('should render simple paragraph', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Hello world', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<p>Hello world</p>')
    })

    it('should render h2 heading with id', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'The Problem', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<h2 id="the-problem">The Problem</h2>')
    })

    it('should render h3 heading with id', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Our Solution', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<h3 id="our-solution">Our Solution</h3>')
    })

    it('should render h4 heading with id', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h4',
          children: [{ _type: 'span', text: 'Key Points', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<h4 id="key-points">Key Points</h4>')
    })

    it('should render blockquote', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'blockquote',
          children: [{ _type: 'span', text: 'Important quote', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<blockquote>Important quote</blockquote>')
    })

    it('should handle null/undefined gracefully', () => {
      expect(renderPortableText(null)).toBe('')
      expect(renderPortableText(undefined)).toBe('')
      expect(renderPortableText([])).toBe('')
    })

    it('should handle non-array input', () => {
      expect(renderPortableText('invalid' as any)).toBe('')
      expect(renderPortableText({} as any)).toBe('')
    })
  })

  describe('Mark Rendering', () => {
    it('should render strong mark', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'bold text', marks: ['strong'] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<strong>bold text</strong>')
    })

    it('should render em mark', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'italic text', marks: ['em'] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<em>italic text</em>')
    })

    it('should render code mark', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'const x = 1', marks: ['code'] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<code>const x = 1</code>')
    })

    it('should render multiple marks', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'bold italic', marks: ['strong', 'em'] }],
        },
      ]

      const result = renderPortableText(blocks)
      // Marks are applied in order: strong first, then em
      expect(result).toContain('<em>')
      expect(result).toContain('<strong>')
      expect(result).toContain('bold italic')
    })
  })

  describe('List Rendering', () => {
    it('should render bullet list', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          listItem: 'bullet',
          children: [{ _type: 'span', text: 'First item', marks: [] }],
        },
        {
          _type: 'block',
          listItem: 'bullet',
          children: [{ _type: 'span', text: 'Second item', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<ul>')
      expect(result).toContain('<li>First item</li>')
      expect(result).toContain('<li>Second item</li>')
      expect(result).toContain('</ul>')
    })

    it('should render numbered list', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          listItem: 'number',
          children: [{ _type: 'span', text: 'First item', marks: [] }],
        },
        {
          _type: 'block',
          listItem: 'number',
          children: [{ _type: 'span', text: 'Second item', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<ol>')
      expect(result).toContain('<li>First item</li>')
      expect(result).toContain('<li>Second item</li>')
      expect(result).toContain('</ol>')
    })

    it('should close list when switching to normal block', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          listItem: 'bullet',
          children: [{ _type: 'span', text: 'List item', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Paragraph', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('</ul>')
      expect(result).toContain('<p>Paragraph</p>')
    })
  })

  describe('renderPolicyPortableText', () => {
    it('should wrap "The Problem" section with white background', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'The Problem', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Description of problem', marks: [] }],
        },
      ]

      const result = renderPolicyPortableText(blocks)
      expect(result).toContain('bg-white')
      expect(result).toContain('<h2')
      expect(result).toContain('The Problem')
      expect(result).toContain('Description of problem')
    })

    it('should wrap "Our Solution" section with white background', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Our Solution', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Solution details', marks: [] }],
        },
      ]

      const result = renderPolicyPortableText(blocks)
      expect(result).toContain('bg-white')
      expect(result).toContain('Our Solution')
      expect(result).toContain('Solution details')
    })

    it('should wrap "Savings" section with yellow background', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Savings', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Financial benefits', marks: [] }],
        },
      ]

      const result = renderPolicyPortableText(blocks)
      expect(result).toContain('bg-yellow')
      expect(result).toContain('Savings')
      expect(result).toContain('Financial benefits')
    })

    it('should handle multiple sections', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'The Problem', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Problem text', marks: [] }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Our Solution', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Solution text', marks: [] }],
        },
      ]

      const result = renderPolicyPortableText(blocks)
      expect(result).toContain('The Problem')
      expect(result).toContain('Our Solution')
      expect(result).toContain('Problem text')
      expect(result).toContain('Solution text')
    })

    it('should handle null/undefined gracefully', () => {
      expect(renderPolicyPortableText(null)).toBe('')
      expect(renderPolicyPortableText(undefined)).toBe('')
      expect(renderPolicyPortableText([])).toBe('')
    })

    it('should render content before first h2 normally', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Introduction', marks: [] }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'The Problem', marks: [] }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Problem details', marks: [] }],
        },
      ]

      const result = renderPolicyPortableText(blocks)
      expect(result).toContain('Introduction')
      expect(result).toContain('The Problem')
      expect(result).toContain('Problem details')
    })
  })

  describe('Edge Cases', () => {
    it('should handle blocks without children', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toBeDefined()
    })

    it('should handle empty text', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: '', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<p></p>')
    })

    it('should skip non-block types', () => {
      const blocks: PortableTextBlock[] = [
        {
          _type: 'image',
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Text', marks: [] }],
        },
      ]

      const result = renderPortableText(blocks)
      expect(result).toContain('<p>Text</p>')
      expect(result).not.toContain('image')
    })
  })
})
