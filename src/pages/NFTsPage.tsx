import { useEffect, useState } from 'react'
import { Typography, Spin, Empty } from 'antd'
import NFTCard from '../components/NFTCard'
import { getNftCollections, type NFTCollection } from '../api/nftApi'

export default function NFTsPage() {
  const [items, setItems] = useState<NFTCollection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNftCollections(12).then(setItems).finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="p-6 grid place-items-center">
        <Spin size="large" />
      </div>
    )

  return (
    <div className="p-6 w-full">
      <Typography.Title level={2} style={{ color: '#fff' }}>
        NFTs
      </Typography.Title>
      {items.length === 0 ? (
        <Empty description="No collections" />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <NFTCard key={c.id} item={c} />
          ))}
        </div>
      )}
    </div>
  )
}
