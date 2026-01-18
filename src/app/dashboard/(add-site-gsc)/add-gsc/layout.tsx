import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Import Google Search Console',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AddGSCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
