import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getSession } from '@/lib/server-utils'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

/**
 * Metadata for all dashboard pages
 * Prevents indexing as these are private/authenticated pages
 */
export const metadata: Metadata = {
  title: {
    default: 'Dashboard | SerpEditor',
    template: '%s | Dashboard SerpEditor',
  },
  description: 'Tableau de bord SerpEditor - Outils SEO professionnels',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
}

/**
 * Dashboard layout with auth protection
 * Uses React.cache() for per-request session deduplication
 */
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-[40%] -top-[40%] h-[80%] w-[80%] rounded-full bg-linear-to-br from-primary/5 via-primary/3 to-transparent blur-3xl" />
        <div className="absolute -bottom-[40%] -right-[40%] h-[80%] w-[80%] rounded-full bg-linear-to-tl from-blue-500/5 via-purple-500/3 to-transparent blur-3xl" />
      </div>

      <SidebarProvider>
        <AppSidebar className="border-r border-white/5 bg-mist-900/95 backdrop-blur-xl" />
        <SidebarInset className="relative z-10">
          {/* Premium Header */}
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-white/5 bg-mist-900/80 backdrop-blur-xl transition-all duration-300 ease-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 transition-colors duration-200" />
                <div className="hidden h-4 w-px bg-white/10 sm:block" />
                <span className="hidden text-xs font-medium text-muted-foreground sm:block">Dashboard</span>
              </div>
              {/* Subtle gradient line at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            </div>
          </header>

          {/* Main content area with premium styling */}
          <div className="relative flex flex-1 flex-col bg-linear-to-b from-mist-800 to-mist-900">
            {/* Subtle grid pattern overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <main className="relative z-10 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
