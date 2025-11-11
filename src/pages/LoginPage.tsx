import { useState } from 'react';
import { Button, Form, Input, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginFake } from '../hooks/useAuth';

export default function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = (v: any) => {
    setLoading(true);
    const ok = loginFake(v.username, v.password);
    setLoading(false);
    if (ok) nav('/');
    else alert('Неверный логин/пароль (подсказка: demo/demo)');
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-sm bg-white/5 backdrop-blur">
        <Typography.Title level={3} style={{color:'#fff', marginBottom:16}}>
          CryptoPulse — Login
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Логин" rules={[{required:true}]}>
            <Input placeholder="demo" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{required:true}]}>
            <Input.Password placeholder="demo" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form>
      </Card>
    </div>
  );
}
