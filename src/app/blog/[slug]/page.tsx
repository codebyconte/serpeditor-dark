import {
  AuthorCard,
  CopyCodeButton,
  ImageLightbox,
  ReadingProgressBar,
  RelatedArticles,
  SocialShareButtons,
  StickyArticleHeader,
  TableOfContents,
} from '@/components/blog'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { FacebookIcon } from '@/components/icons/social/facebook-icon'
import { TiktokIcon } from '@/components/icons/social/tiktok-icon'
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import type { Heading } from '@/hooks'
import { generateArticleStructuredData, generatePostBreadcrumb, renderStructuredData } from '@/lib/structuredData'
import { client } from '@/sanity/lib/client'
import { FAQ_SCHEMA_QUERY, POST_WITH_SEO_QUERY, RELATED_POSTS_QUERY } from '@/sanity/lib/seo-queries'
import { PortableTextReactComponents } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock, type SanityDocument } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import ReactPlayer from 'react-player'

const { projectId, dataset } = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null

const options = { next: { revalidate: 30 } }
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface Post extends SanityDocument {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body: PortableTextBlock[] | null
  image?: SanityImageSource & { alt?: string }
  publishedAt: string
  updatedAt?: string
  lastReviewedAt?: string
  readingTime?: number
  wordCount?: number
  author?: {
    _id: string
    name: string
    role?: string
    image?: SanityImageSource
    bio?: string
    slug?: { current: string }
    email?: string
    website?: string
    social?: {
      linkedin?: string
      twitter?: string
      github?: string
    }
  }
  reviewer?: {
    _id: string
    name: string
    role?: string
  }
  categories?: Array<{
    _id: string
    title: string
    slug: { current: string }
  }>
  tags?: string[]
  focusKeyword?: string
  relatedKeywords?: string[]
  articleSection?: string
  keywords?: string[]
  seo?: {
    title?: string
    description?: string
    image?: SanityImageSource
    canonicalUrl?: string
    noIndex?: boolean
    noFollow?: boolean
    structuredDataType?: string
  }
}

interface RelatedPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  image?: { asset?: { url?: string }; alt?: string }
  author?: { name: string; image?: { asset?: { url?: string } } }
}

// Helper function to create slug from text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Extract headings from Portable Text for TOC (uniquement H2)
function extractHeadings(body: PortableTextBlock[] | null): Heading[] {
  if (!body) return []

  return body
    .filter(
      (block): block is PortableTextBlock & { style: string; children: Array<{ text: string }> } =>
        block._type === 'block' && typeof block.style === 'string' && block.style === 'h2',
    )
    .map((block) => {
      const text = block.children?.map((child) => child.text).join('') || ''
      return {
        id: slugify(text),
        text,
        level: 2,
      }
    })
}

// Get adjacent posts for navigation
const getAdjacentPosts = async (currentSlug: string) => {
  try {
    const query = `*[_type == "post" && defined(slug.current) && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt
    }`
    const posts = await client.fetch(query, {}, options)
    const currentIndex = posts.findIndex((p: { slug: string }) => p.slug === currentSlug)

    return {
      prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des articles adjacents:', error)
    return {
      prev: null,
      next: null,
    }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await client.fetch<Post>(POST_WITH_SEO_QUERY, { slug }, options)

    if (!post) {
      return {
        title: 'Article non trouvé',
        robots: { index: false, follow: false },
      }
    }

  const seoTitle = post.seo?.title || post.title
  const seoDescription = post.seo?.description || post.excerpt || ''
  const imageUrl = post.seo?.image || post.image
  const ogImage = imageUrl ? urlFor(imageUrl)?.width(1200).height(630).url() : undefined
  const canonicalUrl = post.seo?.canonicalUrl || `${baseUrl}/blog/${post.slug.current}`
  const articleUrl = `${baseUrl}/blog/${post.slug.current}`

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: articleUrl,
      siteName: 'SerpEditor',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.image?.alt || post.title }] : [],
      locale: 'fr_FR',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      section: post.articleSection || post.categories?.[0]?.title,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
      creator: post.author?.social?.twitter ? `@${post.author.social.twitter.split('/').pop()}` : undefined,
    },
    robots: {
      index: !post.seo?.noIndex,
      follow: !(post.seo?.noIndex || post.seo?.noFollow),
      googleBot: {
        index: !post.seo?.noIndex,
        follow: !(post.seo?.noIndex || post.seo?.noFollow),
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:author': post.author?.name || '',
      'article:published_time': post.publishedAt,
      'article:modified_time': post.updatedAt || post.publishedAt,
      'article:section': post.articleSection || post.categories?.[0]?.title || '',
      'article:tag': post.tags?.join(', ') || '',
    },
  }
  } catch (error) {
    console.error('❌ Erreur lors de la génération des métadonnées:', error)
    return {
      title: 'Erreur de chargement',
      robots: { index: false, follow: false },
    }
  }
}

// Portable Text Components with enhanced styling
const createPortableTextComponents = (): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: { value: { asset?: SanityImageSource; alt?: string; caption?: string } }) => {
      const imageUrl = value.asset ? urlFor(value.asset)?.width(1200).url() : null
      if (!imageUrl) return null
      return (
        <figure className="my-10">
          <ImageLightbox src={imageUrl} alt={value.alt || ''} caption={value.caption}>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={imageUrl}
                alt={value.alt || ''}
                fill
                className="object-cover transition-transform hover:scale-[1.02]"
              />
            </div>
          </ImageLightbox>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    customImage: ({ value }) => {
      const imageUrl = value.asset ? urlFor(value.asset)?.width(1200).url() : null
      if (!imageUrl) return null

      const sizeClasses = {
        small: 'max-w-md mx-auto',
        medium: 'max-w-2xl mx-auto',
        large: 'max-w-4xl mx-auto',
        full: 'w-full',
      }

      return (
        <figure className={`my-10 ${sizeClasses[value.size as keyof typeof sizeClasses] || sizeClasses.large}`}>
          <ImageLightbox src={imageUrl} alt={value.alt || ''} caption={value.caption}>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={imageUrl}
                alt={value.alt || ''}
                fill
                className="object-cover transition-transform hover:scale-[1.02]"
              />
            </div>
          </ImageLightbox>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    youtube: ({ value }: { value: { url?: string } }) => {
      if (!value.url) return null
      return (
        <div className="my-10 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <ReactPlayer src={value.url} width="100%" height="100%" />
        </div>
      )
    },
    code: ({ value }) => {
      return (
        <div className="relative my-10">
          <CopyCodeButton code={value.code} />
          <pre className="border-border overflow-x-auto rounded-xl border bg-mist-950 p-5 text-sm leading-relaxed text-mist-100">
            <code>{value.code}</code>
          </pre>
        </div>
      )
    },
    ctaBlock: ({ value }) => {
      const styleClasses = {
        primary: 'bg-primary text-primary-foreground border-primary',
        info: 'bg-blue-500 text-white border-blue-500',
        success: 'bg-green-500 text-white border-green-500',
        warning: 'bg-mist-500 text-white border-mist-500',
      }

      return (
        <Card
          className={`my-10 border-2 ${styleClasses[value.style as keyof typeof styleClasses] || styleClasses.primary}`}
        >
          <CardContent className="p-8">
            {value.heading && <h3 className="mb-3 text-xl font-semibold">{value.heading}</h3>}
            {value.description && <p className="mb-5 opacity-90">{value.description}</p>}
            {value.buttonText && value.buttonLink && (
              <a
                href={value.buttonLink}
                target={value.openInNewTab ? '_blank' : '_self'}
                rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
                className="inline-block rounded-lg bg-white/20 px-6 py-3 font-medium transition-colors hover:bg-white/30"
              >
                {value.buttonText}
              </a>
            )}
          </CardContent>
        </Card>
      )
    },
    infoBox: ({ value }) => {
      const typeStyles = {
        tip: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40',
        info: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50',
        warning: 'border-mist-300 bg-mist-50 dark:border-mist-700 dark:bg-mist-950/40',
        danger: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40',
        note: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/40',
      }

      const icons = {
        tip: '💡',
        info: 'ℹ️',
        warning: '⚠️',
        danger: '🚨',
        note: '📝',
      }

      return (
        <Card className={`my-10 border-2 ${typeStyles[value.type as keyof typeof typeStyles] || typeStyles.info}`}>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <span className="text-2xl">{icons[value.type as keyof typeof icons] || icons.info}</span>
              <div className="flex-1">
                {value.title && <h4 className="text-foreground mb-2 font-semibold">{value.title}</h4>}
                {value.content && (
                  <div className="text-sm">
                    <PortableText value={value.content} />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    faqBlock: ({
      value,
    }: {
      value: { title?: string; questions?: Array<{ question: string; answer?: PortableTextBlock[] }> }
    }) => {
      if (!value.questions || value.questions.length === 0) return null

      return (
        <Card className="border-primary/20 bg-primary/5 my-10 border-2">
          <CardContent className="p-8">
            {value.title && <h3 className="text-foreground mb-6 text-2xl">{value.title}</h3>}
            <Accordion type="single" collapsible className="w-full">
              {value.questions.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-border border-b last:border-0">
                  <AccordionTrigger className="text-foreground text-left text-xl font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  {faq.answer && (
                    <AccordionContent className="text-muted-foreground pt-4">
                      <PortableText value={faq.answer} />
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )
    },
    table: ({ value }: { value: { rows?: Array<{ cells?: string[] }> } }) => {
      if (!value.rows || value.rows.length === 0) return null
      const numColumns = value.rows[0]?.cells?.length || 0
      if (numColumns === 0) return null

      return (
        <div className="border-border my-10 overflow-x-auto rounded-xl border">
          <table className="divide-border min-w-full divide-y">
            <thead className="bg-muted">
              {value.rows[0] && (
                <tr>
                  {value.rows[0].cells?.map((cell, idx) => (
                    <th key={idx} className="text-foreground px-5 py-4 text-left text-sm font-semibold">
                      {cell || ''}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody className="divide-border bg-card divide-y">
              {value.rows.slice(1).map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-muted/50 transition-colors">
                  {row.cells?.map((cell, cellIdx) => (
                    <td key={cellIdx} className="text-muted-foreground px-5 py-4 text-sm">
                      {cell || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  },
  block: {
    h2: ({ children, value }) => {
      const text = (value.children as Array<{ text?: string }>)?.map((child) => child.text || '').join('') || ''
      const id = slugify(text)
      return (
        <h2 id={id} className="text-foreground mt-12 mb-6 text-3xl tracking-tight">
          {children}
        </h2>
      )
    },
    h3: ({ children, value }) => {
      const text = (value.children as Array<{ text?: string }>)?.map((child) => child.text || '').join('') || ''
      const id = slugify(text)
      return (
        <h3 id={id} className="text-foreground mt-10 mb-4 text-2xl tracking-tight">
          {children}
        </h3>
      )
    },
    h4: ({ children }) => <h4 className="text-foreground mt-8 mb-3 text-xl">{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground marker:text-mist-600 dark:marker:text-mist-400 my-6 ml-6 list-outside list-disc space-y-3">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground marker:text-mist-600 dark:marker:text-mist-400 my-6 ml-6 list-outside list-decimal space-y-3 marker:font-semibold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
  },
})

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fonction helper pour gérer les erreurs de fetch
  const safeFetch = async <T,>(
    fetchFn: () => Promise<T>,
    fallback: T,
    errorMessage: string,
  ): Promise<T> => {
    try {
      return await fetchFn()
    } catch (error) {
      console.error(`❌ ${errorMessage}:`, error)
      return fallback
    }
  }

  // Récupérer les données avec gestion d'erreur pour chaque appel
  const [post, faqData, relatedData, adjacentPosts] = await Promise.all([
    safeFetch(
      () => client.fetch<Post>(POST_WITH_SEO_QUERY, { slug }, options),
      null as Post | null,
      `Erreur lors de la récupération de l'article ${slug}`,
    ),
    safeFetch(
      () => client.fetch(FAQ_SCHEMA_QUERY, { slug }, options),
      null,
      `Erreur lors de la récupération des FAQ pour ${slug}`,
    ),
    safeFetch(
      () => client.fetch<{ relatedPosts: RelatedPost[] }>(RELATED_POSTS_QUERY, { slug }, options),
      { relatedPosts: [] },
      `Erreur lors de la récupération des articles liés pour ${slug}`,
    ),
    safeFetch(
      () => getAdjacentPosts(slug),
      { prev: null, next: null },
      `Erreur lors de la récupération des articles adjacents pour ${slug}`,
    ),
  ])

  if (!post) {
    return (
      <Main>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold">Article non trouvé</h1>
          <Link href="/blog" className="text-primary mt-4 inline-block hover:underline">
            ← Retour au blog
          </Link>
        </div>
      </Main>
    )
  }

  const postImageUrl = post.image ? urlFor(post.image)?.width(1200).height(630).url() : null
  const authorImageUrl = post.author?.image ? urlFor(post.author.image)?.width(120).height(120).url() : null
  const articleUrl = `${baseUrl}/blog/${post.slug.current}`
  const headings = extractHeadings(post.body)
  const portableTextComponents = createPortableTextComponents()

  // Format related posts for component
  const relatedPosts = (relatedData?.relatedPosts || []).map((p) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    image: p.image?.asset?.url || null,
    author: p.author ? { name: p.author.name, image: p.author.image?.asset?.url || null } : undefined,
  }))

  // Generate structured data
  const articleStructuredData = generateArticleStructuredData(
    {
      _id: post._id,
      title: post.title,
      slug: post.slug.current,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      lastReviewedAt: post.lastReviewedAt,
      readingTime: post.readingTime,
      wordCount: post.wordCount,
      image: post.image ? { asset: { url: postImageUrl || '' }, alt: post.image.alt } : undefined,
      author: post.author
        ? {
            name: post.author.name,
            slug: post.author.slug?.current || '',
            bio: post.author.bio,
            role: post.author.role,
            email: post.author.email,
            website: post.author.website,
            image: post.author.image ? { asset: { url: authorImageUrl || '' } } : undefined,
            social: post.author.social,
          }
        : { name: '', slug: '' },
      reviewer: post.reviewer ? { name: post.reviewer.name, slug: '', role: post.reviewer.role } : undefined,
      categories: post.categories?.map((cat) => ({ title: cat.title })) || [],
      tags: post.tags,
      keywords: post.keywords,
      articleSection: post.articleSection,
      seo: post.seo,
      body: post.body || [],
    },
    baseUrl,
  )

  const breadcrumbStructuredData = generatePostBreadcrumb(
    {
      title: post.title,
      slug: post.slug.current,
      categories: post.categories?.map((cat) => ({ title: cat.title, slug: cat.slug.current })),
    },
    baseUrl,
  )

  const faqStructuredData =
    faqData?.faqs?.questions?.length > 0
      ? {
          '@context': 'https://schema.org' as const,
          '@type': 'FAQPage' as const,
          mainEntity: faqData.faqs.questions.map((item: { question: string; answer: string }) => ({
            '@type': 'Question' as const,
            name: item.question,
            acceptedAnswer: { '@type': 'Answer' as const, text: item.answer },
          })),
        } as const
      : null

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(breadcrumbStructuredData) }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderStructuredData(faqStructuredData) }}
        />
      )}

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Sticky Header (appears on scroll) */}
      <StickyArticleHeader title={post.title} />

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
        <article
          className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          {/* Breadcrumb - Design amélioré */}
          <nav aria-label="Breadcrumb" className="mb-12 max-w-4xl">
            <ol className="flex flex-wrap items-center gap-2 rounded-full bg-muted/50 px-4 py-2.5 text-sm backdrop-blur-sm">
              <li>
                <Link 
                  href="/" 
                  className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Accueil
                </Link>
              </li>
              <li>
                <svg className="h-4 w-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
              {post.categories && post.categories.length > 0 && (
                <>
                  <li>
                    <svg className="h-4 w-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                  <li>
                    <Link
                      href={`/blog?category=${post.categories[0].slug.current}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {post.categories[0].title}
                    </Link>
                  </li>
                </>
              )}
              <li>
                <svg className="h-4 w-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="max-w-[200px] truncate font-medium text-foreground" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-16 max-w-4xl">
            {/* Categories */}
            
           
            {/* Title avec animation */}
            <h1
              className="text-foreground mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text leading-[1.15]"
              itemProp="headline"
            >
              {post.title}
            </h1>

            {/* Excerpt amélioré */}
            {post.excerpt && (
              <p className="text-muted-foreground mb-10 text-xl leading-relaxed border-l-4 border-primary/30 pl-6 italic" itemProp="description">
                {post.excerpt}
              </p>
            )}

            {/* Meta Row redesigné */}
            <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border/50 bg-muted/30 px-6 py-5 backdrop-blur-sm">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3.5 group" itemScope itemType="https://schema.org/Person">
                  {authorImageUrl && (
                    <div className="relative">
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/40"
                        itemProp="image"
                      />
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                  )}
                  <div>
                    <p className="text-foreground font-semibold transition-colors group-hover:text-primary" itemProp="name">
                      {post.author.name}
                    </p>
                    {post.author.role && (
                      <p className="text-muted-foreground text-sm" itemProp="jobTitle">
                        {post.author.role}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Separator */}
              {post.author && <div className="hidden h-8 w-px bg-border sm:block" />}

              {/* Dates */}
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <time dateTime={post.publishedAt} itemProp="datePublished" className="font-medium">
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <>
                  <div className="hidden h-8 w-px bg-border sm:block" />
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-mist-500/10 px-2.5 py-1 text-xs font-medium text-mist-700 dark:text-mist-400">
                      Mis à jour
                    </span>
                    <time dateTime={post.updatedAt} itemProp="dateModified">
                      {new Date(post.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <>
                  <div className="hidden h-8 w-px bg-border sm:block" />
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <ClockIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{post.readingTime} min</span>
                  </div>
                </>
              )}
            </div>

            {/* Reviewer (E-E-A-T) - Design amélioré */}
            {post.reviewer && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200/50 bg-linear-to-r from-emerald-50 to-teal-50 p-6 shadow-sm dark:border-emerald-800/30 dark:from-emerald-950/40 dark:to-teal-950/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                      Vérifié par un expert
                    </p>
                    <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>{post.reviewer.name}</strong>
                      {post.reviewer.role && (
                        <span className="text-emerald-700 dark:text-emerald-300"> • {post.reviewer.role}</span>
                      )}
                    </p>
                    {post.lastReviewedAt && (
                      <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                        Dernière vérification : {new Date(post.lastReviewedAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Hero Image - Design amélioré */}
          {postImageUrl && (
            <div className="group mb-20 max-w-4xl">
              <ImageLightbox src={postImageUrl} alt={post.image?.alt || post.title}>
                <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 transition-all duration-500 hover:shadow-primary/10 hover:ring-primary/20 dark:ring-white/5">
                  <Image
                    src={postImageUrl}
                    alt={post.image?.alt || post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                    itemProp="image"
                  />
                  {/* Overlay gradient subtil */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </ImageLightbox>
              {/* Caption si disponible */}
              {post.image?.alt && (
                <p className="mt-4 text-center text-sm italic text-muted-foreground">
                  {post.image.alt}
                </p>
              )}
            </div>
          )}

          {/* Two-Column Layout */}
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-20">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Mobile TOC */}
              {headings.length > 0 && <TableOfContents headings={headings} variant="mobile" />}

              {/* Article Body avec meilleur espacement */}
              <div className="prose-article prose-lg max-w-none" itemProp="articleBody">
                {post.body && Array.isArray(post.body) && (
                  <PortableText value={post.body} components={portableTextComponents} />
                )}
              </div>

          

              {/* Mobile Social Share - Design amélioré */}
              <div className="mt-12 rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur-sm lg:hidden">
                <p className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Partager cet article
                </p>
                <SocialShareButtons url={articleUrl} title={post.title} variant="horizontal" />
              </div>
            </div>

            {/* Sidebar (Desktop) - Design amélioré */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* Desktop TOC - Card design */}
                {headings.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Table des matières
                    </h3>
                    <TableOfContents headings={headings} variant="desktop" />
                  </div>
                )}

                {/* Social Share - Card design */}
                <div className="rounded-2xl border border-border/50 bg-linear-to-br from-primary/5 to-primary/10 p-6 backdrop-blur-sm">
                  <p className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Partager
                  </p>
                  <SocialShareButtons url={articleUrl} title={post.title} variant="horizontal" />
                </div>
              </div>
            </aside>
          </div>

          <Divider className="my-12" />

          {/* Author Card - Section améliorée */}
          {post.author && (
            <div className="mt-20 max-w-4xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  À propos de l&apos;auteur
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-border/50 bg-linear-to-br from-muted/50 to-muted/30 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                <AuthorCard
                  author={{
                    name: post.author.name,
                    role: post.author.role,
                    bio: post.author.bio,
                    image: authorImageUrl,
                    slug: post.author.slug?.current,
                    social: post.author.social,
                  }}
                />
              </div>
            </div>
          )}

          {/* Related Articles - Section améliorée */}
          {relatedPosts.length > 0 && (
            <div className="mt-24 max-w-4xl">
              <div className="mb-8 text-center">
                <h2 className="mb-3 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold text-transparent">
                  Articles similaires
                </h2>
                <p className="text-muted-foreground">
                  Découvrez d&apos;autres articles qui pourraient vous intéresser
                </p>
              </div>
              <div className="rounded-3xl border border-border/50 bg-linear-to-br from-muted/30 to-background p-8 shadow-xl backdrop-blur-sm">
                <RelatedArticles posts={relatedPosts} />
              </div>
            </div>
          )}

          {/* Previous/Next Navigation - Design moderne */}
          {(adjacentPosts.prev || adjacentPosts.next) && (
            <nav className="mt-20 max-w-4xl" aria-label="Navigation articles">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Continuez votre lecture
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {adjacentPosts.prev && (
                  <Link
                    href={`/blog/${adjacentPosts.prev.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-muted/50 to-muted/30 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                  >
                    {/* Decorative gradient */}
                    <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <div className="relative">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Article précédent
                      </div>
                      <div className="text-foreground line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
                        {adjacentPosts.prev.title}
                      </div>
                    </div>
                  </Link>
                )}
                {adjacentPosts.next && (
                  <Link
                    href={`/blog/${adjacentPosts.next.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-muted/50 to-muted/30 p-6 text-right transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 sm:ml-auto"
                  >
                    {/* Decorative gradient */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <div className="relative">
                      <div className="mb-3 flex items-center justify-end gap-2 text-sm font-medium text-primary">
                        Article suivant
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="text-foreground line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
                        {adjacentPosts.next.title}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </article>
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
              <FooterLink href="/privacy-policy">Politique de confidentialité</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </FooterCategory>
          </>
        }
        fineprint="© 2025 SerpEditor, Inc."
        socialLinks={
          <>
            <SocialLink href="https://x.com/serpeditor" name="X">
              <XIcon />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/profile.php?id=61586300626787" name="Facebook">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://www.youtube.com/channel/UCClqn8e1fy2SFNPRJZXpp3Q" name="YouTube">
              <YouTubeIcon />
            </SocialLink>
            <SocialLink href="https://www.tiktok.com/@serpeditor" name="TikTok">
              <TiktokIcon />
            </SocialLink>
          </>
        }
      />
    </>
  )
}
