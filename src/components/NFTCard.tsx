import { Card, Typography } from 'antd'
import type { NFTCollection } from '../api/nftApi'

type Props = { item: NFTCollection }

export default function NFTCard({ item }: Props) {
  return (
    <Card
      hoverable
      className="bg-white/5 border border-white/10"
      cover={<img src={item.image} alt={item.name} className="h-44 w-full object-cover" />}
    >
      <Typography.Title level={5} style={{ color: '#fff', margin: 0 }}>
        {item.name}
      </Typography.Title>
      <div className="mt-3 flex justify-between text-slate-400 text-sm">
        <span>Floor {item.floor_price} ETH</span>
        <span>24h Vol {item.volume_24h} ETH</span>
      </div>
    </Card>
  )
}
