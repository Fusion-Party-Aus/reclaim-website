import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this navigation configuration',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainNav',
      title: 'Main Navigation Items',
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
              name: 'href',
              title: 'URL/Path',
              type: 'string',
              description: 'Leave empty if this item has dropdown children',
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Order in which this item appears (lower numbers first)',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'highlight',
              title: 'Highlight as CTA',
              type: 'boolean',
              description: 'Show this link as a button instead of regular nav link',
              initialValue: false,
            },
            {
              name: 'children',
              title: 'Dropdown Items',
              type: 'array',
              description: 'Add items here to create a dropdown menu',
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
                      name: 'href',
                      title: 'URL/Path',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                      description: 'Optional description shown in dropdown',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      subtitle: 'href',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
              order: 'order',
            },
            prepare({title, subtitle, order}) {
              return {
                title: `${order}. ${title}`,
                subtitle: subtitle,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      description: 'The main call-to-action button in the navigation',
      fields: [
        {
          name: 'label',
          title: 'Button Label',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'href',
          title: 'Button URL',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'style',
          title: 'Button Style',
          type: 'string',
          options: {
            list: [
              {title: 'Primary (Magenta)', value: 'primary'},
              {title: 'Secondary (Mint)', value: 'secondary'},
              {title: 'Yellow', value: 'yellow'},
            ],
          },
          initialValue: 'primary',
        },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo Settings',
      type: 'object',
      fields: [
        {
          name: 'mainText',
          title: 'Main Text (FUSION)',
          type: 'string',
          initialValue: 'FUSION',
        },
        {
          name: 'subText',
          title: 'Sub Text (VICTORIA)',
          type: 'string',
          initialValue: 'VICTORIA',
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
