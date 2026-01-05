import RankOverviewContent from './rank-overview-content'

export const metadata = {
 title: "Vue d'ensemble des positions | Rank Tracker",
 description:
 'Suivez vos positions sur Google et analysez vos performances SEO',
}

export default function RankOverviewPage() {
 return (
 <main className="min-h-screen text-foreground">
 <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
 <RankOverviewContent />
 </div>
 </main>
 )
}
