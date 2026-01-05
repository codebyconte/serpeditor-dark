// 📁 app/dashboard/mots-cles-organiques/page.tsx
import { OrganicKeywordsContent } from './organic-keywords-content'

export const metadata = {
  title: 'Mots-Clés Organiques | Dashboard SEO',
  description:
    'Analysez tous les mots-clés sur lesquels votre domaine se positionne dans Google',
}

export default function OrganicKeywordsPage() {
  return (
    <main className="min-h-screen text-foreground">
      <OrganicKeywordsContent />
    </main>
  )
}
