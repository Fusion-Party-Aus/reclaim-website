import { describe, expect, it } from 'vitest'
import { sharedBranchBaseContent } from './shared-branch-base.mjs'

describe('National policy area photograph records', () => {
  it('supplies three immutable credited photographs from approved HTTPS hosts', () => {
    expect(sharedBranchBaseContent.policyAreas).toHaveLength(3)
    const sources = new Set()
    for (const area of sharedBranchBaseContent.policyAreas) {
      expect(area.photography).toBeDefined()
      const photo = area.photography
      expect(Object.isFrozen(photo)).toBe(true)
      expect(photo.alt.trim().length).toBeGreaterThan(0)
      expect(photo.photographer.trim().length).toBeGreaterThan(0)
      const src = new URL(photo.src)
      expect(src.origin).toBe('https://images.unsplash.com')
      expect(src.pathname).toMatch(/^\/photo-[\w-]+$/)
      expect(src.username + src.password + src.hash).toBe('')
      const credit = new URL(photo.creditUrl)
      expect(credit.origin).toBe('https://unsplash.com')
      expect(credit.pathname).toMatch(/^\/photos\/[^/]+$/)
      expect(credit.username + credit.password + credit.search + credit.hash).toBe('')
      sources.add(src.pathname)
      expect(() => {
        photo.src = 'https://attacker.example'
      }).toThrow()
    }
    expect(sources.size).toBe(3)
  })
})
