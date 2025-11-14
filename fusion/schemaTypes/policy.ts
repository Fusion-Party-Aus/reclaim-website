import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description:
        'MDI icon name (e.g., mdi:home-city, mdi:train, mdi:hospital-box). Find icons at https://pictogrammers.com/library/mdi/',
      placeholder: 'mdi:home-city',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      description: 'Estimated cost of the policy',
    }),
    defineField({
      name: 'funding',
      title: 'Funding',
      type: 'string',
      description: 'How the policy will be funded',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
      cost: 'cost',
    },
    prepare(selection) {
      const {title, icon, cost} = selection
      return {
        title: `${icon || ''} ${title}`,
        subtitle: cost,
      }
    },
  },
})
