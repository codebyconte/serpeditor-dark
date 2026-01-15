import { CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface RelatedPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  image?: string | null
  publishedAt: string
  author?: {
    name: string
    image?: string | null
  }
}

interface RelatedArticlesProps {
  posts: RelatedPost[]
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-8 text-2xl font-semibold text-foreground">Articles similaires</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              {/* Image */}
              {post.image && (
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-mist-100 dark:bg-mist-800">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.image && (
                      <Image
                        src={post.author.image}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span>{post.author.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
