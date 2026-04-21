import { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { getConfig, saveConfig } from '../../siteConfig.js';

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
      <h2 className="mb-4 font-semibold text-white">{title}</h2>
      <div className="flex flex-col divide-y divide-white/8">{children}</div>
    </div>
  );
}

function Row({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        {description && <p className="mt-0.5 text-xs text-white/35">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-white/15'}`}
    >
      <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function AdminSettings() {
  const cfg = getConfig();
  const [siteName, setSiteName] = useState(cfg.siteName);
  const [schoolName, setSchoolName] = useState(cfg.schoolName);
  const [regOpen, setRegOpen] = useState(cfg.regOpen);
  const [maintenance, setMaintenance] = useState(cfg.maintenance);
  const [moderation, setModeration] = useState(cfg.moderation);
  const [maxPostLen, setMaxPostLen] = useState(cfg.maxPostLen);
  const [saved, setSaved] = useState(false);

  function save() {
    saveConfig({ siteName, schoolName, regOpen, maintenance, moderation, maxPostLen });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Настройки</h1>
            <p className="mt-1 text-sm text-white/40">Конфигурация платформы</p>
          </div>
          <button
            onClick={save}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>
                Сохранено
              </>
            ) : 'Сохранить'}
          </button>
        </div>

        <Section title="Основное">
          <Row label="Название сайта" description="Отображается в шапке и заголовке">
            <input
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </Row>
          <Row label="Название школы" description="Используется в подписях">
            <input
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </Row>
          <Row label="Макс. длина поста (символов)">
            <input
              type="number"
              value={maxPostLen}
              onChange={e => setMaxPostLen(e.target.value)}
              className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </Row>
        </Section>

        <Section title="Доступ">
          <Row label="Открытая регистрация" description="Пользователи могут регистрироваться сами">
            <Toggle value={regOpen} onChange={setRegOpen} />
          </Row>
          <Row label="Режим обслуживания" description="Сайт недоступен для обычных пользователей">
            <Toggle value={maintenance} onChange={setMaintenance} />
          </Row>
        </Section>

        <Section title="Контент">
          <Row label="Пре-модерация постов" description="Посты появляются только после одобрения">
            <Toggle value={moderation} onChange={setModeration} />
          </Row>
        </Section>

        <Section title="Безопасность">
          <Row label="Пароль администратора" description="Изменить пароль для входа в эту панель">
            <button className="rounded-xl border border-white/10 px-4 py-1.5 text-sm text-white/50 transition-colors hover:border-white/20 hover:text-white/80">
              Изменить
            </button>
          </Row>
          <Row label="Сессия" description="Принудительно завершить все сессии">
            <button className="rounded-xl border border-red-500/30 px-4 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10">
              Сбросить
            </button>
          </Row>
        </Section>
      </div>
    </AdminLayout>
  );
}
