import { Switch } from 'antd'
import { MoonFilled, SunFilled } from '@ant-design/icons'
import { useAppStore } from '../store/useAppStore'

export default function ThemeToggle() {
  const mode = useAppStore(s => s.theme)
  const toggle = useAppStore(s => s.toggleTheme)
  return (
    <div className="flex items-center gap-2">
      {mode === 'dark' ? <MoonFilled className="text-slate-300" /> : <SunFilled className="text-amber-400" />}
      <Switch checked={mode === 'dark'} onChange={toggle} />
    </div>
  )
}
