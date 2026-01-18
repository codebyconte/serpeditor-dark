import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getSession } from '@/lib/server-utils'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

/**
 * Métadonnées par défaut pour toutes les pages du dashboard
 * Empêche l'indexation car ce sont des pages privées/authentifiées
 */
export const metadata: Metadata = {
  title: {
    default: 'Dashboard | SerpEditor',
    template: '%s | Dashboard SerpEditor',
  },
  description: 'Tableau de bord SerpEditor - Outils SEO professionnels',
  robots: {
    index: false, // Empêche l'indexation de toutes les pages du dashboard
    follow: false, // Empêche aussi le suivi des liens
    googleBot: {
      index: false,
      follow: false,
      'noimageindex': true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  // Pas de Open Graph ni Twitter car c'est privé
  // Les métadonnées robots au niveau racine suffisent
}

/**
 * Dashboard layout with auth protection
 * Uses React.cache() for per-request session deduplication
 */
export default async function Layout({ children }: { children: React.ReactNode }) {
  // Uses cached session - if child components also need session,
  // they can call getSession() without hitting auth again
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <section className="min-h-screen">
      <SidebarProvider>
        <AppSidebar className="bg-mist-900" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-mist-900 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 bg-mist-900 px-4">
              <SidebarTrigger className="text-foreground -ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 bg-mist-800 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
