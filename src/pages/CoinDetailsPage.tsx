import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Card } from 'antd'
import { getCoin, getCoinMarketChart } from '../api/coinApi'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CoinDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [coin, setCoin] = useState<any>(null)
  const [chart, setChart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getCoin(id), getCoinMarketChart(id, 7)])
      .then(([coinData, chartData]) => {
        setCoin(coinData)
        setChart(chartData.prices.map((p: number[]) => ({ time: p[0], price: p[1] })))
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="p-6 grid place-items-center">
        <Spin size="large" />
      </div>
    )

  if (!coin) return <div className="p-6 text-slate-300">Coin not found</div>

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <img src={coin.image?.small || coin.image} alt={coin.name} className="w-10 h-10" />
        <Typography.Title level={2} style={{ color: '#fff', margin: 0 }}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </Typography.Title>
      </div>

      <Card className="bg-white/5 border border-white/10 mb-6">
        <div className="text-slate-300 text-lg mb-2">
          Current price: <span className="text-white">${coin.market_data.current_price.usd}</span>
        </div>
        <div className="text-slate-400 mb-2">
          Market cap: ${coin.market_data.market_cap.usd.toLocaleString()}
        </div>
        <div
          className={`text-sm ${
            coin.market_data.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          24h: {coin.market_data.price_change_percentage_24h.toFixed(2)}%
        </div>
      </Card>

      <Typography.Title level={4} style={{ color: '#fff' }}>
        7-day Price
      </Typography.Title>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart}>
            <XAxis
              dataKey="time"
              tickFormatter={(t) => new Date(t).toLocaleDateString('en-US', { day: 'numeric' })}
              stroke="#555"
            />
            <YAxis
              dataKey="price"
              tickFormatter={(v) => `$${v.toFixed(0)}`}
              domain={['auto', 'auto']}
              stroke="#555"
            />
            <Tooltip
              formatter={(v: number) => `$${v.toFixed(2)}`}
              labelFormatter={(t) => new Date(t).toLocaleString()}
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
            />
            <Line type="monotone" dataKey="price" stroke="#7c3aed" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
