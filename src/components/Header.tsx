import { NavLink, useNavigate } from 'react-router-dom'
import { Button, Popconfirm, message } from 'antd'
import { useAppStore } from '../store/useAppStore'
import ThemeToggle from './ThemeToggle'
import { motion } from 'framer-motion'
import { Home, Bitcoin, Newspaper, Gem, Star, Calculator, LineChart } from 'lucide-react'

const nav = [
  { to: '/', label: 'Главная', Icon: Home, hint: 'Пульс проекта' },
  { to: '/cryptos', label: 'Крипта', Icon: Bitcoin, hint: 'Монеты, цены, графики' },
  { to: '/news', label: 'Новости', Icon: Newspaper, hint: 'Свежие заголовки рынка' },
  { to: '/nfts', label: 'NFT-маркет', Icon: Gem, hint: 'Токены и коллекции' },
  { to: '/favorites', label: 'Избранное', Icon: Star, hint: 'Ваши отслеживаемые' },
  { to: '/calculator', label: 'П/У (P&L)', Icon: Calculator, hint: 'Калькулятор прибыли/убытка' },
  { to: '/Simulator', label: 'Симулятор', Icon: LineChart, hint: 'Тренируй сделки без риска' },
]

export default function Header() {
  const go = useNavigate()
  const username = useAppStore(s => s.username) ?? 'guest'
  const logout = useAppStore(s => s.logout)

  const handleLogout = () => {
    logout()
    message.success('Вы вышли из аккаунта')
    go('/login')
  }

  return (
    <header className="w-full border-b border-black/10 bg-white dark:border-white/10 dark:bg-[#0b0f17]">
      <motion.div
        className="mx-auto w-full max-w-[1440px] px-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', duration: 0.2 }}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className="select-none rounded-md px-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              МонетаРадар
            </NavLink>
            <nav className="hidden items-center gap-2 md:flex">
              {nav.map(({ to, label, Icon, hint }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={hint}
                  className={({ isActive }) =>
                    [
                      'group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                      isActive ? 'text-[var(--primary,theme(colors.blue.600))]' : '',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={[
                          'h-4 w-4',
                          isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                      <span
                        className={[
                          'pointer-events-none absolute inset-x-3 bottom-1 h-[2px] rounded-sm',
                          'bg-current transition-opacity',
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
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
              <div className="flex items-center gap-2 rounded-md border border-black/10 px-2 py-1 dark:border-white/10">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-slate-800 dark:text-slate-300">Привет, {username}</span>
              </div>
              <Popconfirm
                title="Выйти из аккаунта?"
                description="Придётся войти снова :("
                okText="Да, выйти"
                cancelText="Отмена"
                placement="bottomRight"
                onConfirm={handleLogout}
              >
                <Button>Выйти</Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
