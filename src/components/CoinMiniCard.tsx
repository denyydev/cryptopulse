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
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:shadow-[0_20px_60px_-20px_rgba(124,58,237,0.35)]"
      cover={
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/15 via-cyan-400/10 to-transparent" />
          <div className="absolute -top-16 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

          <motion.div
            className="relative z-10 flex h-full items-center justify-center"
            initial={{ scale: 0.95, opacity: 0.9 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <motion.div
              className="relative grid place-items-center rounded-full p-3"
              whileHover={{ y: -6, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <div className="relative grid place-items-center h-28 w-28 rounded-full ring-1 ring-white/15 shadow-[inset_0_8px_22px_rgba(255,255,255,0.06),0_14px_40px_rgba(0,0,0,0.35)] bg-[radial-gradient(120%_120%_at_30%_30%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.06)_45%,transparent_60%)]">
                <motion.div
                  className="absolute -inset-1 rounded-full"
                  animate={{ boxShadow: ['0 0 0 0 rgba(124,58,237,0)', '0 0 40px 6px rgba(124,58,237,0.35)'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
                />
                <motion.img
                  src={image}
                  alt={name}
                  className="h-16 w-16 object-contain drop-shadow-[0_10px_24px_rgba(124,58,237,0.4)]"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>

          {price !== undefined && (
            <div className="absolute right-3 top-3 z-10 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur ring-1 ring-white/15">
              ${price}
            </div>
          )}
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-white">{name}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">coin</span>
      </div>
    </Card>
  )
}
