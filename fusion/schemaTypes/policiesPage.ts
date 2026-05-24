import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policiesPage',
  title: 'Policies Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Main title of the page.',
      initialValue: 'Our Policies',
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'Intro text in the hero section.',
      initialValue: 'Evidence-based solutions. Real costings. No bullshit.',
    }),
    defineField({
      name: 'introCard',
      title: 'Intro Card',
      type: 'object',
      fields: [
        defineField({name: 'heading', type: 'string', title: 'Main Heading'}),
        defineField({name: 'description', type: 'text', rows: 3}),
        defineField({name: 'punchline', type: 'string', title: 'Punchline (e.g. Taking it back)'}),
      ],
    }),
    defineField({
      name: 'ctaSection',
      title: 'Bottom CTA Section',
      type: 'object',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'body', type: 'text'}),
      ],
    }),
  ],
})
