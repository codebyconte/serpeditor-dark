import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparateur SERP Historique',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ComparateurSERPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
