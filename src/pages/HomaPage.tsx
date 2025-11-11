import { useEffect, useState } from 'react'
import { Typography, Spin, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
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
    <div className="p-6 max-w-6xl mx-auto">
      <Typography.Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
        Overview
      </Typography.Title>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
            Top Coins
          </Typography.Title>
          <button onClick={() => nav('/cryptos')} className="text-sky-400 hover:underline">
            View all
          </button>
        </div>
        {coins.length === 0 ? (
          <Empty description="No coins" />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {coins.map(c => (
              <CoinMiniCard
                key={c.id}
                name={c.name}
                image={c.image}
                price={c.current_price}
                onClick={() => nav(`/coin/${c.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
            Latest News
          </Typography.Title>
          <button onClick={() => nav('/news')} className="text-sky-400 hover:underline">
            View all
          </button>
        </div>
        {news.length === 0 ? (
          <Empty description="No news" />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {news.map(n => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
