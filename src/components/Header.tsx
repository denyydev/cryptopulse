import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { useAppStore } from '../store/useAppStore'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const nav = useNavigate()
  const username = useAppStore(s => s.username) ?? 'guest'
  const logout = useAppStore(s => s.logout)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 dark:bg-black/40 dark:backdrop-blur bg-white/70">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex gap-4">
          <Link to="/" className="font-semibold dark:text-white text-slate-800">CryptoPulse</Link>
          <Link to="/cryptos" className="text-slate-500 hover:opacity-80 dark:text-slate-300">Cryptos</Link>
          <Link to="/news" className="text-slate-500 hover:opacity-80 dark:text-slate-300">News</Link>
          <Link to="/nfts" className="text-slate-500 hover:opacity-80 dark:text-slate-300">NFTs</Link>
          <Link to="/favorites" className="text-slate-500 hover:opacity-80 dark:text-slate-300">Favorites</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-slate-700 dark:text-slate-300">Hi, {username}</span>
          <Button onClick={() => { logout(); nav('/login') }}>Logout</Button>
        </div>
      </div>

    </header>
  )
}
