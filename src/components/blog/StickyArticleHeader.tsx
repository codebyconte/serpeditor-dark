'use client'

import { useScrollProgress } from '@/hooks'
import { ArrowUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StickyArticleHeaderProps {
  title: string
}

export function StickyArticleHeader({ title }: StickyArticleHeaderProps) {
  const [visible, setVisible] = useState(false)
  const progress = useScrollProgress()

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      setVisible(window.scrollY > 400)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-primary" style={{ width: `${progress}%` }} />

      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <h2 className="truncate text-sm font-medium text-foreground pr-4">{title}</h2>

        <button
          onClick={scrollToTop}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist-100 text-mist-600 transition-colors hover:bg-mist-200 dark:bg-mist-800 dark:text-mist-300 dark:hover:bg-mist-700"
          aria-label="Retour en haut"
        >
          <ArrowUpIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
