// 📁 app/dashboard/mots-cles-organiques/page.tsx
import type { Metadata } from 'next'
import { Activity, TrendingUp, Users } from 'lucide-react'
import { OrganicKeywordsContent } from './organic-keywords-content'

export const metadata: Metadata = {
  title: 'Mots-Clés Organiques Concurrents',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OrganicKeywordsPage() {
  return (
    <main className="text-foreground min-h-screen">
      <OrganicKeywordsContent />
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* 3 colonnes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-card rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="text-muted-foreground h-5 w-5" />
              <h3 className="text-muted-foreground font-semibold">Identifiez vos tops</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Découvrez quels mots-clés génèrent le plus de trafic et identifiez les opportunités de contenu à créer ou
              optimiser.
            </p>
          </div>

          <div className="bg-card rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="text-muted-foreground h-5 w-5" />
              <h3 className="text-muted-foreground font-semibold">Espionnez vos concurrents</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Entrez le domaine d&apos;un concurrent pour voir tous ses mots-clés positionnés et repérer ce qui manque à
              votre stratégie.
            </p>
          </div>

          <div className="bg-card rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="text-muted-foreground h-5 w-5" />
              <h3 className="text-muted-foreground font-semibold">Suivez l&apos;évolution</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Observez les changements de position dans le temps pour identifier vos tactiques gagnantes et vos marges
              d&apos;amélioration.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
