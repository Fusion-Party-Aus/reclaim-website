import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPage',
  title: 'Blog Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'THE FUSION BLOG',
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'alertBar',
      title: 'Alert Bar Text',
      type: 'string',
      description: 'Text in the yellow alert bar (optional)',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty State Text',
      type: 'string',
      description: 'Text shown when no posts are found.',
    }),
  ],
})
