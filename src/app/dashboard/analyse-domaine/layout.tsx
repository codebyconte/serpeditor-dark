import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analyse de Domaine & WHOIS',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AnalyseDomaineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
