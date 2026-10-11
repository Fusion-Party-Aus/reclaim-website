// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { publicationFields } from '../../studio/schemaTypes/publicationFields'

function validatorFor(fieldName: string, singleton = false) {
  const field = publicationFields({ singleton }).find((item) => item.name === fieldName)!
  let validator: ((value: unknown, context: { document?: { _id?: string } }) => unknown) | undefined
  const rule = {
    required() {
      return this
    },
    min() {
      return this
    },
    unique() {
      return this
    },
    custom(callback: typeof validator) {
      validator = callback
      return this
    },
  }

  field.validation!(rule as never)
  return validator!
}

describe('publication fields', () => {
  it('allows incomplete draft ownership and empty draft scope but rejects them for published documents', () => {
    const owner = validatorFor('owner')
    const siteIds = validatorFor('siteIds')
    const draft = { document: { _id: 'drafts.policy-1' } }
    const published = { document: { _id: 'policy-1' } }

    expect(owner(undefined, draft)).toBe(true)
    expect(siteIds([], draft)).toBe(true)
    expect(owner(undefined, published)).not.toBe(true)
    expect(siteIds([], published)).not.toBe(true)
  })

  it('keeps ownership separate from publication scope and constrains singleton scope', () => {
    const owner = validatorFor('owner')
    const regularScope = validatorFor('siteIds')
    const singletonScope = validatorFor('siteIds', true)
    const context = { document: { _id: 'policy-1' } }

    expect(owner({ type: 'national' }, context)).toBe(true)
    expect(regularScope(['qld'], context)).toBe(true)
    expect(singletonScope(['vic'], context)).toBe(true)
    expect(singletonScope(['vic', 'qld'], context)).not.toBe(true)
  })
})
