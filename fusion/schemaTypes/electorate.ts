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
      name: 'isArchived',
      title: 'Archive Page',
      type: 'boolean',
      description:
        'Hide this page from public navigation and main lists (useful for past candidates)',
      initialValue: false,
    }),
    defineField({
      name: 'electionGrouping',
      title: 'Election Grouping',
      type: 'string',
      description:
        'e.g. "2026 Victoria State Election" - Used to group archived candidates together. If left blank, it defaults to "Historical".',
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'string',
      options: {
        list: [
          {title: 'Lower House (Legislative Assembly)', value: 'lower'},
          {title: 'Upper House (Legislative Council)', value: 'upper'},
        ],
      },
      initialValue: 'lower',
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
      name: 'htv',
      title: 'How To Vote (HTV) Ticket',
      description: 'Add competing candidates to generate a How To Vote ticket.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'candidateName',
              title: 'Candidate Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'candidateParty',
              title: 'Candidate Party',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'candidateTier',
              title: 'Alignment Tier',
              type: 'string',
              options: {
                list: [
                  {title: 'Magenta Light (Fusion Candidate)', value: 'magenta'},
                  {title: 'Green Light (Strong Alignment)', value: 'green'},
                  {title: 'Orange Light (Mixed Alignment / Caution)', value: 'orange'},
                  {title: 'Red Light (Opposed)', value: 'red'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'ballotOrder',
              title: 'Ballot Order',
              type: 'number',
              description:
                'The physical order (1, 2, 3...) this candidate appears on the ballot paper. (We will group them by tier on the HTV card, rather than numbering them).',
            },
            {
              name: 'suggestedVote',
              title: 'Suggested Vote Number',
              type: 'number',
              description:
                'The explicit number to write in the box for this candidate. If provided, this will be displayed inside the ballot box graphic on the HTV guide.',
            },
          ],
          preview: {
            select: {
              title: 'candidateName',
              party: 'candidateParty',
              tier: 'candidateTier',
              order: 'ballotOrder',
              vote: 'suggestedVote',
            },
            prepare(selection: any) {
              const {title, party, tier, order, vote} = selection
              const emoji =
                tier === 'magenta'
                  ? '🟣'
                  : tier === 'green'
                    ? '🟢'
                    : tier === 'orange'
                      ? '🟠'
                      : '🔴'
              const orderPrefix = order ? `${order}. ` : ''
              const voteSuffix = vote ? ` [Vote: ${vote}]` : ''
              return {
                title: `${orderPrefix}${title}${voteSuffix}`,
                subtitle: `${emoji} ${party}`,
              }
            },
          },
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
