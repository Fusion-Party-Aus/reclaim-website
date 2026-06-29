import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sidebar',
  title: 'Sidebar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Sidebar Title',
      type: 'string',
      description: 'The main heading for this sidebar',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Unique identifier for this sidebar (e.g., "policy-sidebar")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sidebar Sections',
      type: 'array',
      description: 'Add different types of sections to your sidebar',
      of: [
        {
          type: 'object',
          name: 'linksSection',
          title: 'Links Section',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'links',
              hidden: true,
            },
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Optional heading for this section',
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
                      title: 'Link Label',
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
                      name: 'isExternal',
                      title: 'External Link',
                      type: 'boolean',
                      description: 'Opens in new tab with external icon',
                      initialValue: false,
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
              title: 'title',
              links: 'links',
            },
            prepare({title, links}) {
              return {
                title: title || 'Links Section',
                subtitle: `${links?.length || 0} links`,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'textSection',
          title: 'Text Section',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'text',
              hidden: true,
            },
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Optional heading for this section',
            },
            {
              name: 'text',
              title: 'Text Content',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              text: 'text',
            },
            prepare({title, text}) {
              return {
                title: title || 'Text Section',
                subtitle: text?.substring(0, 50) + '...',
              }
            },
          },
        },
        {
          type: 'object',
          name: 'ctaSection',
          title: 'Call-to-Action',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'cta',
              hidden: true,
            },
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Optional heading above the CTA button',
            },
            {
              name: 'ctaLabel',
              title: 'Button Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'ctaHref',
              title: 'Button URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'ctaStyle',
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
          preview: {
            select: {
              title: 'ctaLabel',
              style: 'ctaStyle',
            },
            prepare({title, style}) {
              return {
                title: title || 'CTA Button',
                subtitle: `Style: ${style || 'primary'}`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sections: 'sections',
    },
    prepare({title, sections}) {
      return {
        title,
        subtitle: `${sections?.length || 0} sections`,
      }
    },
  },
})
