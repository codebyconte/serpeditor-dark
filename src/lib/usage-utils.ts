/**
 * Utilitaires pour le tracking et la vérification de l'usage
 */

import { prisma } from '@/lib/prisma';
import {
  getPlanLimits,
  isUnlimited,
  isLimitReached,
  LIMIT_ERROR_MESSAGES,
  type UsageType,
  type PlanLimits,
} from '@/lib/plan-limits';

// Types pour les champs d'usage mensuel
type MonthlyUsageField =
  | 'keywordSearches'
  | 'backlinkAnalyses'
  | 'auditPages'
  | 'serpHistories'
  | 'domainAnalyses'
  | 'exports'
  | 'aiVisibilityRequests';

interface UsageCheckResult {
  allowed: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
  message?: string;
}

interface UserUsageStats {
  plan: string;
  limits: PlanLimits;
  usage: {
    projects: { current: number; limit: number; remaining: number };
    trackedKeywords: { current: number; limit: number; remaining: number };
    keywordSearches: { current: number; limit: number; remaining: number };
    backlinkAnalyses: { current: number; limit: number; remaining: number };
    auditPages: { current: number; limit: number; remaining: number };
    serpHistories: { current: number; limit: number; remaining: number };
    domainAnalyses: { current: number; limit: number; remaining: number };
    exports: { current: number; limit: number; remaining: number };
    aiVisibilityRequests: { current: number; limit: number; remaining: number };
  };
  periodStart: Date;
  periodEnd: Date;
}

/**
 * Obtenir les dates de début et fin du mois en cours
 */
function getCurrentPeriod(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

/**
 * Obtenir ou créer le tracking d'usage pour le mois en cours
 */
async function getOrCreateMonthlyUsage(userId: string) {
  const { start, end } = getCurrentPeriod();

  let usage = await prisma.usage_tracking.findFirst({
    where: {
      userId,
      periodStart: start,
    },
  });

  if (!usage) {
    usage = await prisma.usage_tracking.create({
      data: {
        userId,
        periodStart: start,
        periodEnd: end,
      },
    });
  }

  return usage;
}

/**
 * Obtenir le forfait de l'utilisateur
 */
async function getUserPlan(userId: string): Promise<string> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true, status: true },
  });

  // Si pas d'abonnement ou abonnement non actif, retourner Free
  if (!subscription || (subscription.status && subscription.status !== 'active')) {
    return 'Free';
  }

  return subscription.plan || 'Free';
}

/**
 * Vérifier si une action est autorisée selon les limites du forfait
 */
export async function checkUsageLimit(
  userId: string,
  usageType: UsageType,
  increment: number = 1
): Promise<UsageCheckResult> {
  const plan = await getUserPlan(userId);
  const limits = getPlanLimits(plan);
  const limit = limits[usageType];

  // Limites statiques (projets, mots-clés suivis)
  if (usageType === 'projects') {
    const projectCount = await prisma.project.count({
      where: { userId },
    });
    const allowed = isUnlimited(limit) || projectCount + increment <= limit;
    return {
      allowed,
      currentUsage: projectCount,
      limit,
      remaining: isUnlimited(limit) ? -1 : Math.max(0, limit - projectCount),
      message: allowed ? undefined : LIMIT_ERROR_MESSAGES[usageType],
    };
  }

  if (usageType === 'trackedKeywords') {
    const keywordCount = await prisma.keyword.count({
      where: { project: { userId } },
    });
    const allowed = isUnlimited(limit) || keywordCount + increment <= limit;
    return {
      allowed,
      currentUsage: keywordCount,
      limit,
      remaining: isUnlimited(limit) ? -1 : Math.max(0, limit - keywordCount),
      message: allowed ? undefined : LIMIT_ERROR_MESSAGES[usageType],
    };
  }

  // Limites mensuelles
  const monthlyUsage = await getOrCreateMonthlyUsage(userId);
  const currentUsage = monthlyUsage[usageType as MonthlyUsageField] || 0;
  const allowed = isUnlimited(limit) || currentUsage + increment <= limit;

  return {
    allowed,
    currentUsage,
    limit,
    remaining: isUnlimited(limit) ? -1 : Math.max(0, limit - currentUsage),
    message: allowed ? undefined : LIMIT_ERROR_MESSAGES[usageType],
  };
}

/**
 * Incrémenter l'usage pour une action
 */
export async function incrementUsage(
  userId: string,
  usageType: MonthlyUsageField,
  increment: number = 1
): Promise<void> {
  const { start, end } = getCurrentPeriod();

  await prisma.usage_tracking.upsert({
    where: {
      userId_periodStart: {
        userId,
        periodStart: start,
      },
    },
    update: {
      [usageType]: {
        increment,
      },
    },
    create: {
      userId,
      periodStart: start,
      periodEnd: end,
      [usageType]: increment,
    },
  });
}

/**
 * Vérifier et incrémenter l'usage en une seule opération
 * Retourne une erreur si la limite est atteinte
 */
export async function checkAndIncrementUsage(
  userId: string,
  usageType: UsageType,
  increment: number = 1
): Promise<UsageCheckResult> {
  const check = await checkUsageLimit(userId, usageType, increment);

  if (!check.allowed) {
    return check;
  }

  // Incrémenter seulement pour les limites mensuelles
  if (
    usageType !== 'projects' &&
    usageType !== 'trackedKeywords'
  ) {
    await incrementUsage(userId, usageType as MonthlyUsageField, increment);
  }

  return {
    ...check,
    currentUsage: check.currentUsage + increment,
    remaining: isUnlimited(check.limit) ? -1 : Math.max(0, check.remaining - increment),
  };
}

/**
 * Obtenir toutes les statistiques d'usage d'un utilisateur
 */
export async function getUserUsageStats(userId: string): Promise<UserUsageStats> {
  const plan = await getUserPlan(userId);
  const limits = getPlanLimits(plan);
  const { start, end } = getCurrentPeriod();

  // Récupérer l'usage mensuel
  const monthlyUsage = await getOrCreateMonthlyUsage(userId);

  // Compter les projets
  const projectCount = await prisma.project.count({
    where: { userId },
  });

  // Compter les mots-clés suivis
  const keywordCount = await prisma.keyword.count({
    where: { project: { userId } },
  });

  const calculateRemaining = (current: number, limit: number) =>
    isUnlimited(limit) ? -1 : Math.max(0, limit - current);

  return {
    plan,
    limits,
    usage: {
      projects: {
        current: projectCount,
        limit: limits.projects,
        remaining: calculateRemaining(projectCount, limits.projects),
      },
      trackedKeywords: {
        current: keywordCount,
        limit: limits.trackedKeywords,
        remaining: calculateRemaining(keywordCount, limits.trackedKeywords),
      },
      keywordSearches: {
        current: monthlyUsage.keywordSearches,
        limit: limits.keywordSearches,
        remaining: calculateRemaining(monthlyUsage.keywordSearches, limits.keywordSearches),
      },
      backlinkAnalyses: {
        current: monthlyUsage.backlinkAnalyses,
        limit: limits.backlinkAnalyses,
        remaining: calculateRemaining(monthlyUsage.backlinkAnalyses, limits.backlinkAnalyses),
      },
      auditPages: {
        current: monthlyUsage.auditPages,
        limit: limits.auditPages,
        remaining: calculateRemaining(monthlyUsage.auditPages, limits.auditPages),
      },
      serpHistories: {
        current: monthlyUsage.serpHistories,
        limit: limits.serpHistories,
        remaining: calculateRemaining(monthlyUsage.serpHistories, limits.serpHistories),
      },
      domainAnalyses: {
        current: monthlyUsage.domainAnalyses,
        limit: limits.domainAnalyses,
        remaining: calculateRemaining(monthlyUsage.domainAnalyses, limits.domainAnalyses),
      },
      exports: {
        current: monthlyUsage.exports,
        limit: limits.exports,
        remaining: calculateRemaining(monthlyUsage.exports, limits.exports),
      },
      aiVisibilityRequests: {
        current: monthlyUsage.aiVisibilityRequests,
        limit: limits.aiVisibilityRequests,
        remaining: calculateRemaining(monthlyUsage.aiVisibilityRequests, limits.aiVisibilityRequests),
      },
    },
    periodStart: start,
    periodEnd: end,
  };
}

/**
 * Réinitialiser l'usage mensuel (à utiliser pour les tests ou admin)
 */
export async function resetMonthlyUsage(userId: string): Promise<void> {
  const { start } = getCurrentPeriod();

  await prisma.usage_tracking.deleteMany({
    where: {
      userId,
      periodStart: start,
    },
  });
}
