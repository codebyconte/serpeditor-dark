// 📁 app/dashboard/backlinks/nouveaux-perdus/page.tsx
import { NewLostBacklinksContent } from './new-lost-backlinks-content'

export const metadata = {
  title: 'Backlinks Nouveaux & Perdus | Dashboard SEO',
  description: "Suivez l'évolution temporelle de vos backlinks : nouveaux liens acquis et liens perdus",
}

export default function NewLostBacklinksPage() {
  return (
    <main className="text-foreground min-h-screen">
      <NewLostBacklinksContent />
    </main>
  )
}
