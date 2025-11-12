import { useMemo, useState } from 'react'
import { Card, Typography, Form, Select, InputNumber, DatePicker, Button, Spin, Empty } from 'antd'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import axios from '../api/axiosInstance'
import dayjs, { Dayjs } from 'dayjs'
import { useAppStore } from '../store/useAppStore'

type CoinOpt = { label: string; value: string }
const COINS: CoinOpt[] = [
  { label: 'Bitcoin', value: 'bitcoin' },
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Solana', value: 'solana' },
]

type Inputs = { coin: string; amount: number; date: Dayjs | null }
type Point = { t: number; price: number }

export default function InvestmentSimulatorPage() {
  const mode = useAppStore(s => s.theme)
  const [form] = Form.useForm<Inputs>()
  const [loading, setLoading] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [buyPrice, setBuyPrice] = useState<number | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [amount, setAmount] = useState<number>(0)

  const run = async () => {
    const v = form.getFieldsValue()
    if (!v.coin || !v.amount || !v.date) return
    setLoading(true)
    try {
      const buyDate = v.date
      const days = Math.max(1, Math.ceil(dayjs().diff(buyDate, 'day')))
      const dateStr = buyDate.format('DD-MM-YYYY')
      const [hist, cur, chart] = await Promise.all([
        axios.get(`/coins/${v.coin}/history`, { params: { date: dateStr } }),
        axios.get('/simple/price', { params: { ids: v.coin, vs_currencies: 'usd' } }),
        axios.get(`/coins/${v.coin}/market_chart`, { params: { vs_currency: 'usd', days } }),
      ])
      const bp = hist.data?.market_data?.current_price?.usd ?? null
      const cp = cur.data?.[v.coin]?.usd ?? null
      setBuyPrice(bp)
      setCurrentPrice(cp)
      setAmount(v.amount)
      const series: Point[] = (chart.data?.prices ?? []).map((p: number[]) => ({ t: p[0], price: p[1] }))
      setPoints(series)
    } finally {
      setLoading(false)
    }
  }

  const r = useMemo(() => {
    if (!buyPrice || !currentPrice || !amount) return null
    const units = amount / buyPrice
    const valueNow = units * currentPrice
    const pnl = valueNow - amount
    const roi = pnl / amount
    return { units, valueNow, pnl, roi }
  }, [buyPrice, currentPrice, amount])

  const axisColor = mode === 'dark' ? '#94a3b8' : '#64748b'
  const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const lineColor = '#3b82f6'
  const cardCls = 'rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0e141f]'

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <Typography.Title level={2} className="!m-0 mb-1 text-slate-900 dark:!text-slate-100">
        Investment Simulator
      </Typography.Title>
      <Typography.Paragraph className="mb-6 max-w-2xl text-slate-700 dark:text-slate-300">
        Смоделируй покупку на выбранную дату и узнай текущую стоимость позиции, PnL и ROI.
      </Typography.Paragraph>

      <Card className={`${cardCls} mb-6 p-4`}>
        <Form
          form={form}
          layout="inline"
          initialValues={{ coin: 'bitcoin', amount: 1000, date: dayjs().subtract(90, 'day') }}
          onFinish={run}
          className="flex flex-wrap gap-3"
        >
          <Form.Item name="coin" label="Coin" rules={[{ required: true }]}>
            <Select options={COINS} style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="amount" label="Amount ($)" rules={[{ required: true }]}>
            <InputNumber min={10} step={10} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="date" label="Buy date" rules={[{ required: true }]}>
            <DatePicker disabledDate={d => d.isAfter(dayjs())} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Simulate</Button>
          </Form.Item>
        </Form>
      </Card>

      {loading && (
        <div className="grid place-items-center py-16">
          <Spin size="large" />
        </div>
      )}

      {!loading && !r && points.length === 0 && (
        <Card className={`${cardCls} p-8`}>
          <Empty description="Run a simulation to see results." />
        </Card>
      )}

      {!loading && r && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className={`${cardCls} p-4`}>
              <div className="text-xs text-slate-600 dark:text-slate-400">Buy price</div>
              <div className="text-xl text-slate-900 dark:text-slate-100">${(buyPrice ?? 0).toFixed(2)}</div>
            </Card>
            <Card className={`${cardCls} p-4`}>
              <div className="text-xs text-slate-600 dark:text-slate-400">Current price</div>
              <div className="text-xl text-slate-900 dark:text-slate-100">${(currentPrice ?? 0).toFixed(2)}</div>
            </Card>
            <Card className={`${cardCls} p-4`}>
              <div className="text-xs text-slate-600 dark:text-slate-400">Value now</div>
              <div className="text-xl text-slate-900 dark:text-slate-100">${r.valueNow.toFixed(2)}</div>
            </Card>
            <Card className={`${cardCls} p-4`}>
              <div className="text-xs text-slate-600 dark:text-slate-400">PnL / ROI</div>
              <div className={['text-xl', r.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'].join(' ')}>
                {r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)} · {r.roi.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}
              </div>
            </Card>
          </div>

          <Card className={`${cardCls} p-4`}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={points} margin={{ top: 4, right: 6, bottom: 0, left: 6 }}>
                  <XAxis
                    dataKey="t"
                    tickFormatter={t => dayjs(t as number).format('DD MMM')}
                    stroke={axisColor}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    minTickGap={28}
                  />
                  <YAxis
                    tickFormatter={v => `$${Math.round(v as number)}`}
                    stroke={axisColor}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    width={72}
                  />
                  <Tooltip
                    formatter={(v: number) => `$${(v as number).toFixed(2)}`}
                    labelFormatter={t => dayjs(t as number).format('DD MMM YYYY')}
                    contentStyle={{
                      background: mode === 'dark' ? 'rgba(15,22,35,0.98)' : 'rgba(255,255,255,0.98)',
                      border: `1px solid ${gridColor}`,
                      borderRadius: 8,
                    }}
                  />
                  <ReferenceLine y={0} stroke={gridColor} />
                  <Line type="monotone" dataKey="price" stroke={lineColor} dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
