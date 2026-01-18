import { Main } from '@/components/elements/main'
import { ClientToaster } from '@/components/client-toaster'
import 'easymde/dist/easymde.min.css'
import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'

// Optimized font loading with next/font (automatic font optimization)
// Benefits: Self-hosted, no layout shift, automatic subsetting
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'SerpEditor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className={inter.className}>
        <Main>{children}</Main>
        {/* Client-side Toaster with dynamic import for better TTI */}
        <ClientToaster />
      </body>
    </html>
  )
}
