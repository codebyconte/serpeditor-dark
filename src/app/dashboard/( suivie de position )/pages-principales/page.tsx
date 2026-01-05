// 📁 app/dashboard/pages-principales/page.tsx
import { Heading } from '@/components/dashboard/heading'
import { ProjectSelector } from '@/components/dashboard/project-selector'
import { Skeleton } from '@/components/ui/skeleton'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FileText } from 'lucide-react'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { TopPagesContent } from './top-pages-content'

export const metadata = {
  title: 'Pages Principales | Dashboard SEO',
  description: 'Analyse des performances de vos pages principales',
}

export default async function PagesPrincipalesPage({ searchParams }: { searchParams: { project?: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return <div>Non authentifié</div>
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const projectId = (await searchParams)?.project
  const selectedProject = projects.find((p) => p.id === projectId) || projects[0]

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <FileText className="text-primary h-6 w-6" />
            </div>
            <div>
              <Heading className="text-3xl font-bold">Pages principales</Heading>
              <p className="text-muted-foreground text-sm">Performances détaillées de vos pages - 30 derniers jours</p>
            </div>
          </div>
        </div>

        {/* Project Selector */}
        {projects.length > 1 && (
          <div className="mb-6">
            <ProjectSelector projects={projects} currentProjectId={selectedProject?.id} />
          </div>
        )}

        {/* Content */}
        <Suspense fallback={<PagesSkeleton />}>
          {selectedProject && <TopPagesContent projectId={selectedProject.id} />}
        </Suspense>
      </div>
    </main>
  )
}

function PagesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}
