import { defineField, defineType } from 'sanity'
import { SearchIcon } from '@sanity/icons'

/**
 * Type SEO réutilisable avec toutes les meilleures pratiques
 * Utilisé pour les articles, pages, catégories, auteurs, etc.
 * 
 * NOTE IMPORTANTE sur structuredDataType:
 * - Pour les ARTICLES (post): Utilise BlogPosting, Article, NewsArticle, TechArticle
 * - Pour les CATÉGORIES (category): Utilise automatiquement CollectionPage (pas besoin de structuredDataType)
 * - Pour les AUTEURS (author): Utilise automatiquement Person/ProfilePage (pas besoin de structuredDataType)
 * - FAQPage est généré automatiquement si l'article contient des blocs FAQ
 */
export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Réseaux Sociaux',
  type: 'object',
  icon: SearchIcon,
  fields: [
    // =========================
    // META TAGS GOOGLE
    // =========================
    defineField({
      name: 'title',
      title: 'Meta Title (Override)',
      type: 'string',
      description: 'Titre SEO personnalisé. Si vide, utilise le titre principal. Idéalement 50-60 caractères. Utilisez coalesce() dans GROQ pour le fallback.',
      validation: (rule) =>
        rule
          .min(40)
          .max(70)
          .warning('Idéalement entre 50 et 60 caractères pour un affichage optimal'),
    }),

    defineField({
      name: 'description',
      title: 'Meta Description (Override)',
      type: 'text',
      rows: 3,
      description: 'Description SEO personnalisée. Si vide, utilise le résumé/excerpt. 140-160 caractères recommandés. Utilisez coalesce() dans GROQ pour le fallback.',
      validation: (rule) =>
        rule
          .min(120)
          .max(170)
          .warning('Idéalement 140-160 caractères pour éviter la troncature'),
    }),

    // Note: L'image principale de l'article est utilisée automatiquement pour Open Graph
    // Pas besoin de champ image séparé ici

    // =========================
    // PARAMÈTRES AVANCÉS
    // =========================
    defineField({
      name: 'canonicalUrl',
      title: 'URL Canonique (Override)',
      type: 'url',
      description: 'URL canonique personnalisée (optionnel). Si vide, l\'URL canonique est générée automatiquement à partir du slug. Utilisez uniquement si le contenu existe ailleurs (duplicate content).',
    }),

    defineField({
      name: 'noIndex',
      title: 'No Index (Masquer de Google)',
      type: 'boolean',
      description: 'Si activé, cette page ne sera pas indexée par Google. Utiliser pour contenus dupliqués, privés ou en cours de développement.',
      initialValue: false,
    }),

    defineField({
      name: 'noFollow',
      title: 'No Follow (Ne pas suivre les liens)',
      type: 'boolean',
      description: 'Si activé, Google ne suivra pas les liens de cette page. Rarement utilisé, sauf pour contenu sponsorisé ou liens non approuvés.',
      initialValue: false,
    }),

    defineField({
      name: 'structuredDataType',
      title: 'Type Schema.org (Articles uniquement)',
      type: 'string',
      description: 'Type de schéma Schema.org pour les articles de blog uniquement. Les catégories et auteurs utilisent automatiquement CollectionPage et Person.',
      options: {
        list: [
          { title: 'BlogPosting (Blog)', value: 'BlogPosting' },
          { title: 'Article (Standard)', value: 'Article' },
          { title: 'NewsArticle (Actualités)', value: 'NewsArticle' },
          { title: 'TechArticle (Technique)', value: 'TechArticle' },
        ],
        layout: 'radio',
      },
      initialValue: 'BlogPosting',
      // Masquer ce champ pour les catégories et auteurs
      // Il n'est visible que pour les articles (post)
      hidden: ({ document }) => {
        // Dans Sanity, quand un type object est utilisé dans un document,
        // document._type contient le type du document parent
        // Masquer le champ si le document parent n'est pas un 'post'
        return document?._type !== 'post'
      },
    }),
  ],
  options: {
    collapsible: true,
    collapsed: false, // Ouvert par défaut car crucial pour le SEO
  },
})
