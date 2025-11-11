import { useEffect, useState } from 'react';
import { getCryptoNews, type NewsItem } from '../api/newsApi';
import NewsCard from '../components/NewsCard';
import { Typography, Spin, Empty } from 'antd';

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCryptoNews(12).then(setItems).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid place-items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography.Title level={2} style={{ color: '#fff' }}>
        News
      </Typography.Title>
      {items.length === 0 ? (
        <Empty description="No news" />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      )}
    </div>
  );
}
