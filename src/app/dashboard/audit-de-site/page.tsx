import { Divider } from '@/components/dashboard/divider'
import { Heading } from '@/components/dashboard/heading'
import { PageHeader } from '@/components/dashboard/page-header'
import { OpenModal } from '@/components/open-modale-google'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ArrowRight, FileSearch, Search, Sparkles } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function Page() {
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

  const getCrawlStatusBadge = (status: string | null | undefined) => {
    if (!status) return null
    const statusConfig = {
      PENDING: { color: 'amber' as const, label: 'Analyse en cours' },
      READY: { color: 'green' as const, label: 'Prêt' },
      ERROR: { color: 'red' as const, label: 'Erreur' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    return <Badge color={config.color}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string | null | undefined) => {
    if (!status) return <FileSearch className="h-5 w-5" />
    if (status === 'READY') return <Sparkles className="h-5 w-5" />
    if (status === 'PENDING') return <Search className="h-5 w-5" />
    return <FileSearch className="h-5 w-5" />
  }

  return (
    <main className="min-h-screen text-foreground">
      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Audit SEO de votre site web"
          description="Analysez la santé SEO de vos sites en un clic"
          icon={FileSearch}
          iconClassName="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-500"
        />

        <div className="from-primary/5 via-primary/10 to-primary/5 mb-6 rounded-lg border bg-gradient-to-r p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <Sparkles className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-foreground">Analyse complète de votre SEO</h3>
              <p className="text-muted-foreground text-sm">
                Identifiez vos forces, vos points à améliorer et suivez vos performances dans le temps. Notre outil
                analyse automatiquement votre site et vous fournit un rapport détaillé.
              </p>
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {projects.length > 0 ? (
          <section className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Vos projets ({projects.length})</h2>
              <OpenModal />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/dashboard/audit-de-site/${project.id}`} className="group">
                  <Card className="hover:shadow-primary/5 h-full transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                            {getStatusIcon(project.crawl_status)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="line-clamp-1 text-base">
                              {project.url.replace(/^https?:\/\//, '')}
                            </CardTitle>
                            <CardDescription className="mt-1 line-clamp-1 text-xs">{project.url}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {project.crawl_status && (
                        <div className="flex items-center gap-2">{getCrawlStatusBadge(project.crawl_status)}</div>
                      )}

                      <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
                        {project.task_created_at && (
                          <div className="flex items-center gap-1.5">
                            <span>Créé le</span>
                            <span className="font-medium">
                              {format(new Date(project.task_created_at), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        )}
                        {project.crawl_status === 'READY' && (
                          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="font-medium">Analyse disponible</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-muted-foreground text-sm font-medium">
                          {project.crawl_status === 'READY' ? "Voir l'audit" : "Lancer l'analyse"}
                        </span>
                        <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <FileSearch className="text-primary h-8 w-8" />
                  </div>
                </EmptyMedia>
                <EmptyTitle className="text-xl">Aucun projet</EmptyTitle>
                <EmptyDescription className="max-w-md">
                  Commencez par ajouter votre premier site web pour effectuer un audit SEO complet. Analysez la santé de
                  votre site, identifiez les problèmes et optimisez vos performances.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <OpenModal />
              </EmptyContent>
            </Empty>
          </section>
        )}
      </div>
    </main>
  )
}
