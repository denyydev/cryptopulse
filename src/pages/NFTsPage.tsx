import { useEffect, useMemo, useState } from 'react'
import { Typography, Spin, Empty, Select, Tag } from 'antd'
import NFTCard from '../components/NFTCard'
import { getNftCollections, type NFTCollection } from '../api/nftApi'
import { motion } from 'framer-motion'
import { Gem, Sparkles, Filter } from 'lucide-react'

type SortKey = 'floor_desc' | 'floor_asc'

export default function NFTsPage() {
  const [items, setItems] = useState<NFTCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortKey>('floor_desc')

  useEffect(() => {
    setLoading(true)
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
    <div className="w-full">
      <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0e141f]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Gem className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                <Typography.Title level={2} className="!m-0 text-slate-900 dark:text-slate-100">
                  NFT-коллекции
                </Typography.Title>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Коллекции и их floor — красиво и по делу
              </p>
            </div>
            <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <Sparkles className="mr-2 inline-block h-4 w-4" />
              {ordered.length} коллекций
            </Tag>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Select
                value={sort}
                onChange={v => setSort(v)}
                className="w-48"
                options={[
                  { value: 'floor_desc', label: 'Floor ↓' },
                  { value: 'floor_asc', label: 'Floor ↑' },
                ]}
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2, delay: 0.05 }}
          className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#0e141f]"
        >
          {ordered.length === 0 ? (
            <Empty description="Коллекций не найдено" />
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
        </motion.div>
      </section>
    </div>
  )
}
