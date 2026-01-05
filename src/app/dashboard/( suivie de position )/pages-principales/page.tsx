// 📁 app/dashboard/pages-principales/page.tsx
import { Heading } from '@/components/dashboard/heading'
import { PageHeader } from '@/components/dashboard/page-header'
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
    <main className="min-h-screen text-foreground">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Pages principales"
          description="Performances détaillées de vos pages - 30 derniers jours"
          icon={FileText}
          iconClassName="border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-500"
        />

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
