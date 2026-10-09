import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'investigationSource',
  title: 'Investigation Source',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'publisher', type: 'string'}),
    defineField({name: 'publishedOn', type: 'date'}),
    defineField({name: 'version', type: 'string'}),
    defineField({name: 'pageReference', type: 'string'}),
    defineField({name: 'documentType', type: 'string'}),
    defineField({name: 'summary', type: 'text', rows: 3}),
    defineField({name: 'limitations', type: 'text', rows: 3}),
    defineField({name: 'lastVerified', type: 'date'}),
  ],
})
