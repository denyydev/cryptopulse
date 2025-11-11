import { Link, useNavigate } from 'react-router-dom';
import { getUsername, logout } from '../hooks/useAuth';
import { Button } from 'antd';

export default function Header() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex gap-4">
          <Link to="/" className="text-white font-semibold">CryptoPulse</Link>
          <Link to="/cryptos" className="text-slate-300 hover:text-white">Cryptos</Link>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {getUsername()}</span>
          <Button onClick={() => { logout(); nav('/login'); }}>Logout</Button>
        </div>
      </div>
    </header>
  );
}
