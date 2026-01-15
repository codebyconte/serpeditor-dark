'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useScrollProgress(targetRef?: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
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
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  return progress
}
