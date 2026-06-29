import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'Used for SEO and browser tab title fallback',
    }),
    defineField({
      name: 'konamiCode',
      title: 'Konami Code Popup',
      type: 'object',
      description: 'Content for the secret Konami code (↑↑↓↓←→←→BA) popup',
      fields: [
        {
          name: 'title',
          title: 'Popup Title',
          type: 'string',
          initialValue: 'You Found the Secret!',
        },
        {
          name: 'description',
          title: 'Popup Description',
          type: 'text',
          initialValue:
            "True democracy rewards the curious. Here's something special for developers, gamers, and people who actually read the code...",
        },
        {
          name: 'manifestoTitle',
          title: 'Manifesto Box Title',
          type: 'string',
          initialValue: 'ANNOTATED MANIFESTO',
        },
        {
          name: 'manifestoDescription',
          title: 'Manifesto Box Description',
          type: 'text',
          initialValue:
            'Full manifesto with policy team annotations, research citations, and implementation roadmap. This is the behind-the-scenes version we use internally.',
        },
        {
          name: 'githubUrl',
          title: 'GitHub URL',
          type: 'url',
          initialValue: 'https://github.com/Fusion-Party-Aus/reclaim-website-poc',
        },
        {
          name: 'githubLabel',
          title: 'GitHub Link Label',
          type: 'string',
          initialValue: 'View on GitHub',
        },
        {
          name: 'zeroTrackingTitle',
          title: 'Zero Tracking Box Title',
          type: 'string',
          initialValue: 'ZERO TRACKING',
        },
        {
          name: 'zeroTrackingDescription',
          title: 'Zero Tracking Box Description',
          type: 'text',
          initialValue:
            'Check your browser dev tools. Major parties have 15+ tracking scripts. We have zero.',
        },
        {
          name: 'downloadButtonLabel',
          title: 'Download Button Label',
          type: 'string',
          initialValue: '📥 Download Annotated Manifesto',
        },
        {
          name: 'footerMessage',
          title: 'Footer Message',
          type: 'string',
          initialValue: 'P.S. Share this with other curious people. Democracy needs more of them.',
        },
      ],
    }),
  ],
})
