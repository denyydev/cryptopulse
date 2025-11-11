import { useEffect, useState } from 'react'
import { Typography, Spin, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCoins } from '../api/coinApi'
import { getCryptoNews, type NewsItem } from '../api/newsApi'
import CoinMiniCard from '../components/CoinMiniCard'
import NewsCard from '../components/NewsCard'

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
      <div className="p-6 grid place-items-center">
        <Spin size="large" />
      </div>
    )

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-16 h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute top-28 -left-20 h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <section className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            Overview
          </motion.h1>

          <motion.button
            onClick={() => nav('/cryptos')}
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15 transition"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Markets
          </motion.button>
        </div>

        <motion.div
          className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={3} className="!m-0 !text-white">
              Top Coins
            </Typography.Title>
            <button onClick={() => nav('/cryptos')} className="text-sky-400 hover:underline">
              View all
            </button>
          </div>

          {coins.length === 0 ? (
            <Empty description="No coins" />
          ) : (
            <motion.div
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {coins.map((c) => (
                <motion.div
                  key={c.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                >
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
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Typography.Title level={3} className="!m-0 !text-white">
              Latest News
            </Typography.Title>
            <button onClick={() => nav('/news')} className="text-sky-400 hover:underline">
              View all
            </button>
          </div>

          {news.length === 0 ? (
            <Empty description="No news" />
          ) : (
            <motion.div
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {news.map((n) => (
                <motion.div
                  key={n.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                >
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
