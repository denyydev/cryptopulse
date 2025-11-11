import { Card, Typography, Skeleton } from 'antd'
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

  return (
    <Card
      hoverable
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:shadow-[0_20px_60px_-20px_rgba(124,58,237,0.35)]"
      actions={[
        <span key="fav" onClick={() => toggle({ id: item.id, name: item.name, image: item.image, floor: item.floor_price })}>
          {isFav ? <StarFilled style={{ color: '#facc15' }} /> : <StarOutlined />}
        </span>,
      ]}
      cover={
        <div className="relative h-64 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/15 via-cyan-400/10 to-transparent" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

          <motion.div
            className="relative z-10 flex h-full items-center justify-center"
            initial={{ scale: 0.96, opacity: 0.9 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <motion.div
              className="relative grid place-items-center rounded-3xl p-3"
              whileHover={{ y: -6, rotate: 0.5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <div className="relative grid place-items-center h-56 w-56 rounded-3xl ring-1 ring-white/15 bg-black/20 shadow-[inset_0_8px_24px_rgba(255,255,255,0.06),0_14px_40px_rgba(0,0,0,0.35)] overflow-hidden">
                <motion.div
                  className="absolute -inset-1 rounded-3xl"
                  animate={{ boxShadow: ['0 0 0 0 rgba(124,58,237,0)', '0 0 60px 10px rgba(124,58,237,0.25)'] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatType: 'mirror' }}
                />

                {!loaded && !showFallback && (
                  <div className="absolute inset-0">
                    <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
                  </div>
                )}

                {showFallback ? (
                  <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                    No preview
                  </div>
                ) : (
                  <motion.img
                    src={src}
                    alt={item.name}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    className="h-full w-full object-cover"
                    animate={{ scale: [1.02, 1.0, 1.02] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>

          <div className="absolute right-3 top-3 z-10 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur ring-1 ring-white/15">
            Floor {item.floor_price} ETH
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <Typography.Title level={5} className="!m-0 !text-white">
          {item.name}
        </Typography.Title>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">nft</span>
      </div>
    </Card>
  )
}
