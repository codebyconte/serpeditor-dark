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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
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
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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
          <pre className="border-border overflow-x-auto rounded-xl border bg-[oklch(18%_0.01_107)] p-5 text-sm leading-relaxed text-[oklch(90%_0.01_107)]">
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
        warning: 'bg-orange-500 text-white border-orange-500',
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
        warning: 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/40',
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
      <ul className="text-muted-foreground marker:text-primary my-6 ml-6 list-outside list-disc space-y-3">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground marker:text-primary my-6 ml-6 list-outside list-decimal space-y-3 marker:font-semibold">
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
  const [post, faqData, relatedData, adjacentPosts] = await Promise.all([
    client.fetch<Post>(POST_WITH_SEO_QUERY, { slug }, options),
    client.fetch(FAQ_SCHEMA_QUERY, { slug }, options),
    client.fetch<{ relatedPosts: RelatedPost[] }>(RELATED_POSTS_QUERY, { slug }, options),
    getAdjacentPosts(slug),
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
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqData.faqs.questions.map((item: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
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
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10 max-w-4xl">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary text-muted-foreground transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-muted-foreground/50">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary text-muted-foreground transition-colors">
                  Blog
                </Link>
              </li>
              {post.categories && post.categories.length > 0 && (
                <>
                  <li className="text-muted-foreground/50">/</li>
                  <li>
                    <Link
                      href={`/category/${post.categories[0].slug.current}`}
                      className="hover:text-primary text-muted-foreground transition-colors"
                    >
                      {post.categories[0].title}
                    </Link>
                  </li>
                </>
              )}
              <li className="text-muted-foreground/50">/</li>
              <li className="text-foreground font-medium" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12 max-w-4xl">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {post.categories.map((category, idx) => (
                  <Link
                    key={idx}
                    href={`/category/${category.slug.current}`}
                    className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="text-foreground mb-6 font-display text-4xl font-normal tracking-tight sm:text-5xl lg:text-6xl"
              itemProp="headline"
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-muted-foreground mb-8 text-xl leading-relaxed" itemProp="description">
                {post.excerpt}
              </p>
            )}

            {/* Meta Row */}
            <div className="border-border flex flex-wrap items-center gap-6 border-b pb-8">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3" itemScope itemType="https://schema.org/Person">
                  {authorImageUrl && (
                    <Image
                      src={authorImageUrl}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="ring-border rounded-full object-cover ring-2"
                      itemProp="image"
                    />
                  )}
                  <div>
                    <p className="text-foreground font-medium" itemProp="name">
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

              {/* Dates */}
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.publishedAt} itemProp="datePublished">
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <div className="text-muted-foreground text-sm">
                  <span>Mis à jour : </span>
                  <time dateTime={post.updatedAt} itemProp="dateModified">
                    {new Date(post.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4" />
                  <span>{post.readingTime} min de lecture</span>
                </div>
              )}
            </div>

            {/* Reviewer (E-E-A-T) */}
            {post.reviewer && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Révisé par un expert :</strong> {post.reviewer.name}
                  {post.reviewer.role && (
                    <span className="text-green-600 dark:text-green-400"> — {post.reviewer.role}</span>
                  )}
                </p>
                {post.lastReviewedAt && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    Dernière révision : {new Date(post.lastReviewedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            )}
          </header>

          {/* Hero Image */}
          {postImageUrl && (
            <div className="mb-16 max-w-4xl">
              <ImageLightbox src={postImageUrl} alt={post.image?.alt || post.title}>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={postImageUrl}
                    alt={post.image?.alt || post.title}
                    fill
                    className="object-cover"
                    priority
                    itemProp="image"
                  />
                </div>
              </ImageLightbox>
            </div>
          )}

          {/* Two-Column Layout */}
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-16">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Mobile TOC */}
              {headings.length > 0 && <TableOfContents headings={headings} variant="mobile" />}

              {/* Article Body */}
              <div className="prose-article" itemProp="articleBody">
                {post.body && Array.isArray(post.body) && (
                  <PortableText value={post.body} components={portableTextComponents} />
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="border-border mt-12 border-t pt-8">
                  <h3 className="text-foreground mb-4 text-sm font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-muted text-muted-foreground rounded-lg px-3 py-1.5 text-sm"
                        itemProp="keywords"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Social Share */}
              <div className="mt-8 lg:hidden">
                <p className="text-foreground mb-3 text-sm font-medium">Partager cet article</p>
                <SocialShareButtons url={articleUrl} title={post.title} variant="horizontal" />
              </div>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                {/* Desktop TOC */}
                {headings.length > 0 && <TableOfContents headings={headings} variant="desktop" />}

                {/* Social Share */}
                <div className="border-border bg-card rounded-xl border p-5">
                  <p className="text-foreground mb-4 text-sm font-semibold">Partager</p>
                  <SocialShareButtons url={articleUrl} title={post.title} variant="horizontal" />
                </div>
              </div>
            </aside>
          </div>

          {/* Author Card */}
          {post.author && (
            <div className="mt-16 max-w-4xl">
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
          )}

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="max-w-4xl">
              <RelatedArticles posts={relatedPosts} />
            </div>
          )}

          {/* Previous/Next Navigation */}
          {(adjacentPosts.prev || adjacentPosts.next) && (
            <nav className="border-border mt-16 max-w-4xl border-t pt-10" aria-label="Navigation articles">
              <div className="grid gap-6 sm:grid-cols-2">
                {adjacentPosts.prev && (
                  <Link
                    href={`/blog/${adjacentPosts.prev.slug}`}
                    className="group border-border bg-card hover:border-primary rounded-xl border p-6 transition-all hover:shadow-lg"
                  >
                    <div className="text-muted-foreground mb-2 text-sm">← Article précédent</div>
                    <div className="text-foreground group-hover:text-primary line-clamp-2 font-semibold transition-colors">
                      {adjacentPosts.prev.title}
                    </div>
                  </Link>
                )}
                {adjacentPosts.next && (
                  <Link
                    href={`/blog/${adjacentPosts.next.slug}`}
                    className="group border-border bg-card hover:border-primary rounded-xl border p-6 text-right transition-all hover:shadow-lg sm:ml-auto"
                  >
                    <div className="text-muted-foreground mb-2 text-sm">Article suivant →</div>
                    <div className="text-foreground group-hover:text-primary line-clamp-2 font-semibold transition-colors">
                      {adjacentPosts.next.title}
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
