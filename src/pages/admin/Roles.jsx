import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';

const PERMISSIONS = [
  { id: 'create_post', label: 'Создавать посты' },
  { id: 'delete_own_post', label: 'Удалять свои посты' },
  { id: 'delete_any_post', label: 'Удалять чужие посты' },
  { id: 'comment', label: 'Комментировать' },
  { id: 'send_message', label: 'Отправлять сообщения' },
  { id: 'view_profiles', label: 'Просматривать профили' },
  { id: 'follow', label: 'Подписываться' },
  { id: 'repost', label: 'Репостить' },
  { id: 'admin_access', label: 'Доступ к панели' },
  { id: 'manage_users', label: 'Управлять пользователями' },
  { id: 'manage_posts', label: 'Модерировать посты' },
  { id: 'manage_settings', label: 'Изменять настройки' },
];

const INITIAL_ROLES = [];

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-white/15'}`}
    >
      <span className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function Roles() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [saved, setSaved] = useState(false);

  function togglePerm(roleId, permId) {
    setRoles(prev => prev.map(r =>
      r.id === roleId ? { ...r, perms: { ...r.perms, [permId]: !r.perms[permId] } } : r
    ));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Роли и права</h1>
            <p className="mt-1 text-sm text-white/40">Настройка разрешений для каждой роли</p>
          </div>
          <button
            onClick={save}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
          >
            {saved ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>Сохранено</>
            ) : 'Сохранить'}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Разрешение</th>
                  {roles.map(r => (
                    <th key={r.id} className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      <span className={`rounded-full px-2.5 py-1 ${r.color}`}>{r.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PERMISSIONS.map(perm => (
                  <tr key={perm.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white/70">{perm.label}</td>
                    {roles.map(role => (
                      <td key={role.id} className="px-5 py-3 text-center">
                        <div className="flex justify-center">
                          <Toggle
                            value={role.perms[perm.id]}
                            onChange={() => togglePerm(role.id, perm.id)}
                          />
                        </div>
                      </td>
                    ))}
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
