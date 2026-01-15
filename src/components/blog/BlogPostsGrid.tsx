'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Search } from 'lucide-react'
import { BlogPostCard } from './BlogPostCard'

interface Author {
  name: string
  image?: string | null
  role?: string
}

interface Category {
  title: string
  slug: { current: string }
  color?: string
}

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  image?: string | null
  publishedAt: string
  readingTime?: number
  featured?: boolean
  author?: Author
  categories?: Category[]
}

interface BlogPostsGridProps {
  posts: Post[]
  currentCategory?: string | null
}

export function BlogPostsGrid({ posts, currentCategory }: BlogPostsGridProps) {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {currentCategory ? (
            <Search className="h-10 w-10 text-gray-400" />
          ) : (
            <FileText className="h-10 w-10 text-gray-400" />
          )}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {currentCategory ? 'Aucun article dans cette catégorie' : 'Aucun article disponible'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {currentCategory
            ? 'Essayez de sélectionner une autre catégorie ou consultez tous les articles.'
            : 'Les articles seront bientôt disponibles. Revenez nous voir !'}
        </p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentCategory || 'all'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('grid gap-8', 'md:grid-cols-2 lg:grid-cols-3')}
      >
        {posts.map((post, index) => (
          <BlogPostCard
            key={post._id}
            title={post.title}
            slug={post.slug.current}
            excerpt={post.excerpt}
            image={post.image}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            author={post.author}
            categories={post.categories}
            index={index}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
