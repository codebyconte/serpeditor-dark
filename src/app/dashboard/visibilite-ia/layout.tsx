import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visibilité IA & GEO SEO',
  robots: {
    index: false,
    follow: false,
  },
}

export default function VisibiliteIALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
