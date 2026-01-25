'use client'

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  DollarSign,
  ExternalLink,
  PieChart,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useMemo } from 'react'
import type { DomainOverviewResponse, DomainOverviewStats } from './action'
import { calculateDomainStats } from './utils'

interface DomainOverviewProps {
  data: DomainOverviewResponse
}

export default function DomainOverview({ data }: DomainOverviewProps) {
  // Calculer les statistiques
  const stats: DomainOverviewStats = useMemo(() => {
    return calculateDomainStats(data)
  }, [data])

  const organicMetrics = data.items[0].metrics.organic

  return (
    <div className="space-y-8">
      {/* Header du domaine avec métriques clés */}
      <div className="border-primary/20 bg-linear-to-br from-primary/5 via-card to-card rounded-2xl border-2 p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ring-4 ring-primary/10">
                <Target className="text-primary-foreground h-9 w-9" />
              </div>
              <div className="flex-1">
                <h2 className="dashboard-heading-1 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {data.target}
                </h2>
                <p className="text-muted-foreground mt-2 text-base">Analyse SEO complète du domaine</p>
              </div>
            </div>
          </div>
          <a
            href={`https://${data.target}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:scale-105 shadow-lg"
          >
            Visiter le site
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Métriques clés en résumé */}
        <div className="grid grid-cols-2 gap-4 border-t border-primary/10 pt-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-muted-foreground text-sm font-medium">Mots-clés organiques</div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {stats.totalOrganicKeywords.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {stats.totalPaidKeywords > 0 && (
                <span className="text-accent-foreground">
                  +{stats.totalPaidKeywords.toLocaleString()} payants
                </span>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-sm font-medium">Top 10</div>
            <div className="mt-1 text-2xl font-bold text-primary">
              {stats.topPositions.organic.top10.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {((stats.topPositions.organic.top10 / stats.totalOrganicKeywords) * 100).toFixed(1)}% du total
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-sm font-medium">Valeur mensuelle</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600">
              ${Math.round(stats.totalOrganicValue).toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">Équivalent Google Ads</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-sm font-medium">Trafic estimé</div>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              {stats.totalOrganicTraffic.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">Visites/mois</div>
          </div>
        </div>
      </div>

      {/* Métriques principales - Organic vs Paid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Organic */}
        <div className="border-primary/30 bg-linear-to-br from-primary/5 via-card to-card rounded-2xl border-2 p-8 shadow-xl transition-all hover:border-primary/40 hover:shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-primary/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 rounded-xl p-3 ring-2 ring-primary/10">
                <Search className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="dashboard-heading-2">Trafic Organique</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">Performance SEO naturelle</p>
              </div>
            </div>
            <span className="bg-primary/20 text-primary rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
              SEO
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <MetricBox
                label="Mots-clés positionnés"
                value={stats.totalOrganicKeywords.toLocaleString()}
                icon={<Search className="h-5 w-5 text-emerald-600" />}
                color="green"
                subtitle={`Top 3: ${stats.topPositions.organic.top3.toLocaleString()}`}
              />
              <MetricBox
                label="Trafic estimé"
                value={stats.totalOrganicTraffic.toLocaleString()}
                suffix="/mois"
                icon={<Activity className="h-5 w-5 text-blue-600" />}
                color="green"
                subtitle="Visites organiques"
              />
            </div>

            <div className="border-primary/40 bg-linear-to-br from-primary/15 to-primary/5 rounded-xl border-2 p-6 shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="text-primary h-5 w-5" />
                <div className="text-primary font-bold">Valeur du trafic organique</div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-4xl font-bold text-primary">
                  ${Math.round(stats.totalOrganicValue).toLocaleString()}
                </div>
                <div className="text-primary text-lg font-semibold">/mois</div>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Équivalent du coût si ce trafic était généré via Google Ads
              </p>
            </div>

            {/* Tendances organiques */}
            <div>
              <div className="mb-3 text-sm font-semibold text-muted-foreground">Évolution récente</div>
              <div className="grid grid-cols-4 gap-3">
                <TrendBox
                  label="Nouveaux"
                  value={stats.organicTrend.new}
                  color="blue"
                  icon={<Sparkles className="h-4 w-4" />}
                />
                <TrendBox
                  label="En hausse"
                  value={stats.organicTrend.up}
                  color="green"
                  icon={<ArrowUpRight className="h-4 w-4" />}
                />
                <TrendBox
                  label="En baisse"
                  value={stats.organicTrend.down}
                  color="orange"
                  icon={<ArrowDownRight className="h-4 w-4" />}
                />
                <TrendBox
                  label="Perdus"
                  value={stats.organicTrend.lost}
                  color="red"
                  icon={<TrendingDown className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="border-accent/30 bg-linear-to-br from-accent/5 via-card to-card rounded-2xl border-2 p-8 shadow-xl transition-all hover:border-accent/40 hover:shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-accent/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/20 rounded-xl p-3 ring-2 ring-accent/10">
                <DollarSign className="text-accent-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="dashboard-heading-2">Trafic Payant</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">Performance Google Ads</p>
              </div>
            </div>
            <span className="bg-accent/20 text-accent-foreground rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
              ADS
            </span>
          </div>

          {stats.totalPaidKeywords > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricBox
                  label="Mots-clés publicitaires"
                  value={stats.totalPaidKeywords.toLocaleString()}
                  icon={<Search className="h-5 w-5 text-purple-600" />}
                  color="purple"
                  subtitle="Campagnes actives"
                />
                <MetricBox
                  label="Trafic payant"
                  value={stats.totalPaidTraffic.toLocaleString()}
                  suffix="/mois"
                  icon={<Activity className="h-5 w-5 text-purple-600" />}
                  color="purple"
                  subtitle="Visites payantes"
                />
              </div>

              <div className="border-accent/40 bg-linear-to-br from-accent/15 to-accent/5 rounded-xl border-2 p-6 shadow-lg">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="text-accent-foreground h-5 w-5" />
                  <div className="text-accent-foreground font-bold">Budget publicitaire estimé</div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-accent-foreground">
                    ${Math.round(stats.totalPaidCost).toLocaleString()}
                  </div>
                  <div className="text-accent-foreground text-lg font-semibold">/mois</div>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Dépenses publicitaires estimées sur Google Ads
                </p>
              </div>

              {/* Tendances payantes */}
              <div>
                <div className="mb-3 text-sm font-semibold text-muted-foreground">Évolution récente</div>
                <div className="grid grid-cols-4 gap-3">
                  <TrendBox
                    label="Nouveaux"
                    value={stats.paidTrend.new}
                    color="blue"
                    icon={<Sparkles className="h-4 w-4" />}
                  />
                  <TrendBox
                    label="En hausse"
                    value={stats.paidTrend.up}
                    color="green"
                    icon={<ArrowUpRight className="h-4 w-4" />}
                  />
                  <TrendBox
                    label="En baisse"
                    value={stats.paidTrend.down}
                    color="orange"
                    icon={<ArrowDownRight className="h-4 w-4" />}
                  />
                  <TrendBox
                    label="Perdus"
                    value={stats.paidTrend.lost}
                    color="red"
                    icon={<TrendingDown className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="bg-muted rounded-full p-4">
                <DollarSign className="text-muted-foreground h-8 w-8" />
              </div>
              <p className="dashboard-heading-4 mt-4">Aucune publicité détectée</p>
              <p className="text-muted-foreground mt-2">Ce domaine ne semble pas investir dans Google Ads</p>
            </div>
          )}
        </div>
      </div>

      {/* Distribution des positions - ORGANIC */}
      <div className="border-primary/20 bg-linear-to-br from-primary/5 via-card to-card rounded-2xl border-2 p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-xl p-3 ring-2 ring-primary/10">
              <Award className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="dashboard-heading-2">Distribution des positions organiques</h3>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Répartition des {stats.totalOrganicKeywords.toLocaleString()} mots-clés par tranche de position
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <PositionBar
            label="Top 1"
            count={organicMetrics.pos_1}
            total={stats.totalOrganicKeywords}
            color="green"
            rank="#1"
          />
          <PositionBar
            label="Positions 2-3"
            count={organicMetrics.pos_2_3}
            total={stats.totalOrganicKeywords}
            color="green"
            rank="#2-3"
          />
          <PositionBar
            label="Positions 4-10"
            count={organicMetrics.pos_4_10}
            total={stats.totalOrganicKeywords}
            color="blue"
            rank="#4-10"
          />
          <PositionBar
            label="Positions 11-20"
            count={organicMetrics.pos_11_20}
            total={stats.totalOrganicKeywords}
            color="purple"
            rank="#11-20"
          />
          <PositionBar
            label="Positions 21-50"
            count={organicMetrics.pos_21_30 + organicMetrics.pos_31_40 + organicMetrics.pos_41_50}
            total={stats.totalOrganicKeywords}
            color="orange"
            rank="#21-50"
          />
          <PositionBar
            label="Positions 51-100"
            count={
              organicMetrics.pos_51_60 +
              organicMetrics.pos_61_70 +
              organicMetrics.pos_71_80 +
              organicMetrics.pos_81_90 +
              organicMetrics.pos_91_100
            }
            total={stats.totalOrganicKeywords}
            color="gray"
            rank="#51-100"
          />
        </div>

        {/* Résumé des positions clés */}
        <div className="border-primary/40 bg-linear-to-br from-primary/15 to-primary/5 mt-8 grid grid-cols-4 gap-6 rounded-xl border-2 p-6 shadow-lg">
          <div className="text-center">
            <div className="text-primary text-sm font-semibold uppercase tracking-wide">Top 3</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {stats.topPositions.organic.top3.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {((stats.topPositions.organic.top3 / stats.totalOrganicKeywords) * 100).toFixed(1)}% du total
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary text-sm font-semibold uppercase tracking-wide">Top 10</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {stats.topPositions.organic.top10.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {((stats.topPositions.organic.top10 / stats.totalOrganicKeywords) * 100).toFixed(1)}% du total
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary text-sm font-semibold uppercase tracking-wide">Top 20</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {stats.topPositions.organic.top20.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {((stats.topPositions.organic.top20 / stats.totalOrganicKeywords) * 100).toFixed(1)}% du total
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary text-sm font-semibold uppercase tracking-wide">Top 50</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {stats.topPositions.organic.top50.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {((stats.topPositions.organic.top50 / stats.totalOrganicKeywords) * 100).toFixed(1)}% du total
            </div>
          </div>
        </div>
      </div>

      {/* Analyse comparative Organic vs Paid */}
      <div className="border-primary/20 bg-linear-to-br from-primary/5 via-card to-card rounded-2xl border-2 p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-xl p-3 ring-2 ring-primary/10">
              <PieChart className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="dashboard-heading-2">Comparaison SEO vs SEA</h3>
              <p className="text-muted-foreground mt-0.5 text-sm">Analyse de la stratégie de visibilité</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stratégie dominante */}
          <div className="col-span-1">
            <div className="border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl border-2 p-6 shadow-lg">
              <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Stratégie dominante
              </div>
              <div className="flex items-center gap-4">
                {stats.totalOrganicKeywords > stats.totalPaidKeywords * 2 ? (
                  <>
                    <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ring-2 ring-primary/20">
                      <Search className="text-primary-foreground h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">SEO Focus</div>
                      <div className="text-muted-foreground mt-1 text-sm">Stratégie organique dominante</div>
                    </div>
                  </>
                ) : stats.totalPaidKeywords > stats.totalOrganicKeywords * 2 ? (
                  <>
                    <div className="bg-accent flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ring-2 ring-accent/20">
                      <DollarSign className="text-accent-foreground h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">SEA Focus</div>
                      <div className="text-muted-foreground mt-1 text-sm">Stratégie payante dominante</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ring-2 ring-primary/20">
                      <Zap className="text-primary-foreground h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">Hybride</div>
                      <div className="text-muted-foreground mt-1 text-sm">Mix SEO + SEA équilibré</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Graphique de comparaison */}
          <div className="col-span-2">
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <span className="font-semibold text-foreground">Mots-clés organiques</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {stats.totalOrganicKeywords.toLocaleString()}
                  </span>
                </div>
                <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-700"
                    style={{
                      width: `${
                        (stats.totalOrganicKeywords / (stats.totalOrganicKeywords + stats.totalPaidKeywords || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent"></div>
                    <span className="font-semibold text-foreground">Mots-clés payants</span>
                  </div>
                  <span className="text-2xl font-bold text-accent-foreground">
                    {stats.totalPaidKeywords.toLocaleString()}
                  </span>
                </div>
                <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-accent h-full transition-all duration-700"
                    style={{
                      width: `${
                        (stats.totalPaidKeywords / (stats.totalOrganicKeywords + stats.totalPaidKeywords || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl border-2 p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="text-primary h-5 w-5" />
                    <span className="font-semibold text-foreground">Ratio SEO/SEA</span>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    {stats.totalPaidKeywords > 0
                      ? (stats.totalOrganicKeywords / stats.totalPaidKeywords).toFixed(1)
                      : '∞'}{' '}
                    : 1
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {stats.totalPaidKeywords > 0
                    ? stats.totalOrganicKeywords > stats.totalPaidKeywords
                      ? 'Stratégie principalement organique'
                      : 'Stratégie principalement payante'
                    : 'Stratégie 100% organique'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="border-primary/20 bg-linear-to-br from-primary/5 via-card to-card rounded-2xl border-2 p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-xl p-3 ring-2 ring-primary/10">
              <Sparkles className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="dashboard-heading-2">Insights & Opportunités</h3>
              <p className="text-muted-foreground mt-0.5 text-sm">Analyse stratégique pour consultants SEO</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Forces */}
          <div className="border-emerald-500/20 bg-linear-to-br from-emerald-500/5 to-emerald-500/0 rounded-xl border-2 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-emerald-500/20 rounded-lg p-2">
                <TrendingUp className="text-emerald-600 h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground">Forces</span>
            </div>
            <ul className="space-y-3">
              {stats.topPositions.organic.top3 > stats.totalOrganicKeywords * 0.05 && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-emerald-600">✓</span>
                  <div>
                    <div className="font-semibold text-foreground">Fort positionnement Top 3</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      {stats.topPositions.organic.top3.toLocaleString()} mots-clés en première page
                    </div>
                  </div>
                </li>
              )}
              {stats.organicTrend.up > stats.organicTrend.down && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-emerald-600">✓</span>
                  <div>
                    <div className="font-semibold text-foreground">Tendance positive</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      +{stats.organicTrend.up.toLocaleString()} positions améliorées récemment
                    </div>
                  </div>
                </li>
              )}
              {stats.totalOrganicValue > 10000 && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-emerald-600">✓</span>
                  <div>
                    <div className="font-semibold text-foreground">Trafic hautement valorisé</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      ${Math.round(stats.totalOrganicValue).toLocaleString()}/mois d&apos;équivalent publicitaire
                    </div>
                  </div>
                </li>
              )}
              {stats.organicTrend.new > 0 && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-emerald-600">✓</span>
                  <div>
                    <div className="font-semibold text-foreground">Croissance active</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      {stats.organicTrend.new.toLocaleString()} nouveaux mots-clés détectés
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Faiblesses / Opportunités */}
          <div className="border-orange-500/20 bg-linear-to-br from-orange-500/5 to-orange-500/0 rounded-xl border-2 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-orange-500/20 rounded-lg p-2">
                <Target className="text-orange-600 h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground">À améliorer</span>
            </div>
            <ul className="space-y-3">
              {stats.organicTrend.down > stats.organicTrend.up && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-orange-600">!</span>
                  <div>
                    <div className="font-semibold text-foreground">Tendance négative</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      {stats.organicTrend.down.toLocaleString()} positions en baisse récemment
                    </div>
                  </div>
                </li>
              )}
              {stats.organicTrend.lost > 50 && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-orange-600">!</span>
                  <div>
                    <div className="font-semibold text-foreground">Érosion du trafic</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      {stats.organicTrend.lost.toLocaleString()} mots-clés perdus - action requise
                    </div>
                  </div>
                </li>
              )}
              {stats.topPositions.organic.top10 / stats.totalOrganicKeywords < 0.2 && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-orange-600">!</span>
                  <div>
                    <div className="font-semibold text-foreground">Faible présence Top 10</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      Seulement{' '}
                      {((stats.topPositions.organic.top10 / stats.totalOrganicKeywords) * 100).toFixed(1)}% en première
                      page
                    </div>
                  </div>
                </li>
              )}
              {stats.totalPaidKeywords === 0 && (
                <li className="flex items-start gap-3 rounded-lg bg-card/50 p-3">
                  <span className="mt-0.5 text-xl text-blue-600">💡</span>
                  <div>
                    <div className="font-semibold text-foreground">Opportunité SEA</div>
                    <div className="text-muted-foreground mt-0.5 text-sm">
                      Aucune publicité détectée - potentiel inexploité
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composants auxiliaires
function MetricBox({
  label,
  value,
  suffix,
  icon,
  color,
  subtitle,
}: {
  label: string
  value: string
  suffix?: string
  icon: React.ReactNode
  color: 'green' | 'purple'
  subtitle?: string
}) {
  const colorClasses = {
    green: 'bg-primary/10 text-primary border-primary/30',
    purple: 'bg-accent/10 text-accent-foreground border-accent/30',
  }

  return (
    <div className={`rounded-xl border-2 p-4 shadow-md transition-all hover:shadow-lg ${colorClasses[color]}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {suffix && <span className="text-sm font-medium">{suffix}</span>}
      </div>
      {subtitle && <div className="text-muted-foreground mt-1 text-xs">{subtitle}</div>}
    </div>
  )
}

function TrendBox({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: number
  color: 'blue' | 'green' | 'orange' | 'red'
  icon: React.ReactNode
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  return (
    <div className={`rounded-xl border-2 p-3 text-center shadow-sm transition-all hover:shadow-md ${colorClasses[color]}`}>
      <div className="mb-2 flex items-center justify-center">{icon}</div>
      <div className="text-xl font-bold">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs font-medium">{label}</div>
    </div>
  )
}

function PositionBar({
  label,
  count,
  total,
  color,
  rank,
}: {
  label: string
  count: number
  total: number
  color: 'green' | 'blue' | 'purple' | 'orange' | 'gray'
  rank: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  const colors = {
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    gray: 'bg-gray-500',
  }

  const bgColors = {
    green: 'bg-emerald-500/10',
    blue: 'bg-blue-500/10',
    purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10',
    gray: 'bg-gray-500/10',
  }

  return (
    <div className="group rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColors[color]}`}>
            <span className={`text-sm font-bold ${colors[color].replace('bg-', 'text-')}`}>{rank}</span>
          </div>
          <div>
            <div className="font-semibold text-foreground">{label}</div>
            <div className="text-muted-foreground text-sm">{count.toLocaleString()} mots-clés</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{percentage.toFixed(1)}%</div>
          <div className="text-muted-foreground text-xs">du total</div>
        </div>
      </div>
      <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
        <div
          className={`h-full transition-all duration-700 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
