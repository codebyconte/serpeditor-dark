import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Type Post - Article de Blog (Simplifié)
 * Configuration SEO optimisée sans surcharge de champs
 */
export const postType = defineType({
  name: 'post',
  title: 'Article de Blog',
  type: 'document',
  icon: DocumentTextIcon,

  fields: [
    // =========================
    // CONTENU PRINCIPAL
    // =========================
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Titre de l\'article (50-70 caractères recommandés)',
      validation: (rule) => rule.required().min(10).max(80),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug URL',
      description: 'URL de l\'article (ex: mon-article-seo)',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      description: 'Résumé de l\'article (140-160 caractères pour le SEO)',
      validation: (rule) => rule.required().min(120).max(200),
    }),

    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      description: 'Contenu principal de l\'article',
      of: [
        { type: 'block' },
        { type: 'image' },
        defineArrayMember({ type: 'customImage' }),
        defineArrayMember({ type: 'code' }),
        defineArrayMember({ type: 'youtube' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'infoBox' }),
        defineArrayMember({ type: 'faqBlock' }),
        defineArrayMember({ type: 'relatedArticles' }),
        defineArrayMember({ type: 'tableBlock' }),
        { type: 'table' },
      ],
      validation: (rule) => rule.required(),
    }),

    // =========================
    // IMAGE PRINCIPALE (utilisée aussi pour OpenGraph)
    // =========================
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Image de couverture (1200x630px recommandé). Utilisée aussi pour Open Graph.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Description SEO de l\'image',
          validation: (rule) => rule.required().min(10).max(125),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // =========================
    // SEO (simplifié)
    // =========================
    defineField({
      name: 'seo',
      type: 'seo',
      description: 'Métadonnées SEO (optionnel, utilise titre/résumé/image par défaut)',
    }),

    // =========================
    // AUTEUR
    // =========================
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Auteur principal',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'coAuthors',
      title: 'Co-Auteurs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      description: 'Auteurs supplémentaires (optionnel)',
    }),

    // =========================
    // DATES
    // =========================
    defineField({
      name: 'publishedAt',
      title: 'Date de Publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Dernière Mise à Jour',
      type: 'datetime',
      description: 'Date de modification (optionnel)',
    }),

    defineField({
      name: 'readingTime',
      title: 'Temps de Lecture (min)',
      type: 'number',
      description: 'Temps de lecture estimé',
      validation: (rule) => rule.min(1).max(60),
    }),

    // =========================
    // CATÉGORIES & TAGS
    // =========================
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: '1-3 catégories',
      validation: (rule) => rule.min(1).max(3),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Mots-clés pour recherche',
      validation: (rule) => rule.max(15).unique(),
    }),

    // =========================
    // STATUT
    // =========================
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Brouillon', value: 'draft' },
          { title: 'En Révision', value: 'review' },
          { title: 'Publié', value: 'published' },
          { title: 'Archivé', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),

    defineField({
      name: 'featured',
      title: 'Article Mis en Avant',
      type: 'boolean',
      description: 'Afficher en tête de page',
      initialValue: false,
    }),

    defineField({
      name: 'isPillarContent',
      title: 'Contenu Pilier',
      type: 'boolean',
      description: 'Article de référence long-format',
      initialValue: false,
    }),

    defineField({
      name: 'showTableOfContents',
      title: 'Table des Matières',
      type: 'boolean',
      description: 'Afficher la table des matières',
      initialValue: true,
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
