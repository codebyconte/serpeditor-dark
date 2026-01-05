// 📁 components/dashboard/quick-actions.tsx
import { Card, CardContent } from '@/components/ui/card'
import {
  BarChart3,
  FileSearch,
  Link2,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export function QuickActions({ projectId }: { projectId: string }) {
  const actions = [
    {
      title: 'Mots-clés organiques',
      description: 'Voir vos positions',
      href: '/dashboard/mots-cles-organiques',
      icon: Search,
      color: 'blue',
    },
    {
      title: 'Audit de site',
      description: 'Analyser votre site',
      href: `/dashboard/audit-de-site/${projectId}`,
      icon: FileSearch,
      color: 'purple',
    },
    {
      title: 'Backlinks',
      description: 'Profil de liens',
      href: '/dashboard/backlinks',
      icon: Link2,
      color: 'green',
    },
    {
      title: 'Analyse SERP',
      description: 'Étudier la concurrence',
      href: '/dashboard/analyse-serp',
      icon: BarChart3,
      color: 'orange',
    },
    {
      title: 'Suivi positions',
      description: 'Tracker vos mots-clés',
      href: '/dashboard/suivi-positions',
      icon: TrendingUp,
      color: 'pink',
    },
    {
      title: 'Concurrents',
      description: 'Analyser la compétition',
      href: '/dashboard/analyse-concurrents',
      icon: Target,
      color: 'red',
    },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Actions rapides</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="group cursor-pointer transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`rounded-lg bg-${action.color}-100 p-3 dark:bg-${action.color}-900/20`}
                >
                  <action.icon
                    className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400`}
                  />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
