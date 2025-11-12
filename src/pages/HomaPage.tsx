import { useEffect, useState } from 'react'
import { Typography, Spin, Empty, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCoins } from '../api/coinApi'
import { getCryptoNews, type NewsItem } from '../api/newsApi'
import CoinMiniCard from '../components/CoinMiniCard'
import NewsCard from '../components/NewsCard'
import { LayoutDashboard, Coins as CoinsIcon, Newspaper as NewspaperIcon } from 'lucide-react'

type CoinRow = { id: string; name: string; image: string; current_price?: number }

export default function HomePage() {
  const [coins, setCoins] = useState<CoinRow[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    Promise.all([getCoins(5), getCryptoNews(6)])
      .then(([c, n]) => {
        setCoins(c)
        setNews(n)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="grid place-items-center p-10">
        <Spin size="large" />
      </div>
    )

  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            className="flex flex-col gap-1"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-slate-700 dark:text-slate-200" aria-hidden="true" />
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                Обзор
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Коротко о рынке: самое важное одним взглядом
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="hidden md:block">
            <Button onClick={() => nav('/cryptos')} size="middle">
              Открыть рынки
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="mb-10 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#0e141f]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'tween', duration: 0.2, delay: 0.05 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CoinsIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                <Typography.Title level={3} className="!m-0 text-slate-900 dark:!text-slate-100">
                  Топ монеты
                </Typography.Title>
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Лидеры по капитализации и вниманию
              </div>
            </div>
            <button
              onClick={() => nav('/cryptos')}
              className="text-sm text-slate-700 underline-offset-4 hover:underline dark:text-slate-300"
            >
              Смотреть все
            </button>
          </div>

          {coins.length === 0 ? (
            <Empty description="Монет нет" />
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {coins.map(c => (
                <motion.div key={c.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <CoinMiniCard
                    name={c.name}
                    image={c.image}
                    price={c.current_price}
                    onClick={() => nav(`/coin/${c.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#0e141f]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'tween', duration: 0.2, delay: 0.08 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <NewspaperIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                <Typography.Title level={3} className="!m-0 text-slate-900 dark:!text-slate-100">
                  Свежие новости
                </Typography.Title>
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Главное из криптомира — без лишнего шума
              </div>
            </div>
            <button
              onClick={() => nav('/news')}
              className="text-sm text-slate-700 underline-offset-4 hover:underline dark:text-slate-300"
            >
              Смотреть все
            </button>
          </div>

          {news.length === 0 ? (
            <Empty description="Новостей нет" />
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            >
              {news.map(n => (
                <motion.div key={n.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <NewsCard item={n} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
