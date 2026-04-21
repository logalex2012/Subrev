import { useState } from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { adminLogout, isAdminAuthed } from './adminAuth.js';

const NAV = [
  {
    id: 'dashboard',
    label: 'Дашборд',
    path: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Пользователи',
    path: '/admin/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'posts',
    label: 'Посты',
    path: '/admin/posts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    id: 'moderation',
    label: 'Модерация',
    path: '/admin/moderation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    path: '/admin/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'changelog',
    label: 'Обновления',
    path: '/admin/changelog',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'roles',
    label: 'Роли',
    path: '/admin/roles',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
        <path d="M16 11l2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 'logs',
    label: 'Логи',
    path: '/admin/logs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Настройки',
    path: '/admin/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2"/>
      </svg>
    ),
  },
];

function SidebarLink({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/admin'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          isActive
            ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
            : 'text-white/50 hover:bg-white/8 hover:text-white/90'
        } ${collapsed ? 'justify-center' : ''}`
      }
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;

  function logout() {
    adminLogout();
    navigate('/admin/login');
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex items-center gap-3 border-b border-white/8 px-4 py-4 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-white">SubreV Admin</p>
            <p className="truncate text-[10px] text-white/30">Школа №1409</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {NAV.map(item => (
            <SidebarLink
              key={item.id}
              item={item}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </div>
      </nav>

      {/* Bottom: collapse toggle + logout */}
      <div className="border-t border-white/8 px-3 py-3">
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 ${collapsed ? 'justify-center' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && 'Выйти'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0d0d14] text-white">
      {/* Desktop sidebar */}
      <aside
        className={`hidden flex-shrink-0 flex-col border-r border-white/8 bg-[#12121e] transition-all duration-300 lg:flex ${
          collapsed ? 'w-[68px]' : 'w-56'
        }`}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute bottom-[60px] left-0 hidden translate-x-full rounded-r-lg border border-l-0 border-white/8 bg-[#12121e] p-1.5 text-white/30 hover:text-white/70 lg:block"
          aria-label={collapsed ? 'Развернуть' : 'Свернуть'}
          style={{ left: collapsed ? '68px' : '224px', transition: 'left 0.3s' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {collapsed
              ? <polyline points="9 18 15 12 9 6" />
              : <polyline points="15 18 9 12 15 6" />}
          </svg>
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 flex-col border-r border-white/8 bg-[#12121e] transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex`}
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-white/8 bg-[#12121e]/60 px-5 backdrop-blur-md">
          <button
            className="text-white/40 hover:text-white/80 lg:hidden"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Меню"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="flex-1" />
          <span className="text-xs text-white/30">admin · Школа №1409</span>
          <a
            href="/feed"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
          >
            ← На сайт
          </a>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
