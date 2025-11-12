import { useEffect, useMemo, useState } from 'react'
import { Typography, Spin, Empty, Select, Tag } from 'antd'
import NFTCard from '../components/NFTCard'
import { getNftCollections, type NFTCollection } from '../api/nftApi'
import { motion } from 'framer-motion'

type SortKey = 'floor_desc' | 'floor_asc'

export default function NFTsPage() {
  const [items, setItems] = useState<NFTCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortKey>('floor_desc')

  useEffect(() => {
    getNftCollections(12).then(setItems).finally(() => setLoading(false))
  }, [])

  const ordered = useMemo(() => {
    const arr = [...items]
    return arr.sort((a, b) => {
      const fa = a.floor_price ?? 0
      const fb = b.floor_price ?? 0
      return sort === 'floor_desc' ? fb - fa : fa - fb
    })
  }, [items, sort])

  if (loading)
    return (
      <div className="grid place-items-center p-10">
        <Spin size="large" />
      </div>
    )

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
          NFTs
        </Typography.Title>
        {items.length > 0 && (
          <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-1 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            {items.length}
          </Tag>
        )}
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Select
          value={sort}
          onChange={v => setSort(v)}
          className="w-52"
          options={[
            { value: 'floor_desc', label: 'Floor ↓' },
            { value: 'floor_asc', label: 'Floor ↑' },
          ]}
        />
      </div>

      {ordered.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0e141f]">
          <Empty description="No collections" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {ordered.map(c => (
            <motion.div key={c.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <NFTCard item={c} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
