import AdminLayout from './AdminLayout.jsx';

const STATS = [
  { label: 'Пользователей', value: '1', delta: '+1 сегодня', color: 'from-indigo-500 to-violet-600', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { label: 'Постов', value: '0', delta: 'всего', color: 'from-sky-500 to-cyan-600', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )},
  { label: 'Активных сегодня', value: '1', delta: '100%', color: 'from-emerald-500 to-teal-600', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )},
  { label: 'Жалоб', value: '0', delta: 'ожидают', color: 'from-rose-500 to-pink-600', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )},
];

const ACTIVITY = [
  { time: 'только что', text: 'Администратор вошёл в панель', type: 'info' },
  { time: '5 мин назад', text: 'Система запущена', type: 'success' },
  { time: 'сегодня', text: 'SubreV v0.1.0 активирован', type: 'success' },
];

const typeColor = {
  info: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-7">
        {/* Page title */}
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Дашборд</h1>
          <p className="mt-1 text-sm text-white/40">Обзор состояния сети SubreV</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(s => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-5"
            >
              <div className={`absolute -right-3 -top-3 size-16 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-xl`} />
              <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                {s.icon}
              </div>
              <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-0.5 text-sm text-white/50">{s.label}</p>
              <p className="mt-1 text-xs text-white/30">{s.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Recent activity */}
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <h2 className="mb-4 font-semibold text-white">Последние события</h2>
            <div className="flex flex-col gap-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 size-2 shrink-0 rounded-full ${typeColor[a.type]}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-white/80">{a.text}</p>
                    <p className="text-xs text-white/30">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <h2 className="mb-4 font-semibold text-white">Быстрые действия</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Добавить пользователя', icon: '👤', href: '/admin/users' },
                { label: 'Посмотреть посты', icon: '📝', href: '/admin/posts' },
                { label: 'Модерация', icon: '🛡️', href: '/admin/moderation' },
                { label: 'Аналитика', icon: '📊', href: '/admin/analytics' },
              ].map(a => (
                <a
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/60 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span>{a.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
          <h2 className="mb-4 font-semibold text-white">Система</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {[
              ['Версия', 'v0.1.0'],
              ['Среда', 'Development'],
              ['Школа', '№1409'],
              ['Фреймворк', 'React + Vite'],
              ['UI Kit', 'HeroUI v3'],
              ['Режим', 'SPA / Client-side'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-white/30">{k}</p>
                <p className="mt-0.5 text-sm font-medium text-white/80">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
