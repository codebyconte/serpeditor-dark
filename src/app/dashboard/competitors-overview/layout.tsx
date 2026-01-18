import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vue d\'ensemble des Concurrents',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CompetitorsOverviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
