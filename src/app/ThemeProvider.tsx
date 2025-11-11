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
    if (mode === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [mode])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: mode === 'dark' ? '#7c3aed' : '#7c3aed',
          colorBgBase: mode === 'dark' ? '#0b0f17' : '#ffffff',
          colorTextBase: mode === 'dark' ? '#e6eef8' : '#0b0f17',
          borderRadius: 14,
          colorBorder: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        },
        algorithm: algorithms,
        components: {
          Card: {
            colorBgContainer: mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#ffffff',
            boxShadowTertiary: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 30px rgba(0,0,0,0.08)',
            borderRadiusLG: 16,
          },
          Button: {
            controlHeight: 40,
            borderRadius: 12,
          },
          Input: {
            borderRadius: 12,
          },
          Tag: {
            borderRadiusSM: 10,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
