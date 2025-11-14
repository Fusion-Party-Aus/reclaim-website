import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Reclaim Website',

  projectId: 'qwl3f8jb',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton Documents
            S.listItem()
              .title('🏠 Home Page')
              .child(S.document().schemaType('homePage').documentId('DYZVAW4yRUmcIv7eyyqoTp')),
            S.listItem()
              .title('🧭 Navigation')
              .child(S.document().schemaType('navigation').documentId('DYZVAW4yRUmcIv7eyyxqYb')),
            S.listItem()
              .title('🦶 Footer')
              .child(S.document().schemaType('footer').documentId('DYZVAW4yRUmcIv7eyzvQ8T')),
            S.divider(),
            // Collection Documents
            S.listItem().title('📄 Pages').child(S.documentTypeList('page').title('Pages')),
            S.listItem()
              .title('📋 Policies')
              .child(
                S.documentTypeList('policy')
                  .title('Policies')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
              ),
            S.listItem()
              .title('🗳️ Electorates')
              .child(
                S.documentTypeList('electorate')
                  .title('Electorates')
                  .defaultOrdering([{field: 'name', direction: 'asc'}]),
              ),
            S.listItem()
              .title('❓ FAQ')
              .child(
                S.documentTypeList('faq')
                  .title('FAQ')
                  .defaultOrdering([
                    {field: 'category', direction: 'asc'},
                    {field: 'order', direction: 'asc'},
                  ]),
              ),
            S.listItem()
              .title('📰 Blog Posts')
              .child(
                S.documentTypeList('blogPost')
                  .title('Blog Posts')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
              ),
            S.listItem()
              .title('📱 Sidebars')
              .child(S.documentTypeList('sidebar').title('Sidebars')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
