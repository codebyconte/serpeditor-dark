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
}

export default nextConfig
