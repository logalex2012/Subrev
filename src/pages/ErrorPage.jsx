import { Button, Link } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

const ERRORS = {
  404: {
    code: '404',
    emoji: '🔍',
    title: 'Страница не найдена',
    description: 'Такой страницы не существует или она была перемещена. Проверьте адрес или вернитесь назад.',
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    glow: 'rgba(99,102,241,0.35)',
  },
  403: {
    code: '403',
    emoji: '🚫',
    title: 'Доступ запрещён',
    description: 'У вас нет прав для просмотра этой страницы. Войдите под другой учётной записью или обратитесь к администратору.',
    gradient: 'from-rose-600 via-red-600 to-orange-500',
    glow: 'rgba(230,53,48,0.35)',
  },
  503: {
    code: '503',
    emoji: '🛠️',
    title: 'Сервис недоступен',
    description: 'Сейчас мы проводим технические работы. Это ненадолго — попробуйте зайти чуть позже.',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    glow: 'rgba(245,158,11,0.35)',
  },
};

export function ErrorPage({ status = 404 }) {
  const navigate = useNavigate();
  const { code, emoji, title, description, gradient, glow } =
    ERRORS[status] ?? ERRORS[404];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* bg glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% -5%, ${glow}, transparent 60%)`,
        }}
      />

      {/* card */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        {/* big code */}
        <div className="relative select-none">
          <span
            className={`bg-gradient-to-br ${gradient} bg-clip-text font-display text-[clamp(6rem,22vw,9rem)] font-bold leading-none tracking-tighter text-transparent`}
          >
            {code}
          </span>
          <span className="absolute -right-6 -top-2 text-4xl">{emoji}</span>
        </div>

        {/* logo */}
        <div className="flex items-center gap-2">
          <img src="/icon1ej.png" alt="SubreV" className="size-7 rounded-xl" />
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            SubreV
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            {description}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            fullWidth
            variant="primary"
            onPress={() => navigate(-1)}
          >
            ← Назад
          </Button>
          <Button
            fullWidth
            variant="outline"
            className="border-border"
            onPress={() => navigate('/')}
          >
            На главную
          </Button>
        </div>

        {status === 503 && (
          <p className="text-xs text-muted">
            Вы администратор?{' '}
            <Link href="/admin/login" className="text-xs font-medium">
              Войти в панель
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export function NotFound()    { return <ErrorPage status={404} />; }
export function Forbidden()   { return <ErrorPage status={403} />; }
export function Unavailable() { return <ErrorPage status={503} />; }
