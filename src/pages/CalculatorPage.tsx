import { useMemo, useState } from 'react'
import { Card, Typography, Form, InputNumber, Divider } from 'antd'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { useAppStore } from '../store/useAppStore'

type Inputs = {
  buyPrice: number
  sellPrice?: number
  amount: number
  feePct: number
}

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
  const cardCls = 'rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0e141f]'

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <Typography.Title level={2} className="!m-0 mb-1 text-slate-900 dark:!text-slate-100">
        PnL Calculator
      </Typography.Title>
      <Typography.Paragraph className="mb-6 max-w-2xl text-slate-700 dark:text-slate-300">
        Быстрая оценка прибыли/убытка с учётом комиссии, ROI и точки безубыточности.
      </Typography.Paragraph>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className={`${cardCls} p-4 lg:col-span-1`}>
          <Form form={form} layout="vertical" initialValues={vals} onValuesChange={(_, all) => setVals(all as Inputs)}>
            <Form.Item name="buyPrice" label="Buy price" rules={[{ required: true }]}>
              <InputNumber min={0} step={1} className="w-full" />
            </Form.Item>
            <Form.Item name="sellPrice" label="Sell price">
              <InputNumber min={0} step={1} className="w-full" />
            </Form.Item>
            <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.0001} className="w-full" />
            </Form.Item>
            <Form.Item name="feePct" label="Fee (%)" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>
          </Form>
        </Card>

        <Card className={`${cardCls} p-4 lg:col-span-2`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Invested</div>
              <div className="text-xl text-slate-900 dark:text-slate-100">${r.totalCost.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Net Proceeds</div>
              <div className="text-xl text-slate-900 dark:text-slate-100">${r.net.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400">PnL</div>
              <div className={['text-xl', r.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'].join(' ')}>
                {r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}
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
              <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Breakeven price</div>
              <div className="text-lg text-slate-900 dark:text-slate-100">${r.breakeven.toFixed(2)}</div>
            </div>
            <div>
              <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Tip</div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                With current fees, you need ≥ ${r.breakeven.toFixed(0)} to break even.
              </div>
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 6, bottom: 0, left: 6 }}>
                <XAxis dataKey="price" tickFormatter={v => `$${Math.round(v as number)}`} stroke={axisColor} tickLine={false} axisLine={{ stroke: gridColor }} minTickGap={28} />
                <YAxis tickFormatter={v => `${(v as number) >= 0 ? '+' : ''}$${Math.round(v as number)}`} stroke={axisColor} tickLine={false} axisLine={{ stroke: gridColor }} width={72} />
                <Tooltip
                  formatter={(v: number) => `${v >= 0 ? '+' : ''}$${v.toFixed(2)}`}
                  labelFormatter={v => `Price: $${Math.round(v as number)}`}
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
        </Card>
      </div>
    </div>
  )
}
