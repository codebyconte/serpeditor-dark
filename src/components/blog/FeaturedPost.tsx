'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, Sparkles, User } from 'lucide-react'
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

interface FeaturedPostProps {
  title: string
  slug: string
  excerpt?: string
  image?: string | null
  publishedAt: string
  author?: Author
  categories?: Category[]
  readingTime?: number
}

export function FeaturedPost({
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  author,
  categories,
  readingTime,
}: FeaturedPostProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 to-gray-800 shadow-2xl"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative grid min-h-[500px] lg:grid-cols-2">
          {/* Content Side */}
          <div className="relative z-10 flex flex-col justify-center p-8 lg:p-12">
            {/* Featured Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 flex items-center gap-2"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25">
                <Sparkles className="h-4 w-4" />
                Article en vedette
              </span>
            </motion.div>

            {/* Categories */}
            {categories && categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4 flex flex-wrap gap-2"
              >
                {categories.map((category, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-sm"
                  >
                    {category.title}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h2>

            {/* Excerpt */}
            {excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 line-clamp-3 text-lg text-gray-300"
              >
                {excerpt}
              </motion.p>
            )}

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8 flex flex-wrap items-center gap-4"
            >
              {author && (
                <div className="flex items-center gap-3">
                  {author.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/20">
                      <Image src={author.image} alt={author.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <User className="h-6 w-6 text-white/60" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{author.name}</p>
                    {author.role && <p className="text-sm text-gray-400">{author.role}</p>}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
                {readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {readingTime} min de lecture
                  </span>
                )}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-900 shadow-lg transition-all duration-300 group-hover:gap-4 group-hover:bg-gray-100 group-hover:shadow-xl">
                Lire l&apos;article
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.div>
          </div>

          {/* Image Side */}
          {image && (
            <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="relative h-64 w-full lg:h-full">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Overlay gradient léger uniquement pour la lisibilité du texte sur mobile */}
                <div className="absolute inset-0 bg-linear-to-r from-gray-900/40 via-gray-900/20 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          )}

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-linear-to-br from-purple-500/20 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-linear-to-tr from-blue-500/20 to-transparent blur-3xl" />
        </div>
      </Link>
    </motion.article>
  )
}
