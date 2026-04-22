import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';

const ROLES = ['Ученик', 'Учитель', 'Администратор'];
const CLASSES = ['5А', '5Б', '6А', '6Б', '7А', '7Б', '8А', '8Б', '9А', '9Б', '10А', '10Б', '11А', '11Б', '-'];

const INITIAL_USERS = [];

let nextId = 1;

function Badge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
      status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/8 text-white/40'
    }`}>
      <span className={`size-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400' : 'bg-white/30'}`} />
      {status === 'active' ? 'Активен' : 'Отключён'}
    </span>
  );
}

function RoleBadge({ role }) {
  const colors = {
    Администратор: 'bg-indigo-500/15 text-indigo-400',
    Учитель: 'bg-amber-500/15 text-amber-400',
    Ученик: 'bg-sky-500/15 text-sky-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[role] ?? 'bg-white/8 text-white/40'}`}>
      {role}
    </span>
  );
}

export default function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', login: '', role: 'Ученик', class: '9А', password: '' });
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.login.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ name: '', login: '', role: 'Ученик', class: '9А', password: '' });
    setEditId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(u) {
    setForm({ name: u.name, login: u.login, role: u.role, class: u.class, password: '' });
    setEditId(u.id);
    setFormError('');
    setShowForm(true);
  }

  function saveUser() {
    if (!form.name.trim() || !form.login.trim()) {
      setFormError('Имя и логин обязательны');
      return;
    }
    if (!editId && !form.password.trim()) {
      setFormError('Пароль обязателен');
      return;
    }
    if (!editId && users.find(u => u.login === form.login.trim())) {
      setFormError('Логин уже занят');
      return;
    }
    if (editId) {
      setUsers(prev => prev.map(u => u.id === editId
        ? { ...u, name: form.name.trim(), login: form.login.trim(), role: form.role, class: form.class }
        : u
      ));
    } else {
      setUsers(prev => [...prev, {
        id: nextId++,
        name: form.name.trim(),
        login: form.login.trim(),
        role: form.role,
        class: form.class,
        status: 'active',
        joined: new Date().toLocaleDateString('ru-RU'),
      }]);
    }
    setShowForm(false);
  }

  function toggleStatus(id) {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u
    ));
  }

  function deleteUser(id) {
    if (!confirm('Удалить пользователя?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
  }

  function toggleSelect(id) {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function toggleSelectAll() {
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(u => u.id)));
  }

  function bulkDelete() {
    if (!confirm(`Удалить ${selected.size} пользователей?`)) return;
    setUsers(prev => prev.filter(u => !selected.has(u.id)));
    setSelected(new Set());
  }

  function bulkDisable() {
    setUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, status: 'disabled' } : u));
    setSelected(new Set());
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Пользователи</h1>
            <p className="mt-1 text-sm text-white/40">{users.length} зарегистрировано</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Добавить
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или логину…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5">
            <span className="text-sm font-medium text-white">{selected.size} выбрано</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={bulkDisable} className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors">Отключить</button>
              <button onClick={bulkDelete} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">Удалить</button>
              <button onClick={() => setSelected(new Set())} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">Отмена</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleSelectAll} className="size-4 cursor-pointer rounded accent-indigo-600" />
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Пользователь</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Логин</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Роль</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Класс</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Статус</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Дата</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-white/30">
                      {search ? 'Ничего не найдено' : 'Пользователей пока нет'}
                    </td>
                  </tr>
                )}
                {filtered.map(u => (
                  <tr key={u.id} className={`group transition-colors hover:bg-white/5 ${selected.has(u.id) ? 'bg-indigo-500/8' : ''}`}>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} className="size-4 cursor-pointer rounded accent-indigo-600" />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-white/90">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/50">{u.login}</td>
                    <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3.5 text-white/50">{u.class}</td>
                    <td className="px-5 py-3.5"><Badge status={u.status} /></td>
                    <td className="px-5 py-3.5 text-white/40">{u.joined}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEdit(u)}
                          className="rounded-lg p-1.5 text-white/40 hover:bg-white/8 hover:text-white"
                          title="Редактировать"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className="rounded-lg p-1.5 text-white/40 hover:bg-white/8 hover:text-amber-400"
                          title={u.status === 'active' ? 'Отключить' : 'Включить'}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                          title="Удалить"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-white">{editId ? 'Редактировать' : 'Добавить пользователя'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white/70">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: 'ФИО', key: 'name', type: 'text', placeholder: 'Иванов Иван Иванович' },
                { label: 'Логин', key: 'login', type: 'text', placeholder: 'ivanov' },
                ...(!editId ? [{ label: 'Пароль', key: 'password', type: 'password', placeholder: '••••••••' }] : []),
              ].map(f => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Роль</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Класс</label>
                  <select
                    value={form.class}
                    onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {formError && <p className="text-xs text-red-400">{formError}</p>}

              <div className="flex justify-end gap-3 pt-1">
                <button onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors">
                  Отмена
                </button>
                <button onClick={saveUser} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                  {editId ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
