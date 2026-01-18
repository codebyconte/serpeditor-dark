'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect mobile viewport
 *
 * Optimizations applied:
 * - Uses matchMedia for efficient breakpoint detection (re-renders only on boolean change)
 * - Uses useSyncExternalStore for SSR-safe subscription
 * - Subscribes to derived boolean state instead of continuous width values
 *
 * @see https://react.dev/reference/react/useSyncExternalStore
 */

// Media query for mobile detection - reusable across hook instances
const getMediaQuery = () => {
  if (typeof window === 'undefined') return null
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}

// Server snapshot - always false for SSR
const getServerSnapshot = () => false

export function useIsMobile() {
  const [mediaQuery, setMediaQuery] = useState<MediaQueryList | null>(null)

  useEffect(() => {
    setMediaQuery(getMediaQuery())
  }, [])

  // Using useSyncExternalStore for safe concurrent rendering
  const isMobile = useSyncExternalStore(
    // Subscribe to changes
    (callback) => {
      if (!mediaQuery) return () => {}
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    // Get current snapshot (client)
    () => mediaQuery?.matches ?? false,
    // Get server snapshot (SSR)
    getServerSnapshot
  )

  return isMobile
}

/**
 * Alternative hook using CSS media query string
 * More flexible for custom breakpoints
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }

  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
