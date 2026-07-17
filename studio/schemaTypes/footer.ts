import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this footer configuration',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'object',
      fields: [
        {
          name: 'mainText',
          title: 'Main Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subText',
          title: 'Sub Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              description: 'e.g., Instagram, Facebook, YouTube, etc.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'MDI icon name (e.g., mdi:instagram)',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'ariaLabel',
              title: 'Aria Label',
              type: 'string',
              description: 'Accessibility label for screen readers',
            },
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'resourceLinksLabel',
      title: 'Resource Links Column Label',
      type: 'string',
      initialValue: 'Governance',
    }),
    defineField({
      name: 'resourceLinks',
      title: 'Resource Links',
      type: 'array',
      description: 'Links to Reignite Democracy resources',
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
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'banner',
      title: 'Banner',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Banner Text (left, magenta strip)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subtext',
          title: 'Banner Subtext (right, yellow)',
          type: 'string',
          description:
            'e.g. "Funded by members & small donors only. That\'s why we answer to you."',
        },
        {
          name: 'rotation',
          title: 'Rotation (degrees)',
          type: 'number',
          description: 'Rotation angle in degrees (e.g., -2 for slight left tilt)',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'string',
      description:
        'Short line under the logo block, e.g. "Taking Back What They Stole. No corporate donations. Ever."',
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter Signup Card',
      type: 'object',
      fields: [
        {name: 'heading', title: 'Heading', type: 'string'},
        {name: 'description', title: 'Description', type: 'text', rows: 2},
        {name: 'buttonText', title: 'Button Text', type: 'string'},
      ],
    }),
    defineField({
      name: 'navColumns',
      title: 'Navigation Columns',
      description:
        'The link columns on the right of the footer. The "Candidates" column will automatically list current electorates after these links.',
      type: 'array',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'badgeLabel',
              title: 'Column Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'badgeVariant',
              title: 'Badge Colour',
              type: 'string',
              options: {
                list: [
                  {title: 'Mint', value: 'mint'},
                  {title: 'Yellow', value: 'yellow'},
                  {title: 'White', value: 'white'},
                  {title: 'Magenta', value: 'magenta'},
                ],
              },
              initialValue: 'mint',
            },
            {
              name: 'showElectorates',
              title: 'Auto-list current electorates after these links',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'links',
              title: 'Links',
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
                    {
                      name: 'url',
                      title: 'URL',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'external',
                      title: 'Opens in new tab',
                      type: 'boolean',
                      initialValue: false,
                    },
                  ],
                  preview: {select: {title: 'label', subtitle: 'url'}},
                },
              ],
            },
          ],
          preview: {select: {title: 'badgeLabel'}},
        },
      ],
    }),
    defineField({
      name: 'donateCta',
      title: 'Donate Button',
      type: 'object',
      fields: [
        {name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Donate Now'},
        {name: 'url', title: 'URL', type: 'url'},
      ],
    }),
    defineField({
      name: 'authorization',
      title: 'Authorization Text',
      type: 'string',
      description: 'Legal authorization text for political material',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description:
        'e.g. "2024-2026 Fusion Party Victoria - Reignite Democracy. All rights reserved."',
      initialValue: '2024-2026 Fusion Party Victoria - Reignite Democracy. All rights reserved.',
    }),
    defineField({
      name: 'networkBranding',
      title: 'Network Branding',
      description: 'The "Part of..." section at the bottom',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Text',
          type: 'string',
          initialValue: 'Fusion: Science, Pirate, Secular, Climate Emergency',
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
          initialValue: 'https://www.fusionparty.org.au',
        }),
      ],
    }),
  ],
})
