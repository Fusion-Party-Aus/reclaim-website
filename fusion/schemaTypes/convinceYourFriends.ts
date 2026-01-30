import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'convinceYourFriends',
  title: 'Convince Your Friends Page',
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
      rows: 3,
    }),
    defineField({
      name: 'whyItWorks',
      title: 'Why It Works Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'description', type: 'string'}),
            defineField({
              name: 'icon',
              type: 'string',
              description: 'Iconify identifier (e.g. mdi:check-bold)',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'templates',
      title: 'Message Templates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'id', type: 'string', title: 'Unique ID (slug-like)'}),
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'audience', type: 'string'}),
            defineField({
              name: 'channel',
              type: 'string',
              options: {
                list: [
                  {title: 'Email', value: 'email'},
                  {title: 'Text/WhatsApp', value: 'text'},
                  {title: 'Social Media', value: 'social'},
                  {title: 'LinkedIn', value: 'linkedin'},
                ],
              },
            }),
            defineField({name: 'icon', type: 'string', description: 'Iconify identifier'}),
            defineField({
              name: 'color',
              type: 'string',
              options: {
                list: [
                  {title: 'Magenta', value: 'magenta'},
                  {title: 'Mint', value: 'mint'},
                  {title: 'Yellow', value: 'yellow'},
                ],
              },
            }),
            defineField({
              name: 'subject',
              type: 'string',
              description: 'Subject line (optional, for email)',
            }),
            defineField({name: 'body', type: 'text', rows: 10}),
            defineField({name: 'tags', type: 'array', of: [{type: 'string'}]}),
          ],
        },
      ],
    }),
    defineField({
      name: 'tips',
      title: 'Tips for Impact',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'description', type: 'text'}),
            defineField({name: 'icon', type: 'string'}),
            defineField({
              name: 'color',
              type: 'string',
              options: {
                list: [
                  {title: 'Magenta', value: 'magenta'},
                  {title: 'Mint', value: 'mint'},
                  {title: 'Yellow', value: 'yellow'},
                ],
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'contrastSection',
      title: 'Contrast Section (Old vs Fusion)',
      type: 'object',
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'subtitle', type: 'text'}),
        defineField({
          name: 'oldWay',
          title: 'Old Politics Way',
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'points', type: 'array', of: [{type: 'string'}]}),
            defineField({name: 'feeling', type: 'string', title: 'Calculated Feeling'}),
          ],
        }),
        defineField({
          name: 'fusionWay',
          title: 'Fusion Party Way',
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'points', type: 'array', of: [{type: 'string'}]}),
            defineField({name: 'feeling', type: 'string', title: 'Calculated Feeling'}),
          ],
        }),
      ],
    }),
  ],
})
