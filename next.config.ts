import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.tailwindplus.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimize package imports - transforms barrel imports to direct imports at build time
  // This provides 15-70% faster dev boot, 28% faster builds, 40% faster cold starts
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tabler/icons',
      'react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@headlessui/react',
      '@heroicons/react',
      'date-fns',
      'recharts',
    ],
  },
  // En-têtes de sécurité HTTP - Conforme aux meilleures pratiques Vercel/Next.js
  // Répond aux exigences de la règle NEXTJS_MISSING_SECURITY_HEADERS de Vercel
  async headers() {
    return [
      {
        // Appliquer les en-têtes de sécurité à toutes les routes
        source: '/(.*)',
        headers: [
          // Content-Security-Policy (CSP) - Protection contre XSS et injection
          // Note: 'unsafe-inline' et 'unsafe-eval' nécessaires pour Next.js et Sanity
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://vercel.live https://*.vercel-insights.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://cdn.sanity.io https://assets.tailwindplus.com https://vercel.live",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://vercel.live https://*.vercel-insights.com https://va.vercel-scripts.com https://www.googleapis.com wss://*.sanity.io",
              "frame-src 'self' https://vercel.live",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'", // Plus strict que X-Frame-Options pour navigateurs modernes
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Strict-Transport-Security (HSTS) - Force HTTPS
          // max-age=63072000 = 2 ans (recommandation Vercel/Next.js)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // X-Frame-Options - Empêche le clickjacking (compatibilité navigateurs anciens)
          // DENY pour sécurité maximale (CSP frame-ancestors gère les navigateurs modernes)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options - Empêche le MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer-Policy - Contrôle les informations de référent envoyées
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy (anciennement Feature-Policy)
          // Restreint l'accès aux API sensibles du navigateur
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },
          // X-DNS-Prefetch-Control - Optimisation performance (pré-résolution DNS)
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // X-XSS-Protection - Protection XSS (déprécié mais encore utile pour anciens navigateurs)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
