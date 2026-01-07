import { Heading } from '@/components/dashboard/heading'
import { ProjectSelector } from '@/components/dashboard/project-selector'
import { Skeleton } from '@/components/ui/skeleton'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Search } from 'lucide-react'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { OrganicKeywordsContent } from './organic-keywords-content'

export const metadata = {
  title: 'Mots-Clés Organiques | Dashboard SEO',
  description: 'Analyse complète des performances de vos mots-clés organiques',
}

export default async function MotsClesOrganiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>
}) {
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

  const params = await searchParams
  const projectId = params?.project
  const selectedProject = projects.find((p) => p.id === projectId) || projects[0]

  if (!selectedProject) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <Search className="text-primary h-6 w-6" />
              </div>
              <div>
                <Heading className="text-3xl font-bold">Mots-clés organiques</Heading>
                <p className="text-muted-foreground text-sm">
                  Analyse détaillée des performances SEO - 30 derniers jours
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border-border rounded-xl border p-12 text-center">
            <p className="font-semibold">Aucun projet trouvé</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Veuillez créer un projet pour accéder à cette fonctionnalité.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Search className="text-primary h-6 w-6" />
            </div>
            <div>
              <Heading className="text-3xl font-bold">Mots-clés organiques</Heading>
              <p className="text-muted-foreground text-sm">
                Analyse détaillée des performances SEO - 30 derniers jours
              </p>
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
        <Suspense fallback={<KeywordsSkeleton />}>
          {selectedProject && <OrganicKeywordsContent projectId={selectedProject.id} />}
        </Suspense>
      </div>
    </main>
  )
}

function KeywordsSkeleton() {
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
