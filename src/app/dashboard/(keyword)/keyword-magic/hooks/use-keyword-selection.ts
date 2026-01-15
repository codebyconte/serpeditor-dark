// 📁 app/dashboard/keyword-magic/hooks/use-keyword-selection.ts
'use client'

import { useCallback, useState } from 'react'

export function useKeywordSelection() {
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set(),
  )

  const toggleKeyword = useCallback((keyword: string) => {
    setSelectedKeywords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(keyword)) {
        newSet.delete(keyword)
      } else {
        newSet.add(keyword)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback((keywords: string[]) => {
    setSelectedKeywords(new Set(keywords))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedKeywords(new Set())
  }, [])

  const toggleAll = useCallback((keywords: string[]) => {
    setSelectedKeywords((prev) => {
      if (prev.size === keywords.length) {
        return new Set()
      }
      return new Set(keywords)
    })
  }, [])

  return {
    selectedKeywords,
    toggleKeyword,
    selectAll,
    clearSelection,
    toggleAll,
  }
}
