import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';

const TYPES = { auth: 'Вход', user: 'Пользователь', post: 'Пост', settings: 'Настройки', moderation: 'Модерация' };
const TYPE_COLOR = {
  auth: 'bg-sky-500/15 text-sky-400',
  user: 'bg-indigo-500/15 text-indigo-400',
  post: 'bg-emerald-500/15 text-emerald-400',
  settings: 'bg-amber-500/15 text-amber-400',
  moderation: 'bg-red-500/15 text-red-400',
};

const INITIAL_LOGS = [];

export default function Logs() {
  const [logs] = useState(INITIAL_LOGS);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.actor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Логи действий</h1>
          <p className="mt-1 text-sm text-white/40">{logs.length} записей</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по действию…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button onClick={() => setTypeFilter('all')} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${typeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white/70'}`}>Все</button>
            {Object.entries(TYPES).map(([k, v]) => (
              <button key={k} onClick={() => setTypeFilter(k)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${typeFilter === k ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white/70'}`}>{v}</button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/5">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Тип</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Действие</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Кто</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-white/30">Нет записей</td></tr>
              )}
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLOR[log.type]}`}>{TYPES[log.type]}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/80">{log.action}</td>
                  <td className="px-5 py-3.5 text-white/50">{log.actor}</td>
                  <td className="px-5 py-3.5 text-white/30 whitespace-nowrap">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
