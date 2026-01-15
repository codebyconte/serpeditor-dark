'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { assist } from '@sanity/assist'
import { codeInput } from '@sanity/code-input'
import { table } from '@sanity/table'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { markdownSchema } from 'sanity-plugin-markdown'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'SerpEditor',
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  // Configuration de la recherche globale du Studio
  // Utilise groq2024 pour de meilleures performances et recherche dans Portable Text
  search: {
    strategy: 'groq2024', // Amélioration par rapport à groqLegacy : meilleure performance, recherche dans Portable Text, recherche profonde
  },
  // Optimisations de performance pour le Studio
  document: {
    // Réduire le nombre de requêtes en cache
    unstable_comments: {
      enabled: false, // Désactiver les commentaires si non utilisés pour améliorer les performances
    },
  },
  // Configuration pour améliorer les performances de chargement
  studio: {
    components: {
      // Optimiser le chargement des composants
    },
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    // Code input for code blocks in rich text
    codeInput(),
    // Unsplash asset source pour images libres de droits
    unsplashImageAsset(),
    // Markdown editor pour éditer du contenu en Markdown
    markdownSchema(),
    // AI Assist - Automatisation et optimisation de contenu avec IA
    // Nécessite un plan Growth ou supérieur
    // https://www.sanity.io/docs/studio/install-and-configure-sanity-ai-assist
    assist({
      assist: {
        // Configuration locale pour dates/heures (français)
        localeSettings: () => ({
          locale: 'fr-FR',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
        // Profondeur maximale pour les chemins de documents (optimisé pour performance)
        maxPathDepth: 4,
        // Température pour la génération (0.3 = plus déterministe, bon pour SEO)
        temperature: 0.3,
      },
    }),
    // Table plugin - Tableaux simples pour Portable Text
    // https://www.sanity.io/plugins/@sanity/table
    table(),
  ],
})
