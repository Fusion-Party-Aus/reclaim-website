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
      name: 'manifesto',
      title: 'Manifesto Block',
      type: 'object',
      description: 'Opening statement shown above the vision policy grid.',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'This is what Victoria could look like.',
        }),
        defineField({
          name: 'body',
          title: 'Body Text',
          type: 'text',
          rows: 4,
          initialValue:
            'The policies on this page require more than one seat. They require a mandate. But they are fully designed, fully costed, and ready to legislate the day we have the numbers. This is the long game.',
        }),
        defineField({
          name: 'punchline',
          title: 'Punchline',
          type: 'string',
          initialValue: 'The detail is below. Every number is sourced.',
        }),
      ],
    }),
    defineField({
      name: 'proofStats',
      title: 'Proof Stats',
      type: 'array',
      description: 'Four key numbers shown in the stats strip below the manifesto.',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'number', title: 'Number', type: 'string'},
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'icon', title: 'MDI Icon', type: 'string'},
            {
              name: 'variant',
              title: 'Colour',
              type: 'string',
              options: {list: [{value: 'magenta'}, {value: 'mint'}, {value: 'yellow'}]},
            },
          ],
          preview: {select: {title: 'number', subtitle: 'label'}},
        },
      ],
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
