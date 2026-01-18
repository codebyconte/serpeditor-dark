import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="text-foreground min-h-screen">
      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-9 w-64" /> {/* Titre */}
              <Skeleton className="h-5 w-96 max-w-full" /> {/* Description */}
            </div>
            <Skeleton className="h-10 w-40" /> {/* Bouton action */}
          </div>
        </div>

        {/* Project Cards Skeleton */}
        <section className="space-y-6 pb-8">
          {[1, 2].map((index) => (
            <Card key={index} className="animate-pulse transition-all duration-200">
              {/* Card Header Skeleton */}
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        {/* Titre du projet */}
                        <Skeleton className="h-6 w-48" />
                        {/* URL */}
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                    {/* Badge + Date */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  {/* Menu dropdown */}
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>

              {/* Card Content Skeleton - Métriques */}
              <CardContent className="space-y-6 pt-6">
                {/* Titre de section */}
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-48" />
                </div>

                {/* Grid de 4 métriques */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Métrique 1 - Clics */}
                  <div className="rounded-lg border bg-linear-to-br from-blue-50/50 to-blue-100/30 p-4 dark:from-blue-950/20 dark:to-blue-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="mb-2 h-8 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  {/* Métrique 2 - Impressions */}
                  <div className="rounded-lg border bg-linear-to-br from-purple-50/50 to-purple-100/30 p-4 dark:from-purple-950/20 dark:to-purple-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="mb-2 h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  {/* Métrique 3 - CTR */}
                  <div className="rounded-lg border bg-linear-to-br from-emerald-50/50 to-emerald-100/30 p-4 dark:from-emerald-950/20 dark:to-emerald-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="mb-2 h-8 w-16" />
                  </div>

                  {/* Métrique 4 - Position */}
                  <div className="rounded-lg border bg-linear-to-br from-orange-50/50 to-orange-100/30 p-4 dark:from-orange-950/20 dark:to-orange-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="mb-2 h-8 w-12" />
                  </div>
                </div>

                {/* Alertes skeleton (optionnel) */}
                {index === 1 && (
                  <div className="space-y-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-4 w-4 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-64 max-w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Indicateur de chargement subtil */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            <span className="ml-2">Chargement de vos données SEO...</span>
          </div>
        </div>
      </div>
    </main>
  )
}