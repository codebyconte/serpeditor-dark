import { OpenModal } from '@/components/open-modale-google'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BarChart3 } from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import RankOverviewContent from './rank-overview-content'

export const metadata: Metadata = {
  title: 'Vue d\'ensemble des Positions SEO',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RankOverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const projects = await prisma.project.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (projects.length === 0) {
    return (
      <main className="text-foreground min-h-screen">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <section className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <BarChart3 className="text-primary h-8 w-8" />
                  </div>
                </EmptyMedia>
                <EmptyTitle className="text-xl">Aucun projet</EmptyTitle>
                <EmptyDescription className="max-w-md">
                  Commencez par ajouter votre premier site web pour suivre les positions de vos mots-clés dans les
                  résultats de recherche Google.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <OpenModal />
              </EmptyContent>
            </Empty>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <RankOverviewContent />
      </div>
    </main>
  )
}
