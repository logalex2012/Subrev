import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';

const DEMO = [
  { id: 1, author: 'Алексей Логинов', text: 'Тестовый пост в SubreV!', tag: 'Новость', time: '21.04.2026', likes: 0, comments: 0, status: 'ok' },
];

const STATUS_LABEL = { ok: 'Одобрен', flagged: 'Жалоба', hidden: 'Скрыт' };
const STATUS_COLOR = {
  ok: 'bg-emerald-500/15 text-emerald-400',
  flagged: 'bg-amber-500/15 text-amber-400',
  hidden: 'bg-white/8 text-white/40',
};
const TAG_COLOR = {
  Новость: 'bg-indigo-500/15 text-indigo-400',
  Объявление: 'bg-amber-500/15 text-amber-400',
  Вопрос: 'bg-emerald-500/15 text-emerald-400',
};

export default function Posts() {
  const [posts, setPosts] = useState(DEMO);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = posts.filter(p => {
    const matchSearch = p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  function setStatus(id, status) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  function deletePost(id) {
    if (!confirm('Удалить пост?')) return;
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Посты</h1>
          <p className="mt-1 text-sm text-white/40">{posts.length} всего · {posts.filter(p => p.status === 'flagged').length} жалоб</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по автору или тексту…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {['all', 'ok', 'flagged', 'hidden'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === f ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {{ all: 'Все', ok: 'Одобрены', flagged: 'Жалобы', hidden: 'Скрытые' }[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Автор</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Текст</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Тег</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Статус</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">❤️</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">💬</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Дата</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-white/30">Постов нет</td>
                  </tr>
                )}
                {filtered.map(p => (
                  <tr key={p.id} className="group transition-colors hover:bg-white/5">
                    <td className="px-5 py-3.5 font-medium text-white/80">{p.author}</td>
                    <td className="max-w-[200px] truncate px-5 py-3.5 text-white/50">{p.text}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_COLOR[p.tag] ?? 'bg-white/8 text-white/40'}`}>
                        {p.tag}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/40">{p.likes}</td>
                    <td className="px-5 py-3.5 text-white/40">{p.comments}</td>
                    <td className="px-5 py-3.5 text-white/40">{p.time}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {p.status !== 'ok' && (
                          <button onClick={() => setStatus(p.id, 'ok')} className="rounded-lg p-1.5 text-white/40 hover:bg-emerald-500/10 hover:text-emerald-400" title="Одобрить">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        )}
                        {p.status !== 'hidden' && (
                          <button onClick={() => setStatus(p.id, 'hidden')} className="rounded-lg p-1.5 text-white/40 hover:bg-amber-500/10 hover:text-amber-400" title="Скрыть">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          </button>
                        )}
                        <button onClick={() => deletePost(p.id)} className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400" title="Удалить">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
