import {defineConfig, type ConfigContext} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'

/**
 * Recursive helper to build a nested page tree in the Sanity Desk
 */
const getPageStructure = (S: StructureBuilder, parentId?: string): any => {
  const filter = parentId
    ? `_type == "page" && parent._ref == $parentId && coalesce(isArchived, false) != true`
    : `_type == "page" && !defined(parent) && coalesce(isArchived, false) != true`

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
      structure: async (S: StructureBuilder, context: ConfigContext) => {
        // Dynamically fetch distinct election groupings from archived electorates
        const sanityClient = context.getClient({apiVersion: '2024-01-29'})
        const elections: string[] = await sanityClient.fetch(
          `array::unique(*[_type == "electorate" && isArchived == true && defined(electionGrouping)].electionGrouping) | order(@ desc)`,
        )

        // Fetch distinct pillar + category combos for policy grouping
        type PolicyGroup = {pillar: string; categories: string[]}
        const pillars: string[] = await sanityClient.fetch(
          `array::unique(*[_type == "policy" && defined(pillar)].pillar)`,
        )
        const policyGroups: PolicyGroup[] = await Promise.all(
          pillars.map(async (pillar) => {
            const categories: string[] = await sanityClient.fetch(
              `array::unique(*[_type == "policy" && pillar == $pillar && defined(category)].category)`,
              {pillar},
            )
            return {pillar, categories}
          }),
        )

        return S.list()
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
                    S.listItem()
                      .title('📬 Contact Page')
                      .child(S.document().schemaType('contactPage').documentId('contactPage')),
                  ]),
              ),

            S.divider(),

            // 📝 LETTERHEAD
            S.listItem()
              .title('Letterhead Generator')
              .icon(() => '📝')
              .child(S.document().schemaType('letterhead').documentId('letterhead')),

            S.divider(),

            // ✍️ EDITORIAL CONTENT
            S.listItem()
              .title('Editorial Content')
              .icon(() => '✍️')
              .child(
                S.list()
                  .title('Editorial Content')
                  .items([
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
                    S.listItem()
                      .title('🗃️ Archived Pages')
                      .icon(() => '🗃️')
                      .child(
                        S.documentTypeList('page')
                          .title('Archived Pages')
                          .filter('_type == "page" && isArchived == true'),
                      ),
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
                        S.list()
                          .title('Policies by Pillar')
                          .items([
                            // Dynamic pillar → category → policy tree
                            ...policyGroups.map(({pillar, categories}) =>
                              S.listItem()
                                .title(pillar)
                                .icon(() => '📋')
                                .child(
                                  S.list()
                                    .title(pillar)
                                    .items([
                                      // Per-category sub-lists
                                      ...categories.map((category) =>
                                        S.listItem()
                                          .title(category)
                                          .icon(() => '📁')
                                          .child(
                                            S.documentList()
                                              .title(category)
                                              .filter(
                                                '_type == "policy" && pillar == $pillar && category == $category',
                                              )
                                              .params({pillar, category})
                                              .defaultOrdering([
                                                {field: 'title', direction: 'asc'},
                                              ]),
                                          ),
                                      ),
                                      // Catch-all for policies without a category
                                      S.listItem()
                                        .title('Uncategorised')
                                        .icon(() => '📄')
                                        .child(
                                          S.documentList()
                                            .title('Uncategorised')
                                            .filter(
                                              '_type == "policy" && pillar == $pillar && !defined(category)',
                                            )
                                            .params({pillar})
                                            .defaultOrdering([{field: 'title', direction: 'asc'}]),
                                        ),
                                    ]),
                                ),
                            ),
                            // Flat "All Policies" shortcut
                            S.divider(),
                            S.listItem()
                              .title('All Policies (Flat List)')
                              .icon(() => '📝')
                              .child(
                                S.documentTypeList('policy')
                                  .title('All Policies')
                                  .defaultOrdering([{field: 'title', direction: 'asc'}]),
                              ),
                          ]),
                      ),
                    S.listItem()
                      .title('🗳️ Active Electorates')
                      .child(
                        S.documentTypeList('electorate')
                          .title('Active Electorates')
                          .filter('_type == "electorate" && coalesce(isArchived, false) != true')
                          .defaultOrdering([{field: 'name', direction: 'asc'}]),
                      ),
                    S.listItem()
                      .title('🗃️ Archived Electorates')
                      .child(
                        S.list()
                          .title('Archived by Election')
                          .items([
                            // Dynamically built from data — no code change needed per election
                            ...elections.map((election) =>
                              S.listItem()
                                .title(election)
                                .child(
                                  S.documentList()
                                    .title(election)
                                    .filter(
                                      '_type == "electorate" && isArchived == true && electionGrouping == $election',
                                    )
                                    .params({election})
                                    .defaultOrdering([{field: 'candidateName', direction: 'asc'}]),
                                ),
                            ),
                            // Always include catch-all for ungrouped archived electorates
                            S.listItem()
                              .title('Historical')
                              .child(
                                S.documentList()
                                  .title('Historical')
                                  .filter(
                                    '_type == "electorate" && isArchived == true && !defined(electionGrouping)',
                                  )
                                  .defaultOrdering([{field: 'candidateName', direction: 'asc'}]),
                              ),
                          ]),
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
          ])
      },
    }),
    visionTool(),
    table(),
  ],

  schema: {
    types: schemaTypes,
  },
})
