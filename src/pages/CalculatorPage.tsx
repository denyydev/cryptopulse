import { useMemo, useState } from 'react'
import { Card, Typography, Form, InputNumber, Divider } from 'antd'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

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

  return (
    <div className="container py-8">
      <Typography.Title level={2} className="!text-white mb-1">
        PnL Calculator
      </Typography.Title>
      <Typography.Paragraph className="max-w-2xl text-slate-300">
        Этот инструмент помогает быстро оценить прибыль или убыток по сделке с криптовалютой.
        Введите цену покупки, продажи, объём и торговую комиссию — калькулятор покажет PnL,
        ROI и точку безубыточности, а также чувствительность прибыли к изменению цены.
      </Typography.Paragraph>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="panel p-4 lg:col-span-1">
          <Form
            form={form}
            layout="vertical"
            initialValues={vals}
            onValuesChange={(_, all) => setVals(all as Inputs)}
          >
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

        <Card className="panel p-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-slate-400 text-xs">Invested</div>
              <div className="text-xl text-white">${r.totalCost.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Net Proceeds</div>
              <div className="text-xl text-white">${r.net.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">PnL</div>
              <div className={["text-xl", r.pnl >= 0 ? "text-emerald-400" : "text-rose-400"].join(' ')}>
                {r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">ROI</div>
              <div className={["text-xl", r.roi >= 0 ? "text-emerald-400" : "text-rose-400"].join(' ')}>
                {(r.roi).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <Divider className="border-white/10" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-slate-400 text-xs mb-1">Breakeven price</div>
              <div className="text-lg text-white">${r.breakeven.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Tip</div>
              <div className="text-sm text-slate-300">With current fees, you need ≥ ${r.breakeven.toFixed(0)} to break even.</div>
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="price" tickFormatter={(v) => `$${Math.round(v)}`} stroke="#64748b" />
                <YAxis tickFormatter={(v) => `${v >= 0 ? '+' : ''}$${Math.round(v)}`} stroke="#64748b" />
                <Tooltip
                  formatter={(v: number) => `${v >= 0 ? '+' : ''}$${(v as number).toFixed(2)}`}
                  labelFormatter={(v) => `Price: $${Math.round(v as number)}`}
                  contentStyle={{ backgroundColor: '#0b0f17', border: '1px solid #334155', color: '#fff' }}
                />
                <Line type="monotone" dataKey="pnl" stroke="#7c3aed" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
