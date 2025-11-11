import { Card, Tag, Typography } from 'antd';
import type { NewsItem } from '../api/newsApi';
import { timeAgo, trimUrl } from '../utils/formatters';

type Props = { item: NewsItem };

export default function NewsCard({ item }: Props) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer">
      <Card
        hoverable
        className="bg-white/5 border border-white/10"
        cover={
          item.image_url ? (
            <img src={item.image_url} alt={item.title} className="h-44 w-full object-cover" />
          ) : undefined
        }
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">{trimUrl(item.url)}</span>
          <span className="text-xs text-slate-500">{timeAgo(item.published_at)}</span>
        </div>
        <Typography.Title level={5} style={{ color: '#fff', margin: 0 }}>
          {item.title}
        </Typography.Title>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag color="purple">{item.source}</Tag>
          {item.currencies?.slice(0, 3).map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
      </Card>
    </a>
  );
}
