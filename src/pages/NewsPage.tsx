import { useEffect, useMemo, useState } from 'react'
import { getCryptoNews, type NewsItem } from '../api/newsApi'
import NewsCard from '../components/NewsCard'
import { Typography, Spin, Empty, Tag } from 'antd'
import { motion } from 'framer-motion'
import { Newspaper, Sparkles } from 'lucide-react'

type Period = 'all' | '24h' | '7d'
type SortOrder = 'newest' | 'oldest'
type NewsItemEx = NewsItem & { description?: string; publishedAt?: string; date?: string; source?: string }

function withinPeriod(dateISO: string | undefined, period: Period) {
  if (!dateISO || period === 'all') return true
  const now = Date.now()
  const t = new Date(dateISO).getTime()
  if (Number.isNaN(t)) return true
  const diff = now - t
  if (period === '24h') return diff <= 24 * 60 * 60 * 1000
  if (period === '7d') return diff <= 7 * 24 * 60 * 60 * 1000
  return true
}

const getDateStr = (n: NewsItemEx) => n.publishedAt ?? n.date
const getSource = (n: NewsItemEx) => n.source ?? ''
const getDesc = (n: NewsItemEx) => n.description ?? ''

export default function NewsPage() {
  const [items, setItems] = useState<NewsItemEx[]>([])
  const [loading, setLoading] = useState(true)

  const [query] = useState('')
  const [period] = useState<Period>('all')
  const [source] = useState<string | 'all'>('all')
  const [order] = useState<SortOrder>('newest')

  useEffect(() => {
    setLoading(true)
    getCryptoNews(12)
      .then(res => setItems(res as unknown as NewsItemEx[]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const arr = items
      .filter(n => withinPeriod(getDateStr(n), period))
      .filter(n => (source === 'all' ? true : getSource(n) === source))
      .filter(n =>
        !q ? true : [n.title, getDesc(n), getSource(n)].filter(Boolean).some(v => String(v).toLowerCase().includes(q)),
      )
      .slice()
      .sort((a, b) => {
        const da = new Date(getDateStr(a) ?? '').getTime()
        const db = new Date(getDateStr(b) ?? '').getTime()
        return order === 'newest' ? db - da : da - db
      })
    return arr
  }, [items, period, source, query, order])

  if (loading)
    return (
      <div className="grid min-h-[50vh] w-full place-items-center py-16">
        <Spin size="large" />
      </div>
    )

  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0e141f]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
                  Новости
                </Typography.Title>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Самое важное из криптомира — коротко и по делу</p>
            </div>
            <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <Sparkles className="mr-2 inline-block h-4 w-4" />
              {filtered.length} материалов
            </Tag>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2, delay: 0.05 }}
          className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#0e141f]"
        >
          {filtered.length === 0 ? (
            <Empty description="Ничего не найдено" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(n => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
