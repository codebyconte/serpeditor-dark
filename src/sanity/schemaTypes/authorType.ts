import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Type Author - Auteur de Blog (Simplifié)
 * Version optimisée : uniquement les champs essentiels
 */
export const authorType = defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  icon: UserIcon,

  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      description: 'Nom complet de l\'auteur',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL (ex: jean-dupont)',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Rôle',
      type: 'string',
      description: 'Titre professionnel (ex: "Expert SEO", "Consultant Marketing")',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Photo de profil',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'text',
      rows: 3,
      description: 'Biographie courte (2-3 phrases)',
      validation: (rule) => rule.required().min(50).max(300),
    }),

    defineField({
      name: 'bioLong',
      title: 'Biographie Complète',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Biographie détaillée pour la page auteur (optionnel)',
    }),

    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Domaines d\'expertise (ex: "SEO Technique", "Content Marketing")',
      validation: (rule) => rule.max(10),
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Email professionnel (optionnel)',
      validation: (rule) => rule.email(),
    }),

    defineField({
      name: 'website',
      title: 'Site Web',
      type: 'url',
      description: 'Site web ou portfolio (optionnel)',
    }),

    defineField({
      name: 'social',
      title: 'Réseaux Sociaux',
      type: 'object',
      description: 'Profils sur les réseaux sociaux (optionnel)',
      fields: [
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter / X',
          type: 'url',
        }),
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
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
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
