import { StarFilled, StarOutlined } from '@ant-design/icons'
import { useAppStore, type FavCoin } from '../store/useAppStore'

export default function CoinFavButton({ item }: { item: FavCoin }) {
  const isFav = useAppStore(s => s.isFavCoin(item.id))
  const toggle = useAppStore(s => s.toggleFavCoin)
  return (
    <button
      onClick={() => toggle(item)}
      className="text-xl"
      aria-label="favorite"
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFav ? <StarFilled style={{ color: '#facc15' }} /> : <StarOutlined />}
    </button>
  )
}
