// 📁 app/dashboard/keyword-magic/page.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { KeywordMagicContent } from './components/keyword-magic-content'

export const metadata: Metadata = {
  title: 'Keyword Magic Tool | Dashboard SEO',
  description:
    "Trouvez des milliers d'idées de mots-clés pour booster votre SEO",
  openGraph: {
    title: 'Keyword Magic Tool',
    description: 'Découvrez des opportunités de mots-clés illimitées',
  },
}

export default function KeywordMagicPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                Keyword Magic Tool
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Découvrez des milliers d'opportunités de mots-clés en un clic ✨
              </p>
            </div>
          </div>
        </div>

        {/* Content avec Suspense */}
        <Suspense fallback={<KeywordMagicSkeleton />}>
          <KeywordMagicContent />
        </Suspense>
      </div>
    </main>
  )
}

// Skeleton de chargement
function KeywordMagicSkeleton() {
  return (
    <div className="animate-in space-y-6 duration-500 fade-in">
      {/* Formulaire skeleton */}
      <div className="space-y-4 rounded-lg border border-purple-200 p-6 dark:border-purple-900">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border p-6">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
