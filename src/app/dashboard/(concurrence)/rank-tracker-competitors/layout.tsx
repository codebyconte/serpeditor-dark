import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suivi Positions Concurrents',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RankTrackerCompetitorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
