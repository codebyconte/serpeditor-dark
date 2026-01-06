import type { DomainOverviewResponse, DomainOverviewStats } from './action'

// Fonction pour calculer les statistiques globales
export function calculateDomainStats(data: DomainOverviewResponse): DomainOverviewStats {
  const item = data.items[0]
  const { organic, paid } = item.metrics

  return {
    totalOrganicKeywords: organic.count,
    totalOrganicTraffic: organic.etv,
    totalOrganicValue: organic.estimated_paid_traffic_cost,
    totalPaidKeywords: paid?.count || 0,
    totalPaidTraffic: paid?.etv || 0,
    totalPaidCost: paid?.estimated_paid_traffic_cost || 0,
    organicTrend: {
      new: organic.is_new,
      up: organic.is_up,
      down: organic.is_down,
      lost: organic.is_lost,
    },
    paidTrend: {
      new: paid?.is_new || 0,
      up: paid?.is_up || 0,
      down: paid?.is_down || 0,
      lost: paid?.is_lost || 0,
    },
    topPositions: {
      organic: {
        top3: organic.pos_1 + organic.pos_2_3,
        top10: organic.pos_1 + organic.pos_2_3 + organic.pos_4_10,
        top20: organic.pos_1 + organic.pos_2_3 + organic.pos_4_10 + organic.pos_11_20,
        top50:
          organic.pos_1 +
          organic.pos_2_3 +
          organic.pos_4_10 +
          organic.pos_11_20 +
          organic.pos_21_30 +
          organic.pos_31_40 +
          organic.pos_41_50,
        top100:
          organic.pos_1 +
          organic.pos_2_3 +
          organic.pos_4_10 +
          organic.pos_11_20 +
          organic.pos_21_30 +
          organic.pos_31_40 +
          organic.pos_41_50 +
          organic.pos_51_60 +
          organic.pos_61_70 +
          organic.pos_71_80 +
          organic.pos_81_90 +
          organic.pos_91_100,
      },
      paid: {
        top3: (paid?.pos_1 || 0) + (paid?.pos_2_3 || 0),
        top10: (paid?.pos_1 || 0) + (paid?.pos_2_3 || 0) + (paid?.pos_4_10 || 0),
        top20: (paid?.pos_1 || 0) + (paid?.pos_2_3 || 0) + (paid?.pos_4_10 || 0) + (paid?.pos_11_20 || 0),
        top50:
          (paid?.pos_1 || 0) +
          (paid?.pos_2_3 || 0) +
          (paid?.pos_4_10 || 0) +
          (paid?.pos_11_20 || 0) +
          (paid?.pos_21_30 || 0) +
          (paid?.pos_31_40 || 0) +
          (paid?.pos_41_50 || 0),
        top100:
          (paid?.pos_1 || 0) +
          (paid?.pos_2_3 || 0) +
          (paid?.pos_4_10 || 0) +
          (paid?.pos_11_20 || 0) +
          (paid?.pos_21_30 || 0) +
          (paid?.pos_31_40 || 0) +
          (paid?.pos_41_50 || 0) +
          (paid?.pos_51_60 || 0) +
          (paid?.pos_61_70 || 0) +
          (paid?.pos_71_80 || 0) +
          (paid?.pos_81_90 || 0) +
          (paid?.pos_91_100 || 0),
      },
    },
  }
}

