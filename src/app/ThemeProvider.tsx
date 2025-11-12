import { PropsWithChildren, useEffect, useMemo } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { useAppStore } from '../store/useAppStore'

export default function ThemeProvider({ children }: PropsWithChildren) {
  const mode = useAppStore(s => s.theme)

  const algorithms = useMemo(
    () => (mode === 'dark' ? [antdTheme.darkAlgorithm] : [antdTheme.defaultAlgorithm]),
    [mode]
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.classList.toggle('light', mode !== 'dark')
  }, [mode])

  const pageBg =
    mode === 'dark'
      ? `
        radial-gradient(1200px 600px at 10% -10%, rgba(14,165,233,0.08), rgba(14,165,233,0) 60%),
        radial-gradient(1000px 500px at 110% -10%, rgba(168,85,247,0.06), rgba(168,85,247,0) 60%),
        linear-gradient(180deg, #0b0f17 0%, #0a0e16 40%, #0a0d14 100%)
      `
      : `
        radial-gradient(1200px 600px at -10% -10%, rgba(59,130,246,0.10), rgba(59,130,246,0) 60%),
        radial-gradient(1000px 500px at 110% -10%, rgba(236,72,153,0.08), rgba(236,72,153,0) 60%),
        linear-gradient(180deg, #f8fafc 0%, #f5f7fb 60%, #f3f6fb 100%)
      `

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithms,
        token: {
          colorPrimary: mode === 'dark' ? '#6aa1ff' : '#3b82f6',
          colorBgBase: mode === 'dark' ? '#0e141f' : '#ffffff',
          colorBgLayout: 'transparent',
          colorTextBase: mode === 'dark' ? '#e6eef8' : '#0b0f17',
          colorBorder: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          borderRadius: 10,
          fontFamily: 'Rubik, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial',
        },
        components: {
          Card: {
            colorBgContainer: mode === 'dark' ? '#0f1623' : '#ffffff',
            boxShadowTertiary: mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.35)' : '0 6px 20px rgba(0,0,0,0.08)',
            borderRadiusLG: 12,
          },
          Button: {
            controlHeight: 40,
            borderRadius: 10,
          },
          Input: {
            borderRadius: 10,
          },
          Tag: {
            borderRadiusSM: 8,
          },
        },
      }}
    >
      <div style={{ minHeight: '100vh', background: pageBg.trim(), transition: 'background 300ms ease' }}>
        {children}
      </div>
    </ConfigProvider>
  )
}
