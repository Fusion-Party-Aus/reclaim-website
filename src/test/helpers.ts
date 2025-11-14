/**
 * Test Helpers
 *
 * Utility functions and mocks for testing
 */

import { vi } from 'vitest'
import type { Policy, Electorate, FAQ, HomePage } from '../types/sanity'

/**
 * Mock Sanity Client
 */
export function mockSanityClient() {
  return {
    fetch: vi.fn(),
    listen: vi.fn(),
  }
}

/**
 * Create Mock Policy
 */
export function createMockPolicy(overrides?: Partial<Policy>): Policy {
  return {
    _id: 'test-policy-1',
    _type: 'policy',
    title: 'Test Policy',
    slug: { _type: 'slug', current: 'test-policy' },
    icon: 'mdi:home',
    summary: 'This is a test policy summary',
    keyPoints: ['Point 1', 'Point 2', 'Point 3'],
    cost: '$1 billion',
    funding: 'Tax reform',
    body: [],
    ...overrides,
  }
}

/**
 * Create Mock Electorate
 */
export function createMockElectorate(overrides?: Partial<Electorate>): Electorate {
  return {
    _id: 'test-electorate-1',
    _type: 'electorate',
    name: 'Test Electorate',
    slug: { _type: 'slug', current: 'test-electorate' },
    subtitle: 'A test electorate',
    candidateName: 'Jane Doe',
    candidateBio: 'Test candidate bio',
    commitments: [
      {
        icon: '🏠',
        title: 'Housing',
        highlight: 'Build 10,000 homes',
        details: [],
      },
    ],
    body: [],
    ...overrides,
  }
}

/**
 * Create Mock FAQ
 */
export function createMockFAQ(overrides?: Partial<FAQ>): FAQ {
  return {
    _id: 'test-faq-1',
    _type: 'faq',
    question: 'Test Question?',
    answer: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Test answer' }],
      },
    ],
    category: 'General',
    order: 1,
    slug: { _type: 'slug', current: 'test-question' },
    tags: ['test'],
    ...overrides,
  }
}

/**
 * Create Mock Home Page
 */
export function createMockHomePage(overrides?: Partial<HomePage>): HomePage {
  return {
    _id: 'home-page-1',
    _type: 'homePage',
    title: 'Home',
    heroTitle: 'Test Hero',
    heroSubtitle: 'Test Subtitle',
    theftSection: {
      title: 'What They Stole',
      subtitle: 'Test subtitle',
      cards: [
        {
          title: 'Housing',
          description: 'Test description',
          icon: 'mdi:home',
        },
      ],
    },
    manifestoSection: {
      title: 'Our Plan',
      subtitle: 'Test subtitle',
      description: 'Test description',
      stats: [
        {
          value: '100K',
          label: 'Homes',
          icon: 'mdi:home',
        },
      ],
    },
    joinSection: {
      title: 'Join Us',
      subtitle: 'Test subtitle',
      cards: [
        {
          title: 'Volunteer',
          description: 'Test description',
          ctaText: 'Sign Up',
          ctaLink: '/volunteer',
          icon: 'mdi:hand-heart',
        },
      ],
    },
    ...overrides,
  }
}

/**
 * Create Mock Sanity Image
 */
export function createMockSanityImage() {
  return {
    _type: 'image',
    asset: {
      _ref: 'image-test-123',
      _type: 'reference',
      url: 'https://via.placeholder.com/400x300',
    },
  }
}

/**
 * Wait for async operations
 */
export async function waitFor(callback: () => void, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      try {
        callback()
        clearInterval(interval)
        resolve()
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          clearInterval(interval)
          reject(new Error('Timeout waiting for condition'))
        }
      }
    }, 50)
  })
}
