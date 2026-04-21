import AdminLayout from './AdminLayout.jsx';

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр'];
const REGISTRATIONS = [0, 0, 0, 1];
const POSTS_DATA = [0, 0, 0, 0];

function BarChart({ data, color, label }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-white/50">{label}</p>
      <div className="flex items-end gap-2" style={{ height: 80 }}>
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-white/30">{v}</span>
            <div
              className={`w-full rounded-t-md ${color} transition-all`}
              style={{ height: `${Math.max((v / max) * 60, v > 0 ? 4 : 2)}px`, minHeight: '2px' }}
            />
            <span className="text-[10px] text-white/25">{MONTHS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TOP_USERS = [
  { name: 'Алексей Логинов', posts: 0, likes: 0 },
];

export default function Analytics() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Аналитика</h1>
          <p className="mt-1 text-sm text-white/40">Статистика за 2026 год</p>
        </div>

        {/* Charts */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <BarChart data={REGISTRATIONS} color="bg-indigo-500" label="Регистрации по месяцам" />
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <BarChart data={POSTS_DATA} color="bg-sky-500" label="Посты по месяцам" />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Всего пользователей', value: 1, sub: 'с апреля 2026' },
            { label: 'Всего постов', value: 0, sub: 'опубликовано' },
            { label: 'Лайков', value: 0, sub: 'поставлено' },
            { label: 'Комментариев', value: 0, sub: 'написано' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-white/5 p-5">
              <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
              <p className="mt-0.5 text-xs text-white/25">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Top users */}
        <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
          <h2 className="mb-4 font-semibold text-white">Топ пользователей</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">#</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Пользователь</th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-white/30">Постов</th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-white/30">Лайков</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TOP_USERS.map((u, i) => (
                  <tr key={u.name}>
                    <td className="py-3 pr-4 text-white/30">#{i + 1}</td>
                    <td className="py-3 font-medium text-white/80">{u.name}</td>
                    <td className="py-3 text-right text-white/50">{u.posts}</td>
                    <td className="py-3 text-right text-white/50">{u.likes}</td>
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
