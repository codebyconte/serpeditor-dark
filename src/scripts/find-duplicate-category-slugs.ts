/**
 * Script pour trouver les catégories avec des slugs dupliqués (y compris les brouillons)
 * Usage: npx tsx scripts/find-duplicate-category-slugs.ts
 */

import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../src/sanity/env'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

async function findDuplicateCategorySlugs() {
  console.log('🔍 Recherche des catégories avec des slugs dupliqués...\n')

  // Récupérer toutes les catégories (publiées et brouillons)
  const categories = await client.fetch(
    `*[_type == "category" && defined(slug.current)]{
      _id,
      title,
      "slug": slug.current,
      "isDraft": _id match "drafts.*",
      isActive
    } | order(slug asc)`
  )

  if (categories.length === 0) {
    console.log('✅ Aucune catégorie trouvée.')
    return
  }

  console.log(`📋 ${categories.length} catégorie(s) trouvée(s) au total\n`)

  // Grouper par slug
  const slugGroups = new Map<string, typeof categories>()
  
  categories.forEach((cat: any) => {
    const slug = cat.slug
    if (!slugGroups.has(slug)) {
      slugGroups.set(slug, [])
    }
    slugGroups.get(slug)!.push(cat)
  })

  // Trouver les slugs dupliqués
  const duplicates = Array.from(slugGroups.entries()).filter(
    ([_, cats]) => cats.length > 1
  )

  if (duplicates.length === 0) {
    console.log('✅ Aucun slug dupliqué trouvé.')
    return
  }

  console.log(`⚠️  ${duplicates.length} slug(s) dupliqué(s) trouvé(s):\n`)

  duplicates.forEach(([slug, cats]) => {
    console.log(`\n📌 Slug: "${slug}"`)
    console.log(`   Trouvé dans ${cats.length} catégorie(s):\n`)
    
    cats.forEach((cat: any, index: number) => {
      console.log(`   ${index + 1}. ${cat.isDraft ? '📝 BROUILLON' : '✅ PUBLIÉ'}`)
      console.log(`      ID: ${cat._id}`)
      console.log(`      Titre: ${cat.title || 'Sans titre'}`)
      console.log(`      Active: ${cat.isActive ? 'Oui' : 'Non'}`)
      console.log('')
    })

    // Identifier les brouillons à supprimer
    const drafts = cats.filter((cat: any) => cat.isDraft)
    const published = cats.filter((cat: any) => !cat.isDraft)

    if (drafts.length > 0 && published.length > 0) {
      console.log('   💡 RECOMMANDATION: Supprimez les brouillons car une version publiée existe déjà.')
      drafts.forEach((draft: any) => {
        console.log(`      - À supprimer: ${draft._id} ("${draft.title || 'Sans titre'}")`)
      })
    } else if (drafts.length > 1) {
      console.log('   💡 RECOMMANDATION: Plusieurs brouillons avec le même slug. Gardez-en un seul.')
    }
  })

  console.log('\n💡 Pour supprimer un brouillon dans Sanity Studio:')
  console.log('   1. Ouvrez le document dans Sanity Studio')
  console.log('   2. Cliquez sur "Discard draft" ou supprimez-le')
  console.log('   3. Ou utilisez: npx sanity documents delete <document-id>\n')
}

findDuplicateCategorySlugs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
