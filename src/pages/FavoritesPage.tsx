import { Typography, Empty, Card, Tag } from 'antd'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Coins as CoinsIcon, Gem, Sparkles } from 'lucide-react'
import ImageWithFallback from '../components/ImageWithFallback'

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export default function FavoritesPage() {
  const coins = useAppStore(s => s.favCoins)
  const nfts = useAppStore(s => s.favNfts)
  const nav = useNavigate()

  const cardCls =
    'rounded-xl border border-black/10 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#0e141f]'

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
                <Star className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
                  Избранное
                </Typography.Title>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Ваш личный шорт-лист монет и коллекций
              </p>
            </div>
            <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <Sparkles className="mr-2 inline-block h-4 w-4" />
              {coins.length + nfts.length} всего
            </Tag>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2, delay: 0.05 }}
          className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0e141f]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CoinsIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              <Typography.Title level={4} className="!m-0 text-slate-900 dark:!text-slate-100">
                Монеты
              </Typography.Title>
            </div>
            {coins.length > 0 && (
              <Tag className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                {coins.length}
              </Tag>
            )}
          </div>

          {coins.length === 0 ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0e141f]">
              <Empty description="Нет избранных монет" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coins.map(c => (
                <Card
                  key={c.id}
                  hoverable
                  className={cardCls}
                  onClick={() => nav(`/coin/${c.id}`)}
                  cover={
                    <div className="grid h-40 place-items-center bg-slate-50 p-4 dark:bg-white/5">
                      <ImageWithFallback
                        src={c.image}
                        alt={c.name}
                        className="h-24 w-24 rounded-full object-contain ring-1 ring-black/10 dark:ring-white/10"
                      />
                    </div>
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{c.name}</span>
                    {c.price !== undefined && (
                      <span className="text-sm text-slate-600 dark:text-slate-300">{nfUSD.format(c.price)}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="my-8 h-px w-full bg-black/10 dark:bg-white/10" />

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              <Typography.Title level={4} className="!m-0 text-slate-900 dark:!text-slate-100">
                NFT-коллекции
              </Typography.Title>
            </div>
            {nfts.length > 0 && (
              <Tag className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                {nfts.length}
              </Tag>
            )}
          </div>

          {nfts.length === 0 ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0e141f]">
              <Empty description="Нет избранных NFT" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nfts.map(n => (
                <Card
                  key={n.id}
                  hoverable
                  className={cardCls}
                  cover={
                    <div className="h-48 w-full overflow-hidden rounded-t-xl">
                      <ImageWithFallback src={n.image} alt={n.name} className="h-full w-full object-cover" />
                    </div>
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{n.name}</span>
                    {n.floor !== undefined && (
                      <span className="text-sm text-slate-600 dark:text-slate-300">Floor {n.floor} ETH</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
