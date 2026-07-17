import { describe, it, expect, vi } from 'vitest'

// Mock virtual:astro-icon module
vi.mock('virtual:astro-icon', () => {
  return {
    default: {
      local: {
        icons: {
          'my-local-icon': {},
        },
      },
      mdi: {
        prefix: 'mdi',
        icons: {
          'hand-heart': {},
          'book-open': {},
        },
      },
    },
  }
})

import { checkIconExists } from './iconValidator'

describe('iconValidator', () => {
  it('should return true for valid local icons', () => {
    expect(checkIconExists('my-local-icon')).toBe(true)
  })

  it('should return false for invalid local icons', () => {
    expect(checkIconExists('non-existent-local')).toBe(false)
  })

  it('should return true for valid collection icons', () => {
    expect(checkIconExists('mdi:hand-heart')).toBe(true)
  })

  it('should return false for invalid collection icons', () => {
    expect(checkIconExists('mdi:car-parking')).toBe(false)
  })

  it('should return false for non-existent collections', () => {
    expect(checkIconExists('invalid-set:icon')).toBe(false)
  })

  it('should handle invalid inputs gracefully', () => {
    expect(checkIconExists('')).toBe(false)
    expect(checkIconExists(null as any)).toBe(false)
    expect(checkIconExists(undefined as any)).toBe(false)
  })
})
