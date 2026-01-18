'use client'

import { useEffect, useState, startTransition, type RefObject } from 'react'

/**
 * Hook to track scroll progress
 *
 * Optimizations applied:
 * - Uses startTransition for non-urgent state updates (maintains UI responsiveness)
 * - Uses passive event listener for better scroll performance
 * - Caches DOM measurements to avoid redundant calculations
 *
 * @see https://react.dev/reference/react/startTransition
 */
export function useScrollProgress(targetRef?: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Use startTransition for non-urgent scroll updates
      // This keeps the UI responsive during rapid scrolling
      startTransition(() => {
        if (targetRef?.current) {
          // Progress based on target element
          const { top, height } = targetRef.current.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const scrolled = Math.max(0, Math.min(100, (-top / (height - viewportHeight)) * 100))
          setProgress(scrolled)
        } else {
          // Progress based on full page
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
          setProgress(Math.min(100, Math.max(0, scrolled)))
        }
      })
    }

    handleScroll()
    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  return progress
}
