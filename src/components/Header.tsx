import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { useAppStore } from '../store/useAppStore'
import ThemeToggle from './ThemeToggle'
import { motion } from 'framer-motion'

const nav = [
  { to: '/cryptos', label: 'Cryptos' },
  { to: '/news', label: 'News' },
  { to: '/nfts', label: 'NFTs' },
  { to: '/favorites', label: 'Favorites' },
]

export default function Header() {
  const go = useNavigate()
  const username = useAppStore((s) => s.username) ?? 'guest'
  const logout = useAppStore((s) => s.logout)

  return (
    <header className="sticky top-0 z-50 overflow-x-clip">
      <div className="relative mx-auto mt-3 w-full max-w-[1440px] px-4">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-[-40%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute left-[80%] top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
        </div>

        <motion.div
          className="rounded-2xl border border-white/10 bg-white/60 px-4 backdrop-blur dark:bg-white/5"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <NavLink
                to="/"
                className="relative select-none rounded-xl px-3 py-1.5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white"
              >
                <span className="relative z-10">CryptoPulse</span>
                <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/20 to-transparent blur" />
              </NavLink>

              <nav className="hidden gap-1 md:flex">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'relative rounded-full px-3 py-2 text-sm transition',
                        'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                        isActive ? 'text-sky-500 dark:text-sky-400' : '',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>
                        <span
                          className={[
                            'pointer-events-none absolute inset-x-2 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-sky-500 transition-all',
                            isActive ? 'opacity-100' : 'opacity-0',
                          ].join(' ')}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/40 px-2 py-1 backdrop-blur dark:bg-white/10">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-[10px] font-bold text-white">
                    {username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs text-slate-800 dark:text-slate-300">Hi, {username}</span>
                </div>
                <Button onClick={() => { logout(); go('/login') }}>Logout</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
