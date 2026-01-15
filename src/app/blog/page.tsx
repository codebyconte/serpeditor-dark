import { BlogCategoryFilter, BlogPostsGrid, FeaturedPost } from '@/components/blog'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { YouTubeIcon } from '@/components/icons/social/youtube-icon'
import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/components/sections/navbar-with-links-actions-and-centered-logo'
import {
  generateArticleListStructuredData,
  generateWebsiteStructuredData,
  renderStructuredData,
} from '@/lib/structuredData'
import { client } from '@/sanity/lib/client'
import {
  BLOG_POSTS_QUERY,
  BLOG_STATS_QUERY,
  CATEGORIES_WITH_COUNT_QUERY,
  FEATURED_POST_QUERY,
  POSTS_COUNT_QUERY,
} from '@/sanity/lib/seo-queries'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { BookOpen, FolderOpen, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Blog - Articles SEO et Marketing Digital | SerpEditor',
  description:
    "Découvrez nos articles sur le SEO, le marketing digital et les meilleures pratiques pour améliorer votre visibilité en ligne. Guides, tutoriels et conseils d'experts.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Blog - Articles SEO et Marketing Digital | SerpEditor',
    description:
      'Découvrez nos articles sur le SEO, le marketing digital et les meilleures pratiques pour améliorer votre visibilité en ligne.',
    url: `${baseUrl}/blog`,
    siteName: 'SerpEditor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Articles SEO et Marketing Digital | SerpEditor',
    description:
      'Découvrez nos articles sur le SEO, le marketing digital et les meilleures pratiques pour améliorer votre visibilité en ligne.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const { projectId, dataset } = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source).url() : null

const options = { next: { revalidate: 30 } }

const POSTS_PER_PAGE = 12

interface Category {
  _id: string
  title: string
  slug: { current: string }
  color?: string
  postCount?: number
}

interface Author {
  name: string
  image?: SanityImageSource
  role?: string
}

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  image?: SanityImageSource
  publishedAt: string
  readingTime?: number
  featured?: boolean
  author?: Author
  categories?: Array<{
    title: string
    slug: { current: string }
    color?: string
  }>
}

interface BlogStats {
  totalPosts: number
  totalCategories: number
  totalAuthors: number
}

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

// Stats Card Component - Design amélioré
function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) {
  return (
    <div className="group hover:border-primary/30 relative overflow-hidden rounded-2xl border border-mist-200 bg-mist-50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-mist-800 dark:bg-mist-950">
      <div className="relative flex items-center gap-4">
        <div className="bg-primary/10 group-hover:bg-primary/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="text-primary h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-3xl font-bold text-mist-950 dark:text-white">{value}</p>
          <p className="mt-1 text-sm font-medium text-mist-700 dark:text-mist-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for posts
function PostsGridSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-mist-200 bg-mist-50 dark:border-mist-800 dark:bg-mist-950"
        >
          <div className="aspect-video bg-mist-200 dark:bg-mist-800" />
          <div className="p-6">
            <div className="mb-3 h-4 w-24 rounded bg-mist-200 dark:bg-mist-800" />
            <div className="mb-2 h-6 w-full rounded bg-mist-200 dark:bg-mist-800" />
            <div className="mb-4 h-4 w-3/4 rounded bg-mist-200 dark:bg-mist-800" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-mist-200 dark:bg-mist-800" />
              <div className="flex-1">
                <div className="mb-1 h-4 w-24 rounded bg-mist-200 dark:bg-mist-800" />
                <div className="h-3 w-16 rounded bg-mist-200 dark:bg-mist-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentCategory = params.category || ''
  const currentPage = parseInt(params.page || '1', 10)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  // Fetch all data in parallel
  const [categories, featuredPost, posts, totalCount, stats] = await Promise.all([
    client.fetch<Category[]>(CATEGORIES_WITH_COUNT_QUERY, {}, options),
    client.fetch<Post | null>(FEATURED_POST_QUERY, {}, options),
    client.fetch<Post[]>(BLOG_POSTS_QUERY, { category: currentCategory, start, end }, options),
    client.fetch<number>(POSTS_COUNT_QUERY, { category: currentCategory }, options),
    client.fetch<BlogStats>(BLOG_STATS_QUERY, {}, options),
  ])

  // Filter out featured post from main list to avoid duplication
  const displayPosts = featuredPost && !currentCategory ? posts.filter((p) => p._id !== featuredPost._id) : posts

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  // Generate structured data
  const articleListStructuredData = generateArticleListStructuredData(
    posts.map((post) => ({
      title: post.title,
      slug: post.slug.current,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
    })),
    baseUrl,
  )
  const websiteStructuredData = generateWebsiteStructuredData(baseUrl)

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      ...(currentCategory
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: categories.find((c) => c.slug.current === currentCategory)?.title || currentCategory,
              item: `${baseUrl}/blog?category=${currentCategory}`,
            },
          ]
        : []),
    ],
  }

  const featuredImageUrl = featuredPost?.image ? urlFor(featuredPost.image) : null
  const featuredAuthorImageUrl = featuredPost?.author?.image ? urlFor(featuredPost.author.image) : null

  // Convertir les URLs d'images côté serveur pour éviter de passer la fonction urlFor au Client Component
  const postsWithImageUrls = displayPosts.map((post) => ({
    ...post,
    image: post.image ? urlFor(post.image) : null,
    author: post.author
      ? {
          ...post.author,
          image: post.author.image ? urlFor(post.author.image) : null,
        }
      : undefined,
  }))

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(articleListStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(breadcrumbStructuredData) }}
      />

      <NavbarWithLinksActionsAndCenteredLogo
        id="navbar"
        links={
          <>
            <NavbarLink href="/pricing">Pricing</NavbarLink>
            <NavbarLink href="/blog">Blog</NavbarLink>
            <NavbarLink href="/login" className="sm:hidden">
              Log in
            </NavbarLink>
          </>
        }
        logo={
          <NavbarLogo href="/">
            <Image
              src="https://assets.tailwindplus.com/logos/oatmeal-instrument.svg?color=mist-950"
              alt="SerpEditor"
              className="dark:hidden"
              width={85}
              height={28}
            />
            <Image
              src="https://assets.tailwindplus.com/logos/oatmeal-instrument.svg?color=white"
              alt="SerpEditor"
              className="not-dark:hidden"
              width={85}
              height={28}
            />
          </NavbarLogo>
        }
        actions={
          <>
            <PlainButtonLink href="/login" className="max-sm:hidden">
              Log in
            </PlainButtonLink>
            <ButtonLink href="/register">Get started</ButtonLink>
          </>
        }
      />

      <Main>
        {/* Hero Section - Simple comme les autres pages */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Breadcrumb amélioré */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary dark:hover:text-primary text-mist-700 transition-colors dark:text-mist-400"
                  >
                    Accueil
                  </Link>
                </li>
                <li className="text-mist-500 dark:text-mist-600">/</li>
                <li className="font-medium text-mist-950 dark:text-white">Blog</li>
                {currentCategory && (
                  <>
                    <li className="text-mist-500 dark:text-mist-600">/</li>
                    <li className="text-primary font-medium">
                      {categories.find((c) => c.slug.current === currentCategory)?.title}
                    </li>
                  </>
                )}
              </ol>
            </nav>

            {/* Hero Content amélioré */}
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-display text-4xl font-bold tracking-tight text-mist-950 sm:text-5xl lg:text-6xl dark:text-white">
                Notre <span className="text-primary">Blog</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-mist-700 sm:text-xl dark:text-mist-400">
                Découvrez nos articles, guides et tutoriels sur le SEO, le marketing digital et les meilleures pratiques
                pour booster votre visibilité en ligne.
              </p>
            </div>

            {/* Stats améliorées */}
            <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
              <StatCard icon={BookOpen} value={stats.totalPosts} label="Articles publiés" />
              <StatCard icon={FolderOpen} value={stats.totalCategories} label="Catégories" />
              <StatCard icon={Users} value={stats.totalAuthors} label="Auteurs experts" />
            </div>
          </div>
        </section>

        {/* Featured Post - Section améliorée */}
        {featuredPost && !currentCategory && (
          <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mb-8 text-center">
              <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
                Article en vedette
              </span>
            </div>
            <FeaturedPost
              title={featuredPost.title}
              slug={featuredPost.slug.current}
              excerpt={featuredPost.excerpt}
              image={featuredImageUrl}
              publishedAt={featuredPost.publishedAt}
              readingTime={featuredPost.readingTime}
              author={
                featuredPost.author
                  ? {
                      name: featuredPost.author.name,
                      image: featuredAuthorImageUrl,
                      role: featuredPost.author.role,
                    }
                  : undefined
              }
              categories={featuredPost.categories}
            />
          </section>
        )}

        {/* Category Filter & Posts - Section améliorée */}
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          {/* Category Filter amélioré */}
          {categories.length > 0 && (
            <div className="mb-16 rounded-2xl border border-mist-200 bg-mist-50 p-6 shadow-sm dark:border-mist-800 dark:bg-mist-950">
              <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-mist-200 dark:bg-mist-800" />}>
                <BlogCategoryFilter categories={categories} totalPosts={stats.totalPosts} />
              </Suspense>
            </div>
          )}

          {/* Section Header amélioré */}
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-mist-950 sm:text-4xl dark:text-white">
                {currentCategory
                  ? categories.find((c) => c.slug.current === currentCategory)?.title || 'Articles'
                  : 'Tous les articles'}
              </h2>
              <p className="mt-2 text-base text-mist-700 dark:text-mist-400">
                {totalCount} article{totalCount > 1 ? 's' : ''} disponible{totalCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Posts Grid */}
          <Suspense fallback={<PostsGridSkeleton />}>
            <BlogPostsGrid posts={postsWithImageUrls} currentCategory={currentCategory || null} />
          </Suspense>

          {/* Pagination améliorée */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-2">
              {/* Previous */}
              {currentPage > 1 && (
                <Link
                  href={`/blog?${new URLSearchParams({
                    ...(currentCategory && { category: currentCategory }),
                    page: String(currentPage - 1),
                  })}`}
                  className="hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 rounded-lg border border-mist-300 bg-mist-50 px-4 py-2 text-sm font-medium text-mist-700 transition-all dark:border-mist-700 dark:bg-mist-950 dark:text-mist-300"
                >
                  Précédent
                </Link>
              )}

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first, last, and pages around current
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .map((page, idx, arr) => {
                    // Add ellipsis where there are gaps
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1
                    return (
                      <span key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-mist-400 dark:text-mist-600">...</span>}
                        <Link
                          href={`/blog?${new URLSearchParams({
                            ...(currentCategory && { category: currentCategory }),
                            page: String(page),
                          })}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            page === currentPage
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'hover:text-primary text-mist-700 hover:bg-mist-100 dark:text-mist-300 dark:hover:bg-mist-800'
                          }`}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </Link>
                      </span>
                    )
                  })}
              </div>

              {/* Next */}
              {currentPage < totalPages && (
                <Link
                  href={`/blog?${new URLSearchParams({
                    ...(currentCategory && { category: currentCategory }),
                    page: String(currentPage + 1),
                  })}`}
                  className="hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 rounded-lg border border-mist-300 bg-mist-50 px-4 py-2 text-sm font-medium text-mist-700 transition-all dark:border-mist-700 dark:bg-mist-950 dark:text-mist-300"
                >
                  Suivant
                </Link>
              )}
            </nav>
          )}
        </section>
      </Main>

      <FooterWithNewsletterFormCategoriesAndSocialIcons
        id="footer"
        cta={
          <NewsletterForm
            headline="Restez informé"
            subheadline={
              <p>Recevez nos derniers articles sur le SEO et le marketing digital directement dans votre boîte mail.</p>
            }
            action="#"
          />
        }
        links={
          <>
            <FooterCategory title="Product">
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Integrations</FooterLink>
            </FooterCategory>
            <FooterCategory title="Company">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </FooterCategory>
            <FooterCategory title="Resources">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">API Docs</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterCategory>
            <FooterCategory title="Legal">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </FooterCategory>
          </>
        }
        fineprint="© 2025 SerpEditor, Inc."
        socialLinks={
          <>
            <SocialLink href="https://x.com" name="X">
              <XIcon />
            </SocialLink>
            <SocialLink href="https://github.com" name="GitHub">
              <GitHubIcon />
            </SocialLink>
            <SocialLink href="https://www.youtube.com" name="YouTube">
              <YouTubeIcon />
            </SocialLink>
          </>
        }
      />
    </>
  )
}
