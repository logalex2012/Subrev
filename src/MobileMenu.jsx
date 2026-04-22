import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ITEMS = [
  { id: 'feed', label: 'Лента', path: '/feed', icon: '📰' },
  { id: 'communities', label: 'Сообщества', path: '/communities', icon: '🏛' },
  { id: 'messages', label: 'Сообщения', path: '/messages', icon: '💬' },
  { id: 'notifications', label: 'Уведомления', path: '/notifications', icon: '🔔' },
  { id: 'profile', label: 'Профиль', path: '/profile', icon: '👤' },
  { id: 'settings', label: 'Настройки', path: '/settings', icon: '⚙️' },
];

export function MobileMenuButton({ className = '' }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className={`inline-flex size-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-secondary hover:text-foreground ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 w-[78vw] max-w-xs border-r border-border bg-background shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-4 py-4">
              <img src="/icon1ej.png" alt="SubreV" className="size-9 rounded-xl" />
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-foreground">SubreV</p>
                <p className="truncate text-[11px] text-muted">Школа №1409</p>
              </div>
              <button
                type="button"
                className="ml-auto inline-flex size-9 items-center justify-center rounded-xl text-muted hover:bg-surface-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-3 py-3">
              {ITEMS.map(it => {
                const active = pathname === it.path;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => navigate(it.path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'text-foreground/75 hover:bg-surface-secondary hover:text-foreground'
                    }`}
                  >
                    <span className="text-base">{it.icon}</span>
                    <span className="truncate">{it.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-border px-3 py-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
              >
                <span className="text-base">🚪</span>
                <span>Выйти</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
              >
                <span className="text-base">🛡️</span>
                <span>Админ-панель</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

