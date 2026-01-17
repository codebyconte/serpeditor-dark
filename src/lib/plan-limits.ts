/**
 * Configuration des limites par forfait
 * Basé sur la page de tarifs : /pricing
 */

export type PlanType = 'Free' | 'Pro' | 'Agency';

export type UsageType =
  | 'projects'
  | 'trackedKeywords'
  | 'keywordSearches'
  | 'backlinkAnalyses'
  | 'auditPages'
  | 'serpHistories'
  | 'domainAnalyses'
  | 'exports'
  | 'aiVisibilityRequests';

export interface PlanLimits {
  // Limites statiques (non mensuelles)
  projects: number;
  trackedKeywords: number;

  // Limites mensuelles
  keywordSearches: number;
  backlinkAnalyses: number;
  auditPages: number;
  serpHistories: number;
  domainAnalyses: number;
  exports: number;
  aiVisibilityRequests: number;
}

/**
 * Limites par forfait selon la page de tarifs
 */
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  Free: {
    projects: 1,
    trackedKeywords: 10,
    keywordSearches: 100,
    backlinkAnalyses: 10,
    auditPages: 100, // 1 audit de 100 pages
    serpHistories: 10,
    domainAnalyses: 10,
    exports: 5,
    aiVisibilityRequests: 0, // Non disponible en Free
  },
  Pro: {
    projects: 5,
    trackedKeywords: 1000,
    keywordSearches: 10000,
    backlinkAnalyses: 5000,
    auditPages: 10000,
    serpHistories: 1000,
    domainAnalyses: 100,
    exports: 1000,
    aiVisibilityRequests: 100,
  },
  Agency: {
    projects: 50,
    trackedKeywords: 10000,
    keywordSearches: 100000,
    backlinkAnalyses: 40000,
    auditPages: 100000,
    serpHistories: 10000,
    domainAnalyses: 1000,
    exports: -1, // -1 = Illimité
    aiVisibilityRequests: 1000,
  },
};

/**
 * Messages d'erreur pour les limites atteintes
 */
export const LIMIT_ERROR_MESSAGES: Record<UsageType, string> = {
  projects: "Vous avez atteint la limite de projets de votre forfait. Passez à un forfait supérieur pour créer plus de projets.",
  trackedKeywords: "Vous avez atteint la limite de mots-clés suivis de votre forfait. Passez à un forfait supérieur pour suivre plus de mots-clés.",
  keywordSearches: "Vous avez atteint votre limite mensuelle de recherches de mots-clés. Passez à un forfait supérieur ou attendez le mois prochain.",
  backlinkAnalyses: "Vous avez atteint votre limite mensuelle d'analyses de backlinks. Passez à un forfait supérieur ou attendez le mois prochain.",
  auditPages: "Vous avez atteint votre limite mensuelle de pages auditées. Passez à un forfait supérieur ou attendez le mois prochain.",
  serpHistories: "Vous avez atteint votre limite mensuelle d'historiques SERP. Passez à un forfait supérieur ou attendez le mois prochain.",
  domainAnalyses: "Vous avez atteint votre limite mensuelle d'analyses de domaines. Passez à un forfait supérieur ou attendez le mois prochain.",
  exports: "Vous avez atteint votre limite mensuelle d'exports. Passez à un forfait supérieur ou attendez le mois prochain.",
  aiVisibilityRequests: "Vous avez atteint votre limite mensuelle de requêtes Visibilité IA. Passez à un forfait supérieur ou attendez le mois prochain.",
};

/**
 * Labels français pour les types d'usage
 */
export const USAGE_LABELS: Record<UsageType, string> = {
  projects: 'Projets',
  trackedKeywords: 'Mots-clés suivis',
  keywordSearches: 'Recherches mots-clés',
  backlinkAnalyses: 'Analyses backlinks',
  auditPages: 'Pages auditées',
  serpHistories: 'Historiques SERP',
  domainAnalyses: 'Analyses domaines',
  exports: 'Exports',
  aiVisibilityRequests: 'Requêtes Visibilité IA',
};

/**
 * Obtenir les limites d'un plan
 */
export function getPlanLimits(plan: string): PlanLimits {
  const validPlan = (plan as PlanType) in PLAN_LIMITS ? (plan as PlanType) : 'Free';
  return PLAN_LIMITS[validPlan];
}

/**
 * Vérifier si une limite est illimitée
 */
export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

/**
 * Formater une limite pour l'affichage
 */
export function formatLimit(limit: number): string {
  if (isUnlimited(limit)) {
    return 'Illimité';
  }
  return limit.toLocaleString('fr-FR');
}

/**
 * Calculer le pourcentage d'utilisation
 */
export function getUsagePercentage(used: number, limit: number): number {
  if (isUnlimited(limit)) {
    return 0;
  }
  return Math.min(Math.round((used / limit) * 100), 100);
}

/**
 * Vérifier si l'utilisateur est proche de la limite (> 80%)
 */
export function isNearLimit(used: number, limit: number): boolean {
  if (isUnlimited(limit)) {
    return false;
  }
  return (used / limit) >= 0.8;
}

/**
 * Vérifier si la limite est atteinte
 */
export function isLimitReached(used: number, limit: number): boolean {
  if (isUnlimited(limit)) {
    return false;
  }
  return used >= limit;
}
