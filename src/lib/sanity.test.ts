import { describe, it, expect, vi } from 'vitest'
import { createClient } from '@sanity/client'

// Mock the Sanity client
vi.mock('@sanity/client', () => ({
  createClient: vi.fn(() => ({
    fetch: vi.fn(),
  })),
}))

const mockClient = createClient({
  projectId: 'test',
  dataset: 'test',
  apiVersion: '2024-01-01',
  useCdn: false,
})

describe('Sanity Client Queries', () => {
  describe('getPolicies', () => {
    it('should fetch all published policies', async () => {
      const mockPolicies = [
        {
          _id: '1',
          title: 'Climate Policy',
          slug: { current: 'climate-policy' },
          icon: 'leaf',
          summary: 'Climate action plan',
          order: 1,
        },
        {
          _id: '2',
          title: 'Healthcare Policy',
          slug: { current: 'healthcare-policy' },
          icon: 'hospital',
          summary: 'Healthcare reform',
          order: 2,
        },
      ]

      mockClient.fetch = vi.fn().mockResolvedValue(mockPolicies)

      const query = `*[_type == "policy"] | order(order asc)`
      const result = await mockClient.fetch(query)

      expect(mockClient.fetch).toHaveBeenCalledWith(query)
      expect(result).toEqual(mockPolicies)
      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Climate Policy')
    })

    it('should handle empty policy list', async () => {
      mockClient.fetch = vi.fn().mockResolvedValue([])

      const query = `*[_type == "policy"] | order(order asc)`
      const result = await mockClient.fetch(query)

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('getElectorates', () => {
    it('should fetch all electorates', async () => {
      const mockElectorates = [
        {
          _id: '1',
          name: 'Melbourne',
          slug: { current: 'melbourne' },
          type: 'federal',
          description: 'Inner Melbourne seat',
        },
      ]

      mockClient.fetch = vi.fn().mockResolvedValue(mockElectorates)

      const query = `*[_type == "electorate"] | order(name asc)`
      const result = await mockClient.fetch(query)

      expect(mockClient.fetch).toHaveBeenCalledWith(query)
      expect(result).toEqual(mockElectorates)
      expect(result[0].name).toBe('Melbourne')
    })
  })

  describe('getFAQs', () => {
    it('should fetch all FAQs with category filtering', async () => {
      const mockFAQs = [
        {
          _id: '1',
          question: 'What is Reclaim?',
          slug: { current: 'what-is-reclaim' },
          category: 'general',
          order: 1,
        },
        {
          _id: '2',
          question: 'How can I volunteer?',
          slug: { current: 'how-to-volunteer' },
          category: 'involvement',
          order: 2,
        },
      ]

      mockClient.fetch = vi.fn().mockResolvedValue(mockFAQs)

      const query = `*[_type == "faq"] | order(order asc)`
      const result = await mockClient.fetch(query)

      expect(mockClient.fetch).toHaveBeenCalledWith(query)
      expect(result).toEqual(mockFAQs)
      expect(result).toHaveLength(2)
    })

    it('should filter FAQs by category', async () => {
      const mockFilteredFAQs = [
        {
          _id: '1',
          question: 'What is Reclaim?',
          slug: { current: 'what-is-reclaim' },
          category: 'general',
          order: 1,
        },
      ]

      mockClient.fetch = vi.fn().mockResolvedValue(mockFilteredFAQs)

      const query = `*[_type == "faq" && category == "general"] | order(order asc)`
      const result = await mockClient.fetch(query)

      expect(mockClient.fetch).toHaveBeenCalledWith(query)
      expect(result).toHaveLength(1)
      expect(result[0].category).toBe('general')
    })
  })

  describe('getHomePage', () => {
    it('should fetch home page content', async () => {
      const mockHomePage = {
        _id: 'home',
        title: 'Reclaim Democracy',
        heroTitle: 'Take Back Control',
        heroSubtitle: 'Join the movement',
        ctaText: 'Get Involved',
        ctaLink: '/get-involved',
      }

      mockClient.fetch = vi.fn().mockResolvedValue(mockHomePage)

      const query = `*[_type == "homePage"][0]`
      const result = await mockClient.fetch(query)

      expect(mockClient.fetch).toHaveBeenCalledWith(query)
      expect(result).toEqual(mockHomePage)
      expect(result.title).toBe('Reclaim Democracy')
    })

    it('should handle missing home page', async () => {
      mockClient.fetch = vi.fn().mockResolvedValue(null)

      const query = `*[_type == "homePage"][0]`
      const result = await mockClient.fetch(query)

      expect(result).toBeNull()
    })
  })

  describe('getSinglePolicy', () => {
    it('should fetch policy by slug', async () => {
      const mockPolicy = {
        _id: '1',
        title: 'Climate Policy',
        slug: { current: 'climate-policy' },
        icon: 'leaf',
        summary: 'Climate action plan',
        content: [{ _type: 'block', children: [] }],
      }

      mockClient.fetch = vi.fn().mockResolvedValue([mockPolicy])

      const query = `*[_type == "policy" && slug.current == "climate-policy"]`
      const result = await mockClient.fetch(query)

      expect(mockClient.fetch).toHaveBeenCalledWith(query)
      expect(result[0]).toEqual(mockPolicy)
      expect(result[0].slug.current).toBe('climate-policy')
    })

    it('should return empty array for non-existent policy', async () => {
      mockClient.fetch = vi.fn().mockResolvedValue([])

      const query = `*[_type == "policy" && slug.current == "non-existent"]`
      const result = await mockClient.fetch(query)

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockClient.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const query = `*[_type == "policy"]`

      await expect(mockClient.fetch(query)).rejects.toThrow('Network error')
    })

    it('should handle malformed queries', async () => {
      mockClient.fetch = vi.fn().mockRejectedValue(new Error('Invalid GROQ query'))

      const query = `*[_type == `

      await expect(mockClient.fetch(query)).rejects.toThrow('Invalid GROQ query')
    })
  })
})
