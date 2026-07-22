import rss from '@astrojs/rss'
import { getDocuments } from '../lib/sanity'

interface BlogPost {
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  category: string
  author?: { name: string }
}

export async function GET() {
  const posts = await getDocuments<BlogPost>('blogPost')
  const sorted = posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return rss({
    title: 'Fusion Party Victoria',
    description:
      'Campaign updates, policy announcements, and stories from the movement to reclaim Victoria.',
    site: 'https://vic.fusionparty.org.au',
    items: sorted.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt,
      link: `/blog/${post.slug.current}/`,
      categories: [post.category],
      author: post.author?.name,
    })),
    customData: '<language>en-au</language>',
    trailingSlash: false,
  })
}
