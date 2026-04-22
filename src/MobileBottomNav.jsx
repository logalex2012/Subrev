import { useLocation, useNavigate } from 'react-router-dom';

const NAV = [
  { id: 'feed', label: 'Лента', path: '/feed', icon: '📰' },
  { id: 'communities', label: 'Сообщества', path: '/communities', icon: '🏛' },
  { id: 'messages', label: 'Сообщения', path: '/messages', icon: '💬' },
  { id: 'notifications', label: 'Уведы', path: '/notifications', icon: '🔔' },
  { id: 'profile', label: 'Профиль', path: '/profile', icon: '👤' },
];

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-2xl px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-2">
        {NAV.map(it => {
          const active = pathname === it.path || (it.path !== '/feed' && pathname.startsWith(it.path));
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => navigate(it.path)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-muted hover:bg-surface-secondary hover:text-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="text-base leading-none">{it.icon}</span>
              <span className="leading-none">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

