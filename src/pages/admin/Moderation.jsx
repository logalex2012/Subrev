import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';

const REPORTS = [];

const STATUS_LABEL = { pending: 'Ожидает', resolved: 'Решено', dismissed: 'Отклонено' };
const STATUS_COLOR = {
  pending: 'bg-amber-500/15 text-amber-400',
  resolved: 'bg-emerald-500/15 text-emerald-400',
  dismissed: 'bg-white/8 text-white/40',
};

export default function Moderation() {
  const [reports, setReports] = useState(REPORTS);

  function resolve(id, status) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  const pending = reports.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Модерация</h1>
          <p className="mt-1 text-sm text-white/40">
            {pending > 0 ? `${pending} жалоб ожидают рассмотрения` : 'Нет новых жалоб'}
          </p>
        </div>

        {pending === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/5 py-16 text-center">
            <span className="text-5xl">🛡️</span>
            <p className="font-semibold text-white/70">Всё чисто</p>
            <p className="text-sm text-white/30">Новых жалоб нет</p>
          </div>
        )}

        {reports.length > 0 && (
          <div className="flex flex-col gap-3">
            {reports.map(r => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 p-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                    <span className="text-xs text-white/30">{r.type === 'post' ? 'Пост' : 'Пользователь'} · {r.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white/80">Жалоба на: «{r.target}»</p>
                  <p className="mt-0.5 text-sm text-white/40">Причина: {r.reason}</p>
                  <p className="mt-0.5 text-xs text-white/25">Репортер: {r.reporter}</p>
                </div>
                {r.status === 'pending' && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => resolve(r.id, 'resolved')}
                      className="rounded-xl bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-600/30"
                    >
                      Решить
                    </button>
                    <button
                      onClick={() => resolve(r.id, 'dismissed')}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
