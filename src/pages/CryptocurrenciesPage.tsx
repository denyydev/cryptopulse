import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CoinFavButton from '../components/CoinFavButton';

export default function CryptocurrenciesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    axios.get('/coins/markets', { params: { vs_currency: 'usd', per_page: 20 }})
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <Typography.Title level={2} style={{color:'#fff'}}>Cryptocurrencies</Typography.Title>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={[
          {
            title: '',
            dataIndex: 'fav',
            width: 60,
            render: (_: any, r: any) => (
              <CoinFavButton item={{ id: r.id, name: r.name, image: r.image, price: r.current_price }} />
            )
          },
          {
            title: 'Name',
            dataIndex: 'name',
            render: (_: any, r: any) => (
              <span onClick={() => nav(`/coin/${r.id}`)} className="text-blue-400 cursor-pointer hover:underline">
                {r.name}
              </span>
            ),
          },
          { title: 'Price', dataIndex: 'current_price' },
          { title: '24h %', dataIndex: 'price_change_percentage_24h' },
          { title: 'Market Cap', dataIndex: 'market_cap' },
        ]}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
