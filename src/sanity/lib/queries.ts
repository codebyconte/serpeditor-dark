import { defineQuery } from 'next-sanity'

/**
 * Queries GROQ pour le blog SEO
 * Toutes les queries incluent les métadonnées SEO optimales
 */

// =========================
// FRAGMENTS RÉUTILISABLES
// =========================

// Fragment SEO complet
const SEO_FRAGMENT = `
  seo {
    metaTitle,
    metaDescription,
    focusKeyword,
    additionalKeywords,
    ogTitle,
    ogDescription,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions { width, height }
        }
      },
      alt
    },
    twitterTitle,
    twitterDescription,
    twitterImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions { width, height }
        }
      },
      alt
    },
    canonicalUrl,
    noIndex,
    noFollow,
    structuredDataType
  }
`

// Fragment Image avec LQIP
const IMAGE_FRAGMENT = `{
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  alt,
  caption
}`

// Fragment Auteur Complet
const AUTHOR_FULL_FRAGMENT = `{
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  bioLong,
  yearsOfExperience,
  expertise,
  certifications,
  image ${IMAGE_FRAGMENT},
  social,
  website,
  email
}`

// Fragment Auteur Simplifié (pour cards)
const AUTHOR_CARD_FRAGMENT = `{
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  image {
    asset->{ url },
    alt
  }
}`

// Fragment Catégorie avec Parent
const CATEGORY_FRAGMENT = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  color,
  icon,
  parent->{
    _id,
    title,
    "slug": slug.current,
    parent->{
      _id,
      title,
      "slug": slug.current
    }
  }
}`

// =========================
// POSTS (ARTICLES)
// =========================

/**
 * Query pour un article complet (page article)
 */
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,
    lastReviewedAt,
    readingTime,
    wordCount,
    status,
    featured,
    isPillarContent,
    showTableOfContents,

    // SEO
    ${SEO_FRAGMENT},

    // Image principale
    image ${IMAGE_FRAGMENT},

    // Auteur principal
    author-> ${AUTHOR_FULL_FRAGMENT},

    // Co-auteurs
    coAuthors[]-> ${AUTHOR_CARD_FRAGMENT},

    // Réviseur
    reviewer-> ${AUTHOR_CARD_FRAGMENT},

    // Catégories
    categories[]-> ${CATEGORY_FRAGMENT},

    // Tags
    tags,

    // Contenu avec tous les blocks
    body[]{
      ...,

      // Custom Image Block
      _type == "customImage" => {
        _key,
        _type,
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions { width, height }
          }
        },
        alt,
        caption,
        title,
        size,
        linkTo
      },

      // CTA Block
      _type == "ctaBlock" => {
        _key,
        _type,
        style,
        heading,
        description,
        buttonText,
        buttonLink,
        openInNewTab
      },

      // Info Box
      _type == "infoBox" => {
        _key,
        _type,
        type,
        title,
        content
      },

      // FAQ Block (avec texte plain pour Schema.org)
      _type == "faqBlock" => {
        _key,
        _type,
        title,
        questions[]{
          question,
          answer,
          "answerText": pt::text(answer)
        }
      },

      // Related Articles
      _type == "relatedArticles" => {
        _key,
        _type,
        title,
        displayStyle,
        articles[]->{
          _id,
          title,
          "slug": slug.current,
          excerpt,
          readingTime,
          publishedAt,
          image {
            asset->{ url },
            alt
          },
          author->{ name, "slug": slug.current }
        }
      },

      // Table Block
      _type == "tableBlock" => {
        _key,
        _type,
        caption,
        headers,
        rows,
        showStripes
      },

      // YouTube
      _type == "youtube" => {
        _key,
        _type,
        url
      },

      // Code
      _type == "code" => {
        _key,
        _type,
        language,
        code,
        filename
      }
    }
  }
`)

/**
 * Query pour la liste des articles (page blog)
 */
export const POSTS_LIST_QUERY = defineQuery(`
  *[_type == "post" && status == "published"] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    featured,
    isPillarContent,

    image {
      asset->{ url },
      alt
    },

    author->{
      name,
      "slug": slug.current,
      role,
      image { asset->{ url } }
    },

    categories[]->{
      title,
      "slug": slug.current,
      color
    },

    tags
  }
`)

/**
 * Query pour compter les articles
 */
export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "post" && status == "published"])
`)

/**
 * Query pour les articles mis en avant
 */
export const FEATURED_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    image { asset->{ url }, alt },
    author->{ name, "slug": slug.current },
    categories[0]->{ title, "slug": slug.current, color }
  }
`)

/**
 * Query pour les articles récents (sidebar)
 */
export const RECENT_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    image { asset->{ url }, alt }
  }
`)

/**
 * Query pour générer les paths statiques
 */
export const POST_PATHS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && status == "published"]{ "slug": slug.current }
`)

// =========================
// CATEGORIES
// =========================

/**
 * Query pour une catégorie complète (page catégorie)
 */
export const CATEGORY_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug && isActive == true][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    excerpt,

    image ${IMAGE_FRAGMENT},

    color,
    icon,
    order,

    // SEO
    ${SEO_FRAGMENT},

    // Hiérarchie (Breadcrumbs)
    parent->{
      _id,
      title,
      "slug": slug.current,
      parent->{
        _id,
        title,
        "slug": slug.current
      }
    },

    // Articles de cette catégorie
    "posts": *[_type == "post" && references(^._id) && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      readingTime,
      image { asset->{ url }, alt },
      author->{ name, "slug": slug.current }
    },

    // Sous-catégories
    "subcategories": *[_type == "category" && parent._ref == ^._id && isActive == true] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      color,
      "postCount": count(*[_type == "post" && references(^._id) && status == "published"])
    }
  }
`)

/**
 * Query pour toutes les catégories (menu navigation)
 */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && isActive == true && !defined(parent)] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    color,
    icon,
    order,
    featured,

    // Sous-catégories
    "subcategories": *[_type == "category" && parent._ref == ^._id && isActive == true] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      color
    },

    // Nombre d'articles
    "postCount": count(*[_type == "post" && references(^._id) && status == "published"])
  }
`)

/**
 * Query pour les paths des catégories
 */
export const CATEGORY_PATHS_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current) && isActive == true]{ "slug": slug.current }
`)

// =========================
// AUTHORS (AUTEURS)
// =========================

/**
 * Query pour un auteur complet (page auteur)
 */
export const AUTHOR_QUERY = defineQuery(`
  *[_type == "author" && slug.current == $slug && isActive == true][0]{
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    bioLong,

    image ${IMAGE_FRAGMENT},

    expertise,
    yearsOfExperience,
    certifications,
    social,
    website,
    email,

    // SEO
    ${SEO_FRAGMENT},

    // Articles de cet auteur
    "posts": *[_type == "post" && author._ref == ^._id && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      readingTime,
      image { asset->{ url }, alt },
      categories[0]->{ title, "slug": slug.current, color }
    },

    // Statistiques
    "stats": {
      "totalPosts": count(*[_type == "post" && author._ref == ^._id && status == "published"]),
      "totalViews": 0,
      "avgReadingTime": math::avg(*[_type == "post" && author._ref == ^._id && status == "published"].readingTime)
    }
  }
`)

/**
 * Query pour tous les auteurs actifs
 */
export const AUTHORS_QUERY = defineQuery(`
  *[_type == "author" && isActive == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    image { asset->{ url }, alt },
    expertise,
    social,
    "postCount": count(*[_type == "post" && author._ref == ^._id && status == "published"])
  }
`)

/**
 * Query pour les paths des auteurs
 */
export const AUTHOR_PATHS_QUERY = defineQuery(`
  *[_type == "author" && defined(slug.current) && isActive == true]{ "slug": slug.current }
`)

// =========================
// SITEMAP
// =========================

/**
 * Query pour générer le sitemap
 */
export const SITEMAP_QUERY = defineQuery(`
  [
    ...(*[_type == "post" && status == "published" && seo.noIndex != true]{
      "href": "/blog/" + slug.current,
      _updatedAt,
      "changeFrequency": "weekly",
      "priority": 0.8
    }),
    ...(*[_type == "category" && isActive == true && seo.noIndex != true]{
      "href": "/category/" + slug.current,
      _updatedAt,
      "changeFrequency": "weekly",
      "priority": 0.6
    }),
    ...(*[_type == "author" && isActive == true && seo.noIndex != true]{
      "href": "/author/" + slug.current,
      _updatedAt,
      "changeFrequency": "monthly",
      "priority": 0.5
    })
  ]
`)

// =========================
// SEARCH (RECHERCHE)
// =========================

/**
 * Query pour la recherche globale
 */
export const SEARCH_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && (
    title match $searchTerm ||
    excerpt match $searchTerm ||
    pt::text(body) match $searchTerm ||
    $searchTerm in tags
  )] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    image { asset->{ url }, alt },
    author->{ name },
    categories[]->{ title, color }
  }
`)

// =========================
// TAGS
// =========================

/**
 * Query pour tous les tags uniques
 */
export const ALL_TAGS_QUERY = defineQuery(`
  array::unique(*[_type == "post" && status == "published"].tags[])
`)

/**
 * Query pour les articles par tag
 */
export const POSTS_BY_TAG_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && $tag in tags] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    image { asset->{ url }, alt },
    author->{ name, "slug": slug.current },
    categories[0]->{ title, "slug": slug.current, color }
  }
`)
