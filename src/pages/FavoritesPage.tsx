import { Typography, Empty, Card } from 'antd'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'

export default function FavoritesPage() {
  const coins = useAppStore(s => s.favCoins)
  const nfts = useAppStore(s => s.favNfts)
  const nav = useNavigate()

  return (
    <div className="p-6">
      <Typography.Title level={2} style={{ color: '#fff' }}>Favorites</Typography.Title>

      <Typography.Title level={4} style={{ color: '#fff' }}>Coins</Typography.Title>
      {coins.length === 0 ? (
        <Empty description="No favorite coins" />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {coins.map(c => (
            <Card key={c.id} hoverable className="bg-white/5 border border-white/10"
              onClick={() => nav(`/coin/${c.id}`)}
              cover={<img src={c.image} alt={c.name} className="h-40 w-full object-contain p-4 bg-black/30" />}>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{c.name}</span>
                {c.price !== undefined && <span className="text-slate-400">${c.price}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="h-8" />

      <Typography.Title level={4} style={{ color: '#fff' }}>NFTs</Typography.Title>
      {nfts.length === 0 ? (
        <Empty description="No favorite NFTs" />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {nfts.map(n => (
            <Card key={n.id} hoverable className="bg-white/5 border border-white/10"
              cover={<img src={n.image} alt={n.name} className="h-44 w-full object-cover" />}>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{n.name}</span>
                {n.floor !== undefined && <span className="text-slate-400">Floor {n.floor} ETH</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
