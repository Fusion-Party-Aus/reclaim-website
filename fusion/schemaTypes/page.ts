import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
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
      name: 'parent',
      title: 'Parent Page',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'Select the parent page to create a nested URL (e.g., about/team)',
      validation: (Rule) =>
        Rule.custom((parent, context) => {
          if (parent && parent._ref === (context.document as any)._id?.replace(/^drafts\./, '')) {
            return 'A page cannot be its own parent'
          }
          return true
        }),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'showSidebar',
      title: 'Show Sidebar',
      type: 'boolean',
      description: 'Display a table of contents sidebar based on page headings',
      initialValue: false,
    }),
    defineField({
      name: 'sidebarPosition',
      title: 'Sidebar Position',
      type: 'string',
      options: {
        list: [
          {title: 'Right', value: 'right'},
          {title: 'Left', value: 'left'},
        ],
      },
      initialValue: 'right',
      hidden: ({document}) => !document?.showSidebar,
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Bio (Profile)', value: 'bio'},
          {title: 'Landing Page (Campaign)', value: 'landing'},
        ],
      },
      initialValue: 'standard',
      group: 'content',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({document}) => document?.pageType !== 'bio',
      group: 'bio',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. Lead Candidate for Victoria',
      hidden: ({document}) => document?.pageType !== 'bio',
      group: 'bio',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  {title: 'X / Twitter', value: 'twitter'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'GitHub', value: 'github'},
                  {title: 'Website', value: 'website'},
                ],
              },
            },
            {name: 'url', type: 'url', title: 'URL'},
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
      hidden: ({document}) => document?.pageType !== 'bio',
      group: 'bio',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
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
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})
