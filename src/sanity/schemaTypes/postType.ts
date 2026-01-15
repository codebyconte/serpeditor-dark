import {
  DocumentTextIcon,
  SearchIcon,
  ImageIcon,
  CogIcon,
  RocketIcon,
} from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Type Post - Article de Blog
 * Configuration SEO professionnelle avec E-E-A-T, Schema.org, et copywriting
 */
export const postType = defineType({
  name: 'post',
  title: 'Article de Blog',
  type: 'document',
  icon: DocumentTextIcon,

  groups: [
    { name: 'content', title: 'Contenu', icon: DocumentTextIcon, default: true },
    { name: 'seo', title: 'SEO', icon: SearchIcon },
    { name: 'media', title: 'Médias', icon: ImageIcon },
    { name: 'metadata', title: 'Métadonnées', icon: CogIcon },
    { name: 'advanced', title: 'Avancé', icon: RocketIcon },
  ],

  fields: [
    // =========================
    // CONTENU PRINCIPAL
    // =========================
    defineField({
      name: 'title',
      title: 'Titre H1',
      type: 'string',
      description: 'Titre principal de l\'article. Doit inclure le mot-clé principal. 50-70 caractères recommandés pour le SEO.',
      validation: (rule) => rule.required().min(10).max(80).warning('Idéalement entre 50 et 70 caractères pour le SEO'),
      options: {
        search: { weight: 10 },
      },
      group: 'content',
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug URL',
      description: 'URL de l\'article (ex: /blog/mon-article-seo). Doit être unique.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
      },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return 'Le slug est requis'
          // Validation du format
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
          }
          // Vérification de l'unicité
          const client = context.getClient({ apiVersion: '2024-01-01' })
          const currentId = context.document?._id || ''
          
          // Trouver tous les documents (publiés et drafts) avec ce slug
          const conflictingDocs = await client.fetch(
            `*[_type == "post" && slug.current == $slug]{
              _id,
              title,
              _id
            }`,
            {
              slug: slug.current,
            }
          )
          
          // Filtrer pour exclure le document actuel et son équivalent draft/publié
          const currentIdBase = currentId.replace(/^drafts\./, '')
          const filtered = conflictingDocs.filter((doc: { _id: string }) => {
            const docIdBase = doc._id.replace(/^drafts\./, '')
            // Exclure le document actuel et son équivalent (draft ou publié)
            return docIdBase !== currentIdBase
          })
          
          if (filtered.length > 0) {
            const conflictingDoc = filtered[0]
            const isDraft = conflictingDoc._id.startsWith('drafts.')
            const docTitle = conflictingDoc.title || 'Sans titre'
            const docType = isDraft ? 'brouillon' : 'article publié'
            
            return `Ce slug est déjà utilisé par un ${docType}: "${docTitle}" (ID: ${conflictingDoc._id}). ${isDraft ? 'Supprimez le brouillon dans Sanity Studio ou utilisez un autre slug.' : 'Utilisez un autre slug.'}`
          }
          
          return true
        }),
      group: 'content',
    }),

    defineField({
      name: 'excerpt',
      title: 'Résumé / Chapeau',
      type: 'text',
      rows: 4,
      description:
        'Résumé accrocheur affiché dans les listes. Utilisé comme fallback pour la meta description. Inclure un Call-to-Action.',
      validation: (rule) => rule.required().min(120).max(200).warning('120-200 caractères pour un bon équilibre'),
      options: {
        search: { weight: 8 }, // Poids élevé pour le résumé (recherche secondaire)
      },
      group: 'content',
    }),

    defineField({
      name: 'body',
      title: "Contenu de l'article",
      type: 'array',
      description: 'Contenu principal de l\'article. Minimum 1000 mots recommandé pour le SEO.',
      of: [
        { type: 'block' },
        { type: 'image' }, // Type natif pour compatibilité avec données existantes
        defineArrayMember({ type: 'customImage' }),
        defineArrayMember({ type: 'code' }),
        defineArrayMember({ type: 'youtube' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'infoBox' }),
        defineArrayMember({ type: 'faqBlock' }),
        defineArrayMember({ type: 'relatedArticles' }),
        defineArrayMember({ type: 'tableBlock' }), // Tableau personnalisé
        // Plugin @sanity/table - Tableaux simples pour articles de blog
        // https://www.sanity.io/plugins/@sanity/table
        { type: 'table' },
      ],
      validation: (rule) => rule.required(),
      options: {
        search: { weight: 5 }, // Poids moyen pour le contenu (recherche dans Portable Text avec groq2024)
      },
      group: 'content',
    }),
    defineField({
      name: 'markdownContent',
      title: 'Contenu Markdown',
      type: 'markdown',
      description: 'Contenu en Markdown avec support des images',
      group: 'content',
    }),

    // =========================
    // SEO (Type réutilisable)
    // =========================
    defineField({
      name: 'seo',
      type: 'seo',
      description: 'Métadonnées SEO pour Google et réseaux sociaux (Open Graph, Twitter Cards)',
      group: 'seo',
    }),

    // =========================
    // IMAGE PRINCIPALE
    // =========================
    defineField({
      name: 'image',
      title: 'Image Principale',
      type: 'image',
      description: 'Image de couverture de l\'article. Format recommandé: 1200x630px. Utilisée pour Open Graph si aucune image OG spécifique n\'est définie.',
      options: {
        hotspot: true,
        // Configuration AI Assist pour génération automatique de descriptions d'images
        aiAssist: {
          imageDescriptionField: 'alt', // Génère automatiquement le alt text avec IA
        },
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Description SEO de l\'image avec mots-clés naturels. Peut être généré automatiquement avec AI Assist.',
          validation: (rule) => rule.required().min(10).max(125),
        }),
        defineField({
          name: 'caption',
          title: 'Légende',
          type: 'string',
          description: 'Crédit photo ou description longue',
        }),
      ],
      validation: (rule) => rule.required(),
      group: 'media',
    }),

    // =========================
    // AUTEUR & E-E-A-T
    // =========================
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Auteur principal de l\'article. Crucial pour E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) et crédibilité.',
      validation: (rule) => rule.required(),
      group: 'metadata',
    }),

    defineField({
      name: 'coAuthors',
      title: 'Co-Auteurs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      description: 'Auteurs supplémentaires (optionnel)',
      group: 'metadata',
    }),

    defineField({
      name: 'reviewer',
      title: 'Réviseur / Expert',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Expert qui a validé le contenu. Renforce l\'E-E-A-T et est affiché dans Schema.org.',
      group: 'metadata',
    }),

    // =========================
    // MÉTADONNÉES TEMPORELLES
    // =========================
    defineField({
      name: 'publishedAt',
      title: 'Date de Publication',
      type: 'datetime',
      description: 'Date de première publication',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      group: 'metadata',
    }),

    defineField({
      name: 'updatedAt',
      title: 'Dernière Mise à Jour',
      type: 'datetime',
      description: 'Date de dernière modification (utilisée pour "dateModified" Schema.org)',
      group: 'metadata',
    }),

    defineField({
      name: 'lastReviewedAt',
      title: 'Dernière Révision Éditoriale',
      type: 'datetime',
      description: 'Date de la dernière vérification de l\'exactitude du contenu. Important pour E-E-A-T.',
      group: 'metadata',
    }),

    defineField({
      name: 'readingTime',
      title: 'Temps de Lecture (minutes)',
      type: 'number',
      description: 'Calculé automatiquement ou défini manuellement',
      validation: (rule) => rule.min(1).max(60),
      group: 'metadata',
    }),

    defineField({
      name: 'wordCount',
      title: 'Nombre de Mots',
      type: 'number',
      description: 'Nombre total de mots (calculé automatiquement recommandé)',
      readOnly: true,
      group: 'metadata',
    }),

    // =========================
    // TAXONOMIE & ORGANISATION
    // =========================
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: '1-2 catégories principales (structure silo SEO). Utilisé pour Schema.org articleSection.',
      validation: (rule) => rule.min(1).max(3).error('Sélectionnez entre 1 et 3 catégories'),
      group: 'metadata',
    }),

    defineField({
      name: 'tags',
      title: 'Tags / Mots-clés',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Mots-clés additionnels pour classification et recherche interne',
      validation: (rule) => rule.max(15).unique().warning('Maximum 15 tags recommandés'),
      options: {
        search: { weight: 7 }, // Poids élevé pour les tags (aide à trouver rapidement)
      },
      group: 'metadata',
    }),

    // =========================
    // SCHEMA.ORG & STRUCTURED DATA
    // =========================
    defineField({
      name: 'articleSection',
      title: 'Section Article (Schema.org)',
      type: 'string',
      description: 'Section principale de l\'article pour Schema.org. Généralement la première catégorie, mais peut être personnalisée.',
      group: 'metadata',
    }),

    defineField({
      name: 'keywords',
      title: 'Mots-clés (Meta Keywords)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Mots-clés pour Schema.org keywords. Généralement déprécié pour Google mais utile pour d\'autres moteurs de recherche.',
      validation: (rule) => rule.max(10),
      group: 'metadata',
    }),

    // =========================
    // STATUT & QUALITÉ
    // =========================
    defineField({
      name: 'status',
      title: 'Statut de Publication',
      type: 'string',
      description: "État de l'article",
      options: {
        list: [
          { title: 'Brouillon', value: 'draft' },
          { title: 'En Révision', value: 'review' },
          { title: 'Publié', value: 'published' },
          { title: 'À Mettre à Jour', value: 'needs_update' },
          { title: 'Archivé', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      group: 'advanced',
    }),

    defineField({
      name: 'contentQuality',
      title: 'Score de Qualité SEO',
      type: 'number',
      description: 'Score de qualité SEO sur 100. Peut être généré par un outil SEO externe.',
      validation: (rule) => rule.min(0).max(100),
      group: 'advanced',
    }),

    defineField({
      name: 'featured',
      title: 'Article Mis en Avant',
      type: 'boolean',
      description: 'Afficher cet article en tête de page d\'accueil ou de catégorie',
      initialValue: false,
      group: 'advanced',
    }),

    defineField({
      name: 'isPillarContent',
      title: 'Contenu Pilier (Pillar Page)',
      type: 'boolean',
      description: 'Article de référence long-format (2000+ mots) au centre d\'un topic cluster. Contenu pilier pour le SEO.',
      initialValue: false,
      group: 'advanced',
    }),

    // =========================
    // TABLE DES MATIÈRES
    // =========================
    defineField({
      name: 'showTableOfContents',
      title: 'Afficher la Table des Matières',
      type: 'boolean',
      description: 'Génère automatiquement une table des matières à partir des titres H2/H3',
      initialValue: true,
      group: 'advanced',
    }),

    // =========================
    // NOTES INTERNES
    // =========================
    defineField({
      name: 'internalNotes',
      title: 'Notes Internes (Non Publiques)',
      type: 'text',
      rows: 3,
      description: 'Notes internes pour l\'équipe éditoriale. Non affichées sur le site public.',
      group: 'advanced',
    }),

    // =========================
    // SEO TECHNIQUE
    // =========================
    defineField({
      name: 'focusKeyword',
      title: 'Mot-clé Principal (Focus Keyword)',
      type: 'string',
      description: 'Mot-clé principal ciblé pour cet article. Doit apparaître dans le titre, la description et le contenu. Utilisé pour l\'analyse SEO.',
      validation: (rule) => rule.min(2).max(50),
      group: 'seo',
    }),

    defineField({
      name: 'relatedKeywords',
      title: 'Mots-clés Associés (LSI Keywords)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Mots-clés sémantiques et variantes (LSI Keywords). Aide Google à comprendre le contexte. 5-10 recommandés.',
      validation: (rule) => rule.max(15).unique(),
      group: 'seo',
    }),
  ],

  // Configuration de la prévisualisation
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'image',
      status: 'status',
      publishedAt: 'publishedAt',
    },
    prepare({ title, author, media, status, publishedAt }) {
      const statusLabels: Record<string, string> = {
        draft: 'Brouillon',
        review: 'En Révision',
        published: 'Publié',
        needs_update: 'À Mettre à Jour',
        archived: 'Archivé',
      }
      const statusLabel = status ? statusLabels[status] || 'Non défini' : 'Non défini'
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('fr-FR') : 'Non publié'

      return {
        title: title || 'Sans titre',
        subtitle: `${statusLabel} • ${author || 'Sans auteur'} • ${date}`,
        media,
      }
    },
  },

  // Ordre des champs dans la liste
  orderings: [
    {
      title: 'Date de publication (récent)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Date de publication (ancien)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Titre A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
