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
    keyPoints: [{ point: 'Point 1' }, { point: 'Point 2' }, { point: 'Point 3' }],
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
    hero: { title: 'Test Hero', subtitle: 'Test Subtitle' },
    theftSection: {
      heading: 'Our policies',
      description: 'Test description',
      cards: [{ title: 'Housing', description: 'Test description', link: '/policies/housing' }],
    },
    manifestoSection: { heading: 'Our approach', description: 'Test description' },
    joinSection: {
      heading: 'Join us',
      cards: [
        {
          title: 'Volunteer',
          description: 'Test description',
          buttonText: 'Sign up',
          buttonLink: '/volunteer',
        },
      ],
    },
    ...overrides,
  }
}
