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
    <div className="space-y-6">
      {/* Header du domaine */}
      <div className="border-border bg-card rounded-xl border-2 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-xl shadow-lg">
                <Target className="text-primary-foreground h-8 w-8" />
              </div>
              <div>
                <h2 className="dashboard-heading-1">{data.target}</h2>
                <p className="text-muted-foreground mt-1">Vue d&apos;ensemble complète du domaine</p>
              </div>
            </div>
          </div>
          <a
            href={`https://${data.target}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            Visiter le site
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Métriques principales - Organic vs Paid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Organic */}
        <div className="border-border bg-card rounded-xl border-2 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <Search className="text-primary h-5 w-5" />
            </div>
            <h3 className="dashboard-heading-3">Trafic Organique</h3>
            <span className="bg-primary/10 text-primary ml-auto rounded-full px-3 py-1 text-xs font-semibold">SEO</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <MetricBox
                label="Mots-clés"
                value={stats.totalOrganicKeywords.toLocaleString()}
                icon={<Search className="h-4 w-4 text-green-600" />}
                color="green"
              />
              <MetricBox
                label="Trafic estimé"
                value={stats.totalOrganicTraffic.toLocaleString()}
                suffix="/mois"
                icon={<Activity className="h-4 w-4 text-green-600" />}
                color="green"
              />
            </div>

            <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
              <div className="text-primary font-medium">Valeur du trafic</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="dashboard-heading-1 text-primary">
                  ${Math.round(stats.totalOrganicValue).toLocaleString()}
                </div>
                <div className="text-primary">/mois</div>
              </div>
              <p className="text-muted-foreground mt-2">Si vous deviez payer pour ce trafic en Google Ads</p>
            </div>

            {/* Tendances organiques */}
            <div className="grid grid-cols-4 gap-2">
              <TrendBox
                label="Nouveaux"
                value={stats.organicTrend.new}
                color="blue"
                icon={<Sparkles className="h-3 w-3" />}
              />
              <TrendBox
                label="En hausse"
                value={stats.organicTrend.up}
                color="green"
                icon={<ArrowUpRight className="h-3 w-3" />}
              />
              <TrendBox
                label="En baisse"
                value={stats.organicTrend.down}
                color="orange"
                icon={<ArrowDownRight className="h-3 w-3" />}
              />
              <TrendBox
                label="Perdus"
                value={stats.organicTrend.lost}
                color="red"
                icon={<TrendingDown className="h-3 w-3" />}
              />
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="border-border bg-card rounded-xl border-2 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-accent rounded-lg p-2">
              <DollarSign className="text-accent-foreground h-5 w-5" />
            </div>
            <h3 className="dashboard-heading-3">Trafic Payant</h3>
            <span className="bg-accent text-accent-foreground ml-auto rounded-full px-3 py-1 text-xs font-semibold">
              ADS
            </span>
          </div>

          {stats.totalPaidKeywords > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricBox
                  label="Mots-clés"
                  value={stats.totalPaidKeywords.toLocaleString()}
                  icon={<Search className="h-4 w-4 text-purple-600" />}
                  color="purple"
                />
                <MetricBox
                  label="Trafic estimé"
                  value={stats.totalPaidTraffic.toLocaleString()}
                  suffix="/mois"
                  icon={<Activity className="h-4 w-4 text-purple-600" />}
                  color="purple"
                />
              </div>

              <div className="border-accent/20 bg-accent/5 rounded-lg border p-4">
                <div className="text-accent-foreground font-medium">Budget estimé</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <div className="dashboard-heading-1 text-accent-foreground">
                    ${Math.round(stats.totalPaidCost).toLocaleString()}
                  </div>
                  <div className="text-accent-foreground">/mois</div>
                </div>
                <p className="text-muted-foreground mt-2">Dépenses publicitaires estimées sur Google Ads</p>
              </div>

              {/* Tendances payantes */}
              <div className="grid grid-cols-4 gap-2">
                <TrendBox
                  label="Nouveaux"
                  value={stats.paidTrend.new}
                  color="blue"
                  icon={<Sparkles className="h-3 w-3" />}
                />
                <TrendBox
                  label="En hausse"
                  value={stats.paidTrend.up}
                  color="green"
                  icon={<ArrowUpRight className="h-3 w-3" />}
                />
                <TrendBox
                  label="En baisse"
                  value={stats.paidTrend.down}
                  color="orange"
                  icon={<ArrowDownRight className="h-3 w-3" />}
                />
                <TrendBox
                  label="Perdus"
                  value={stats.paidTrend.lost}
                  color="red"
                  icon={<TrendingDown className="h-3 w-3" />}
                />
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
      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Award className="text-primary h-5 w-5" />
          <h3 className="dashboard-heading-3">Distribution des positions organiques</h3>
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
        <div className="border-primary/20 bg-primary/5 mt-6 grid grid-cols-4 gap-4 rounded-lg border-2 p-4">
          <div className="text-center">
            <div className="text-primary font-medium">Top 3</div>
            <div className="dashboard-heading-2 text-primary mt-1">
              {stats.topPositions.organic.top3.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1">
              {((stats.topPositions.organic.top3 / stats.totalOrganicKeywords) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary font-medium">Top 10</div>
            <div className="dashboard-heading-2 text-primary mt-1">
              {stats.topPositions.organic.top10.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1">
              {((stats.topPositions.organic.top10 / stats.totalOrganicKeywords) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary font-medium">Top 20</div>
            <div className="dashboard-heading-2 text-primary mt-1">
              {stats.topPositions.organic.top20.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1">
              {((stats.topPositions.organic.top20 / stats.totalOrganicKeywords) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary font-medium">Top 50</div>
            <div className="dashboard-heading-2 text-primary mt-1">
              {stats.topPositions.organic.top50.toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-1">
              {((stats.topPositions.organic.top50 / stats.totalOrganicKeywords) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Analyse comparative Organic vs Paid */}
      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <PieChart className="text-primary h-5 w-5" />
          <h3 className="dashboard-heading-3">Comparaison SEO vs SEA</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stratégie dominante */}
          <div className="col-span-1">
            <div className="border-primary/20 bg-primary/5 rounded-lg border-2 p-4">
              <div className="dashboard-body text-foreground font-semibold">Stratégie dominante</div>
              <div className="mt-3 flex items-center gap-3">
                {stats.totalOrganicKeywords > stats.totalPaidKeywords * 2 ? (
                  <>
                    <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                      <Search className="text-primary-foreground h-6 w-6" />
                    </div>
                    <div>
                      <div className="dashboard-heading-4">SEO Focus</div>
                      <div className="text-muted-foreground">Stratégie organique forte</div>
                    </div>
                  </>
                ) : stats.totalPaidKeywords > stats.totalOrganicKeywords * 2 ? (
                  <>
                    <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                      <DollarSign className="text-accent-foreground h-6 w-6" />
                    </div>
                    <div>
                      <div className="dashboard-heading-4">SEA Focus</div>
                      <div className="text-muted-foreground">Stratégie payante forte</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                      <Zap className="text-primary-foreground h-6 w-6" />
                    </div>
                    <div>
                      <div className="dashboard-heading-4">Hybride</div>
                      <div className="text-muted-foreground">Mix SEO + SEA équilibré</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Graphique de comparaison */}
          <div className="col-span-2">
            <div className="space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Mots-clés organiques</span>
                  <span className="text-primary font-bold">{stats.totalOrganicKeywords.toLocaleString()}</span>
                </div>
                <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${
                        (stats.totalOrganicKeywords / (stats.totalOrganicKeywords + stats.totalPaidKeywords || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Mots-clés payants</span>
                  <span className="text-accent-foreground font-bold">{stats.totalPaidKeywords.toLocaleString()}</span>
                </div>
                <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-accent h-full"
                    style={{
                      width: `${
                        (stats.totalPaidKeywords / (stats.totalOrganicKeywords + stats.totalPaidKeywords || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="border-primary/20 bg-primary/5 mt-4 rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="text-primary h-4 w-4" />
                  <span className="text-foreground font-semibold">Ratio SEO/SEA :</span>
                  <span className="text-primary font-bold">
                    {stats.totalPaidKeywords > 0
                      ? (stats.totalOrganicKeywords / stats.totalPaidKeywords).toFixed(1)
                      : '∞'}{' '}
                    : 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="border-border bg-card rounded-xl border-2 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h3 className="dashboard-heading-3">Insights & Opportunités</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Forces */}
          <div className="border-border bg-card rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="text-primary h-4 w-4" />
              <span className="text-foreground font-semibold">Forces</span>
            </div>
            <ul className="text-foreground space-y-2">
              {stats.topPositions.organic.top3 > stats.totalOrganicKeywords * 0.05 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Fort positionnement Top 3 ({stats.topPositions.organic.top3} mots-clés)</span>
                </li>
              )}
              {stats.organicTrend.up > stats.organicTrend.down && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Tendance positive : +{stats.organicTrend.up} positions améliorées</span>
                </li>
              )}
              {stats.totalOrganicValue > 10000 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>
                    Trafic organique très valorisé ($
                    {Math.round(stats.totalOrganicValue).toLocaleString()}/mois)
                  </span>
                </li>
              )}
              {stats.organicTrend.new > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Croissance active : {stats.organicTrend.new} nouveaux mots-clés</span>
                </li>
              )}
            </ul>
          </div>

          {/* Faiblesses / Opportunités */}
          <div className="border-border bg-card rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Target className="text-accent-foreground h-4 w-4" />
              <span className="text-foreground font-semibold">À améliorer</span>
            </div>
            <ul className="text-foreground space-y-2">
              {stats.organicTrend.down > stats.organicTrend.up && (
                <li className="flex items-start gap-2">
                  <span className="text-accent-foreground">!</span>
                  <span>Tendance négative : -{stats.organicTrend.down} positions perdues</span>
                </li>
              )}
              {stats.organicTrend.lost > 50 && (
                <li className="flex items-start gap-2">
                  <span className="text-accent-foreground">!</span>
                  <span>Érosion du trafic : {stats.organicTrend.lost} mots-clés perdus</span>
                </li>
              )}
              {stats.topPositions.organic.top10 / stats.totalOrganicKeywords < 0.2 && (
                <li className="flex items-start gap-2">
                  <span className="text-accent-foreground">!</span>
                  <span>
                    Peu de positions Top 10 (
                    {((stats.topPositions.organic.top10 / stats.totalOrganicKeywords) * 100).toFixed(1)}
                    %)
                  </span>
                </li>
              )}
              {stats.totalPaidKeywords === 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">💡</span>
                  <span>Opportunité SEA inexploitée (pas de publicités détectées)</span>
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
}: {
  label: string
  value: string
  suffix?: string
  icon: React.ReactNode
  color: 'green' | 'purple'
}) {
  const colorClasses = {
    green: 'bg-primary/10 text-primary border-primary/20',
    purple: 'bg-accent/10 text-accent-foreground border-accent/20',
  }

  return (
    <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>
      <div className="mb-1 flex items-center gap-1">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="dashboard-heading-4 font-bold">{value}</span>
        {suffix && <span>{suffix}</span>}
      </div>
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
    blue: 'bg-primary/10 text-primary border-primary/20',
    green: 'bg-primary/10 text-primary border-primary/20',
    orange: 'bg-accent/10 text-accent-foreground border-accent/20',
    red: 'bg-destructive/10 text-destructive border-destructive/20',
  }

  return (
    <div className={`rounded-lg border p-2 text-center ${colorClasses[color]}`}>
      <div className="mb-1 flex items-center justify-center">{icon}</div>
      <div className="dashboard-heading-4 font-bold">{value.toLocaleString()}</div>
      <div>{label}</div>
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
    green: 'bg-primary',
    blue: 'bg-primary',
    purple: 'bg-accent',
    orange: 'bg-accent',
    gray: 'bg-muted-foreground',
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-foreground w-24 font-medium">
        <span className="text-muted-foreground">{rank}</span>
        <div>{label}</div>
      </div>
      <div className="flex-1">
        <div className="text-muted-foreground mb-1 flex items-center justify-between">
          <span>{count.toLocaleString()} mots-clés</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
          <div className={`h-full transition-all duration-500 ${colors[color]}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  )
}
