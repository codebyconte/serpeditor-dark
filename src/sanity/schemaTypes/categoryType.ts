import { DocumentTextIcon, FolderIcon, ImageIcon, LinkIcon, SearchIcon, TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Type Category - Catégorie de Blog
 * Configuration SEO avec structure silo et breadcrumbs
 */
export const categoryType = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: FolderIcon,

  groups: [
    { name: 'content', title: 'Contenu', icon: DocumentTextIcon, default: true },
    { name: 'seo', title: 'SEO', icon: SearchIcon },
    { name: 'media', title: 'Médias', icon: ImageIcon },
    { name: 'structure', title: 'Structure', icon: LinkIcon },
    { name: 'branding', title: 'Branding', icon: TagIcon },
  ],

  fields: [
    // =========================
    // CONTENU
    // =========================
    defineField({
      name: 'title',
      title: 'Nom de la Catégorie',
      type: 'string',
      description: 'Nom court et descriptif de la catégorie (ex: "SEO Technique", "Content Marketing")',
      group: 'content',
      validation: (rule) => rule.required().min(3).max(60),
      options: {
        search: { weight: 10 }, // Poids élevé pour le titre de catégorie
      },
    }),

    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      description: 'URL de la catégorie (ex: /category/seo-technique). Doit être unique.',
      group: 'content',
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
            `*[_type == "category" && slug.current == $slug]{
              _id,
              title,
              _id
            }`,
            {
              slug: slug.current,
            },
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
            const docType = isDraft ? 'brouillon' : 'catégorie publiée'

            return `Ce slug est déjà utilisé par une ${docType}: "${docTitle}" (ID: ${conflictingDoc._id}). ${isDraft ? 'Supprimez le brouillon dans Sanity Studio ou utilisez un autre slug.' : 'Utilisez un autre slug.'}`
          }

          return true
        }),
    }),

    defineField({
      name: 'excerpt',
      title: 'Résumé Court',
      type: 'text',
      rows: 2,
      description: 'Description courte affichée dans les listes et cards. 100-150 caractères recommandés.',
      group: 'content',
      validation: (rule) => rule.max(200),
    }),

    // =========================
    // SEO (Type réutilisable)
    // =========================
    defineField({
      name: 'seo',
      type: 'seo',
      description: 'Métadonnées SEO pour Google et réseaux sociaux',
      group: 'seo',
    }),

    // =========================
    // IMAGE
    // =========================
    defineField({
      name: 'image',
      title: 'Image de la Catégorie',
      type: 'image',
      description: 'Image représentative de la catégorie. Format recommandé: 1200x630px.',
      group: 'media',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: "Description SEO de l'image",
          validation: (rule) => rule.required().min(10).max(125),
        }),
      ],
    }),

    // =========================
    // STRUCTURE SILO & HIÉRARCHIE
    // =========================
    defineField({
      name: 'parent',
      title: 'Catégorie Parente',
      type: 'reference',
      to: [{ type: 'category' }],
      description:
        'Catégorie parente pour créer une hiérarchie (Silo SEO). Ex: "Marketing Digital" > "SEO" > "SEO Technique"',
      group: 'structure',
    }),

    defineField({
      name: 'order',
      title: "Ordre d'Affichage",
      type: 'number',
      description:
        "Ordre d'affichage dans le menu et les listes. Plus le nombre est petit, plus la catégorie apparaît en premier.",
      group: 'structure',
      validation: (rule) => rule.min(0),
    }),

    // =========================
    // COULEUR & BRANDING
    // =========================
    defineField({
      name: 'color',
      title: 'Couleur de la Catégorie',
      type: 'string',
      description: "Couleur d'accent pour badges et interface utilisateur. Format hexadécimal (ex: #FF5733)",
      group: 'branding',
      validation: (rule) =>
        rule
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex',
            invert: false,
          })
          .error('La couleur doit être au format hexadécimal (ex: #FF5733 ou #F57)'),
    }),

    defineField({
      name: 'icon',
      title: 'Icône',
      type: 'string',
      description:
        'Nom de l\'icône à utiliser pour cette catégorie. Dépend de votre bibliothèque d\'icônes (ex: "TrendingUp", "Book")',
      group: 'branding',
    }),

    // =========================
    // MÉTADONNÉES
    // =========================
    defineField({
      name: 'isActive',
      title: 'Catégorie Active',
      type: 'boolean',
      description: 'Décocher pour masquer la catégorie du site sans la supprimer',
      initialValue: true,
    }),

    defineField({
      name: 'featured',
      title: 'Catégorie Mise en Avant',
      type: 'boolean',
      description: "Afficher cette catégorie dans le menu principal ou sur la page d'accueil",
      initialValue: false,
    }),

    defineField({
      name: 'articleCount',
      title: "Nombre d'Articles",
      type: 'number',
      description: "Nombre d'articles dans cette catégorie. Calculé automatiquement.",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
      parent: 'parent.title',
      isActive: 'isActive',
    },
    prepare({ title, media, parent, isActive }) {
      const status = isActive ? 'Active' : 'Inactive'
      const hierarchy = parent ? `${parent} > ${title}` : title

      return {
        title: title || 'Sans titre',
        subtitle: `${status} • ${parent ? hierarchy : 'Catégorie racine'}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Ordre personnalisé',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Nom A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
