import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Card, Tag, Segmented } from 'antd'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import { getCoin, getCoinMarketChart } from '../api/coinApi'
import { useAppStore } from '../store/useAppStore'

type ChartPoint = { time: number; price: number }

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const nfInt = new Intl.NumberFormat('en-US')

export default function CoinDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const mode = useAppStore(s => s.theme)
  const [coin, setCoin] = useState<any>(null)
  const [chart, setChart] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<1 | 7 | 30 | 90 | 365>(7)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([getCoin(id), getCoinMarketChart(id, range)])
      .then(([coinData, chartData]) => {
        setCoin(coinData)
        setChart(chartData.prices.map((p: number[]) => ({ time: p[0], price: p[1] })))
      })
      .finally(() => setLoading(false))
  }, [id, range])

  const axisColor = mode === 'dark' ? '#94a3b8' : '#64748b'
  const lineColor = '#3b82f6'
  const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const cardCls = 'rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0e141f]'

  const price = coin?.market_data?.current_price?.usd
  const change24 = coin?.market_data?.price_change_percentage_24h
  const up = (change24 ?? 0) >= 0

  const latest = useMemo(() => chart[chart.length - 1]?.price, [chart])
  const first = useMemo(() => chart[0]?.price, [chart])
  const upSeries = (latest ?? 0) >= (first ?? 0)

  if (loading)
    return (
      <div className="grid place-items-center p-10">
        <Spin size="large" />
      </div>
    )

  if (!coin) return <div className="p-6 text-slate-600 dark:text-slate-300">Coin not found</div>

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <img src={coin.image?.small || coin.image} alt={coin.name} className="h-10 w-10 rounded-full" />
        <div className="flex items-baseline gap-3">
          <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
            {coin.name} ({coin.symbol?.toUpperCase()})
          </Typography.Title>
          <Tag className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            Rank #{coin.market_cap_rank ?? '—'}
          </Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className={`${cardCls} lg:col-span-2`}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {price !== undefined ? nfUSD.format(price) : '—'}
              </div>
              <div
                className={[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                ].join(' ')}
              >
                {change24 !== undefined ? `${change24.toFixed(2)}%` : '—'} 24h
              </div>
            </div>
            <Segmented
              size="small"
              value={range}
              onChange={v => setRange(v as typeof range)}
              options={[
                { label: '1D', value: 1 },
                { label: '7D', value: 7 },
                { label: '1M', value: 30 },
                { label: '3M', value: 90 },
                { label: '1Y', value: 365 },
              ]}
            />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <XAxis
                  dataKey="time"
                  tickFormatter={t =>
                    new Date(t).toLocaleDateString('en-US', range === 1 ? { hour: '2-digit' } : { month: 'short', day: 'numeric' })
                  }
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                  minTickGap={32}
                />
                <YAxis
                  dataKey="price"
                  tickFormatter={v => nfUSD.format(v).replace('.00', '')}
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                  width={72}
                />
                <Tooltip
                  formatter={(v: number) => nfUSD.format(v)}
                  labelFormatter={t => new Date(t).toLocaleString()}
                  contentStyle={{
                    background: mode === 'dark' ? 'rgba(15,22,35,0.98)' : 'rgba(255,255,255,0.98)',
                    border: `1px solid ${gridColor}`,
                    borderRadius: 8,
                  }}
                />
                <Line type="monotone" dataKey="price" stroke={lineColor} dot={false} strokeWidth={2} />
                {latest && chart.length > 0 && (
                  <ReferenceDot x={chart[chart.length - 1].time} y={latest} r={3} fill={lineColor} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={cardCls}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Market Cap</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {coin.market_data?.market_cap?.usd ? nfUSD.format(coin.market_data.market_cap.usd) : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">24h Volume</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {coin.market_data?.total_volume?.usd ? nfUSD.format(coin.market_data.total_volume.usd) : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Circulating Supply</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {coin.market_data?.circulating_supply ? nfInt.format(Math.round(coin.market_data.circulating_supply)) : '—'} {coin.symbol?.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">All-Time High</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {coin.market_data?.ath?.usd ? nfUSD.format(coin.market_data.ath.usd) : '—'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {coin.description?.en && (
        <Card className={`${cardCls} mt-6`}>
          <Typography.Title level={4} className="!mt-0 text-slate-900 dark:!text-slate-100">
            About {coin.name}
          </Typography.Title>
          <div
            className="prose max-w-none text-slate-700 dark:prose-invert dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: coin.description.en.slice(0, 1200) }}
          />
        </Card>
      )}
    </div>
  )
}
