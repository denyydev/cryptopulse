import { useMemo, useState } from 'react'
import { Card, Typography, Form, InputNumber, Divider, Tag, Tooltip, Segmented } from 'antd'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ReferenceLine } from 'recharts'
import { useAppStore } from '../store/useAppStore'
import { motion } from 'framer-motion'
import { Calculator, CircleDollarSign, Percent, TrendingUp, Info, Sparkles } from 'lucide-react'

type Inputs = {
  buyPrice: number
  sellPrice?: number
  amount: number
  feePct: number
}

const nfUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const nfUSD0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function calcPnL({ buyPrice, sellPrice, amount, feePct }: Inputs) {
  const fee = feePct / 100
  const cost = buyPrice * amount
  const buyFee = cost * fee
  const totalCost = cost + buyFee
  const sp = sellPrice ?? buyPrice
  const gross = sp * amount
  const sellFee = gross * fee
  const net = gross - sellFee
  const pnl = net - totalCost
  const roi = totalCost === 0 ? 0 : pnl / totalCost
  const breakeven = (buyPrice * (1 + fee)) / (1 - fee)
  return { pnl, roi, totalCost, net, breakeven }
}

export default function CalculatorPage() {
  const mode = useAppStore(s => s.theme)
  const [form] = Form.useForm<Inputs>()
  const [vals, setVals] = useState<Inputs>({ buyPrice: 30000, sellPrice: 32000, amount: 0.1, feePct: 0.1 })
  const [feePreset, setFeePreset] = useState<'custom' | 'cex' | 'dex'>('custom')

  const r = useMemo(() => calcPnL(vals), [vals])

  const data = useMemo(() => {
    const base = vals.sellPrice ?? vals.buyPrice
    const steps = [-10, -5, -2, 0, 2, 5, 10]
    return steps.map(p => {
      const sp = base * (1 + p / 100)
      const { pnl } = calcPnL({ ...vals, sellPrice: sp })
      return { price: sp, pnl }
    })
  }, [vals])

  const axisColor = mode === 'dark' ? '#94a3b8' : '#64748b'
  const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const lineColor = r.pnl >= 0 ? '#059669' : '#dc2626'
  const cardCls = 'rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0e141f]'

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
                <Calculator className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                <Typography.Title level={2} className="!m-0 text-slate-900 dark:!text-slate-100">
                  Калькулятор PnL
                </Typography.Title>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Считаем прибыль/убыток с комиссиями, ROI и точкой безубыточности. Не финсовет, а финс‐друг.
              </p>
            </div>
            <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <Sparkles className="mr-2 inline-block h-4 w-4" />
              {r.pnl >= 0 ? 'В плюсе' : 'В минусе'}
            </Tag>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={`${cardCls} p-4 lg:col-span-1`}>
            <Form
              form={form}
              layout="vertical"
              initialValues={vals}
              onValuesChange={(_, all) => setVals(all as Inputs)}
            >
              <Form.Item
                name="buyPrice"
                label={<span className="inline-flex items-center gap-2"><CircleDollarSign className="h-4 w-4" />Цена покупки</span>}
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={1}
                  className="w-full"
                  formatter={v => (v === undefined ? '' : nfUSD.format(Number(v)))}
                  parser={v => (v ? v.replace(/[^\d.]/g, '') : '') as unknown as number}
                />
              </Form.Item>

              <Form.Item
                name="sellPrice"
                label={<span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" />Цена продажи</span>}
              >
                <InputNumber
                  min={0}
                  step={1}
                  className="w-full"
                  placeholder="Опционально"
                  formatter={v => (v === undefined ? '' : nfUSD.format(Number(v)))}
                  parser={v => (v ? v.replace(/[^\d.]/g, '') : '') as unknown as number}
                />
              </Form.Item>

              <Form.Item
                name="amount"
                label="Количество"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={0.0001} className="w-full" />
              </Form.Item>

              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs text-slate-600 dark:text-slate-400">Пресет комиссии</label>
                <Segmented
                  size="small"
                  value={feePreset}
                  onChange={v => {
                    setFeePreset(v as any)
                    if (v === 'cex') form.setFieldsValue({ feePct: 0.1 })
                    if (v === 'dex') form.setFieldsValue({ feePct: 0.3 })
                  }}
                  options={[
                    { label: 'Своя', value: 'custom' },
                    { label: 'CEX ~0.1%', value: 'cex' },
                    { label: 'DEX ~0.3%', value: 'dex' },
                  ]}
                />
              </div>

              <Form.Item
                name="feePct"
                label={<span className="inline-flex items-center gap-2"><Percent className="h-4 w-4" />Комиссия (%)</span>}
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  className="w-full"
                  formatter={v => (v === undefined ? '' : `${v}%`)}
                  parser={v => (v ? v.replace(/[^\d.]/g, '') : '') as unknown as number}
                />
              </Form.Item>

              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                <Tooltip title="Комиссия удерживается при покупке и продаже">
                  <span className="inline-flex items-center gap-1"><Info className="h-3.5 w-3.5" />учитываем обе комиссии</span>
                </Tooltip>
              </div>
            </Form>
          </Card>

          <Card className={`${cardCls} p-4 lg:col-span-2`}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Инвестировано</div>
                <div className="text-xl text-slate-900 dark:text-slate-100">{nfUSD.format(r.totalCost)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Выручка (net)</div>
                <div className="text-xl text-slate-900 dark:text-slate-100">{nfUSD.format(r.net)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">PnL</div>
                <div className={['text-xl', r.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'].join(' ')}>
                  {`${r.pnl >= 0 ? '+' : ''}${nfUSD.format(Math.abs(r.pnl))}`}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">ROI</div>
                <div className={['text-xl', r.roi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'].join(' ')}>
                  {r.roi.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <Divider className="border-black/10 dark:border-white/10" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Точка безубыточности</div>
                <div className="text-lg text-slate-900 dark:text-slate-100">{nfUSD.format(r.breakeven)}</div>
              </div>
              <div>
                <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Подсказка</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  При текущей комиссии вам нужно ≥ {nfUSD0.format(r.breakeven)}. Дальше — только звёзды и трейлинг-стопы.
                </div>
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 6, bottom: 0, left: 6 }}>
                  <XAxis
                    dataKey="price"
                    tickFormatter={v => nfUSD0.format(v as number)}
                    stroke={axisColor}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    minTickGap={28}
                  />
                  <YAxis
                    tickFormatter={v => `${(v as number) >= 0 ? '+' : ''}${nfUSD0.format(Math.abs(v as number))}`}
                    stroke={axisColor}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    width={86}
                  />
                  <RTooltip
                    formatter={(v: number) => `${v >= 0 ? '+' : ''}${nfUSD.format(Math.abs(v))}`}
                    labelFormatter={v => `Цена: ${nfUSD0.format(v as number)}`}
                    contentStyle={{
                      background: mode === 'dark' ? 'rgba(15,22,35,0.98)' : 'rgba(255,255,255,0.98)',
                      border: `1px solid ${gridColor}`,
                      borderRadius: 8,
                    }}
                  />
                  <ReferenceLine y={0} stroke={gridColor} />
                  <Line type="monotone" dataKey="pnl" stroke={lineColor} dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Сегодня без паники: «минус — это временно, опыт — навсегда».
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
