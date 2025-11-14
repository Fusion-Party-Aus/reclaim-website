import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'electorate',
  title: 'Electorate',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Electorate Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'candidateName',
      title: 'Candidate Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'candidateImage',
      title: 'Candidate Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'candidateBio',
      title: 'Candidate Bio',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'commitments',
      title: 'Commitments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'highlight',
              title: 'Highlight',
              type: 'string',
            },
            {
              name: 'details',
              title: 'Details',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'detail',
                      title: 'Detail',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
  ],
  preview: {
    select: {
      title: 'name',
      candidate: 'candidateName',
      media: 'candidateImage',
    },
    prepare(selection) {
      const {title, candidate, media} = selection
      return {
        title,
        subtitle: candidate,
        media,
      }
    },
  },
})
