import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Basic Info', default: true},
    {name: 'details', title: 'Further Detail'},
    {name: 'meta', title: 'Metadata'},
  ],
  fields: [
    // Basic Info Group
    defineField({
      name: 'pillar',
      title: 'Pillar',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          'RECLAIM OUR ECONOMY',
          'SOLVE THE HOUSING CRISIS',
          'FIX THE TAX EXPLOITS',
          'RECLAIM OUR FUTURE',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      description: 'Sub-category within the pillar (e.g., "Restore the Fair Go")',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
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
      group: 'basic',
      description:
        'MDI icon name (e.g., mdi:home-city, mdi:train, mdi:hospital-box). Find icons at https://pictogrammers.com/library/mdi/',
      placeholder: 'mdi:home-city',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      group: 'basic',
      rows: 4,
      description:
        'The main introductory statement for this policy (e.g., "Every Australian will receive a Citizens Dividend...")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      group: 'basic',
      description: 'List of key benefits/outcomes of this policy',
      of: [
        {
          type: 'object',
          name: 'keyPoint',
          title: 'Key Point',
          fields: [
            defineField({
              name: 'point',
              title: 'Point',
              type: 'string',
              description: 'Brief title of the key point',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Detailed explanation of this key point',
            }),
          ],
          preview: {
            select: {
              title: 'point',
              subtitle: 'description',
            },
          },
        },
      ],
    }),

    // Further Detail Group
    defineField({
      name: 'designRationale',
      title: 'Design Rationale',
      type: 'text',
      group: 'details',
      rows: 6,
      description: 'Why this policy design was selected over alternatives',
    }),
    defineField({
      name: 'systemInteraction',
      title: 'System Interaction',
      type: 'text',
      group: 'details',
      rows: 6,
      description: 'How this policy interacts with existing systems (welfare, tax, etc.)',
    }),
    defineField({
      name: 'economicLogic',
      title: 'Economic and Institutional Logic',
      type: 'text',
      group: 'details',
      rows: 6,
      description: 'The economic rationale and institutional mechanisms',
    }),
    defineField({
      name: 'riskAndFailureModes',
      title: 'Risk and Failure Modes',
      type: 'text',
      group: 'details',
      rows: 6,
      description: 'Key risks and indicators of underperformance',
    }),
    defineField({
      name: 'evidenceAndPrecedent',
      title: 'Evidence and Precedent',
      type: 'text',
      group: 'details',
      rows: 6,
      description: 'Relevant evidence, trials, and precedents from other jurisdictions',
    }),
    defineField({
      name: 'implementationOutline',
      title: 'Implementation Outline',
      type: 'text',
      group: 'details',
      rows: 6,
      description: 'High-level implementation sequence and dependencies',
    }),

    // Metadata Group
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      group: 'meta',
      description: 'Estimated cost of the policy',
    }),
    defineField({
      name: 'funding',
      title: 'Funding',
      type: 'string',
      group: 'meta',
      description: 'How the policy will be funded',
    }),
    defineField({
      name: 'body',
      title: 'Additional Content',
      type: 'array',
      group: 'meta',
      description: 'Optional additional content (images, tables, etc.)',
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
      group: 'meta',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pillar: 'pillar',
      category: 'category',
    },
    prepare(selection) {
      const {title, pillar, category} = selection
      return {
        title: title,
        subtitle: category ? `${pillar} → ${category}` : pillar,
      }
    },
  },
})
