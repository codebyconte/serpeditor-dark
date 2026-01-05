// 📁 app/dashboard/backlinks/domaines-referents/page.tsx
import { ReferringDomainsContent } from './referring-domains-content'

export const metadata = {
  title: 'Domaines Référents | Dashboard SEO',
  description:
    'Analysez tous les domaines qui pointent des backlinks vers votre site',
}

export default function ReferringDomainsPage() {
  return (
    <main className="min-h-screen text-foreground">
      <ReferringDomainsContent />
    </main>
  )
}
