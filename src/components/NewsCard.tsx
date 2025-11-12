import { Card, Tag, Typography } from 'antd'
import type { NewsItem } from '../api/newsApi'
import { timeAgo, trimUrl } from '../utils/formatters'

type Props = { item: NewsItem }

export default function NewsCard({ item }: Props) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer">
      <Card
        hoverable
        className="group relative overflow-hidden rounded-xl border border-black/10 bg-white transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-[#0e141f]"
        cover={
          item.image_url ? (
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          ) : undefined
        }
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{trimUrl(item.url)}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(item.published_at)}</span>
        </div>

        <Typography.Title
          level={5}
          className="mb-3 !m-0 text-slate-900 transition-colors duration-150 group-hover:text-[var(--primary,theme(colors.blue.600))] dark:text-slate-100"
        >
          {item.title}
        </Typography.Title>

        <div className="mt-3 flex flex-wrap gap-2">
          <Tag className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            {item.source}
          </Tag>
          {item.currencies?.slice(0, 3).map((c) => (
            <Tag
              key={c}
              className="m-0 rounded-full border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              {c}
            </Tag>
          ))}
        </div>
      </Card>
    </a>
  )
}
