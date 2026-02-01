import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="text-foreground">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-5 w-80 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Summary stats skeleton */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-mist-800/80 to-mist-900/80 p-5 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Projects section header */}
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Project Cards Skeleton */}
        <section className="space-y-4 pb-8">
          {[1, 2].map((index) => (
            <Card
              key={index}
              className="overflow-hidden border-white/5 bg-linear-to-br from-mist-800/60 to-mist-900/60 backdrop-blur-sm"
            >
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </CardHeader>

              <CardContent className="space-y-5 pt-5">
                {/* Metrics header */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Metrics grid - explicit Tailwind classes for purge (no dynamic class names) */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    'from-blue-500/10 via-blue-500/5',
                    'from-purple-500/10 via-purple-500/5',
                    'from-emerald-500/10 via-emerald-500/5',
                    'from-orange-500/10 via-orange-500/5',
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`relative overflow-hidden rounded-xl border border-white/5 bg-linear-to-br ${gradient} to-transparent p-4`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-7 w-7 rounded-lg" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="mt-2 h-3 w-12" />
                    </div>
                  ))}
                </div>

                {/* Alert skeleton for first card */}
                {index === 1 && (
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Premium loading indicator */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            {/* Spinner */}
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-primary" />
              <div className="absolute h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-primary/50 [animation-direction:reverse] [animation-duration:1.5s]" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">Chargement de vos données SEO...</p>
        </div>
      </div>
    </main>
  )
}