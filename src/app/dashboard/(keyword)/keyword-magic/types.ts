// 📁 app/dashboard/keyword-magic/types.ts
export interface KeywordInfo {
  se_type?: string
  last_updated_time?: string
  competition?: number
  competition_level?: 'LOW' | 'MEDIUM' | 'HIGH'
  cpc?: number
  search_volume?: number
  low_top_of_page_bid?: number
  high_top_of_page_bid?: number
  categories?: number[]
  monthly_searches?: Array<{
    year: number
    month: number
    search_volume: number
  }>
  search_volume_trend?: {
    monthly?: number
    quarterly?: number
    yearly?: number
  }
  keyword_info_normalized_with_bing?: {
    last_updated_time?: string
    search_volume?: number
    is_normalized?: boolean
    monthly_searches?: Array<{
      year: number
      month: number
      search_volume: number
    }>
  }
  keyword_info_normalized_with_clickstream?: {
    last_updated_time?: string
    search_volume?: number
    is_normalized?: boolean
    monthly_searches?: Array<{
      year: number
      month: number
      search_volume: number
    }>
  }
}

export interface KeywordProperties {
  se_type?: string
  core_keyword?: string
  synonym_clustering_algorithm?: string
  keyword_difficulty?: number
  detected_language?: string
  is_another_language?: boolean
  words_count?: number
}

export interface SerpInfo {
  se_type?: string
  check_url?: string
  serp_item_types?: string[]
  se_results_count?: string | number // String pour keyword_suggestions, number pour related_keywords
  last_updated_time?: string
  previous_updated_time?: string
}

export interface ClickstreamKeywordInfo {
  search_volume?: number
  last_updated_time?: string
  gender_distribution?: {
    female?: number
    male?: number
  }
  age_distribution?: {
    '18-24'?: number
    '25-34'?: number
    '35-44'?: number
    '45-54'?: number
    '55-64'?: number
  }
  monthly_searches?: Array<{
    year: number
    month: number
    search_volume: number
  }>
}

export interface AvgBacklinksInfo {
  se_type?: string
  backlinks?: number
  dofollow?: number
  referring_pages?: number
  referring_domains?: number
  referring_main_domains?: number
  rank?: number
  main_domain_rank?: number
  last_updated_time?: string
}

export interface SearchIntentInfo {
  se_type?: string
  main_intent?: 'informational' | 'navigational' | 'commercial' | 'transactional'
  foreign_intent?: Array<'informational' | 'navigational' | 'commercial' | 'transactional'>
  last_updated_time?: string
}

/**
 * Structure pour keyword_data dans related_keywords
 */
export interface KeywordData {
  se_type?: string
  keyword: string
  location_code?: number
  language_code?: string
  keyword_info?: KeywordInfo
  keyword_properties?: KeywordProperties
  serp_info?: SerpInfo
  clickstream_keyword_info?: ClickstreamKeywordInfo
  avg_backlinks_info?: AvgBacklinksInfo
  search_intent_info?: SearchIntentInfo
}

export interface KeywordItem {
  se_type?: string
  keyword: string
  location_code?: number
  language_code?: string
  search_partners?: boolean
  competition?: number
  competition_level?: string
  cpc?: number
  search_volume?: number
  categories?: number[]
  keyword_info?: KeywordInfo
  keyword_properties?: KeywordProperties
  serp_info?: SerpInfo
  clickstream_keyword_info?: ClickstreamKeywordInfo
  avg_backlinks_info?: AvgBacklinksInfo
  search_intent_info?: SearchIntentInfo
  // Champs spécifiques à related_keywords
  keyword_data?: KeywordData // Pour related_keywords
  depth?: number // Profondeur de recherche
  related_keywords?: string[] // Liste de mots-clés associés
}

export interface DataForSEOFilter {
  field: string
  operator: string
  value: string | number
}

export type FilterExpression =
  | [string, string, string | number]
  | [[string, string, string | number], 'and' | 'or', [string, string, string | number]]
  | Array<[string, string, string | number] | 'and' | 'or'>

export interface KeywordMagicParams {
  keyword: string
  locationCode?: number
  languageCode?: string
  filters?: FilterExpression
  orderBy?: string[]
  limit?: number
  offset?: number
  offsetToken?: string // Pour pagination avec token
  includeSerp?: boolean
  includeClickstream?: boolean
  includeSeedKeyword?: boolean // Inclure les données du seed keyword
  exactMatch?: boolean // Rechercher la phrase exacte
  ignoreSynonyms?: boolean // Ignorer les synonymes
}

export interface APIResponse<T> {
  success: boolean
  results?: T[]
  seedData?: KeywordInfo | KeywordInfo[] // Array pour related_keywords
  seedKeyword?: string
  totalCount?: number
  itemsCount?: number
  offset?: number
  offsetToken?: string
  cost?: number
  error?: string
}

export interface DataForSEOResponse {
  version: string
  status_code: number
  status_message: string
  time: string
  cost: number
  tasks_count: number
  tasks_error: number
  tasks: Array<{
    id: string
    status_code: number
    status_message: string
    time: string
    cost: number
    result_count: number
    path: string[]
    task: {
      api: string
      function: string
      se_type: string
      keyword: string
    }
    result: Array<{
      keyword: string
      location_code: number
      language_code: string
      total_count: number
      items_count: number
      items: KeywordItem[]
      seed_keyword_data?: KeywordInfo
    }>
  }>
}
