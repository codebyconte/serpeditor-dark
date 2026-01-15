/**
 * Helpers pour générer les données structurées Schema.org
 * Pour les rich snippets Google et le SEO
 */

import type {
  Article,
  BlogPosting,
  Person,
  FAQPage,
  BreadcrumbList,
  Organization,
  WebSite,
  WebPage,
  WithContext,
  ItemList,
  CollectionPage,
  ProfilePage,
} from 'schema-dts'

// Types pour nos données Sanity
type SanityPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  updatedAt?: string
  lastReviewedAt?: string
  image?: {
    asset: { url: string }
    alt?: string
  }
  author: {
    name: string
    slug: string
    bio?: string
    image?: { asset: { url: string } }
    role?: string
    email?: string
    website?: string
    social?: {
      linkedin?: string
      twitter?: string
      github?: string
    }
  }
  reviewer?: {
    name: string
    slug: string
    role?: string
  }
  categories?: Array<{ title: string }>
  tags?: string[]
  keywords?: string[]
  articleSection?: string
  wordCount?: number
  readingTime?: number
  seo?: {
    structuredDataType?: string
  }
  body?: Array<{
    _type: string
    questions?: Array<{
      question: string
      answerText: string
    }>
  }>
}

type SanityAuthor = {
  name: string
  slug: string
  bio?: string
  image?: { asset: { url: string } }
  role?: string
  social?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  website?: string
  email?: string
}

const DEFAULT_ORGANIZATION: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SerpEditor',
  url: 'https://serpeditor.com', // À personnaliser
  logo: {
    '@type': 'ImageObject',
    url: 'https://serpeditor.com/logo.png', // À personnaliser
  },
  sameAs: [
    'https://twitter.com/serpeditor', // À personnaliser
    'https://linkedin.com/company/serpeditor', // À personnaliser
  ],
}

/**
 * Génère les données structurées pour un article
 * Supporte BlogPosting, Article, NewsArticle, TechArticle
 */
export function generateArticleStructuredData(
  post: SanityPost,
  baseUrl: string
): WithContext<BlogPosting | Article> {
  const url = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.image?.asset.url || `${baseUrl}/default-og.jpg`

  const structuredData: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': (post.seo?.structuredDataType as 'BlogPosting' | 'Article' | 'NewsArticle' | 'TechArticle') || 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
      ...(post.image?.alt && { caption: post.image.alt }),
    },
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${baseUrl}/author/${post.author.slug}`,
      ...(post.author.image && {
        image: post.author.image.asset.url,
      }),
      ...(post.author.bio && {
        description: post.author.bio,
      }),
      ...(post.author.role && {
        jobTitle: post.author.role,
      }),
      ...(post.author.email && {
        email: post.author.email,
      }),
      ...(post.author.website && {
        url: post.author.website,
      }),
      ...(post.author.social && {
        sameAs: [
          ...(post.author.social.linkedin ? [post.author.social.linkedin] : []),
          ...(post.author.social.twitter ? [post.author.social.twitter] : []),
          ...(post.author.social.github ? [post.author.social.github] : []),
        ],
      }),
    },
    publisher: DEFAULT_ORGANIZATION,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(post.wordCount && {
      wordCount: post.wordCount,
    }),
    ...(post.readingTime && {
      timeRequired: `PT${post.readingTime}M`,
    }),
  }

  // Ajouter le réviseur si présent (E-E-A-T)
  if (post.reviewer) {
    structuredData.reviewedBy = {
      '@type': 'Person',
      name: post.reviewer.name,
      url: `${baseUrl}/author/${post.reviewer.slug}`,
      ...(post.reviewer.role && {
        jobTitle: post.reviewer.role,
      }),
    }
  }

  // Ajouter les mots-clés
  const keywords: string[] = []
  if (post.categories && post.categories.length > 0) {
    keywords.push(...post.categories.map((cat) => cat.title))
  }
  if (post.tags && post.tags.length > 0) {
    keywords.push(...post.tags)
  }
  if (post.keywords && post.keywords.length > 0) {
    keywords.push(...post.keywords)
  }
  if (keywords.length > 0) {
    structuredData.keywords = keywords.join(', ')
  }

  // Ajouter la section de l'article
  if (post.articleSection) {
    structuredData.articleSection = post.articleSection
  }

  // Ajouter la date de dernière révision si présente
  if (post.lastReviewedAt) {
    structuredData.dateReviewed = post.lastReviewedAt
  }

  return structuredData
}

/**
 * Génère les données structurées pour un auteur
 */
export function generatePersonStructuredData(
  author: SanityAuthor,
  baseUrl: string
): WithContext<Person> {
  const structuredData: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${baseUrl}/author/${author.slug}`,
  }

  // Biographie
  if (author.bio) {
    structuredData.description = author.bio
  }

  // Image
  if (author.image) {
    structuredData.image = author.image.asset.url
  }

  // Email
  if (author.email) {
    structuredData.email = author.email
  }

  // Site web
  if (author.website) {
    structuredData.url = author.website
  }

  // Rôle
  if (author.role) {
    structuredData.jobTitle = author.role
  }

  // Réseaux sociaux (sameAs)
  const sameAs: string[] = []
  if (author.social?.linkedin) sameAs.push(author.social.linkedin)
  if (author.social?.twitter) sameAs.push(author.social.twitter)
  if (author.social?.github) sameAs.push(author.social.github)

  if (sameAs.length > 0) {
    structuredData.sameAs = sameAs
  }

  return structuredData
}

/**
 * Génère les données structurées FAQ à partir d'un bloc FAQ
 */
export function generateFAQStructuredData(
  faqBlock: { questions: Array<{ question: string; answerText: string }> },
  pageUrl: string
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlock.questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerText,
      },
    })),
  }
}

/**
 * Génère le breadcrumb structuré pour une page
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
  baseUrl: string
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

/**
 * Helper pour extraire et générer toutes les FAQs d'un article
 */
export function extractFAQsFromPost(post: SanityPost, pageUrl: string): WithContext<FAQPage> | null {
  if (!post.body) return null

  const faqBlocks = post.body.filter((block) => block._type === 'faqBlock')
  if (faqBlocks.length === 0) return null

  // Combiner toutes les questions de tous les blocs FAQ
  const allQuestions = faqBlocks.flatMap((block) => block.questions || [])

  if (allQuestions.length === 0) return null

  return generateFAQStructuredData({ questions: allQuestions }, pageUrl)
}

/**
 * Helper pour générer le breadcrumb d'une catégorie
 */
export function generateCategoryBreadcrumb(
  category: {
    title: string
    slug: string
    parent?: {
      title: string
      slug: string
      parent?: {
        title: string
        slug: string
      }
    }
  },
  baseUrl: string
): WithContext<BreadcrumbList> {
  const items = [{ name: 'Accueil', url: '/' }]

  // Ajouter les parents dans l'ordre (du plus haut au plus bas)
  if (category.parent?.parent) {
    items.push({
      name: category.parent.parent.title,
      url: `/category/${category.parent.parent.slug}`,
    })
  }

  if (category.parent) {
    items.push({
      name: category.parent.title,
      url: `/category/${category.parent.slug}`,
    })
  }

  // Ajouter la catégorie actuelle
  items.push({
    name: category.title,
    url: `/category/${category.slug}`,
  })

  return generateBreadcrumbStructuredData(items, baseUrl)
}

/**
 * Helper pour générer le breadcrumb d'un article
 */
export function generatePostBreadcrumb(
  post: {
    title: string
    slug: string
    categories?: Array<{
      title: string
      slug: string
      parent?: {
        title: string
        slug: string
      }
    }>
  },
  baseUrl: string
): WithContext<BreadcrumbList> {
  const items = [
    { name: 'Accueil', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]

  // Si l'article a une catégorie, l'ajouter au breadcrumb
  if (post.categories && post.categories.length > 0) {
    const mainCategory = post.categories[0]

    if (mainCategory.parent) {
      items.push({
        name: mainCategory.parent.title,
        url: `/category/${mainCategory.parent.slug}`,
      })
    }

    items.push({
      name: mainCategory.title,
      url: `/category/${mainCategory.slug}`,
    })
  }

  // Ajouter l'article actuel
  items.push({
    name: post.title,
    url: `/blog/${post.slug}`,
  })

  return generateBreadcrumbStructuredData(items, baseUrl)
}

/**
 * Génère les données structurées pour le site web (WebSite)
 */
export function generateWebsiteStructuredData(baseUrl: string): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SerpEditor',
    url: baseUrl,
    publisher: DEFAULT_ORGANIZATION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Génère les données structurées pour une page web (WebPage)
 */
export function generateWebPageStructuredData(
  title: string,
  description: string,
  url: string,
  baseUrl: string
): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SerpEditor',
      url: baseUrl,
    },
    publisher: DEFAULT_ORGANIZATION,
  }
}

/**
 * Génère les données structurées pour une liste d'articles (ItemList)
 */
export function generateArticleListStructuredData(
  articles: Array<{
    title: string
    slug: string
    publishedAt: string
    excerpt?: string
  }>,
  baseUrl: string
): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        url: `${baseUrl}/blog/${article.slug}`,
        datePublished: article.publishedAt,
      },
    })),
  }
}

/**
 * Génère les données structurées pour l'organisation
 */
export function generateOrganizationStructuredData(
  customData?: Partial<WithContext<Organization>>
): WithContext<Organization> {
  return {
    ...DEFAULT_ORGANIZATION,
    ...customData,
  }
}

/**
 * Génère les données structurées pour une page catégorie (CollectionPage)
 */
export function generateCategoryStructuredData(
  category: {
    title: string
    slug: string
    description?: string
    excerpt?: string
    image?: { asset: { url: string }; alt?: string }
    parent?: {
      title: string
      slug: string
    }
    articles?: Array<{
      title: string
      slug: string
      publishedAt: string
      excerpt?: string
    }>
  },
  baseUrl: string
): WithContext<CollectionPage> {
  const url = `${baseUrl}/category/${category.slug}`

  const structuredData: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.title,
    description: category.excerpt || category.description || '',
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SerpEditor',
      url: baseUrl,
    },
    publisher: DEFAULT_ORGANIZATION,
    ...(category.image && {
      image: {
        '@type': 'ImageObject',
        url: category.image.asset.url,
        ...(category.image.alt && { caption: category.image.alt }),
      },
    }),
  }

  // Ajouter la catégorie parente si présente
  if (category.parent) {
    structuredData.breadcrumb = {
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
        {
          '@type': 'ListItem',
          position: 3,
          name: category.parent.title,
          item: `${baseUrl}/category/${category.parent.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: category.title,
          item: url,
        },
      ],
    }
  }

  // Ajouter la liste d'articles si présente
  if (category.articles && category.articles.length > 0) {
    structuredData.mainEntity = {
      '@type': 'ItemList',
      itemListElement: category.articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          url: `${baseUrl}/blog/${article.slug}`,
          datePublished: article.publishedAt,
        },
      })),
    }
  }

  return structuredData
}

/**
 * Génère les données structurées pour une page auteur (ProfilePage avec Person)
 */
export function generateAuthorPageStructuredData(
  author: {
    name: string
    slug: string
    bio?: string
    role?: string
    image?: { asset: { url: string }; alt?: string }
    email?: string
    website?: string
    social?: {
      linkedin?: string
      twitter?: string
      github?: string
    }
    articles?: Array<{
      title: string
      slug: string
      publishedAt: string
      excerpt?: string
    }>
  },
  baseUrl: string
): WithContext<ProfilePage> {
  const url = `${baseUrl}/author/${author.slug}`

  // Générer d'abord les données Person
  const personData: WithContext<Person> = generatePersonStructuredData(
    {
      name: author.name,
      slug: author.slug,
      bio: author.bio,
      role: author.role,
      image: author.image,
      email: author.email,
      website: author.website,
      social: author.social,
    },
    baseUrl
  )

  // Créer ProfilePage avec Person comme mainEntity
  const structuredData: WithContext<ProfilePage> = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${author.name} - Auteur`,
    description: author.bio || `Articles de ${author.name}`,
    url: url,
    mainEntity: personData,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SerpEditor',
      url: baseUrl,
    },
    publisher: DEFAULT_ORGANIZATION,
  }

  // Ajouter la liste d'articles si présente
  if (author.articles && author.articles.length > 0) {
    structuredData.about = {
      '@type': 'ItemList',
      itemListElement: author.articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          url: `${baseUrl}/blog/${article.slug}`,
          datePublished: article.publishedAt,
        },
      })),
    }
  }

  return structuredData
}

/**
 * Composant Script pour injecter les données structurées
 * Utilisation:
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
 * />
 */
export function renderStructuredData(data: WithContext<any>): string {
  return JSON.stringify(data, null, 0) // Pas d'indentation pour réduire la taille
}
