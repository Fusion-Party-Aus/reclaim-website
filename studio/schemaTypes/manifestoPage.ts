import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'manifestoPage',
  title: 'Manifesto Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Victoria Belongs To Victorians',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image Path',
      type: 'string',
      description: 'Path under /public, e.g. /color_panel_rally.jpg',
      initialValue: '/color_panel_rally.jpg',
    }),

    defineField({
      name: 'lede',
      title: 'Opening Statement',
      type: 'object',
      description: 'The scannable stat block right below the hero.',
      fields: [
        {name: 'badge', title: 'Badge Label', type: 'string'},
        {name: 'body', title: 'Body', type: 'text', rows: 4, validation: (Rule) => Rule.required()},
        {
          name: 'stats',
          title: 'Stat Strip',
          type: 'array',
          description: 'Up to 4 key numbers shown as a scannable stat strip.',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'variant',
                  title: 'Colour',
                  type: 'string',
                  options: {
                    list: [
                      {value: 'magenta'},
                      {value: 'mint'},
                      {value: 'yellow'},
                      {value: 'lavender'},
                    ],
                  },
                  initialValue: 'magenta',
                },
              ],
              preview: {select: {title: 'value', subtitle: 'label'}},
            },
          ],
          validation: (Rule) => Rule.max(4),
        },
        {name: 'footnote', title: 'Footnote', type: 'text', rows: 3},
      ],
    }),

    defineField({
      name: 'lieBlock',
      title: 'The Lie Pull-Quote',
      type: 'object',
      fields: [
        {name: 'eyebrow', title: 'Eyebrow', type: 'string'},
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {name: 'body', title: 'Body', type: 'text', rows: 4},
      ],
    }),

    defineField({
      name: 'promises',
      title: "What We're Actually Going To Do",
      type: 'array',
      description: 'Scannable promise cards — icon, short headline, 2-3 line body.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'MDI Icon',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Headline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'body',
              title: 'Body (keep to 2-3 sentences)',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        },
      ],
    }),

    defineField({
      name: 'whyNobody',
      title: 'Why Nobody Else Will Do This',
      type: 'object',
      fields: [
        {
          name: 'badge',
          title: 'Badge Label',
          type: 'string',
          initialValue: 'Why Nobody Else Will Do This',
        },
        {name: 'body', title: 'Body', type: 'text', rows: 4},
      ],
    }),

    defineField({
      name: 'notPromising',
      title: "What We're Not Promising",
      type: 'object',
      fields: [
        {name: 'intro', title: 'Intro', type: 'text', rows: 2},
        {
          name: 'items',
          title: 'Honesty Tiles',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'icon', title: 'MDI Icon', type: 'string'},
                {name: 'text', title: 'Text', type: 'text', rows: 3},
              ],
              preview: {select: {title: 'text'}},
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'oneSeat',
      title: 'One Seat Can Start This',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'One Seat Can Start This',
        },
        {name: 'body', title: 'Body', type: 'text', rows: 3},
      ],
    }),

    defineField({
      name: 'closing',
      title: 'Closing Pull-Quote + CTA',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
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
