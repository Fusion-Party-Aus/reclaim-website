import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policiesPage',
  title: 'Policies Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Main title of the page.',
      initialValue: 'Our Policies',
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'Intro text in the hero section.',
      initialValue: "Evidence-based solutions. We've done the maths. No bullshit.",
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 2,
      description:
        'Custom meta description for the policies index page (155 chars max). Lead with the problem and the fix.',
      initialValue:
        "Victoria is being ripped off. See Fusion Party Victoria's fully costed policy platform to fix housing, transport, tax, and democracy.",
    }),
    defineField({
      name: 'manifesto',
      title: 'Manifesto Block',
      type: 'object',
      description:
        "The angry opening statement shown above the policy grid. Tell the story of what's being taken and who's doing it.",
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'E.g. "They built the system to take from you."',
          initialValue: 'They built the system to take from you.',
        }),
        defineField({
          name: 'body',
          title: 'Body Text',
          type: 'text',
          rows: 4,
          description: 'The accusation paragraph. Be specific. Name the mechanisms.',
          initialValue:
            "For thirty years, Victoria borrowed to build infrastructure — then handed the profits to private operators while you carried the debt. Transurban collects $2M a day from your commute. A private operator just locked in 42 years of Victorian lottery revenue. Southern Cross Station's commercial income goes to a consortium. The people who built this state are subsidising the people who own it. That ends here.",
        }),
        defineField({
          name: 'punchline',
          title: 'Punchline',
          type: 'string',
          description: 'The bold closing line. E.g. "The fix is below."',
          initialValue: 'The fix is below. Fully costed. No bullshit.',
        }),
      ],
    }),
    defineField({
      name: 'proofStats',
      title: 'Proof Statistics Strip',
      type: 'array',
      description:
        'Concrete numbers shown in a stat strip below the manifesto. Use 3–4 for best impact.',
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Stat',
          fields: [
            defineField({
              name: 'number',
              title: 'The Number',
              type: 'string',
              description: 'E.g. "$2M/day", "30,000", "42 years"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'What the number means.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'MDI icon name (optional). E.g. mdi:cash-remove',
            }),
            defineField({
              name: 'variant',
              title: 'Colour',
              type: 'string',
              options: {list: ['magenta', 'mint', 'yellow']},
              initialValue: 'magenta',
            }),
          ],
          preview: {
            select: {title: 'number', subtitle: 'label'},
          },
        },
      ],
    }),
    defineField({
      name: 'introCard',
      title: 'Intro Card (Legacy)',
      type: 'object',
      description: 'Legacy field — use Manifesto Block instead.',
      fields: [
        defineField({name: 'heading', type: 'string', title: 'Main Heading'}),
        defineField({name: 'description', type: 'text', rows: 3}),
        defineField({name: 'punchline', type: 'string', title: 'Punchline'}),
      ],
    }),
    defineField({
      name: 'ctaSection',
      title: 'Bottom CTA Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          initialValue: 'These Policies Can Win',
        }),
        defineField({
          name: 'body',
          type: 'text',
          initialValue: "But only if we build a movement that can't be ignored. Join us.",
        }),
      ],
    }),
  ],
})
