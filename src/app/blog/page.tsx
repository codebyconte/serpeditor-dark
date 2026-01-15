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
import { Card, CardContent } from '@/components/ui/card'
import {
  generateArticleListStructuredData,
  generateWebsiteStructuredData,
  renderStructuredData,
} from '@/lib/structuredData'
import { client } from '@/sanity/lib/client'
import { POSTS_LIST_QUERY } from '@/sanity/lib/seo-queries'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { CalendarIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { type SanityDocument } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Blog - Articles SEO et Marketing Digital',
  description:
    'Découvrez nos articles sur le SEO, le marketing digital et les meilleures pratiques pour améliorer votre visibilité en ligne.',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Blog - Articles SEO et Marketing Digital',
    description:
      'Découvrez nos articles sur le SEO, le marketing digital et les meilleures pratiques pour améliorer votre visibilité en ligne.',
    url: `${baseUrl}/blog`,
    siteName: 'SerpEditor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Articles SEO et Marketing Digital',
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
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null

const options = { next: { revalidate: 30 } }

interface Post extends SanityDocument {
  title: string
  slug: { current: string }
  excerpt?: string
  image?: SanityImageSource
  publishedAt: string
  author?: {
    name: string
    image?: SanityImageSource
    role?: string
  }
  categories?: Array<{
    title: string
    slug: { current: string }
  }>
}

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(POSTS_LIST_QUERY, { limit: 12 }, options)

  // Générer les données structurées pour la liste d'articles
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
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-5xl/12 tracking-tight text-balance text-mist-950 sm:text-[5rem]/20 dark:text-white">
              Blog
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Découvrez nos articles sur le SEO, le marketing digital et les meilleures pratiques pour améliorer votre
              visibilité en ligne.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          {posts.length === 0 ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">Aucun article disponible pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const imageUrl = post.image ? urlFor(post.image)?.width(600).height(400).url() : null
                const authorImageUrl = post.author?.image ? urlFor(post.author.image)?.width(40).height(40).url() : null

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group block transition-transform hover:scale-[1.02]"
                  >
                    <Card className="hover:border-primary/50 h-full overflow-hidden border-2 border-gray-200/80 bg-white shadow-lg transition-all hover:shadow-xl dark:border-gray-800/50 dark:bg-gray-900/50">
                      {imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                        </div>
                      )}
                      <CardContent className="flex flex-col gap-4 p-6">
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.categories.slice(0, 2).map((category, idx) => (
                              <span
                                key={idx}
                                className="bg-primary/10 text-primary dark:bg-primary/20 rounded-full px-3 py-1 text-xs font-medium"
                              >
                                {category.title}
                              </span>
                            ))}
                          </div>
                        )}
                        <h2 className="group-hover:text-primary line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                        )}
                        <div className="mt-auto flex items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                          {authorImageUrl && (
                            <Image
                              src={authorImageUrl}
                              alt={post.author?.name || 'Auteur'}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            {post.author?.name && (
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <CalendarIcon className="h-3 w-3" />
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </time>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
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
