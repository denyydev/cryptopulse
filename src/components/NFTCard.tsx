import { Card, Typography, Skeleton, Tag } from 'antd'
import { motion } from 'framer-motion'
import type { NFTCollection } from '../api/nftApi'
import { useState } from 'react'
import { ipfsToHttp } from '../utils/ipfs'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { useAppStore } from '../store/useAppStore'

type Props = { item: NFTCollection }

export default function NFTCard({ item }: Props) {
  const isFav = useAppStore(s => s.isFavNft(item.id))
  const toggle = useAppStore(s => s.toggleFavNft)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const src = ipfsToHttp(item.image) || 'https://picsum.photos/seed/fallback/800/600'
  const showFallback = error || !src

  const cardCls =
    'group relative overflow-hidden rounded-xl border border-black/10 bg-white transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-[#0e141f]'

  return (
    <Card
      hoverable
      className={cardCls}
      actions={[
        <span
          key="fav"
          onClick={() => toggle({ id: item.id, name: item.name, image: item.image, floor: item.floor_price })}
        >
          {isFav ? <StarFilled style={{ color: '#f59e0b' }} /> : <StarOutlined />}
        </span>,
      ]}
      cover={
        <div className="relative h-64 w-full overflow-hidden rounded-t-xl bg-slate-50 dark:bg-white/5">
          {!loaded && !showFallback && (
            <div className="absolute inset-0">
              <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
            </div>
          )}

          {showFallback ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              No preview
            </div>
          ) : (
            <motion.img
              src={src}
              alt={item.name}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'tween', duration: 0.25 }}
            />
          )}

          <Tag className="pointer-events-none absolute right-3 top-3 m-0 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            Floor {item.floor_price} ETH
          </Tag>
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <Typography.Title level={5} className="!m-0 text-slate-900 dark:!text-slate-100">
          {item.name}
        </Typography.Title>
        <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">nft</span>
      </div>
    </Card>
  )
}
