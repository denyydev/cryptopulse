import { Card, Typography } from 'antd'
import type { NFTCollection } from '../api/nftApi'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { useAppStore } from '../store/useAppStore'

type Props = { item: NFTCollection }

export default function NFTCard({ item }: Props) {
  const isFav = useAppStore(s => s.isFavNft(item.id))
  const toggle = useAppStore(s => s.toggleFavNft)

  return (
    <Card
      hoverable
      className="bg-white/5 border border-white/10 relative"
      cover={<img src={item.image} alt={item.name} className="h-44 w-full object-cover" />}
      actions={[
        <span key="fav" onClick={() => toggle({ id: item.id, name: item.name, image: item.image, floor: item.floor_price })}>
          {isFav ? <StarFilled style={{ color: '#facc15' }} /> : <StarOutlined />}
        </span>
      ]}
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
