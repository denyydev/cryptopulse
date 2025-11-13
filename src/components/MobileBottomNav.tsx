import { NavLink } from "react-router-dom"
import { Home, Bitcoin, Newspaper, Gem, Star, Calculator, LineChart } from "lucide-react"

const nav = [
  { to: "/", label: "Главная", Icon: Home },
  { to: "/cryptos", label: "Крипта", Icon: Bitcoin },
  { to: "/news", label: "Новости", Icon: Newspaper },
  { to: "/nfts", label: "NFT", Icon: Gem },
  { to: "/favorites", label: "Избранное", Icon: Star },
  { to: "/calculator", label: "P&L", Icon: Calculator },
  { to: "/Simulator", label: "Симулятор", Icon: LineChart },
]

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0b0f17]/95 md:hidden">
      <div className="grid grid-cols-5">
        {nav.slice(0,5).map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex flex-col items-center justify-center py-2 text-[11px] transition",
                "text-slate-600 dark:text-slate-300",
                isActive ? "text-blue-600 dark:text-blue-400" : ""
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-5 w-5 ${isActive ? "" : "opacity-70"}`} />
                <span className="mt-0.5">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
