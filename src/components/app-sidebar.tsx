// 📁 components/app-sidebar.tsx
'use client'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { SidebarLogo } from '@/components/sidebar-logo'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import {
  BrainCircuit,
  GlobeIcon,
  LayoutDashboard,
  Link,
  MoreHorizontal,
  Search,
  ShieldAlert,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

import * as React from 'react'

export const data = {
  navMain: [
    {
      title: 'Tableau de bord',
      url: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'Concurrence',
      icon: Target,
      items: [
        {
          title: "Vue d'ensemble",
          url: '/dashboard/domaine-overview',
        },
        {
          title: 'Recherche organiques',
          url: '/dashboard/keyword-organic',
        },
        {
          title: 'Écart de mots-clés',
          url: '/dashboard/ecart-mots-cles',
        },
        {
          title: 'Écart de backlinks',
          url: '/dashboard/ecart-backlinks',
        },
      ],
    },
    {
      title: 'Mots-clés',
      icon: Search,
      badge: 'Core',
      items: [
        {
          title: 'Recherche de mots-clés',
          url: '/dashboard/keyword-magic',
          badge: 'Popular',
        },
        {
          title: 'Analyse de mot-clé',
          url: '/dashboard/keyword-overview',
        },
      ],
    },
    {
      title: 'Suivi de positions',
      icon: TrendingUp,
      badge: 'Core',
      items: [
        {
          title: 'Synthèse des positions',
          url: '/dashboard/rank-tracker-overview',
        },
        {
          title: 'Pages positionnées',
          url: '/dashboard/pages-principales',
        },
        {
          title: 'Analyse SERP',
          url: '/dashboard/analyse-serp',
        },
        {
          title: 'Concurrents SEO',
          url: '/dashboard/rank-tracker-competitors',
        },
      ],
    },
    {
      title: 'Backlinks',
      icon: Link,
      badge: 'Core',
      items: [
        {
          title: "Vue d'ensemble",
          url: '/dashboard/backlinks-overview',
        },
        {
          title: 'Tous les backlinks',
          url: '/dashboard/backlinks',
        },
        {
          title: 'Domaines référents',
          url: '/dashboard/backlinks-domaines-referents',
        },
        {
          title: 'Ancres',
          url: '/dashboard/backlinks-ancres',
        },
        {
          title: 'Nouveaux / Perdus',
          url: '/dashboard/backlinks-nouveaux-perdus',
        },
      ],
    },
    {
      title: 'Audit de site',
      icon: ShieldAlert,
      badge: 'Core',
      items: [
        {
          title: 'Audit technique',
          url: '/dashboard/audit-de-site',
        },
      ],
    },
  ],

  advancedTools: {
    title: "Plus d'outils",
    icon: MoreHorizontal,
    position: 'bottom',
    items: [
      {
        title: 'Visibilité IA',
        url: '/dashboard/visibilite-ia',
        icon: BrainCircuit,
        badge: 'New',
      },
      {
        title: 'Analyse de domaine WHOIS',
        url: '/dashboard/analyse-domaine',
        icon: GlobeIcon,
      },
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Plateforme" />
        <NavMain
          items={data.advancedTools.items
            .filter((item) => typeof item === 'object' && item !== null)
            .map((item) => {
              const navItem = item as {
                title: string
                url: string
                icon?: LucideIcon
              }
              return {
                title: navItem.title,
                url: navItem.url,
                icon: navItem.icon,
              }
            })}
          label={data.advancedTools.title}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
