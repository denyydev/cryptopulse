import { useMemo, useState } from 'react'
import { Card, Typography, Form, Select, InputNumber, DatePicker, Button, Spin, Empty, Tag, Segmented } from 'antd'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ReferenceLine } from 'recharts'
import axios from '../api/axiosInstance'
import dayjs, { Dayjs } from 'dayjs'
import { useAppStore } from '../store/useAppStore'
import { motion } from 'framer-motion'
import { LineChart as LineChartIcon, Coins, CalendarDays, Sparkles, Info } from 'lucide-react'

type CoinOpt = { label: string; value: string }
const COINS: CoinOpt[] = [
  { label: 'Bitcoin', value: 'bitcoin' },
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Solana', value: 'solana' },
]

type Inputs = { coin: string; amount: number; date: Dayjs | null }
type Point = { t: number; price: number }

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const nfUSD0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function InvestmentSimulatorPage() {
  const mode = useAppStore(s => s.theme)
  const [form] = Form.useForm<Inputs>()
  const [loading, setLoading] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [buyPrice, setBuyPrice] = useState<number | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [rangePreset, setRangePreset] = useState<'30d' | '90d' | '1y' | 'custom'>('90d')

  const axisColor = mode === 'dark' ? '#94a3b8' : '#64748b'
  const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const lineColor = '#3b82f6'
  const cardCls = 'rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0e141f]'

  const run = async () => {
    const v = form.getFieldsValue()
    if (!v.coin || !v.amount || !v.date) return
    setLoading(true)
    try {
      const buyDate = v.date as Dayjs
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

  const initialValues: Inputs = { coin: 'bitcoin', amount: 1000, date: dayjs().subtract(90, 'day') }

  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2 }}
          className={`${cardCls} p-5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
                  Симулятор инвестиций
                </Typography.Title>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Выбирай монету, дату и сумму — посмотрим, что было бы «если». Немного магии, ноль финсовета.
              </p>
            </div>
            <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <Sparkles className="mr-2 inline-block h-4 w-4" />
              {points.length ? `${COINS.find(c => c.value === form.getFieldValue('coin'))?.label ?? ''}` : 'готов к запуску'}
            </Tag>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <Card className={`${cardCls} mb-6 p-4`}>
          <Form
            form={form}
            layout="inline"
            initialValues={initialValues}
            onFinish={run}
            className="flex flex-wrap items-end gap-3"
          >
            <Form.Item
              name="coin"
              label={<span className="inline-flex items-center gap-1"><Coins className="h-4 w-4" />Монета</span>}
              rules={[{ required: true }]}
            >
              <Select options={COINS} style={{ width: 200 }} />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Сумма ($)"
              rules={[{ required: true }]}
              tooltip="Сколько инвестируем в день покупки"
            >
              <InputNumber min={10} step={10} style={{ width: 160 }} />
            </Form.Item>

            <Form.Item
              name="date"
              label={<span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />Дата покупки</span>}
              rules={[{ required: true }]}
            >
              <DatePicker
                disabledDate={d => d.isAfter(dayjs())}
                onChange={() => setRangePreset('custom')}
              />
            </Form.Item>

            <Segmented
              value={rangePreset}
              onChange={v => {
                const val = v as typeof rangePreset
                setRangePreset(val)
                if (val !== 'custom') {
                  const map = { '30d': 30, '90d': 90, '1y': 365 } as const
                  const days = map[val]
                  form.setFieldsValue({ date: dayjs().subtract(days, 'day') })
                }
              }}
              options={[
                { label: '30д', value: '30d' },
                { label: '90д', value: '90d' },
                { label: '1г', value: '1y' },
                { label: 'Своя', value: 'custom' },
              ]}
            />

            <Form.Item>
              <Button type="primary" htmlType="submit">Смоделировать</Button>
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
            <Empty description="Запусти симуляцию, чтобы увидеть результат" />
          </Card>
        )}

        {!loading && r && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className={`${cardCls} p-4`}>
                <div className="text-xs text-slate-600 dark:text-slate-400">Цена покупки</div>
                <div className="text-xl text-slate-900 dark:text-slate-100">{nfUSD.format(buyPrice ?? 0)}</div>
              </Card>
              <Card className={`${cardCls} p-4`}>
                <div className="text-xs text-slate-600 dark:text-slate-400">Текущая цена</div>
                <div className="text-xl text-slate-900 dark:text-slate-100">{nfUSD.format(currentPrice ?? 0)}</div>
              </Card>
              <Card className={`${cardCls} p-4`}>
                <div className="text-xs text-slate-600 dark:text-slate-400">Текущая стоимость</div>
                <div className="text-xl text-slate-900 dark:text-slate-100">{nfUSD.format(r.valueNow)}</div>
              </Card>
              <Card className={`${cardCls} p-4`}>
                <div className="text-xs text-slate-600 dark:text-slate-400">PnL / ROI</div>
                <div className={['text-xl', r.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'].join(' ')}>
                  {`${r.pnl >= 0 ? '+' : ''}${nfUSD.format(Math.abs(r.pnl))} · ${r.roi.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}`}
                </div>
              </Card>
            </div>

            <Card className={`${cardCls} p-4`}>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Info className="h-3.5 w-3.5" />
                <span>График цен с даты покупки до сегодня</span>
              </div>
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
                      tickFormatter={v => nfUSD0.format(v as number)}
                      stroke={axisColor}
                      tickLine={false}
                      axisLine={{ stroke: gridColor }}
                      width={80}
                    />
                    <RTooltip
                      formatter={(v: number) => nfUSD.format(v)}
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
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Если результат не радует — представь, что это был демо-счёт. Го ещё раз?
              </div>
            </Card>
          </>
        )}
      </section>
    </div>
  )
}
