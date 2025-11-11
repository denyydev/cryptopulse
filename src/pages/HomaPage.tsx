import { Typography } from 'antd';

export default function HomePage() {
  return (
    <div className="p-6">
      <Typography.Title level={2} style={{color:'#fff'}}>Home</Typography.Title>
      <p className="text-slate-300">Здесь будут топ-коины и новости.</p>
    </div>
  );
}
