/**
 * Requêtes GROQ optimisées pour le SEO
 * Utilisez coalesce() pour les fallbacks selon les meilleures pratiques Sanity
 */

/**
 * Requête pour un article avec tous les fallbacks SEO
 * Utilise coalesce() pour fournir des valeurs par défaut intelligentes
 */
export const POST_WITH_SEO_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    excerpt,
    body,
    image {
      asset->{
        _id,
        url,
        metadata {
          dimensions { width, height }
        }
      },
      alt,
      caption
    },
    publishedAt,
    updatedAt,
    lastReviewedAt,
    readingTime,
    "wordCount": length(pt::text(body)),
    author->{
      _id,
      name,
      role,
      "slug": slug.current,
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      bio,
      expertise,
      email,
      website,
      social {
        linkedin,
        twitter,
        github,
        youtube
      }
    },
    coAuthors[]->{
      _id,
      name,
      role,
      "slug": slug.current,
      image {
        asset->{ url },
        alt
      }
    },
    reviewer->{
      _id,
      name,
      role,
      "slug": slug.current
    },
    categories[]->{
      _id,
      title,
      slug {
        current
      },
      parent->{
        title,
        slug {
          current
        }
      }
    },
    tags,
    focusKeyword,
    relatedKeywords,
    articleSection,
    keywords,
    status,
    featured,
    isPillarContent,
    // SEO avec fallbacks intelligents
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, excerpt, ""),
      "image": coalesce(seo.image, image),
      "canonicalUrl": seo.canonicalUrl,
      "noIndex": seo.noIndex == true,
      "noFollow": seo.noFollow == true,
      "structuredDataType": coalesce(seo.structuredDataType, "BlogPosting")
    }
  }
`

/**
 * Requête pour la liste des articles avec SEO
 */
export const POSTS_LIST_QUERY = `
  *[_type == "post" && defined(slug.current) && status == "published"] 
  | order(publishedAt desc) 
  [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    author->{
      name,
      image,
      role
    },
    categories[]->{
      title,
      slug
    },
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, excerpt, "")
    }
  }
`

/**
 * Requête pour générer le sitemap
 * Exclut les documents avec noIndex
 */
export const SITEMAP_QUERY = `
  *[_type in ["post", "category"] && defined(slug.current) && !(seo.noIndex == true)] {
    "href": select(
      _type == "post" => "/blog/" + slug.current,
      _type == "category" => "/category/" + slug.current,
      "/" + slug.current
    ),
    _updatedAt,
    publishedAt
  }
`

/**
 * Requête pour les données structurées Schema.org (Article)
 */
export const ARTICLE_SCHEMA_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    excerpt,
    body,
    image,
    publishedAt,
    updatedAt,
    lastReviewedAt,
    author->{
      name,
      image,
      role,
      email,
      website,
      social
    },
    reviewer->{
      name,
      role
    },
    categories[]->{
      title
    },
    articleSection,
    keywords,
    "wordCount": length(pt::text(body)),
    "readingTime": readingTime
  }
`

/**
 * Requête pour les FAQ Schema.org
 * Extrait les blocs FAQ du contenu
 */
export const FAQ_SCHEMA_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    "faqs": body[_type == "faqBlock"][0]{
      questions[]{
        question,
        "answer": pt::text(answer)
      }
    }
  }
`

/**
 * Requête pour les breadcrumbs Schema.org
 */
export const BREADCRUMB_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    title,
    categories[]->{
      title,
      slug,
      parent->{
        title,
        slug
      }
    }
  }
`

/**
 * Requête pour les articles liés (basés sur les catégories communes)
 */
export const RELATED_POSTS_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    "relatedPosts": *[
      _type == "post" &&
      _id != ^._id &&
      status == "published" &&
      count(categories[@._ref in ^.^.categories[]._ref]) > 0
    ] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      image {
        asset->{
          url
        },
        alt
      },
      author->{
        name,
        image {
          asset->{
            url
          }
        }
      }
    }
  }
`
