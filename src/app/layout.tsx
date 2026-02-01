import { ClientToaster } from '@/components/client-toaster'
import { Main } from '@/components/elements/main'
import { Analytics } from "@vercel/analytics/next"
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
  metadataBase: new URL("https://www.serpeditor.fr"),
  title: {
    default: "SerpEditor | Outil SEO Tout-en-un : Audit, Mots-clés & Tracking",
    template: "%s | SerpEditor", 
  },
  description: "Boostez votre visibilité avec SerpEditor : Audit SEO complet, recherche de mots-clés (213M+ FR) et suivi de positions. L'alternative française n°1 pour votre référencement.",
  keywords: ["audit seo", "recherche de mots cles", "analyse seo", "outil seo français", "suivi de positions Google"],
  authors: [{ name: "SerpEditor Team", url: "https://www.serpeditor.fr" }],
  creator: "SerpEditor",
  publisher: "SerpEditor",
  applicationName: "SerpEditor",
  
  // Open Graph (Pour le partage sur Facebook, LinkedIn, etc.)
  openGraph: {
    title: "SerpEditor - Dominez les résultats de recherche Google",
    description: "Analysez votre site gratuitement et trouvez les meilleurs mots-clés avec notre base de données massive pour le marché français.",
    url: "https://www.serpeditor.fr",
    siteName: "SerpEditor",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aperçu de la plateforme SerpEditor",
      },
    ],
    locale: "fr_FR", 
    type: "website",
  },
  
  // Twitter (X)
  twitter: {
    card: "summary_large_image",
    title: "SerpEditor | Votre allié pour le SEO Français",
    description: "Audits techniques et recherche de mots-clés simplifiés.",
    creator: "@serpeditor", 
    images: ["/og-image.jpg"],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons
// Icons
icons: {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" }, // Le standard moderne (Scalable)
    { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }, // Pour les anciens navigateurs
  ],
  shortcut: "/favicon.ico", // Pour la compatibilité maximale
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, // Pour l'icône sur iPhone/iPad
  ],
},
manifest: "/site.webmanifest", // Très important pour Android et le SEO mobile
};


/**
 * JSON-LD Schema pour le SEO structuré
 * - Organization : Informations sur l'entreprise
 * - WebSite : Informations sur le site avec SearchAction pour sitelinks
 * @see https://schema.org/Organization
 * @see https://schema.org/WebSite
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.serpeditor.fr/#organization",
      "name": "SerpEditor",
      "url": "https://www.serpeditor.fr",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.serpeditor.fr/logo.png",
        "width": 180,
        "height": 60,
        "caption": "SerpEditor - Outil SEO Français"
      },
      "image": "https://www.serpeditor.fr/og-image.jpg",
      "sameAs": [
        "https://x.com/serpeditor",
        "https://www.facebook.com/profile.php?id=61586300626787",
        "https://www.youtube.com/channel/UCClqn8e1fy2SFNPRJZXpp3Q",
        "https://www.tiktok.com/@serpeditor"
      ],
      "description": "Plateforme SEO française tout-en-un pour l'audit, la recherche de mots-clés et le suivi de positions.",
      "foundingDate": "2024",
      "slogan": "L'alternative française aux outils SEO américains"
    },
    {
      "@type": "WebSite",
      "@id": "https://www.serpeditor.fr/#website",
      "url": "https://www.serpeditor.fr",
      "name": "SerpEditor",
      "description": "Outil SEO tout-en-un : Audit technique, recherche de mots-clés et suivi de positions Google",
      "publisher": { "@id": "https://www.serpeditor.fr/#organization" },
      "inLanguage": "fr-FR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.serpeditor.fr/dashboard/keyword-magic?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* JSON-LD inline pour une indexation immédiate par les robots */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Main>{children}</Main>
        {/* Client-side Toaster with dynamic import for better TTI */}
        <ClientToaster />
        <Analytics />
      </body>
    </html>
  )
}
