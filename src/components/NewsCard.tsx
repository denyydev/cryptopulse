import { Card, Tag, Typography } from 'antd'
import type { NewsItem } from '../api/newsApi'
import { timeAgo, trimUrl } from '../utils/formatters'

type Props = { item: NewsItem }

export default function NewsCard({ item }: Props) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer">
      <Card
        hoverable
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_-20px_rgba(124,58,237,0.35)]"
        cover={
          item.image_url ? (
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-fuchsia-500/10 via-cyan-400/10 to-transparent" />
            </div>
          ) : undefined
        }
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">{trimUrl(item.url)}</span>
          <span className="text-xs text-slate-500">{timeAgo(item.published_at)}</span>
        </div>

        <Typography.Title
          level={5}
          className="mb-3 text-white transition-colors duration-300 group-hover:text-fuchsia-400"
        >
          {item.title}
        </Typography.Title>

        <div className="mt-auto flex flex-wrap gap-2">
          <Tag className="rounded-full border-none bg-fuchsia-500/20 text-fuchsia-300 backdrop-blur">
            {item.source}
          </Tag>
          {item.currencies?.slice(0, 3).map((c) => (
            <Tag
              key={c}
              className="rounded-full border-none bg-white/10 text-slate-300 backdrop-blur"
            >
              {c}
            </Tag>
          ))}
        </div>
      </Card>
    </a>
  )
}
