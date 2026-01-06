// 📁 components/sidebar-logo.tsx
'use client'

import { ChartNoAxesCombined } from 'lucide-react'
import Link from 'next/link'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href="/dashboard">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <ChartNoAxesCombined className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="text-foreground truncate font-serif text-2xl">Serpeditor</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
