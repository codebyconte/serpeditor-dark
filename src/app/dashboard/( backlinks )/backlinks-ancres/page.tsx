// 📁 app/dashboard/backlinks/ancres/page.tsx
import { AnchorsContent } from './anchors-content'

export const metadata = {
 title: 'Analyse des Ancres | Dashboard SEO',
 description:
 "Analysez les textes d'ancre utilisés dans vos backlinks pour optimiser votre profil de liens",
}

export default function AnchorsPage() {
 return (
 <main className="min-h-screen text-foreground">
 <AnchorsContent />
 </main>
 )
}
