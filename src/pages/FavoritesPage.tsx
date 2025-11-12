import { Typography, Empty, Card, Tag } from 'antd'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export default function FavoritesPage() {
  const coins = useAppStore(s => s.favCoins)
  const nfts = useAppStore(s => s.favNfts)
  const nav = useNavigate()

  const cardCls = 'rounded-xl border border-black/10 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#0e141f]'

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <Typography.Title level={2} className="!m-0 mb-6 text-slate-900 dark:!text-slate-100">
        Favorites
      </Typography.Title>

      <div className="mb-6 flex items-center justify-between">
        <Typography.Title level={4} className="!m-0 text-slate-900 dark:!text-slate-100">
          Coins
        </Typography.Title>
        {coins.length > 0 && (
          <Tag className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            {coins.length}
          </Tag>
        )}
      </div>

      {coins.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0e141f]">
          <Empty description="No favorite coins" />
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
                  <img src={c.image} alt={c.name} className="h-24 w-24 object-contain" />
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

      <div className="h-10" />

      <div className="mb-6 flex items-center justify-between">
        <Typography.Title level={4} className="!m-0 text-slate-900 dark:!text-slate-100">
          NFTs
        </Typography.Title>
        {nfts.length > 0 && (
          <Tag className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            {nfts.length}
          </Tag>
        )}
      </div>

      {nfts.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0e141f]">
          <Empty description="No favorite NFTs" />
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
                  <img src={n.image} alt={n.name} className="h-full w-full object-cover" />
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
    </div>
  )
}
