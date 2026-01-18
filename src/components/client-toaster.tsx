'use client'

import dynamic from 'next/dynamic'

/**
 * Client-side Toaster with dynamic import
 * Loads after hydration to reduce initial bundle size and improve TTI
 *
 * This wrapper is needed because `ssr: false` is not allowed
 * in Server Components, but can be used in Client Components
 */
const DynamicToaster = dynamic(
  () => import('@/components/ui/sonner').then((m) => m.Toaster),
  { ssr: false }
)

export function ClientToaster() {
  return <DynamicToaster position="bottom-right" richColors closeButton />
}
