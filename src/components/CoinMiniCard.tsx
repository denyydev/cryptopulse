import { Card } from 'antd'
import { motion } from 'framer-motion'

type Props = {
  name: string
  image: string
  price?: number
  onClick?: () => void
}

export default function CoinMiniCard({ name, image, price, onClick }: Props) {
  return (
    <Card
      hoverable
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-black/10 bg-white transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-[#0e141f]"
      cover={
        <div className="flex h-40 w-full items-center justify-center">
          <motion.img
            src={image}
            alt={name}
            className="h-16 w-16 object-contain"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          />
          {price !== undefined && (
            <div className="absolute right-3 top-3 rounded-full border border-black/10 bg-white/80 px-2 py-0.5 text-xs text-slate-800 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              ${price}
            </div>
          )}
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{name}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">coin</span>
      </div>
    </Card>
  )
}
