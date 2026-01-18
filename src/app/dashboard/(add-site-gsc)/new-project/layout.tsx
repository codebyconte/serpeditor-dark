import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nouveau Projet',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NewProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
