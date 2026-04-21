import { Button, TextField, Input, Description, Label } from '@heroui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from './adminAuth.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e?.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (adminLogin(password)) {
        navigate('/admin');
      } else {
        setError('Неверный пароль');
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d14] px-4">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(99,102,241,0.25),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_8px_32px_rgba(99,102,241,0.5)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold tracking-tight text-white">SubreV Admin</p>
            <p className="mt-0.5 text-sm text-white/40">Панель управления · Школа №1409</p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/5 p-7 backdrop-blur-sm"
        >
          <div>
            <p className="text-lg font-semibold text-white">Вход в панель</p>
            <p className="mt-0.5 text-sm text-white/40">Только для администраторов</p>
          </div>

          <TextField isInvalid={!!error} className="w-full">
            <Label className="text-sm text-white/70">Пароль</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <Description className="mt-1.5 text-xs text-red-400">{error}</Description>
            )}
          </TextField>

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-indigo-600 font-semibold text-white hover:bg-indigo-500"
            isLoading={loading}
            isDisabled={!password || loading}
            onPress={handleSubmit}
          >
            Войти
          </Button>

          <button
            type="button"
            className="text-center text-xs text-white/25 hover:text-white/50 transition-colors"
            onClick={() => navigate('/')}
          >
            ← Вернуться на сайт
          </button>
        </form>
      </div>
    </div>
  );
}
