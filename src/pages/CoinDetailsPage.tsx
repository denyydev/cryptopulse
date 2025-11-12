import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Card, Tag, Segmented, Tooltip } from 'antd'
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import { getCoin, getCoinMarketChart } from '../api/coinApi'
import { useAppStore } from '../store/useAppStore'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Info, Sparkles } from 'lucide-react'
import ImageWithFallback from '../components/ImageWithFallback'

type ChartPoint = { time: number; price: number }

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const nfUSD0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
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
  const cardCls = 'rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0e141f]'

  const price = coin?.market_data?.current_price?.usd
  const change24 = coin?.market_data?.price_change_percentage_24h
  const up = (change24 ?? 0) >= 0

  const latest = useMemo(() => chart[chart.length - 1]?.price, [chart])
  const first = useMemo(() => chart[0]?.price, [chart])

  if (loading)
    return (
      <div className="grid place-items-center p-10">
        <Spin size="large" />
      </div>
    )

  if (!coin) return <div className="p-6 text-slate-600 dark:text-slate-300">Монета не найдена</div>

  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2 }}
          className={`${cardCls} p-5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={coin.image?.small || coin.image}
                alt={coin.name}
                className="h-10 w-10 rounded-full ring-1 ring-black/10 dark:ring-white/10 object-cover"
              />
              <div className="flex flex-col">
                <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
                  {coin.name} <span className="text-base text-slate-500 dark:text-slate-400">({coin.symbol?.toUpperCase()})</span>
                </Typography.Title>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Официально ранг #{coin.market_cap_rank ?? '—'} — не скромничает.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                <Sparkles className="mr-1 inline-block h-4 w-4" />
                {price !== undefined ? nfUSD.format(price) : '—'}
              </Tag>
              <Tag
                className={[
                  'm-0 rounded-full px-3 py-1.5 text-xs font-medium',
                  up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                ].join(' ')}
              >
                {up ? <ArrowUpRight className="mr-1 inline-block h-4 w-4" /> : <ArrowDownRight className="mr-1 inline-block h-4 w-4" />}
                {change24 !== undefined ? `${change24.toFixed(2)}%` : '—'} • 24ч
              </Tag>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className={`${cardCls} lg:col-span-2 p-4`}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {first !== undefined && latest !== undefined && (
                  <span>
                    За период: {nfUSD.format(first).replace('.00', '')} → {nfUSD.format(latest).replace('.00', '')}{' '}
                    <span className={latest >= first ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      ({((latest - first) / first * 100).toFixed(2)}%)
                    </span>
                  </span>
                )}
              </div>
              <Segmented
                size="small"
                value={range}
                onChange={v => setRange(v as typeof range)}
                options={[
                  { label: '1Д', value: 1 },
                  { label: '7Д', value: 7 },
                  { label: '1М', value: 30 },
                  { label: '3М', value: 90 },
                  { label: '1Г', value: 365 },
                ]}
              />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                  <defs>
                    <linearGradient id="priceLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={lineColor} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={lineColor} stopOpacity={0.25} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tickFormatter={t =>
                      new Date(t as number).toLocaleDateString('ru-RU',
                        range === 1 ? { hour: '2-digit' } : { day: '2-digit', month: 'short' })
                    }
                    stroke={axisColor}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    minTickGap={32}
                  />
                  <YAxis
                    dataKey="price"
                    tickFormatter={v => nfUSD0.format(v as number)}
                    stroke={axisColor}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    width={80}
                  />
                  <RTooltip
                    formatter={(v: number) => nfUSD.format(v)}
                    labelFormatter={t =>
                      new Date(t as number).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    contentStyle={{
                      background: mode === 'dark' ? 'rgba(15,22,35,0.98)' : 'rgba(255,255,255,0.98)',
                      border: `1px solid ${gridColor}`,
                      borderRadius: 8,
                    }}
                  />
                  <Line type="monotone" dataKey="price" stroke="url(#priceLine)" dot={false} strokeWidth={2} />
                  {latest && chart.length > 0 && (
                    <ReferenceDot x={chart[chart.length - 1].time} y={latest} r={3} fill={lineColor} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              <Tooltip title="Цена и изменения за выбранный период">
                <span className="inline-flex items-center gap-1"><Info className="h-3.5 w-3.5" />данные обновляются по запросу</span>
              </Tooltip>
            </div>
          </Card>

          <Card className={`${cardCls} p-4`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Капитализация</div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {coin.market_data?.market_cap?.usd ? nfUSD0.format(coin.market_data.market_cap.usd) : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Объём 24ч</div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {coin.market_data?.total_volume?.usd ? nfUSD0.format(coin.market_data.total_volume.usd) : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">В обороте</div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {coin.market_data?.circulating_supply ? nfInt.format(Math.round(coin.market_data.circulating_supply)) : '—'} {coin.symbol?.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">ATH</div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {coin.market_data?.ath?.usd ? nfUSD0.format(coin.market_data.ath.usd) : '—'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {coin.description?.en && (
        <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
          <Card className={`${cardCls} p-5`}>
            <Typography.Title level={4} className="!mt-0 text-slate-900 dark:!text-slate-100">
              О {coin.name}
            </Typography.Title>
            <div
              className="prose max-w-none text-slate-700 dark:prose-invert dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: coin.description.en.slice(0, 1200) }}
            />
            {coin.links?.homepage?.[0] && (
              <a
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-[var(--primary,theme(colors.blue.600))] underline-offset-4 hover:underline"
              >
                Читать больше на сайте
              </a>
            )}
          </Card>
        </section>
      )}
    </div>
  )
}
