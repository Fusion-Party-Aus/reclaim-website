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
                    // Hierarchical Pages
                    S.listItem()
                      .title('📄 Pages')
                      .child(
                        S.documentTypeList('page')
                          .title('Top Level Pages')
                          .filter('_type == "page" && !defined(parent)')
                          .child((id) =>
                            S.list()
                              .title('Page Settings')
                              .items([
                                S.listItem()
                                  .title('Edit Page')
                                  .child(S.document().schemaType('page').documentId(id)),
                                S.listItem()
                                  .title('Subpages')
                                  .child(
                                    S.documentTypeList('page')
                                      .title('Subpages')
                                      .filter('_type == "page" && parent._ref == $id')
                                      .params({id}),
                                  ),
                              ]),
                          ),
                      ),
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
