import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

/**
 * Block CTA (Call-to-Action) pour inciter à l'action dans les articles
 */
export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call-to-Action (CTA)',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'style',
      title: 'Style Visuel',
      type: 'string',
      description: 'Choisir le style d\'affichage du CTA',
      options: {
        list: [
          { title: 'Principal (Accent)', value: 'primary' },
          { title: 'Informatif (Bleu)', value: 'info' },
          { title: 'Succès (Vert)', value: 'success' },
          { title: 'Attention (Orange)', value: 'warning' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'heading',
      title: 'Titre du CTA',
      type: 'string',
      description: 'Titre accrocheur du call-to-action (ex: "Prêt à booster votre SEO ?")',
      validation: (rule) => rule.required().min(5).max(100),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Message persuasif (1-2 phrases)',
      validation: (rule) => rule.max(300),
    }),

    defineField({
      name: 'buttonText',
      title: 'Texte du Bouton',
      type: 'string',
      description: 'Texte du bouton avec verbe d\'action (ex: "Commencer Maintenant", "Télécharger le Guide")',
      validation: (rule) => rule.required().min(3).max(50),
    }),

    defineField({
      name: 'buttonLink',
      title: 'Lien du Bouton',
      type: 'url',
      description: 'URL de destination (interne ou externe)',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),

    defineField({
      name: 'openInNewTab',
      title: 'Ouvrir dans un nouvel onglet',
      type: 'boolean',
      description: 'Cocher pour les liens externes',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      subtitle: 'buttonText',
      style: 'style',
    },
    prepare({ title, subtitle, style }) {
      const styleLabel = {
        primary: 'Principal',
        info: 'Informatif',
        success: 'Succès',
        warning: 'Attention',
      }[style] || 'Principal'

      return {
        title: title || 'Call-to-Action',
        subtitle: `${styleLabel} • ${subtitle || 'Sans bouton'}`,
        media: RocketIcon,
      }
    },
  },
})
