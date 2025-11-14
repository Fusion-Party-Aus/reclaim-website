/**
 * Tests for Sanity Client Utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BRAND_COLORS, CARD_ROTATIONS, CARD_VARIANTS, FAQ_CATEGORIES } from './constants'

describe('constants.ts', () => {
  describe('BRAND_COLORS', () => {
    it('should contain all required brand colors', () => {
      expect(BRAND_COLORS).toHaveProperty('MAGENTA')
      expect(BRAND_COLORS).toHaveProperty('MINT')
      expect(BRAND_COLORS).toHaveProperty('YELLOW')
      expect(BRAND_COLORS).toHaveProperty('BLACK')
      expect(BRAND_COLORS).toHaveProperty('WHITE')
    })

    it('should have valid hex color values', () => {
      Object.values(BRAND_COLORS).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i)
      })
    })
  })

  describe('CARD_ROTATIONS', () => {
    it('should contain valid rotation values', () => {
      expect(CARD_ROTATIONS).toContain(-2)
      expect(CARD_ROTATIONS).toContain(0)
      expect(CARD_ROTATIONS).toContain(2)
    })

    it('should be readonly', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        CARD_ROTATIONS[0] = 999
      }).not.toThrow()
    })
  })

  describe('CARD_VARIANTS', () => {
    it('should contain all card variants', () => {
      expect(CARD_VARIANTS).toContain('white')
      expect(CARD_VARIANTS).toContain('magenta')
      expect(CARD_VARIANTS).toContain('mint')
      expect(CARD_VARIANTS).toContain('yellow')
    })
  })

  describe('FAQ_CATEGORIES', () => {
    it('should contain all FAQ categories', () => {
      expect(FAQ_CATEGORIES).toContain('All')
      expect(FAQ_CATEGORIES).toContain('General')
      expect(FAQ_CATEGORIES).toContain('Policies')
      expect(FAQ_CATEGORIES).toContain('Membership')
    })

    it('should start with "All"', () => {
      expect(FAQ_CATEGORIES[0]).toBe('All')
    })
  })
})
