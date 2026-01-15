// 📁 app/dashboard/keyword-magic/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.DATAFORSEO_URL,
  CREDENTIALS: process.env.DATAFORSEO_PASSWORD,
  TIMEOUT: 30000, // 30 secondes
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 seconde
} as const

export const DEFAULT_PARAMS = {
  locationCode: 2250, // France
  languageCode: 'fr',
  limit: 1000,
  includeSerp: true,
  includeClickstream: false,
  depth: 2,
} as const

export const LOCATIONS = {
  FRANCE: 2250,
  USA: 2840,
  UK: 2826,
  GERMANY: 2276,
  SPAIN: 2724,
  CANADA: 2124,
  BELGIUM: 2056,
  SWITZERLAND: 2756,
} as const

export const LANGUAGES = {
  FRENCH: 'fr',
  ENGLISH: 'en',
  GERMAN: 'de',
  SPANISH: 'es',
  ITALIAN: 'it',
  DUTCH: 'nl',
} as const

// Validation des filtres DataForSEO
export const VALID_OPERATORS = [
  'regex',
  'not_regex',
  '<',
  '<=',
  '>',
  '>=',
  '=',
  '<>',
  'in',
  'not_in',
  'like',
  'not_like',
  'ilike',
  'not_ilike',
] as const

export const FILTERABLE_FIELDS = {
  KEYWORD: 'keyword',
  SEARCH_VOLUME: 'keyword_info.search_volume',
  CPC: 'keyword_info.cpc',
  COMPETITION: 'keyword_info.competition',
  COMPETITION_LEVEL: 'keyword_info.competition_level',
  LOW_BID: 'keyword_info.low_top_of_page_bid',
  HIGH_BID: 'keyword_info.high_top_of_page_bid',
  DIFFICULTY: 'keyword_properties.keyword_difficulty',
} as const

export const SORTABLE_FIELDS = {
  RELEVANCE: 'relevance,desc', // Uniquement pour keyword_ideas
  SEARCH_VOLUME: 'keyword_info.search_volume,desc',
  CPC: 'keyword_info.cpc,desc',
  COMPETITION: 'keyword_info.competition,desc',
  DIFFICULTY: 'keyword_properties.keyword_difficulty,asc',
} as const
