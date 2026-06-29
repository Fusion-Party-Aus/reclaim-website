import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'electoratesPage',
  title: 'Electorates Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'introCard',
      title: 'Intro/Target Seats Card',
      type: 'object',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'body', type: 'text'}),
        defineField({name: 'highlight', type: 'text', title: 'Highlight Text (e.g. key point)'}),
      ],
    }),
    defineField({
      name: 'ctaSection',
      title: 'Not in These Electorates? CTA',
      type: 'object',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'body', type: 'text'}),
      ],
    }),
  ],
})
