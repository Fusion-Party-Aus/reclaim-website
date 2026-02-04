import {defineConfig, type ConfigContext} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

/**
 * Recursive helper to build a nested page tree in the Sanity Desk
 */
const getPageStructure = (S: StructureBuilder, parentId?: string): any => {
  const filter = parentId
    ? `_type == "page" && parent._ref == $parentId`
    : `_type == "page" && !defined(parent)`

  const title = parentId ? 'Subpages' : 'Top Level Pages'

  return S.documentTypeList('page')
    .title(title)
    .filter(filter)
    .params({parentId})
    .child((id: string) =>
      S.list()
        .title('Page Options')
        .items([
          S.listItem()
            .title('Edit Page Content')
            .icon(() => '📝')
            .child(S.document().schemaType('page').documentId(id)),
          S.listItem()
            .title('Subpages')
            .icon(() => '📁')
            .child(getPageStructure(S, id)),
        ]),
    )
}

export default defineConfig({
  name: 'default',
  title: 'Reclaim Website',

  projectId: 'qwl3f8jb',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S: StructureBuilder, _context: ConfigContext) =>
        S.list()
          .title('Website Management')
          .items([
            // 🌐 SITE BACKBONE
            S.listItem()
              .title('Site Backbone')
              .icon(() => '🌐')
              .child(
                S.list()
                  .title('Site Backbone')
                  .items([
                    S.listItem()
                      .title('🏠 Home Page')
                      .child(
                        S.document().schemaType('homePage').documentId('DYZVAW4yRUmcIv7eyyqoTp'),
                      ),
                    S.listItem()
                      .title('🧭 Navigation')
                      .child(
                        S.document().schemaType('navigation').documentId('DYZVAW4yRUmcIv7eyyxqYb'),
                      ),
                    S.listItem()
                      .title('🦶 Footer')
                      .child(
                        S.document().schemaType('footer').documentId('DYZVAW4yRUmcIv7eyzvQ8T'),
                      ),
                    S.listItem()
                      .title('⚙️ Site Configuration')
                      .child(S.document().schemaType('siteConfig').documentId('siteConfig')),
                  ]),
              ),

            S.divider(),

            // ✍️ EDITORIAL CONTENT
            S.listItem()
              .title('Editorial Content')
              .icon(() => '✍️')
              .child(
                S.list()
                  .title('Editorial Content')
                  .items([
                    // Recursive Hierarchical Pages
                    S.listItem().title('📄 Pages').child(getPageStructure(S)),
                    S.listItem()
                      .title('📰 Blog Posts')
                      .icon(() => '📰')
                      .child(
                        S.documentTypeList('blogPost')
                          .title('Blog Posts')
                          .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                      ),
                    S.listItem()
                      .title('📱 Sidebars')
                      .icon(() => '📱')
                      .child(S.documentTypeList('sidebar').title('Sidebars')),
                  ]),
              ),

            S.divider(),

            // 🗄️ DATABASE COLLECTIONS
            S.listItem()
              .title('Database Collections')
              .icon(() => '🗄️')
              .child(
                S.list()
                  .title('Database Collections')
                  .items([
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
                      .title('🤝 Convince Your Friends')
                      .child(
                        S.documentTypeList('convinceYourFriends').title('Convince Your Friends'),
                      ),
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
