import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { getChangelog, saveChangelog } from '../../changelog.js';

let nextId = Date.now();

const EMOJI_SUGGESTIONS = ['🎉', '📝', '🖼️', '🔔', '🛡️', '🌓', '🔧', '🚀', '✨', '🐛', '⚡', '🔒', '📱', '💬', '👤', '❤️'];

function ItemRow({ value, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="🎉 Описание изменения"
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-indigo-500 focus:outline-none"
      />
      <button
        onClick={onDelete}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
        aria-label="Удалить"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

function ReleaseCard({ release, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(release);

  function save() {
    onSave(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(release);
    setEditing(false);
  }

  function addItem() {
    setDraft(d => ({ ...d, items: [...d.items, ''] }));
  }

  function updateItem(idx, val) {
    setDraft(d => ({ ...d, items: d.items.map((it, i) => i === idx ? val : it) }));
  }

  function removeItem(idx) {
    setDraft(d => ({ ...d, items: d.items.filter((_, i) => i !== idx) }));
  }

  if (!editing) {
    return (
      <div className="group rounded-2xl border border-white/8 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-display text-base font-bold text-white">{release.version}</span>
              {release.badge && (
                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-400">
                  {release.badge}
                </span>
              )}
              <span className="text-xs text-white/30">{release.date}</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {release.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="shrink-0">{item.slice(0, 2)}</span>
                  <span>{item.slice(2).trim()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-1.5 text-white/40 hover:bg-white/8 hover:text-white"
              title="Редактировать"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
              title="Удалить"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-white/5 p-5">
      <p className="mb-4 text-sm font-semibold text-white/70">Редактирование релиза</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Версия</label>
          <input
            value={draft.version}
            onChange={e => setDraft(d => ({ ...d, version: e.target.value }))}
            placeholder="v0.2.0"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Метка</label>
          <input
            value={draft.badge}
            onChange={e => setDraft(d => ({ ...d, badge: e.target.value }))}
            placeholder="Новое"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-xs text-white/40">Дата</label>
          <input
            value={draft.date}
            onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
            placeholder="21 апреля 2026"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Emoji suggestions */}
      <div className="mt-4">
        <p className="mb-2 text-xs text-white/30">Быстрые эмодзи:</p>
        <div className="flex flex-wrap gap-1">
          {EMOJI_SUGGESTIONS.map(em => (
            <button
              key={em}
              onClick={() => setDraft(d => ({ ...d, items: [...d.items, `${em} `] }))}
              className="rounded-lg border border-white/10 px-2 py-1 text-sm transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10"
              title={`Добавить строку с ${em}`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-white/40">Изменения:</p>
        {draft.items.map((item, idx) => (
          <ItemRow
            key={idx}
            value={item}
            onChange={val => updateItem(idx, val)}
            onDelete={() => removeItem(idx)}
          />
        ))}
        <button
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-2 text-sm text-white/35 transition-colors hover:border-white/30 hover:text-white/60"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Добавить строку
        </button>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={cancel} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/40 transition-colors hover:text-white/70">
          Отмена
        </button>
        <button onClick={save} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500">
          Сохранить
        </button>
      </div>
    </div>
  );
}

export default function Changelog() {
  const [releases, setReleases] = useState(getChangelog);
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState({ version: '', badge: 'Новое', date: '', items: [''] });

  function persist(updated) {
    setReleases(updated);
    saveChangelog(updated);
  }

  function updateRelease(id, data) {
    persist(releases.map(r => r.id === id ? { ...r, ...data } : r));
  }

  function deleteRelease(id) {
    if (!confirm('Удалить этот релиз?')) return;
    persist(releases.filter(r => r.id !== id));
  }

  function createRelease() {
    if (!newDraft.version.trim()) return;
    const created = {
      id: nextId++,
      version: newDraft.version.trim(),
      badge: newDraft.badge.trim(),
      date: newDraft.date.trim() || new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: newDraft.items.filter(i => i.trim()),
    };
    persist([created, ...releases]);
    setNewDraft({ version: '', badge: 'Новое', date: '', items: [''] });
    setAddingNew(false);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Обновления</h1>
            <p className="mt-1 text-sm text-white/40">
              {releases.length} {releases.length === 1 ? 'релиз' : 'релизов'} · отображаются в попапе «Новости»
            </p>
          </div>
          {!addingNew && (
            <button
              onClick={() => setAddingNew(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Новый релиз
            </button>
          )}
        </div>

        {/* New release form */}
        {addingNew && (
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-5">
            <p className="mb-4 text-sm font-semibold text-indigo-300">Новый релиз</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Версия *</label>
                <input
                  value={newDraft.version}
                  onChange={e => setNewDraft(d => ({ ...d, version: e.target.value }))}
                  placeholder="v0.2.0"
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Метка</label>
                <input
                  value={newDraft.badge}
                  onChange={e => setNewDraft(d => ({ ...d, badge: e.target.value }))}
                  placeholder="Новое"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs text-white/40">Дата</label>
                <input
                  value={newDraft.date}
                  onChange={e => setNewDraft(d => ({ ...d, date: e.target.value }))}
                  placeholder="Авто"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs text-white/30">Быстрые эмодзи:</p>
              <div className="flex flex-wrap gap-1">
                {EMOJI_SUGGESTIONS.map(em => (
                  <button
                    key={em}
                    onClick={() => setNewDraft(d => ({ ...d, items: [...d.items, `${em} `] }))}
                    className="rounded-lg border border-white/10 px-2 py-1 text-sm transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <p className="text-xs text-white/40">Изменения:</p>
              {newDraft.items.map((item, idx) => (
                <ItemRow
                  key={idx}
                  value={item}
                  onChange={val => setNewDraft(d => ({ ...d, items: d.items.map((it, i) => i === idx ? val : it) }))}
                  onDelete={() => setNewDraft(d => ({ ...d, items: d.items.filter((_, i) => i !== idx) }))}
                />
              ))}
              <button
                onClick={() => setNewDraft(d => ({ ...d, items: [...d.items, ''] }))}
                className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-2 text-sm text-white/35 transition-colors hover:border-white/30 hover:text-white/60"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Добавить строку
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => { setAddingNew(false); setNewDraft({ version: '', badge: 'Новое', date: '', items: [''] }); }}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/40 transition-colors hover:text-white/70"
              >
                Отмена
              </button>
              <button
                onClick={createRelease}
                disabled={!newDraft.version.trim()}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
              >
                Опубликовать
              </button>
            </div>
          </div>
        )}

        {/* Releases list */}
        <div className="flex flex-col gap-3">
          {releases.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/5 py-14 text-center">
              <p className="text-3xl">📋</p>
              <p className="mt-3 text-sm text-white/30">Релизов пока нет</p>
            </div>
          )}
          {releases.map(r => (
            <ReleaseCard
              key={r.id}
              release={r}
              onSave={data => updateRelease(r.id, data)}
              onDelete={() => deleteRelease(r.id)}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
