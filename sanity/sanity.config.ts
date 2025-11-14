import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../fusion/schemas'

export default defineConfig({
  name: 'default',
  title: 'Reclaim Victoria',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton Documents
            S.listItem()
              .title('🏠 Home Page')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('🧭 Navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.divider(),
            // Collection Documents
            S.listItem().title('📄 Pages').child(S.documentTypeList('page').title('Pages')),
            S.listItem()
              .title('📋 Policies')
              .child(
                S.documentTypeList('policy')
                  .title('Policies')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('🗳️ Electorates')
              .child(S.documentTypeList('electorate').title('Electorates')),
            S.listItem()
              .title('❓ FAQ')
              .child(
                S.documentTypeList('faq')
                  .title('FAQ')
                  .defaultOrdering([
                    { field: 'category', direction: 'asc' },
                    { field: 'order', direction: 'asc' },
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
