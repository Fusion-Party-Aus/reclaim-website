import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'visionPage',
  title: 'Vision Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Our Vision',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaSection',
      title: 'Bottom CTA',
      type: 'object',
      fields: [
        {name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required()},
        {name: 'body', title: 'Body', type: 'text', rows: 2, validation: (Rule) => Rule.required()},
        {
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required()},
                {name: 'icon', title: 'MDI Icon Name', type: 'string'},
                {
                  name: 'style',
                  title: 'Style',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Magenta', value: 'magenta'},
                      {title: 'Black', value: 'black'},
                    ],
                  },
                  initialValue: 'black',
                },
              ],
              preview: {select: {title: 'label'}},
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {name: 'metaTitle', title: 'Meta Title', type: 'string'},
        {name: 'metaDescription', title: 'Meta Description', type: 'text'},
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
