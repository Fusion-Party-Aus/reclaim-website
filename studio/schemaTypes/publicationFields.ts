import {defineField} from 'sanity'
import {approvedSiteRoster} from '../../config/site-roster.mjs'
import {validOwner} from '../../src/lib/publication-rules'

/** Staged fields only: not registered in existing schemas or current production datasets.
 * Validation errors block publication; Studio can still save incomplete drafts.
 * Reference integrity and permission enforcement require the approved publishing gateway.
 */
export function publicationFields({singleton = false} = {}) {
  const isDraft = (context: {document?: {_id?: string}}) =>
    context.document?._id?.startsWith('drafts.') ?? false

  return [
    defineField({
      name: 'owner',
      title: 'Editorial owner',
      type: 'object',
      fields: [
        defineField({name: 'type', type: 'string', options: {list: ['national', 'branch']}}),
        defineField({
          name: 'branchId',
          type: 'string',
          options: {list: Object.keys(approvedSiteRoster).filter((id) => id !== 'national')},
        }),
      ],
      validation: (rule) =>
        rule.custom(
          (value, context) =>
            (isDraft(context) && value == null) ||
            validOwner(value) ||
            'Choose an explicit National or valid Branch owner.',
        ),
    }),
    defineField({
      name: 'siteIds',
      title: 'Publish on Sites',
      description:
        'Ownership does not grant visibility. Select every Site allowed to publish this document.',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: Object.keys(approvedSiteRoster).map((value) => ({title: value, value}))},
      validation: (rule) =>
        rule.custom((value, context) => {
          if (isDraft(context) && (value == null || (Array.isArray(value) && value.length === 0)))
            return true
          if (
            !Array.isArray(value) ||
            value.length === 0 ||
            new Set(value).size !== value.length ||
            !value.every((id) => typeof id === 'string' && Object.hasOwn(approvedSiteRoster, id))
          )
            return 'Select one or more unique approved Sites.'
          if (singleton && value.length !== 1) return 'This singleton must target exactly one Site.'
          return true
        }),
    }),
  ]
}
