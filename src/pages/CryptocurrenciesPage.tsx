import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function CryptocurrenciesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

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
      title: 'Name',
      dataIndex: 'name',
      render: (_: any, record: any) => (
        <span
          onClick={() => navigate(`/coin/${record.id}`)}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          {record.name}
        </span>
      ),
    },
    { title: 'Price', dataIndex: 'current_price' },
    { title: '24h %', dataIndex: 'price_change_percentage_24h' },
    { title: 'Market Cap', dataIndex: 'market_cap' },
  ]}
/>
    </div>
  );
}
