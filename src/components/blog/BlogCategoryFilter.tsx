'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { LayoutGrid, Tag } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface Category {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  postCount?: number
}

interface BlogCategoryFilterProps {
  categories: Category[]
  totalPosts: number
}

export function BlogCategoryFilter({ categories, totalPosts }: BlogCategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCategory = searchParams.get('category')

  const handleCategoryChange = useCallback(
    (categorySlug: string | null) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (categorySlug) {
          params.set('category', categorySlug)
        } else {
          params.delete('category')
        }
        router.push(`/blog?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams],
  )

  return (
    <div className="relative">
      {/* Filter Header */}
      <div className="mb-4 flex items-center gap-2">
        <Tag className="text-primary h-4 w-4" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par catégorie</span>
      </div>

      {/* Categories Pills */}
      <div className="flex flex-wrap gap-2">
        {/* All Articles Button */}
        <button
          onClick={() => handleCategoryChange(null)}
          disabled={isPending}
          className={cn(
            'group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
            'focus:ring-primary/50 focus:ring-2 focus:ring-offset-2 focus:outline-none',
            !currentCategory
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
            isPending && 'opacity-70',
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Tous</span>
          <span
            className={cn(
              'ml-1 rounded-full px-2 py-0.5 text-xs',
              !currentCategory
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
            )}
          >
            {totalPosts}
          </span>
          {!currentCategory && (
            <motion.div
              layoutId="activeCategory"
              className="bg-primary absolute inset-0 -z-10 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>

        {/* Category Buttons */}
        {categories.map((category) => {
          const isActive = currentCategory === category.slug.current
          return (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.slug.current)}
              disabled={isPending}
              className={cn(
                'group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                'focus:ring-primary/50 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                isPending && 'opacity-70',
              )}
              style={undefined}
            >
              <span>{category.title}</span>
              {category.postCount !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
                  )}
                  style={undefined}
                >
                  {category.postCount}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="bg-primary absolute inset-0 -z-10 rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="absolute -right-2 -top-2">
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
    </div>
  )
}
