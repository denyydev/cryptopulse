import { useState } from 'react'
import { Button, Form, Input, Card, Typography, Tag, Divider, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { loginFake } from '../hooks/useAuth'

export default function LoginPage() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = (v: any) => {
    setLoading(true)
    const ok = loginFake(v.username, v.password)
    setLoading(false)
    if (ok) {
      message.success('Добро пожаловать!')
      nav('/')
    } else {
      message.error('Неверный логин/пароль. Подсказка ниже 😉')
    }
  }



  const cardCls = 'rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0e141f]'

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-100 dark:from-[#0b0f17] dark:to-[#0e141f]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] place-items-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="w-full max-w-sm"
        >
          <Card className={cardCls}>
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              <Typography.Title level={3} className="!m-0 text-slate-900 dark:!text-slate-100">
                МонетаРадар
              </Typography.Title>
            </div>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                Тестовый вход для демо — никаких ключей от кошелька, только безопасный режим 🙂
            </p>

            <div className="mb-4 flex items-center justify-between">
              <Tag className="m-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                <Sparkles className="mr-1 inline-block h-4 w-4" />
                Логин: <b className="mx-1">demo</b> • Пароль: <b className="ml-1">demo</b>
              </Tag>

            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ username: '', password: '' }}>
              <Form.Item name="username" label="Логин" rules={[{ required: true, message: 'Введите логин' }]}>
                <Input placeholder="demo" autoFocus />
              </Form.Item>
              <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
                <Input.Password placeholder="demo" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Войти
              </Button>
            </Form>

            <Divider className="my-4 border-black/10 dark:border-white/10" />

            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              Забыли пароль? Мы тоже — это нормально. Попробуйте <span className="font-medium">demo / demo</span> 🙂
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
