// 📁 app/dashboard/keywords/page.tsx
import { KeywordOverviewContent } from './keyword-overview-content'

export const metadata = {
  title: 'Analyse de Mots-Clés | Dashboard SEO',
  description:
    'Analysez les mots-clés Google : volume, CPC, concurrence et tendances',
}

export default function KeywordsPage() {
  return (
    <main className="min-h-screen text-foreground">
      <KeywordOverviewContent />
    </main>
  )
}
