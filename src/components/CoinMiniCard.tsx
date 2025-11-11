import { Card } from 'antd'

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
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
      onClick={onClick}
      cover={
        <div className="bg-black/30 flex items-center justify-center h-36">
          <img src={image} alt={name} className="h-20 w-20 object-contain" />
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">{name}</span>
        {price !== undefined && <span className="text-slate-400 text-sm">${price}</span>}
      </div>
    </Card>
  )
}
