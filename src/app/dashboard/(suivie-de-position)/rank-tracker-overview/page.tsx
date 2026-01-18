import type { Metadata } from 'next'
import RankOverviewContent from './rank-overview-content'

export const metadata: Metadata = {
  title: 'Vue d\'ensemble des Positions SEO',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RankOverviewPage() {
  return (
    <main className="text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <RankOverviewContent />
      </div>
    </main>
  )
}
