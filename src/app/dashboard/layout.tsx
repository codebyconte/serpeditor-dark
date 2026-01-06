import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/login')
  }

  return (
    <section className="min-h-screen">
      <SidebarProvider>
        <AppSidebar className="bg-mist-950" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-mist-950 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 bg-mist-950 px-4">
              <SidebarTrigger className="text-foreground -ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 bg-mist-900 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
