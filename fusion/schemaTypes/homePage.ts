import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'eyebrow',
          title: 'Eyebrow Text',
          type: 'string',
          description: 'Small text above the main title (e.g. "The Progressive Coalition")',
        },
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'string',
        },
        {
          name: 'showCTA',
          title: 'Show Call to Action Buttons',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'theftSection',
      title: 'The Victorian Theft Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'cards',
          title: 'Theft Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'category',
                  title: 'Category',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  description:
                    'MDI icon name (e.g., mdi:home-city, mdi:currency-usd-off). Find icons at https://pictogrammers.com/library/mdi/',
                  placeholder: 'mdi:home-city',
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
                {
                  name: 'imageUrl',
                  title: 'Image URL (fallback)',
                  type: 'url',
                  description: 'Only used if no image is uploaded',
                },
                {
                  name: 'amount',
                  title: 'Amount/Number',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'impact',
                  title: 'Impact Statement',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'link',
                  title: 'Link URL',
                  type: 'string',
                },
                {
                  name: 'linkText',
                  title: 'Link Text',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'electoratesSection',
      title: 'Electorates Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'callToAction',
          title: 'Call to Action',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'CTA Heading',
              type: 'string',
            },
            {
              name: 'description',
              title: 'CTA Description',
              type: 'text',
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'manifestoSection',
      title: 'Manifesto Highlight Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'stats',
          title: 'Highlight Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number',
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
                  name: 'size',
                  title: 'Size',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Small', value: 'small'},
                      {title: 'Medium', value: 'medium'},
                      {title: 'Large', value: 'large'},
                    ],
                  },
                  initialValue: 'medium',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'joinSection',
      title: 'Join The Fight Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'cards',
          title: 'Action Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  description:
                    'MDI icon name (e.g., mdi:email-newsletter, mdi:hand-coin-outline). Find icons at https://pictogrammers.com/library/mdi/',
                  placeholder: 'mdi:email-newsletter',
                },
                {
                  name: 'emoji',
                  title: 'Emoji (deprecated - use Icon instead)',
                  type: 'string',
                  hidden: true,
                },
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'buttonText',
                  title: 'Button Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'buttonLink',
                  title: 'Button Link',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'buttonStyle',
                  title: 'Button Style',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                    ],
                  },
                  initialValue: 'primary',
                },
                {
                  name: 'size',
                  title: 'Card Size',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Small (1 column)', value: 'small'},
                      {title: 'Medium (2 columns)', value: 'medium'},
                      {title: 'Large (3 columns)', value: 'large'},
                    ],
                  },
                  initialValue: 'medium',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'alertBar',
      title: 'Alert Bar',
      type: 'object',
      fields: [
        {name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true},
        {name: 'text', title: 'Text', type: 'string'},
        {name: 'linkText', title: 'Link Text', type: 'string'},
        {name: 'linkUrl', title: 'Link URL', type: 'string'},
      ],
    }),
    defineField({
      name: 'movementMetrics',
      title: 'Movement Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'current', title: 'Current Value', type: 'number'},
            {name: 'goal', title: 'Goal Value', type: 'number'},
            {name: 'icon', title: 'Icon (Emoji)', type: 'string'},
            {name: 'suffix', title: 'Suffix (e.g. "electorates")', type: 'string'},
            {name: 'prefix', title: 'Prefix (e.g. "$")', type: 'string'},
            {
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Magenta', value: 'magenta'},
                  {title: 'Mint', value: 'mint'},
                  {title: 'Yellow', value: 'yellow'},
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'signupCTA',
      title: 'Signup CTA (NationBuilder Replacement)',
      type: 'object',
      fields: [
        {name: 'heading', title: 'Heading', type: 'string', initialValue: 'Join the movement'},
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          initialValue:
            'We need people like you to help us reclaim our future. Join Fusion Party today and be part of the change.',
        },
        {name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Sign Up Now'},
        {
          name: 'footerText',
          title: 'Footer Text',
          type: 'string',
          initialValue: 'You will be redirected to our official membership portal.',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
