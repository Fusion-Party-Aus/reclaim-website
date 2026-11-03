import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'electionGuide',
  title: 'Election coverage — voting recommendation',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'electionYear', type: 'number', validation: (r) => r.required().integer()}),
    defineField({
      name: 'electorateId',
      title: 'Official electorate identifier',
      type: 'string',
      description: 'Use the stable VEC identifier, not a candidate name.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'electorateName', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'house',
      type: 'string',
      options: {
        list: [
          {title: 'Legislative Assembly district', value: 'lower'},
          {title: 'Legislative Council region', value: 'upper'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'draft',
      options: {list: ['draft', 'review', 'published', 'withdrawn']},
      description: 'Only published status plus a published Sanity document is publicly visible.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'publishedAt', type: 'datetime', validation: (r) => r.required()}),
    defineField({name: 'updatedAt', title: 'Editorial update date', type: 'datetime'}),
    defineField({name: 'summary', type: 'text'}),
    defineField({
      name: 'recommendation',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description:
        'Approved organisational recommendation. Separate documented facts and analysis, and cite sources.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'sources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'url',
              type: 'url',
              validation: (r) => r.required().uri({scheme: ['https', 'http']}),
            }),
            defineField({name: 'accessedAt', type: 'date'}),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {select: {title: 'electorateName', subtitle: 'house'}},
})
