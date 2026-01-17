// 📁 components/audit/types.ts

export interface AuditPageMetricsChecks {
  no_title?: number
  no_description?: number
  no_h1_tag?: number
  duplicate_title?: number
  duplicate_description?: number
  duplicate_content?: number
  is_https?: number
  is_http?: number
  low_content_rate?: number
  high_loading_time?: number
  high_waiting_time?: number
  no_image_alt?: number
  no_image_title?: number
  canonical?: number
  no_favicon?: number
  no_content_encoding?: number
  seo_friendly_url?: number
  has_robots_txt?: boolean
  has_sitemap?: boolean
  is_www?: number
  title_too_long?: number
  title_too_short?: number
  irrelevant_title?: number
  irrelevant_description?: number
  has_misspelling?: number
}

export interface AuditPageMetrics {
  onpage_score?: number
  broken_links?: number
  broken_resources?: number
  duplicate_title?: number
  duplicate_description?: number
  duplicate_content?: number
  pages_crawled?: number
  checks?: AuditPageMetricsChecks
}

export interface AuditDomainInfoChecks {
  http2?: boolean
  robots_txt?: boolean
  sitemap?: boolean
  test_www_redirect?: boolean
  test_https_redirect?: boolean
  test_page_not_found?: boolean
}

export interface AuditData {
  page_metrics?: AuditPageMetrics
  domain_info?: {
    name?: string
    cms?: string
    ip?: string
    server?: string
    crawl_progress?: string
    ssl_info?: {
      valid_certificate?: boolean
      certificate_issuer?: string
      certificate_expiration_date?: string
    }
    checks?: AuditDomainInfoChecks
  }
}
