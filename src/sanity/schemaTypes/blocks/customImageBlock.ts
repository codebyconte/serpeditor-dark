import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

/**
 * Block image enrichi pour le contenu des articles
 * Avec options SEO avancées
 */
export const customImageBlock = defineType({
  name: 'customImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {
    hotspot: true, // Permet de définir le point focal
    // Configuration AI Assist pour génération automatique de descriptions d'images
    aiAssist: {
      imageDescriptionField: 'alt', // Génère automatiquement le alt text avec IA
    },
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text (Texte Alternatif)',
      type: 'string',
      description: 'Texte alternatif crucial pour le SEO et l\'accessibilité. Décrire précisément l\'image avec des mots-clés naturels.',
      validation: (rule) => rule.required().min(10).max(125),
    }),

    defineField({
      name: 'caption',
      title: 'Légende',
      type: 'string',
      description: 'Texte affiché sous l\'image. Peut contenir le crédit photo ou une description complémentaire.',
      validation: (rule) => rule.max(200),
    }),

    defineField({
      name: 'title',
      title: 'Title Attribute',
      type: 'string',
      description: 'Texte affiché au survol de la souris (attribut title). Optionnel mais recommandé pour l\'accessibilité.',
      validation: (rule) => rule.max(100),
    }),

    defineField({
      name: 'size',
      title: 'Taille d\'Affichage',
      type: 'string',
      description: 'Contrôler la largeur de l\'image dans l\'article',
      options: {
        list: [
          { title: 'Petite (50%)', value: 'small' },
          { title: 'Moyenne (75%)', value: 'medium' },
          { title: 'Grande (100%)', value: 'large' },
          { title: 'Pleine largeur', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'large',
    }),

    defineField({
      name: 'linkTo',
      title: 'Lien de l\'Image',
      type: 'url',
      description: 'URL si l\'image doit être cliquable (optionnel)',
    }),
  ],

  preview: {
    select: {
      media: 'asset',
      alt: 'alt',
      caption: 'caption',
    },
    prepare({ media, alt, caption }) {
      return {
        title: alt || 'Image sans alt text',
        subtitle: caption || 'Aucune légende',
        media,
      }
    },
  },
})
