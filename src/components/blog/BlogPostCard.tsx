'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Author {
  name: string
  image?: string | null
  role?: string
}

interface Category {
  title: string
  slug: { current: string }
}

interface BlogPostCardProps {
  title: string
  slug: string
  excerpt?: string
  image?: string | null
  publishedAt: string
  author?: Author
  categories?: Category[]
  readingTime?: number
  featured?: boolean
  variant?: 'default' | 'compact' | 'horizontal'
  index?: number
}

export function BlogPostCard({
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  author,
  categories,
  readingTime,
  featured,
  variant = 'default',
  index = 0,
}: BlogPostCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (variant === 'horizontal') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group"
      >
        <Link
          href={`/blog/${slug}`}
          className="flex flex-col gap-6 sm:flex-row"
        >
          {/* Image */}
          {image && (
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-video sm:w-64">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center">
            {categories && categories.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {categories.slice(0, 2).map((category, idx) => (
                  <span
                    key={idx}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: 'rgb(var(--primary) / 0.1)',
                      color: 'rgb(var(--primary))',
                    }}
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            <h3 className="group-hover:text-primary line-clamp-2 text-lg font-semibold text-gray-900 transition-colors dark:text-white">
              {title}
            </h3>

            {excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{excerpt}</p>
            )}

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              {readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group"
      >
        <Link
          href={`/blog/${slug}`}
          className="border-border hover:border-primary/50 flex gap-4 rounded-xl border bg-white p-4 transition-all duration-300 hover:shadow-md dark:bg-gray-900/50"
        >
          {image && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center">
            <h3 className="group-hover:text-primary line-clamp-2 text-sm font-semibold text-gray-900 transition-colors dark:text-white">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  // Default variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn('group relative h-full', featured && 'md:col-span-2')}
    >
      <Link
        href={`/blog/${slug}`}
        className="border-border hover:border-primary/50 flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-900/50"
      >
        {/* Image Container */}
        {image && (
          <div className={cn('relative w-full overflow-hidden', featured ? 'aspect-[21/9]' : 'aspect-video')}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Categories on image */}
            {categories && categories.length > 0 && (
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {categories.slice(0, 2).map((category, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm dark:bg-gray-900/90"
                    style={{ color: 'inherit' }}
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {/* Featured badge */}
            {featured && (
              <div className="absolute right-4 top-4">
                <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold shadow-lg">
                  En vedette
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Title */}
          <h2
            className={cn(
              'group-hover:text-primary font-semibold text-gray-900 transition-colors dark:text-white',
              featured ? 'line-clamp-2 text-2xl' : 'line-clamp-2 text-xl',
            )}
          >
            {title}
          </h2>

          {/* Excerpt */}
          {excerpt && (
            <p
              className={cn(
                'mt-3 text-gray-600 dark:text-gray-400',
                featured ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm',
              )}
            >
              {excerpt}
            </p>
          )}

          {/* Meta Footer */}
          <div className="border-border mt-auto flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              {author?.image && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-800">
                  <Image src={author.image} alt={author.name} fill className="object-cover" />
                </div>
              )}
              <div>
                {author?.name && (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    {!author.image && <User className="h-3.5 w-3.5 text-gray-400" />}
                    {author.name}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </span>
                  {readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime} min
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Read more arrow */}
            <div className="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-gray-800">
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
