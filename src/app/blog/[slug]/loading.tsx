import { Main } from '@/components/elements/main'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Main>
      <article className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        {/* Breadcrumb Skeleton - Design amélioré */}
        <nav aria-label="Breadcrumb" className="mb-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 rounded-full bg-muted/50 px-4 py-2.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </nav>

        {/* Article Header Skeleton */}
        <header className="mb-16 max-w-4xl">
          {/* Categories */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>

          {/* Title */}
          <div className="mb-6 space-y-4">
            <Skeleton className="h-14 w-full max-w-3xl" />
            <Skeleton className="h-14 w-full max-w-2xl" />
          </div>

          {/* Excerpt */}
          <div className="mb-10 space-y-3 border-l-4 border-primary/30 pl-6">
            <Skeleton className="h-6 w-full max-w-4xl" />
            <Skeleton className="h-6 w-full max-w-3xl" />
          </div>

          {/* Meta Row - Design amélioré */}
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border/50 bg-muted/30 px-6 py-5">
            {/* Author */}
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Separator */}
            <div className="hidden h-8 w-px bg-border sm:block" />

            {/* Date */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Separator */}
            <div className="hidden h-8 w-px bg-border sm:block" />

            {/* Reading Time */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </header>

        {/* Hero Image Skeleton - Design amélioré */}
        <div className="mb-20 max-w-4xl">
          <Skeleton className="aspect-video w-full rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5" />
          <Skeleton className="mx-auto mt-4 h-4 w-64" />
        </div>

        {/* Article Content Skeleton */}
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-20">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Paragraphs */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              ))}

              {/* Heading */}
              <Skeleton className="h-8 w-3/4" />

              {/* More paragraphs */}
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              ))}

              {/* Image in content */}
              <Skeleton className="aspect-video w-full rounded-xl" />

              {/* More paragraphs */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}

              {/* Another heading */}
              <Skeleton className="h-8 w-2/3" />

              {/* List items */}
              <div className="space-y-2 pl-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/5" />
              </div>

              {/* Final paragraphs */}
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              ))}
            </div>

            {/* Sidebar (Table of Contents) - Design amélioré */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* TOC Card */}
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-6">
                  <Skeleton className="mb-4 h-5 w-40" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
                
                {/* Social Share Card */}
                <div className="rounded-2xl border border-border/50 bg-linear-to-br from-primary/5 to-primary/10 p-6">
                  <Skeleton className="mb-4 h-5 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Author Card Skeleton - Design amélioré */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <Skeleton className="h-4 w-40" />
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
          </div>
          <div className="rounded-3xl border border-border/50 bg-linear-to-br from-muted/50 to-muted/30 p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Skeleton - Design amélioré */}
        <div className="mx-auto mt-24 max-w-4xl">
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto mb-3 h-9 w-64" />
            <Skeleton className="mx-auto h-5 w-96 max-w-full" />
          </div>
          <div className="rounded-3xl border border-border/50 bg-linear-to-br from-muted/30 to-background p-8 shadow-xl">
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Skeleton - Design amélioré */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <Skeleton className="h-4 w-48" />
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>

        {/* Subtle loading indicator - Design amélioré */}
        <div className="mx-auto mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Chargement de l&apos;article en cours...
          </p>
        </div>
      </article>
    </Main>
  )
}
