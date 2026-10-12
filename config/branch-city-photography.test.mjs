import { describe, expect, it } from 'vitest'
import { branchCityPhotography, getBranchCityPhotography } from './branch-city-photography.mjs'

const cities = {
  nsw: 'Sydney',
  sa: 'Adelaide',
  nt: 'Darwin',
  act: 'Canberra',
  tas: 'Hobart',
  wa: 'Perth',
}
describe('explicit branch city photography', () => {
  it('provides six distinct immutable photographs mapped to the correct cities', () => {
    expect(Object.keys(branchCityPhotography).sort()).toEqual(Object.keys(cities).sort())
    const photos = new Set()
    for (const [id, city] of Object.entries(cities)) {
      const photo = getBranchCityPhotography(id)
      expect(photo).toBe(branchCityPhotography[id])
      expect(photo.city).toBe(city)
      expect(photo.alt).toContain(city)
      expect(photo.photographer.trim().length).toBeGreaterThan(0)
      expect(photo.position.trim().length).toBeGreaterThan(0)
      expect(Object.isFrozen(photo)).toBe(true)
      const image = new URL(photo.src)
      expect(image.protocol).toBe('https:')
      expect(image.hostname).toBe('images.unsplash.com')
      expect(image.pathname).toMatch(/^\/photo-[\w-]+$/)
      expect(image.username + image.password + image.hash).toBe('')
      for (const key of image.searchParams.keys())
        expect(['auto', 'fit', 'crop', 'w', 'h', 'q', 'fm', 'dpr']).toContain(key)
      const credit = new URL(photo.creditUrl)
      expect(credit.protocol).toBe('https:')
      expect(credit.hostname).toBe('unsplash.com')
      expect(credit.pathname).toMatch(/^\/photos\/[^/]+$/)
      expect(credit.username + credit.password + credit.search + credit.hash).toBe('')
      photos.add(image.pathname)
    }
    expect(photos.size).toBe(6)
    expect(Object.isFrozen(branchCityPhotography)).toBe(true)
    expect(() => {
      branchCityPhotography.nsw.city = 'Melbourne'
    }).toThrow()
  })
  it('does not activate or supply images to existing or unapproved branches', () => {
    for (const id of ['vic', 'qld', 'national', 'unknown', '', 'NSW']) {
      expect(() => getBranchCityPhotography(id)).toThrow()
    }
  })
})
