import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Basic Info', default: true},
    {name: 'campaign', title: 'Campaign Voice'},
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
        list: ['RECLAIM OUR ECONOMY', 'RECLAIM OUR INFRASTRUCTURE', 'RECLAIM OUR DEMOCRACY'],
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
      name: 'thisTerm',
      title: 'This Term (Crossbench-Realistic)',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
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

    // Campaign Voice Group
    defineField({
      name: 'hook',
      title: 'Populist Hook',
      type: 'text',
      rows: 2,
      group: 'campaign',
      description:
        'The one-sentence accusation that frames why this policy exists. Make it visceral and specific. E.g. "CityLink rakes in $2M every single day from Victorian commuters — none of it comes back to you."',
    }),
    defineField({
      name: 'villain',
      title: 'Villain Framing',
      type: 'text',
      rows: 3,
      group: 'campaign',
      description:
        'Who or what is doing the stealing, and how. Name the mechanism. E.g. "Transurban holds a government-granted toll monopoly until 2045. They set the price. You pay it. The profit goes to shareholders."',
    }),
    defineField({
      name: 'proofStat',
      title: 'Proof Statistic',
      type: 'object',
      group: 'campaign',
      description: 'A single concrete number that proves the problem is real.',
      fields: [
        defineField({
          name: 'number',
          title: 'The Number',
          type: 'string',
          description: 'E.g. "$2M/day", "42 years", "$199B"',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'label',
          title: 'What It Means',
          type: 'string',
          description: 'E.g. "flowing to Transurban daily", "locked into a private lottery deal"',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'source',
          title: 'Source',
          type: 'string',
          description: 'Attribution for the stat. E.g. "Victorian Budget 2026-27"',
        }),
      ],
    }),
    defineField({
      name: 'shareableQuote',
      title: 'Shareable Quote',
      type: 'text',
      rows: 2,
      group: 'campaign',
      description:
        'A punchy pull-quote suitable for social sharing. This appears as a highlighted callout on the policy page.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 2,
      group: 'campaign',
      description:
        'Custom meta description (155 chars max). If blank, the summary is used. Lead with the problem and the fix.',
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
