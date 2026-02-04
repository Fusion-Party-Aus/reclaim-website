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
      name: 'resourceLinks',
      title: 'Resource Links',
      type: 'array',
      description: 'Links to national Fusion resources',
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
          title: 'Banner Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
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
      name: 'authorization',
      title: 'Authorization Text',
      type: 'string',
      description: 'Legal authorization text for political material',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'e.g. "2024-2025 Fusion Party Victoria. All rights reserved."',
      initialValue: '2024-2026 Fusion Party. All rights reserved.',
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
