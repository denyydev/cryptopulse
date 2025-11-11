import { Typography, Empty, Card } from 'antd'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { StarFilled, PictureOutlined } from '@ant-design/icons'

export default function FavoritesPage() {
  const coins = useAppStore((s) => s.favCoins)
  const nfts = useAppStore((s) => s.favNfts)
  const nav = useNavigate()

  const renderEmpty = (icon: React.ReactNode, text: string) => (
    <div className="flex flex-col items-center justify-center py-12 opacity-70">
      <div className="text-6xl mb-4 text-slate-500">{icon}</div>
      <Typography.Text style={{ color: '#999' }}>{text}</Typography.Text>
    </div>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Typography.Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
        Favorites
      </Typography.Title>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <StarFilled className="text-yellow-400 text-3xl" />
          <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
            Coins
          </Typography.Title>
        </div>

        {coins.length === 0
          ? renderEmpty(<StarFilled />, 'No favorite coins yet')
          : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {coins.map((c) => (
                <Card
                  key={c.id}
                  hoverable
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                  onClick={() => nav(`/coin/${c.id}`)}
                  cover={
                    <div className="bg-black/30 flex items-center justify-center h-48">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-32 w-32 object-contain"
                      />
                    </div>
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{c.name}</span>
                    {c.price !== undefined && (
                      <span className="text-slate-400 text-sm">${c.price}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <PictureOutlined className="text-purple-400 text-3xl" />
          <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
            NFTs
          </Typography.Title>
        </div>

        {nfts.length === 0
          ? renderEmpty(<PictureOutlined />, 'No favorite NFTs yet')
          : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {nfts.map((n) => (
                <Card
                  key={n.id}
                  hoverable
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                  cover={
                    <div className="relative">
                      <img
                        src={n.image}
                        alt={n.name}
                        className="h-56 w-full object-cover"
                      />
                    </div>
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{n.name}</span>
                    {n.floor !== undefined && (
                      <span className="text-slate-400 text-sm">
                        Floor {n.floor} ETH
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
      </section>
    </div>
  )
}
