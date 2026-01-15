import {
  UserIcon,
  DocumentTextIcon,
  TagIcon,
  LinkIcon,
  SearchIcon,
} from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Type Author pour les articles de blog
 * Inclut expertise, crédibilité (E-E-A-T) et données structurées
 */
export const authorType = defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  icon: UserIcon,

  groups: [
    { name: 'profile', title: 'Profil', icon: UserIcon, default: true },
    { name: 'expertise', title: 'Expertise', icon: TagIcon },
    { name: 'contact', title: 'Contact', icon: LinkIcon },
    { name: 'seo', title: 'SEO', icon: SearchIcon },
  ],

  fields: [
    // =========================
    // INFORMATIONS DE BASE
    // =========================
    defineField({
      name: 'name',
      title: 'Nom Complet',
      type: 'string',
      description: 'Nom complet de l\'auteur',
      validation: (rule) => rule.required(),
      options: {
        search: { weight: 10 },
      },
      group: 'profile',
    }),

    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      group: 'profile',
    }),

    defineField({
      name: 'role',
      title: 'Titre / Rôle',
      type: 'string',
      description: 'Titre ou rôle professionnel (ex: "Expert SEO", "Consultant Marketing Digital", "Rédacteur Web Senior")',
      validation: (rule) => rule.required(),
      options: {
        search: { weight: 7 },
      },
      group: 'profile',
    }),

    defineField({
      name: 'image',
      title: 'Photo de Profil',
      type: 'image',
      description: 'Photo de profil professionnelle. Format carré recommandé.',
      group: 'profile',
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

    // =========================
    // E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
    // =========================
    defineField({
      name: 'bio',
      title: 'Biographie Courte',
      type: 'text',
      rows: 3,
      description: 'Biographie courte en 2-3 phrases. Affichée sous les articles de l\'auteur.',
      validation: (rule) => rule.required().min(50).max(300),
      options: {
        search: { weight: 6 },
      },
      group: 'profile',
    }),

    defineField({
      name: 'bioLong',
      title: 'Biographie Complète',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Biographie complète pour la page auteur. Détaille le parcours, l\'expertise et les réalisations.',
      group: 'profile',
    }),

    defineField({
      name: 'expertise',
      title: "Domaines d'Expertise",
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Domaines d\'expertise de l\'auteur (ex: "SEO Technique", "Content Marketing", "Google Analytics")',
      validation: (rule) => rule.min(1).max(10),
      options: {
        search: { weight: 8 },
      },
      group: 'expertise',
    }),

    defineField({
      name: 'yearsOfExperience',
      title: "Années d'Expérience",
      type: 'number',
      description: 'Nombre d\'années d\'expérience professionnelle dans le domaine',
      group: 'expertise',
      validation: (rule) => rule.min(0).max(50),
    }),

    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Nom de la Certification',
              type: 'string',
              description: 'Ex: "Google Analytics Certified", "HubSpot Content Marketing"',
            }),
            defineField({
              name: 'issuer',
              title: 'Organisme',
              type: 'string',
              description: 'Ex: "Google", "HubSpot Academy"',
            }),
            defineField({
              name: 'year',
              title: "Année d'Obtention",
              type: 'number',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'issuer',
            },
          },
        },
      ],
      description: 'Certifications professionnelles obtenues par l\'auteur. Renforce l\'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).',
      group: 'expertise',
    }),

    // =========================
    // RÉSEAUX SOCIAUX & CONTACT
    // =========================
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Adresse email professionnelle. Utilisée pour Schema.org et contact.',
      validation: (rule) => rule.email(),
      group: 'contact',
    }),

    defineField({
      name: 'website',
      title: 'Site Web Personnel',
      type: 'url',
      description: 'URL du site web ou portfolio personnel de l\'auteur',
      group: 'contact',
    }),

    defineField({
      name: 'social',
      title: 'Réseaux Sociaux',
      type: 'object',
      description: 'Profils sur les réseaux sociaux. Utilisés pour Schema.org et renforcement de l\'E-E-A-T.',
      group: 'contact',
      fields: [
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          description: 'URL complète du profil LinkedIn',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter / X',
          type: 'url',
          description: 'URL complète du profil Twitter/X',
        }),
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url',
          description: 'URL complète du profil GitHub (pour auteurs techniques)',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          description: 'URL de la chaîne YouTube',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // =========================
    // SEO
    // =========================
    defineField({
      name: 'seo',
      type: 'seo',
      description: 'Métadonnées SEO pour la page auteur',
      group: 'seo',
    }),

    // =========================
    // STATISTIQUES & METADATA
    // =========================
    defineField({
      name: 'publishedArticlesCount',
      title: "Nombre d'Articles Publiés",
      type: 'number',
      description: 'Nombre total d\'articles publiés par cet auteur. Calculé automatiquement ou mis à jour manuellement.',
      readOnly: true,
    }),

    defineField({
      name: 'isGuestAuthor',
      title: 'Auteur Invité',
      type: 'boolean',
      description: "Cocher si c'est un contributeur externe",
      initialValue: false,
    }),

    defineField({
      name: 'isActive',
      title: 'Auteur Actif',
      type: 'boolean',
      description: "Décocher pour masquer l'auteur du site",
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
