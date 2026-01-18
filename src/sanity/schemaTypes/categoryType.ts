import { FolderIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Type Category - Catégorie de Blog (Ultra-simplifié)
 * Utilisé dans l'URL: /blog?category=slug
 */
export const categoryType = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: FolderIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Nom',
      type: 'string',
      description: 'Nom de la catégorie',
      validation: (rule) => rule.required().min(3).max(60),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL (ex: seo-technique)',
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
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Description courte de la catégorie',
      validation: (rule) => rule.max(200),
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Afficher sur le site',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare({ title, isActive }) {
      return {
        title: title || 'Sans titre',
        subtitle: isActive ? '✓ Active' : '✗ Inactive',
      }
    },
  },
})
