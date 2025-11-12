import { useEffect, useMemo, useState } from 'react'
import axios from '../api/axiosInstance'
import { Table, Typography, Input, Select, Segmented, Tag, Tooltip, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import CoinFavButton from '../components/CoinFavButton'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Info, Sparkles, Coins, LineChart, CircleDollarSign } from 'lucide-react'

type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_1h_in_currency?: number
  sparkline_in_7d?: { price: number[] }
}

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 })


function pct(p?: number) {
  if (p === null || p === undefined) return '—'
  const fixed = Math.abs(p) < 1 ? p.toFixed(2) : p.toFixed(2)
  const sign = p > 0 ? '+' : ''
  return `${sign}${fixed}%`
}

function TrendPill({ value }: { value?: number }) {
  if (value === undefined || value === null) return <span>—</span>
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {pct(value)}
    </span>
  )
}

function Sparkline({ points }: { points?: number[] }) {
  if (!points || points.length === 0) return <span className="text-xs opacity-60">нет данных</span>
  const width = 110, height = 34, padding = 2
  const min = Math.min(...points), max = Math.max(...points)
  const span = Math.max(max - min, 1e-9)
  const stepX = (width - padding * 2) / (points.length - 1)
  const toX = (i: number) => padding + i * stepX
  const toY = (v: number) => height - padding - ((v - min) / span) * (height - padding * 2)
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const up = points[points.length - 1] >= points[0]
  return (
    <svg width={width} height={height} className="block">
      <path d={d} fill="none" stroke={up ? '#059669' : '#dc2626'} strokeWidth={1.5} />
    </svg>
  )
}

const ORDER_OPTIONS = [
  { value: 'market_cap_desc', label: 'Капитализация ↓' },
  { value: 'market_cap_asc', label: 'Капитализация ↑' },
  { value: 'volume_desc', label: 'Объём ↓' },
  { value: 'volume_asc', label: 'Объём ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'price_asc', label: 'Цена ↑' },
] as const

type OrderValue = typeof ORDER_OPTIONS[number]['value']

export default function CryptocurrenciesPage() {
  const [data, setData] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<OrderValue>('market_cap_desc')
  const [limit, setLimit] = useState<20 | 50 | 100>(20)
  const [moveFilter, setMoveFilter] = useState<'all' | 'gainers' | 'losers'>('all')
  const nav = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          per_page: limit,
          order,
          sparkline: true,
          price_change_percentage: '1h,24h,7d',
        },
      })
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [order, limit])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter(c => {
      const matches = !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      if (!matches) return false
      if (moveFilter === 'gainers') return (c.price_change_percentage_24h ?? 0) >= 0
      if (moveFilter === 'losers') return (c.price_change_percentage_24h ?? 0) < 0
      return true
    })
  }, [data, query, moveFilter])

  const orderLabel = useMemo(() => ORDER_OPTIONS.find(o => o.value === order)?.label ?? order, [order])

  const columns: ColumnsType<Coin> = [
    {
      title: '',
      dataIndex: 'fav',
      width: 56,
      fixed: 'left',
      render: (_: any, r: Coin) => <CoinFavButton item={{ id: r.id, name: r.name, image: r.image, price: r.current_price }} />,
    },
    {
      title: '#',
      dataIndex: 'market_cap_rank',
      width: 64,
      sorter: (a, b) => (a.market_cap_rank ?? 0) - (b.market_cap_rank ?? 0),
      render: v => <span className="text-slate-500 dark:text-slate-400">#{v}</span>,
    },
    {
      title: 'Монета',
      dataIndex: 'name',
      width: 260,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_: any, r: Coin) => (
        <div onClick={() => nav(`/coin/${r.id}`)} className="group flex cursor-pointer items-center gap-3">
          <img src={r.image} alt={r.name} className="h-7 w-7 rounded-full ring-1 ring-black/10 dark:ring-white/10" />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-slate-900 group-hover:underline dark:text-slate-100">{r.name}</span>
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{r.symbol}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <Space size={6}>
          <CircleDollarSign className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span>Цена</span>
        </Space>
      ),
      dataIndex: 'current_price',
      align: 'right',
      sorter: (a, b) => a.current_price - b.current_price,
      render: (v: number) => <span className="font-medium text-slate-900 dark:text-slate-100">{nfUSD.format(v)}</span>,
    },
    {
      title: () => (
        <Space size={6}>
          <span>24ч</span>
          <Tooltip title="Изменение цены за 24 часа">
            <Info className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'price_change_percentage_24h',
      width: 110,
      align: 'right',
      sorter: (a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0),
      render: (v: number) => <TrendPill value={v} />,
    },
    {
      title: '7д',
      dataIndex: 'price_change_percentage_7d_in_currency',
      width: 110,
      align: 'right',
      sorter: (a, b) => (a.price_change_percentage_7d_in_currency ?? 0) - (b.price_change_percentage_7d_in_currency ?? 0),
      render: (v: number) => <TrendPill value={v} />,
    },
    {
      title: 'Капитализация',
      dataIndex: 'market_cap',
      align: 'right',
      sorter: (a, b) => a.market_cap - b.market_cap,
      render: (v: number) => <span className="text-slate-900 dark:text-slate-100">{nfUSD.format(v)}</span>,
    },
    {
      title: 'Объём 24ч',
      dataIndex: 'total_volume',
      align: 'right',
      sorter: (a, b) => a.total_volume - b.total_volume,
      render: (v: number) => <span className="text-slate-900 dark:text-slate-100">{nfUSD.format(v)}</span>,
    },
    {
      title: (
        <Space size={6}>
          <LineChart className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span>График 7д</span>
        </Space>
      ),
      dataIndex: 'sparkline_in_7d',
      width: 140,
      render: (_: any, r: Coin) => <Sparkline points={r.sparkline_in_7d?.price} />,
    },
  ]

  return (
    <div className="w-full">
      <div>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-4"
        >
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0e141f]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                  <Typography.Title level={2} className="!m-0 text-slate-900 dark:text-slate-100">
                    Криптовалюты
                  </Typography.Title>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Живые котировки, тренды и обороты — всё под рукой
                </p>
              </div>
              <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                <Sparkles className="mr-2 inline-block h-4 w-4" />
                Топ {limit} • {orderLabel}
              </Tag>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Input.Search
                allowClear
                placeholder="Поиск по имени или тикеру…"
                onChange={e => setQuery(e.target.value)}
                className="w-full sm:w-72"
              />
              <Select<OrderValue>
                value={order}
                onChange={v => setOrder(v)}
                className="w-full sm:w-60"
                options={ORDER_OPTIONS as any}
              />
              <Segmented
                options={[{ label: 'Топ 20', value: 20 }, { label: 'Топ 50', value: 50 }, { label: 'Топ 100', value: 100 }]}
                value={limit}
                onChange={v => setLimit(v as 20 | 50 | 100)}
              />
              <Segmented
                options={[
                  { label: 'Все', value: 'all' },
                  { label: 'Рост', value: 'gainers' },
                  { label: 'Падение', value: 'losers' },
                ]}
                value={moveFilter}
                onChange={v => setMoveFilter(v as 'all' | 'gainers' | 'losers')}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <div className="rounded-2xl border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#0e141f]">
          <Table<Coin>
            rowKey="id"
            loading={loading}
            dataSource={filtered}
            columns={columns}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            size="middle"
            sticky
            onRow={() => ({
              className: 'transition-colors hover:bg-slate-50 dark:hover:bg-white/5',
              style: { cursor: 'pointer' },
            })}
          />
        </div>
      </div>
    </div>
  )
}
