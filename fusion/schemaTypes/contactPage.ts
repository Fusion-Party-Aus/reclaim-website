import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'Short tagline displayed below the title in the hero',
      initialValue: 'Get in touch with us',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction Text',
      type: 'text',
      description: 'Short paragraph shown at the top of the contact page',
      rows: 3,
    }),

    // --- GENERAL CONTACT ---
    defineField({
      name: 'generalContact',
      title: 'General Contact',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'General Enquiries',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'For any feedback or questions about the party or this website:',
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          initialValue: 'contact@fusionparty.org.au',
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
        defineField({
          name: 'discordUrl',
          title: 'Discord Invite URL',
          type: 'url',
          description: 'Link to the Fusion Discord server',
          initialValue: 'https://www.fusionparty.org.au/discord',
        }),
        defineField({
          name: 'mailingListUrl',
          title: 'Mailing List URL',
          type: 'url',
          description: 'Link to the interactive mailing list',
        }),
      ],
    }),

    // --- MEDIA CONTACT ---
    defineField({
      name: 'mediaContact',
      title: 'Media Inquiries',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Media Inquiries',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'For media inquiries ONLY, please contact:',
        }),
        defineField({
          name: 'email',
          title: 'Media Email',
          type: 'string',
          initialValue: 'press@fusionparty.org.au',
        }),
        defineField({
          name: 'phone',
          title: 'Media Phone',
          type: 'string',
        }),
      ],
    }),

    // --- MAILING ADDRESS ---
    defineField({
      name: 'mailingAddress',
      title: 'Mailing Address',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Mailing Address',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'This postal address is to be used for legal correspondence:',
        }),
        defineField({
          name: 'address',
          title: 'Full Address',
          type: 'text',
          rows: 4,
          initialValue: '254 McLeod Lane\nMansfield VIC 3722\nAustralia',
        }),
      ],
    }),

    // --- SOCIAL LINKS ---
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform Name',
              type: 'string',
              description: 'e.g. Facebook, Twitter, Instagram',
            }),
            defineField({
              name: 'icon',
              title: 'MDI Icon Name',
              type: 'string',
              description: 'Material Design Icon name, e.g. mdi:facebook',
              initialValue: 'mdi:web',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        },
      ],
      initialValue: [
        {
          platform: 'Facebook',
          icon: 'mdi:facebook',
          url: 'https://www.facebook.com/FusionPartyAus/',
        },
        {platform: 'Twitter / X', icon: 'mdi:twitter', url: 'https://twitter.com/FusionPartyAus'},
        {
          platform: 'Instagram',
          icon: 'mdi:instagram',
          url: 'https://www.instagram.com/fusionpartyaus/',
        },
        {platform: 'YouTube', icon: 'mdi:youtube', url: 'https://www.youtube.com/c/fusionpartyaus'},
        {platform: 'TikTok', icon: 'mdi:music-note', url: 'https://www.tiktok.com/@fusionpartyaus'},
        {platform: 'Discord', icon: 'mdi:discord', url: 'https://www.fusionparty.org.au/discord'},
        {platform: 'Mastodon', icon: 'mdi:mastodon', url: 'https://mastodon.au/@FusionPartyAus'},
        {
          platform: 'LinkedIn',
          icon: 'mdi:linkedin',
          url: 'https://www.linkedin.com/company/fusionpartyaus/',
        },
      ],
    }),
  ],
})
